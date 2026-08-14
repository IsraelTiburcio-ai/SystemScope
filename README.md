# SYSTEM SCOPE — Explorador de Sistemas y Fronteras

**Nombre:** System Scope
**Materia:** Optimización I
**Repositorio:** https://github.com/IsraelTiburcio-ai/SystemScope
**Sitio publicado:** https://israeltiburcio-ai.github.io/SystemScope/

Actividad / **Juego 3** de la colección de herramientas digitales de **Optimización I**.
Unidad base: **Gimnasio 1 — Introducción a la Teoría de Sistemas**.

> Una experiencia de zoom semántico para explorar sistemas desde diferentes niveles,
> descubrir qué existe dentro y fuera de ellos y delimitar su alcance mediante sus fronteras.

---

## Objetivo

Que el estudiante pueda:

1. reconocer qué es el sistema que está analizando;
2. distinguir componentes que funcionan como **subsistemas**;
3. reconocer el sistema mayor o **suprasistema**;
4. comprender la relación entre **sistema y entorno**;
5. establecer el **alcance** del sistema;
6. identificar sus **fronteras** (física, económica, técnica y temporal);
7. comprender que un mismo objeto cambia de rol según el nivel de análisis
   (subsistema / sistema / suprasistema).

La experiencia se diferencia de los otros juegos de la colección:

| Juego | Foco |
|---|---|
| OptiQuest | Aprender y repasar |
| System Lab | Construir y clasificar |
| **System Scope** | **Explorar y delimitar** |

---

## Cómo funciona

System Scope es una aplicación web de **página única** (sin backend ni base de datos)
que combina:

- **Observatorio de sistemas** — mapa SVG navegable con zoom semántico real. Se entra
  a los subsistemas, se sale hacia el suprasistema y se observa el entorno.
- **Tutorial interactivo** — primera visita guiada dentro del observatorio.
- **Guía «El nivel cambia»** — práctica para ver cómo cambian los roles según el punto
  de referencia.
- **6 misiones** en un mapa de progreso:
  1. *Dentro del Sistema* — identificar subsistemas (arrastrar / seleccionar).
  2. *Fuera del Sistema* — identificar el suprasistema.
  3. *El Nivel Cambia* — práctica de cambio de referencia en el observatorio.
  4. *Estableciendo Fronteras* — Configurador de Alcance + asignar tarjetas a las
     cuatro fronteras (6 escenarios).
  5. *Fronteras en Acción* — detectar qué frontera cambia en 12 eventos.
  6. *Misión Final* — delimitar por completo el sistema de entrega de medicamentos.
- **Resultados** — mapa final del sistema con leyenda, estadísticas y «Ver análisis».
- **Logros** — 6 insignias desbloqueables.
- **Puntuación** — 100/70/40 puntos por intento (1º/2º/3º), pistas −20, bonus de
  misión perfecta +300 y precisión general.

---

## Estructura

```
system-scope/
├── index.html          # Shell de la aplicación y puntos de montaje
├── README.md
├── css/
│   ├── variables.css   # Paleta, tipografías, radios, sombras
│   ├── base.css        # Reset, fondo, botones, logo, tipografía
│   ├── layout.css      # HUD, home, intro, progreso, logros
│   ├── components.css  # Modales, toasts, tarjetas, chips, misiones, fronteras
│   ├── map.css         # Estilos del mapa SVG y del observatorio
│   ├── animations.css  # Keyframes y prefers-reduced-motion
│   └── responsive.css  # Tablet, móvil, touch
├── js/
│   ├── state.js        # Estado en memoria y reglas de desbloqueo
│   ├── storage.js      # localStorage (progress guardado)
│   ├── audio.js        # Efectos WebAudio sintetizados (sin archivos)
│   ├── scoring.js      # Puntos, precisión, bonus, pistas
│   ├── achievements.js # Definición y evaluación de logros
│   ├── ui.js           # Íconos SVG propios, toasts, modales, drag & drop
│   ├── router.js       # Cambio de pantallas
│   ├── mapEngine.js    # Dibuja el nivel de un sistema en SVG
│   ├── zoomEngine.js   # Cámara y animación de zoom semántico
│   ├── boundaries.js   # Configurador de alcance y "Define el alcance"
│   ├── missions.js     # Misiones 1–4, Misión final y Resultados
│   └── app.js          # Arranque, home, tutorial, observatorio, progreso, logros
├── data/
│   ├── systems.js      # Grafo de sistemas: subsistemas, suprasistema, entorno, fronteras
│   ├── missions.js     # Datos de misiones 1 y 2 (+ pistas y retroalimentación)
│   ├── boundaries.js   # Escenarios "Define el alcance" y 12 eventos de frontera
│   └── finalChallenge.js # Datos de la Misión Final
├── assets/audio/       # (opcional) sin archivos: el audio se sintetiza
└── test/               # Pruebas automáticas con jsdom (opcional)
```

## Edición de contenidos

Todo el contenido académico vive en `data/` y está separado de la lógica:

- **Sistemas** (`data/systems.js`): cada nodo tiene `id`, `name`, `icon`, `blurb`,
  `parent` (suprasistema), `children` (subsistemas), `env` (entorno) y `boundaries`
  (textos de las cuatro fronteras). Se puede añadir o reordenar ramas completas.
- **Misiones 1 y 2** (`data/missions.js`): casos, elementos a clasificar y opciones,
  con `hint` y `wrongWhy` por elemento.
- **Fronteras** (`data/boundaries.js`): escenarios para "Define el alcance"
  (tarjetas con su categoría `physical | economic | technical | temporal | out`)
  y eventos de cambio de frontera (medidores iniciales, evento, respuesta y
  explicación).
- **Misión Final** (`data/finalChallenge.js`): las 5 etapas del desafío completo.

## Almacenamiento de progreso

El progreso se guarda en `localStorage` con la clave `systemscope_v1`:

- misiones completadas y su porcentaje de precisión;
- puntuación, estadísticas y precisión;
- logros desbloqueados;
- tutorial visto, sonido activado/desactivado;
- nivel de exploración del observatorio (último sistema visitado, profundidad).

Al volver, el botón **Continuar misión** lleva directo al mapa de progreso.
**Reiniciar exploración** borra todo el guardado (usa un modal propio, sin
`confirm()` ni `alert()`).

## Ejecución local

Abre `index.html` directamente en un navegador, o usa un servidor estático
(recomendado):

```bash
# Python 3
python3 -m http.server 8000
# abre http://localhost:8000
```

```bash
# Node
npx serve .
```

## Pruebas automáticas (opcional)

```bash
npm i jsdom            # solo para el entorno de pruebas
NODE_PATH=node_modules node test/smoke.js
NODE_PATH=node_modules node test/extra.js
```

Recorren la experiencia completa (tutorial, misiones, misión final, logros,
persistencia) y las rutas de error (respuestas incorrectas, pistas, bloqueo de
misiones y reinicio).

## Publicar en GitHub Pages

El sitio está publicado en **https://israeltiburcio-ai.github.io/SystemScope/** con
despliegue automático mediante GitHub Actions.

Flujo de autodeploy:

```text
push a main → GitHub Actions (.github/workflows/pages.yml) → GitHub Pages
```

El workflow se ejecuta con cada `push` a `main` (y manualmente con
`workflow_dispatch`), usando `actions/checkout`, `actions/configure-pages`,
`actions/upload-pages-artifact` y `actions/deploy-pages`. No hay build: el
contenido estático se publica tal cual.

### Desplegar manualmente (alternativa)

1. Crea un repositorio y coloca el contenido de `system-scope` en la raíz.
2. Sube los archivos (`git add . && git commit && git push`).
3. En el repositorio: **Settings → Pages → Source: Deploy from a branch**,
   elige la rama `main` y carpeta `/root` (o `/docs` si lo prefieres).
4. Abre la URL `https://usuario.github.io/repo/`.

Las rutas son relativas, por lo que funciona también si el juego queda en una
subcarpeta (por ejemplo `/repo/system-scope/`).

## Restricciones técnicas

- HTML5, CSS3 y JavaScript ES6+ en **vanilla**. Sin frameworks ni librerías pesadas.
- Sin backend, sin servidor, sin base de datos.
- Gráficos vectoriales propios (SVG) e íconos originales; sin assets ni marcas externas.
- Interacciones con mouse, touch y teclado; `prefers-reduced-motion` respetado.
- Interfaz 100 % en español, terminología del Gimnasio 1 conservada.
