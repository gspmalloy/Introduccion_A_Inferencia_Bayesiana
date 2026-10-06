# Razonar en medio de la incertidumbre — Inferencia bayesiana e IA

Presentación interactiva y autónoma para un taller de aproximadamente 60 minutos dirigido a estudiantes de los últimos grados de bachillerato o de los primeros semestres universitarios. Está lista para publicarse con GitHub Pages.

## ¿Qué incluye?

- Presentación en pantalla completa, organizada por diapositivas.
- Panel con controles para quien presenta (`P`).
- Navegación con el teclado (`←`, `→` y `Espacio`).
- Modo de pantalla completa (`F`).
- Experimento de 15 lanzamientos de una moneda, con registro manual de cara o sello y simulación al azar.
- Registro en vivo de la probabilidad y el nivel de confianza de cada participante.
- Visualización bayesiana de la distribución previa del grupo, ponderada por el nivel de confianza.
- Valor de referencia editable para los días lluviosos.
- Visualización de la actualización de la distribución posterior.
- Comparación entre los enfoques frecuentista y bayesiano.
- Ejemplos de inteligencia artificial: clasificación de correo no deseado, reconocimiento de imágenes y modelos de lenguaje.
- Funcionamiento sin conexión: no necesita marcos de JavaScript, fuentes externas, API ni CDN.

## Cómo ejecutarla en tu equipo

Abre `index.html` directamente en un navegador moderno. También puedes iniciar un servidor web sencillo desde esta carpeta.

Por ejemplo, si tienes Python instalado:

```bash
python -m http.server 8000
```

Después, abre `http://localhost:8000` en el navegador.

## Cómo publicarla con GitHub Pages

1. Crea un repositorio en GitHub; por ejemplo, `taller-bayesiano`.
2. Sube `index.html`, `styles.css` y `app.js` a la raíz del repositorio.
3. En GitHub, ve a **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Escoge la rama `main` y la carpeta `/ (root)`.
6. Guarda los cambios. GitHub te mostrará la dirección pública de la página.

## Guía para la presentación

- `→` o `Av Pág`: ir a la siguiente diapositiva o revelar el siguiente elemento.
- `←` o `Re Pág`: volver a la diapositiva anterior.
- `Espacio`: revelar el siguiente elemento; si no hay nada oculto, avanzar.
- `P`: mostrar u ocultar el panel y habilitar por completo los controles interactivos.
- `F`: entrar o salir del modo de pantalla completa.

### Experimento de la moneda

En la diapositiva «Lancémosla 15 veces», oprime `P` para habilitar los controles. Lanza una moneda física y selecciona **Cara** o **Sello** después de cada resultado. La presentación calcula automáticamente el porcentaje observado.

### Distribución previa del grupo

En esta diapositiva, registra la probabilidad estimada por cada participante y su nivel de confianza, de 1 a 5. Cada respuesta se representa mediante una distribución beta. El nivel de confianza se convierte en una cantidad efectiva de información así:

- 1 → 2 pseudoobservaciones.
- 2 → 5 pseudoobservaciones.
- 3 → 10 pseudoobservaciones.
- 4 → 20 pseudoobservaciones.
- 5 → 40 pseudoobservaciones.

La distribución previa del grupo es una mezcla que asigna el mismo peso a cada distribución individual. Es un modelo pedagógico deliberadamente transparente; no pretende afirmar que exista una única conversión matemática correcta para la confianza subjetiva.

### Actualización bayesiana

La evidencia histórica se interpreta como una serie de observaciones binarias: día lluvioso o día no lluvioso. La distribución posterior se calcula numéricamente así:

`posterior(p) ∝ previa(p) × p^(días lluviosos) × (1-p)^(días no lluviosos)`

De esta manera, la distribución previa construida por el grupo se actualiza en tiempo real sin suponer que deba ser una única distribución beta.

## Valor de referencia del IDEAM

La presentación usa **10 días lluviosos de 31** como dato provisional para que la actividad funcione desde el comienzo. Antes del taller, reemplázalo por el valor exacto de la estación o climatología de Neiva que vayas a citar.

Fuentes oficiales incluidas:

- [Normales climatológicas estándar del IDEAM](https://www.ideam.gov.co/sala-de-prensa/boletines/Normales-clim%C3%A1ticas-est%C3%A1ndar).
- [Atlas climatológico del IDEAM](https://www.ideam.gov.co/AtlasWeb/), que incluye productos sobre el número de días con lluvia.

Quien presenta puede modificar en vivo la cantidad de días lluviosos y el total de días sin editar el código fuente.

## Distribución sugerida de los 60 minutos

- Minutos 0–5: conceptos básicos de probabilidad.
- Minutos 5–15: experimento de la moneda equilibrada.
- Minutos 15–20: conversación sobre las distintas reacciones frente a la evidencia.
- Minutos 20–35: estimaciones sobre la lluvia en Neiva y niveles de confianza.
- Minutos 35–42: presentación de la evidencia oficial y actualización de la distribución previa.
- Minutos 42–50: conceptos de Bayes, ecuación y comparación con el enfoque frecuentista.
- Minutos 50–58: aplicaciones en inteligencia artificial.
- Minutos 58–60: reto final y conclusión.

## Notas de diseño

La página está pensada como una presentación, no como un sitio web convencional: muestra una idea por pantalla, usa tipografía grande, mantiene la interfaz al mínimo y evita el desplazamiento vertical. También está diseñada para seguir funcionando si se pierde la conexión a internet después de abrirla.
