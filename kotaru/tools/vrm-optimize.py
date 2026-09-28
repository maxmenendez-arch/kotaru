#!/usr/bin/env python3
"""Aligera un .vrm (GLB) para la web: reduce las texturas a un tamano maximo y las
recomprime, sin tocar mallas, huesos, expresiones ni metadatos (licencia incluida).

    python3 tools/vrm-optimize.py entrada.vrm salida.vrm [--max 1024]

Requiere Pillow. Las texturas con transparencia siguen en PNG; las opacas pasan a JPEG
solo si el modelo no usa el canal alfa (no se toca: MToon puede leerlo), asi que se
quedan en PNG optimizado. Es seguro repetirlo: la salida es un GLB valido.
"""
import io
import json
import struct
import sys

from PIL import Image


def pad4(data: bytes, fill: bytes = b"\x00") -> bytes:
    return data + fill * ((4 - len(data) % 4) % 4)


def main() -> None:
    args = sys.argv[1:]
    max_side = 1024
    if "--max" in args:
        i = args.index("--max")
        max_side = int(args[i + 1])
        del args[i : i + 2]
    src, dst = args
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

    views = gltf["bufferViews"]
    image_views = {img["bufferView"]: img for img in gltf.get("images", []) if "bufferView" in img}
    before = after = 0
    chunks = []
    for index, view in enumerate(views):
        start = view.get("byteOffset", 0)
        data = blob[start : start + view["byteLength"]]
        img = image_views.get(index)
        if img is not None:
            before += len(data)
            picture = Image.open(io.BytesIO(data))
            picture.load()
            if max(picture.size) > max_side:
                scale = max_side / max(picture.size)
                size = (max(1, round(picture.size[0] * scale)), max(1, round(picture.size[1] * scale)))
                picture = picture.resize(size, Image.LANCZOS)
            out = io.BytesIO()
            picture.save(out, format="PNG", optimize=True)
            new = out.getvalue()
            if len(new) < len(data) or picture.size != Image.open(io.BytesIO(data)).size:
                data = new
                img["mimeType"] = "image/png"
            after += len(data)
        chunks.append(data)

    # Buffer nuevo: cada vista alineada a 4 bytes, en el mismo orden.
    out_blob = bytearray()
    for view, data in zip(views, chunks):
        out_blob += b"\x00" * ((4 - len(out_blob) % 4) % 4)
        view["byteOffset"] = len(out_blob)
        view["byteLength"] = len(data)
        out_blob += data
    gltf["buffers"][0]["byteLength"] = len(out_blob)

    json_bytes = pad4(json.dumps(gltf, separators=(",", ":"), ensure_ascii=False).encode("utf-8"), b" ")
    bin_bytes = pad4(bytes(out_blob))
    total = 12 + 8 + len(json_bytes) + 8 + len(bin_bytes)
    with open(dst, "wb") as f:
        f.write(struct.pack("<4sII", b"glTF", 2, total))
        f.write(struct.pack("<I4s", len(json_bytes), b"JSON") + json_bytes)
        f.write(struct.pack("<I4s", len(bin_bytes), b"BIN\x00") + bin_bytes)
    print(f"{src}: texturas {before / 1e6:.1f} MB -> {after / 1e6:.1f} MB; archivo {len(raw) / 1e6:.1f} MB -> {total / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
