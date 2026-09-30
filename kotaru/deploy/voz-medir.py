#!/usr/bin/env python3
"""Mide el tono (mediana de F0) de archivos WAV ya generados, con el detector de voz-tono.py.

    python3 deploy/voz-medir.py /var/lib/kotaru/intro/*.wav
"""
import importlib.util
import os
import sys

spec = importlib.util.spec_from_file_location('tono', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'voz-tono.py'))
tono = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tono)

for path in sys.argv[1:]:
    samples, rate = tono.pcm_of(open(path, 'rb').read())
    track = tono.f0_track(samples, rate)
    low = sum(1 for f in track if f < 150) / max(1, len(track))
    print(f'{os.path.basename(path):14} mediana {tono.median(track):5.0f} Hz, bajo 150 Hz {low * 100:3.0f} %')
