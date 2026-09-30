# Captura de movimiento

Los movimientos de los personajes (de pie en reposo, explicar con las manos) salen de la
base de datos de captura de movimiento de Carnegie Mellon University, reajustados a cada
personaje con `scripts/mocap-convert.mjs` y `src/mocap.ts`.

The data used in this project was obtained from mocap.cs.cmu.edu.
The database was created with funding from NSF EIA-0196217.

Licencia (https://mocap.cs.cmu.edu/): se puede incluir en productos comerciales; no se puede
revender los datos, ni siquiera convertidos. Copia usada: https://github.com/una-dinosauria/cmu-mocap

| Archivo | Captura CMU | Tramo | Qué es |
| --- | --- | --- | --- |
| idle-82_08(-m) | 82_08 | 0–8 s | De pie, quieto (antes de caminar) |
| idle-40_11(-m) | 40_11 | 0,8–5,6 s | Esperando el autobús |
| talk-18_08(-m) | 18_08 | 2,5–17 s | Conversación, explicando con las manos |

`-m` = en espejo (izquierda por derecha).
