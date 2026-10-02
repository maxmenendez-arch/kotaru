#!/usr/bin/env python3
"""Adelgaza un .vrm (GLB) para que cargue antes: quita del archivo los datos de las formas de
la cara (morph targets) que no se usan o que en una parte de la malla son todo ceros.

Un modelo de VRoid trae ~57 formas de cara repetidas en cada trozo de la malla (8 trozos en la
cara), y la mitad del archivo son esas formas, casi todas ceros (los ojos no se mueven cuando
la boca dice «a»). En glTF un accessor sin bufferView vale ceros: se deja el accessor (mismo
numero de formas y mismo orden, asi las expresiones del VRM siguen apuntando bien) y se quitan
sus bytes. Tambien se vacian las formas que ninguna expresion del VRM usa.

No toca huesos, texturas, materiales, expresiones ni metadatos (licencia incluida).

    python3 tools/vrm-slim.py entrada.vrm salida.vrm [--webp]
"""
import json
import struct
import sys
from array import array

COMPONENTS = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4, "MAT4": 16}
SIZES = {5126: 4, 5125: 4, 5123: 2, 5122: 2, 5121: 1, 5120: 1}


def pad(data: bytes, n: int = 4, fill: bytes = b"\x00") -> bytes:
    return data + fill * ((n - len(data) % n) % n)


def main() -> None:
    src, dst = sys.argv[1:3]
    raw = open(src, "rb").read()
    magic, version, _ = struct.unpack("<4sII", raw[:12])
    assert magic == b"glTF" and version == 2, "no es un GLB 2.0"
    json_len, json_type = struct.unpack("<I4s", raw[12:20])
    assert json_type == b"JSON"
    gltf = json.loads(raw[20 : 20 + json_len])
    off = 20 + json_len
    bin_len, bin_type = struct.unpack("<I4s", raw[off : off + 8])
    assert bin_type == b"BIN\x00"
    blob = raw[off + 8 : off + 8 + bin_len]

    accessors = gltf["accessors"]
    views = gltf["bufferViews"]

    # Formas que usa alguna expresion del VRM (por malla).
    used: dict[int, set[int]] = {}
    vrm = gltf.get("extensions", {}).get("VRMC_vrm")
    assert vrm, "solo VRM 1.0 (VRMC_vrm)"
    groups = vrm.get("expressions", {})
    for group in ("preset", "custom"):
        for expr in groups.get(group, {}).values():
            for bind in expr.get("morphTargetBinds", []):
                mesh = gltf["nodes"][bind["node"]]["mesh"]
                used.setdefault(mesh, set()).add(bind["index"])

    def floats(a: dict) -> array:
        v = views[a["bufferView"]]
        start = v.get("byteOffset", 0) + a.get("byteOffset", 0)
        n = a["count"] * COMPONENTS[a["type"]]
        assert a["componentType"] == 5126 and v.get("byteStride", 4 * COMPONENTS[a["type"]]) == 4 * COMPONENTS[a["type"]]
        out = array("f")
        out.frombytes(blob[start : start + n * 4])
        return out

    extra_views: list[bytes] = []
    emptied = 0
    saved = 0
    for mi, mesh in enumerate(gltf["meshes"]):
        keep = used.get(mi, set())
        for prim in mesh["primitives"]:
            for ti, target in enumerate(prim.get("targets", [])):
                for attr, ai in target.items():
                    a = accessors[ai]
                    if "bufferView" not in a or "sparse" in a:
                        continue
                    if ti in keep and any(abs(x) > 1e-7 for x in floats(a)):
                        continue
                    saved += a["count"] * COMPONENTS[a["type"]] * SIZES[a["componentType"]]
                    del a["bufferView"]
                    a.pop("byteOffset", None)
                    if "min" in a:
                        a["min"] = [0] * len(a["min"])
                        a["max"] = [0] * len(a["max"])
                    emptied += 1

    # Texturas en WebP (EXT_texture_webp, lo leen three.js y todos los navegadores actuales):
    # pesan 4-8 veces menos que el PNG con la misma vista. La miniatura de la licencia, que la
    # app no muestra, se queda en 128 px.
    if "--webp" in sys.argv:
        import io
        from PIL import Image

        thumb = vrm.get("meta", {}).get("thumbnailImage")
        quality = 90
        for ii, img in enumerate(gltf.get("images", [])):
            v = views[img["bufferView"]]
            data = blob[v.get("byteOffset", 0) : v.get("byteOffset", 0) + v["byteLength"]]
            pic = Image.open(io.BytesIO(data))
            pic.load()
            buf = io.BytesIO()
            if ii == thumb:
                pic.thumbnail((128, 128))
                pic.convert("RGB").save(buf, "PNG", optimize=True)
                mime = "image/png"
            else:
                mode = "RGBA" if pic.mode in ("RGBA", "LA", "P") else "RGB"
                pic.convert(mode).save(buf, "WEBP", quality=quality, method=6, alpha_quality=100)
                mime = "image/webp"
            new = buf.getvalue()
            if mime == "image/webp" or len(new) < len(data):
                extra_views.append(new)
                img["bufferView"] = len(views) + len(extra_views) - 1
                img["mimeType"] = mime
        for tex in gltf.get("textures", []):
            src_i = tex.get("source")
            if src_i is not None and gltf["images"][src_i]["mimeType"] == "image/webp":
                del tex["source"]
                tex.setdefault("extensions", {})["EXT_texture_webp"] = {"source": src_i}
        for key in ("extensionsUsed", "extensionsRequired"):
            gltf[key] = sorted(set(gltf.get(key, [])) | {"EXT_texture_webp"})

    # Rehacer el binario solo con las vistas que se siguen usando.
    refs: set[int] = set()
    for a in accessors:
        if "bufferView" in a:
            refs.add(a["bufferView"])
        if "sparse" in a:
            refs.add(a["sparse"]["indices"]["bufferView"])
            refs.add(a["sparse"]["values"]["bufferView"])
    for img in gltf.get("images", []):
        if "bufferView" in img:
            refs.add(img["bufferView"])
    remap: dict[int, int] = {}
    new_views = []
    out = bytearray()
    for i, v in enumerate(views + [{"byteLength": len(x)} for x in extra_views]):
        if i not in refs:
            continue
        if i >= len(views):
            chunk = extra_views[i - len(views)]
        else:
            start = v.get("byteOffset", 0)
            chunk = blob[start : start + v["byteLength"]]
        while len(out) % 8:
            out.append(0)
        nv = dict(v)
        nv["byteLength"] = len(chunk)
        nv["byteOffset"] = len(out)
        nv["buffer"] = 0
        out += chunk
        remap[i] = len(new_views)
        new_views.append(nv)
    for a in accessors:
        if "bufferView" in a:
            a["bufferView"] = remap[a["bufferView"]]
        if "sparse" in a:
            a["sparse"]["indices"]["bufferView"] = remap[a["sparse"]["indices"]["bufferView"]]
            a["sparse"]["values"]["bufferView"] = remap[a["sparse"]["values"]["bufferView"]]
    for img in gltf.get("images", []):
        if "bufferView" in img:
            img["bufferView"] = remap[img["bufferView"]]
    gltf["bufferViews"] = new_views
    out = pad(bytes(out))
    gltf["buffers"] = [{"byteLength": len(out)}]

    js = pad(json.dumps(gltf, separators=(",", ":")).encode(), 4, b" ")
    total = 12 + 8 + len(js) + 8 + len(out)
    with open(dst, "wb") as f:
        f.write(struct.pack("<4sII", b"glTF", 2, total))
        f.write(struct.pack("<I4s", len(js), b"JSON"))
        f.write(js)
        f.write(struct.pack("<I4s", len(out), b"BIN\x00"))
        f.write(out)
    print(f"{src} -> {dst}: {len(raw) // 1024} KB -> {total // 1024} KB ({emptied} formas vaciadas, {saved // 1024} KB)")


if __name__ == "__main__":
    main()
