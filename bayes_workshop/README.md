# Reasoning Under Uncertainty — Bayesian Inference & AI

A self-contained, GitHub-Pages-ready interactive presentation for a ~60 minute high-school / early-college workshop.

## What is included

- Full-screen slide-style presentation in the browser
- English / Spanish toggle (`L`)
- Presenter controls (`P`)
- Keyboard navigation (`←`, `→`, `Space`)
- Fullscreen mode (`F`)
- 15-flip coin experiment with manual H/T entry or fair random simulation
- Live class probability + confidence entry
- Confidence-weighted Bayesian class prior visualization
- Editable rainy-day evidence benchmark
- Bayesian posterior update animation/visualization
- Frequentist vs. Bayesian explanation
- AI examples: spam classification, image prediction, language models
- Offline-friendly: no JavaScript frameworks, fonts, APIs, or CDNs are required

## Run locally

Open `index.html` directly in a modern browser, or run any simple local web server in this directory.

For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a GitHub repository, e.g. `bayes-workshop`.
2. Upload `index.html`, `styles.css`, and `app.js` to the repository root.
3. In GitHub: **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder.
6. Save. GitHub will provide the public Pages URL.

## Presenter workflow

- `→` or `Page Down`: next slide / reveal
- `←` or `Page Up`: previous slide
- `Space`: reveal the next item; if nothing is hidden, advance
- `P`: show/hide presenter panel and fully expose interactive controls
- `L`: toggle English / Spanish
- `F`: enter/exit fullscreen

### Coin experiment

On the “Let's flip it 15 times” screen, press `P` to expose the controls. Flip a physical coin and click **Heads / Cara** or **Tails / Sello** after each result. The presentation automatically tracks the observed proportion.

### Class prior experiment

On the class-prior slide, enter each student's probability estimate and confidence from 1–5. Each response is represented as a Beta distribution. Confidence is mapped to an effective information strength:

- 1 → 2 pseudo-observations
- 2 → 5
- 3 → 10
- 4 → 20
- 5 → 40

The class prior is an equal-weight mixture of those individual distributions. This is an intentionally transparent teaching model, not a claim that subjective confidence has a uniquely correct mathematical conversion.

### Bayesian update

The historical evidence is treated as Bernoulli rainy/not-rainy observations. The posterior is calculated numerically as:

`posterior(p) ∝ prior(p) × p^(rainy days) × (1-p)^(non-rainy days)`

This lets the class's actual prior update in real time without assuming the prior itself is a single Beta distribution.

## IDEAM benchmark

The page currently defaults to **10 rainy days out of 31** only as a workshop placeholder so the interaction is immediately usable. Before presenting, replace it with the exact Neiva station/climatology value you intend to cite.

Official source page included in the presentation:

- IDEAM — Standard climate normals: https://www.ideam.gov.co/sala-de-prensa/boletines/Normales-clim%C3%A1ticas-est%C3%A1ndar

IDEAM also provides a climatological atlas with number-of-days-with-rain products:

- https://www.ideam.gov.co/AtlasWeb/

The presenter can change the rainy-day count and total days live without editing source code.

## Recommended 60-minute pacing

- 0–5: Probability basics
- 5–15: Fair coin experiment
- 15–20: Discuss different reactions to the evidence
- 20–35: Neiva probability + confidence responses
- 35–42: Reveal official evidence and update the prior
- 42–50: Bayes terms, equation, frequentist comparison
- 50–58: AI applications
- 58–60: Final challenge and takeaway

## Design notes

The page is intentionally built like a presentation rather than a conventional website: one idea per screen, large typography, minimal interface, and no scrolling. It is also designed to keep working if internet access drops after the page is loaded.
