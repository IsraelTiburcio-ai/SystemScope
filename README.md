# BOUNDARY RUN — Corre hacia el límite correcto

**Materia:** Optimización I
**Unidad:** Gimnasio 1 — Introducción a la Teoría de Sistemas
**Repositorio:** https://github.com/IsraelTiburcio-ai/SystemScope
**Sitio publicado:** https://israeltiburcio-ai.github.io/SystemScope/

Microjuego arcade educativo de **60–100 segundos**: el corredor avanza
automáticamente y tú eliges la puerta de la frontera correcta para cada
situación.

> La versión anterior (System Scope, explorador de sistemas) está preservada
> bajo el tag `legacy-v1`.

## Concepto académico

Las **cuatro fronteras** del sistema, con la terminología del material:

| Frontera | Se relaciona con |
|---|---|
| 📍 **Física** | límite espacial o corporal |
| 💰 **Económica** | capacidad monetaria |
| ⚙️ **Técnica** | nivel de conocimientos o capacidad técnica |
| ⏱️ **Temporal** | duración en el tiempo |

## Cómo se juega

1. Pulsa **JUGAR**.
2. Aparece una situación breve (p. ej. "El proyecto termina en diciembre.").
3. Toca la puerta de la frontera correcta (**TEMPORAL** en el ejemplo).
4. Correcto: la puerta se abre, el corredor acelera y ganas puntos (con combo).
   Incorrecto: pequeño choque, pierdes velocidad y continúas.
5. Al cruzar la meta: resultado (correctas, tiempo, velocidad y puntos).

Una partida = **6 situaciones**, aproximadamente **60–100 segundos**.
Sin tutorial, sin módulos, sin campaña. Solo jugar.

## Tecnologías

- HTML5, CSS3 y JavaScript ES6+ (vanilla). Sin frameworks.
- Sonido sintetizado con WebAudio (sin archivos).
- SVG original para el corredor; gráficos propios con CSS.
- `localStorage` solo para: mejor puntuación y preferencia de sonido.
- Accesibilidad: teclado (teclas `1–4` para elegir puerta, `Enter` para
  jugar/repetir), focus visible, `aria-label` y `prefers-reduced-motion`.

## Desarrollo local

Abre `index.html` directamente, o con un servidor estático:

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Estructura

```
├── index.html          # Portada + gameplay + resultado
├── css/
│   └── game.css        # Todo el estilo del microjuego
├── js/
│   ├── data.js         # Situaciones de frontera (editable)
│   └── game.js         # Lógica, sonido, animaciones, partículas
└── .github/
    └── workflows/
        └── pages.yml   # Autodeploy a GitHub Pages
```

## Editar contenido

En `js/data.js` se editan las **situaciones** del juego:

```js
{ text: "El proyecto termina en diciembre.", kind: "temporal", note: "duración en el tiempo" }
```

- `text`: situación breve que ve el estudiante.
- `kind`: `physical` | `economic` | `technical` | `temporal`.
- `note`: frase corta de refuerzo que se muestra al acertar.

El número de decisiones por partida se ajusta en `js/game.js` con la constante
`ROUNDS` (por defecto 6).

## GitHub Pages y autodeploy

Sitio: **https://israeltiburcio-ai.github.io/SystemScope/**

```text
push a main → GitHub Actions (.github/workflows/pages.yml) → GitHub Pages
```

El workflow se ejecuta en cada push a `main` (y manualmente con
`workflow_dispatch`). Publica el contenido estático tal cual; no requiere build.
