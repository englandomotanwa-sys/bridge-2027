# BRIDGE the District · 2027 website

Live: https://englandomotanwa-sys.github.io/bridge-2027/

Two connected experiences built from the same content file:

- **Ride the BRIDGE Line** (`index.html`): the immersive Metro experience.
- **Partner Express** (`express.html`): the 90-second executive summary.

Also: `present.html` (meeting presentation), `prospectus.html`, `overview.html` and `downloads/` (prospectus and one-page overview PDFs).

To update facts, numbers, programs or partnership levels, edit `content.js`. Then run `python tools/prerender.py` and `python tools/build-prospectus.py`. See [docs/MAINTENANCE.md](docs/MAINTENANCE.md) and [docs/CHANGELOG.md](docs/CHANGELOG.md).

Static site with no build step and no dependencies, deployed by GitHub Pages from `main`. Fonts are self-hosted (SIL Open Font License, see `assets/fonts/LICENSE-OFL.txt`).
