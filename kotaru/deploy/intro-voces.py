#!/usr/bin/env python3
"""Voz de los shorts de presentacion (pantalla de elegir personaje): un saludo corto de cada
personaje con su voz y una risa natural, en español e ingles.

Se generan una vez con Gemini TTS (que acepta instrucciones de actuacion: la risa) y se
guardan en /var/lib/kotaru/intro/, fuera de la web: deploy/web.sh los copia en cada
despliegue a https://app.kotaru.app/intro/ . Si Gemini no responde (cuota), usa Chirp (la
misma voz, sin risa).

    sudo python3 deploy/intro-voces.py          # genera las que falten
    sudo python3 deploy/intro-voces.py --todas  # las vuelve a generar

Costo: 6 frases cortas (menos de 1 centavo). Las claves se leen del servidor y nunca se imprimen.
Sin gemidos ni nada sexual: son la primera impresion de la app, para todo adulto que la abra.
"""
import importlib.util
import os
import shutil
import sys
import time

here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('vozluna', os.path.join(here, 'voz-luna.py'))
vl = importlib.util.module_from_spec(spec)
spec.loader.exec_module(vl)

STORE = '/var/lib/kotaru/intro'
WEB = '/etc/caddy/otros-sitios/kotaru-web/intro'

# personaje -> (voz, estilo, {idioma: frase})
LINES = {
    'luna': ('Despina',
             'Voz de mujer joven adulta, claramente femenina, de tono medio-agudo y luminoso, nunca grave; suave y cálida. Empieza con una risita breve y tierna, '
             'como quien se alegra de ver a alguien, y luego habla tranquila y cercana.',
             {'es': 'Hola… me alegra que estés aquí. Ven, siéntate, hoy tenemos tiempo.',
              'en': 'Hi… I’m glad you’re here. Come, sit down, we have time today.'}),
    'nova': ('Sulafat',
             'Voz de mujer adulta, segura y coqueta, con sonrisa en la voz. Empieza con una risa corta y divertida, '
             'juguetona, y luego habla con pausas con intención.',
             {'es': 'Llegaste justo cuando iba a poner música… ¿te quedas un rato conmigo?',
              'en': 'You showed up right when I was putting on music… staying a while with me?'}),
    'rio': ('Algieba',
            'Voz de hombre adulto, cálida y animada. Empieza con una carcajada breve y alegre, contagiosa, '
            'y luego habla con energía de buen narrador.',
            {'es': '¡Justo a tiempo! Tú eliges el lugar y yo pongo la aventura.',
             'en': 'Right on time! You pick the place and I’ll bring the adventure.'}),
}


def main() -> None:
    if os.geteuid() != 0:
        sys.exit('Ejecuta como root (sudo).')
    again = '--todas' in sys.argv
    os.makedirs(STORE, exist_ok=True)
    key = vl.env('GEMINI_API_KEY')
    token = None
    made = 0
    for who, (voice, style, lines) in LINES.items():
        for lang, text in lines.items():
            path = f'{STORE}/{who}-{lang}.wav'
            if os.path.exists(path) and not again:
                print(f'  {who}-{lang}: ya estaba')
                continue
            audio, engine = None, ''
            if key:
                vl.TEXT, vl.STYLE = text, style
                audio, engine = vl.gemini(key, voice), 'Gemini'
                time.sleep(1)
            if not audio:
                token = token or vl.chirp_token()
                if token:
                    vl.TEXT = text
                    audio, engine = vl.chirp(token, voice), 'Chirp (sin risa)'
            if not audio:
                print(f'  {who}-{lang}: no se pudo generar')
                continue
            open(path, 'wb').write(audio)
            made += 1
            print(f'  {who}-{lang}: {engine}, {len(audio) // 48000:.0f} s')
    key = ''
    shutil.rmtree(WEB, ignore_errors=True)
    shutil.copytree(STORE, WEB)
    os.system(f'chmod -R a+rX {STORE} {WEB}')
    print(f'Listo: {made} nuevas; en la web: https://app.kotaru.app/intro/')


if __name__ == '__main__':
    main()
