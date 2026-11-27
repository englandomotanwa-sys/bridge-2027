# Maintaining the BRIDGE the District website

This site is plain HTML, CSS and JavaScript. There is no build step and nothing to install to edit it. GitHub Pages publishes whatever is on the `main` branch.

**Almost every update happens in one file: `content.js`.** Edit it on GitHub (open the file, click the pencil icon, commit). The site updates within a minute or two.

**`content.js` is public.** Anyone can read it. Never put student names, contact details, application data, banking details, private correspondence or internal governance notes in it. Internal records belong in the shared drive, not in this repository.

**After editing `content.js`, refresh the static copy** so the site stays readable without JavaScript (see "Keeping the static HTML in sync" below). If you skip it, visitors with JavaScript still see the new content, but search engines and no-script visitors see the old copy.

## The files

| File | What it is |
|---|---|
| `content.js` | All facts, numbers, programs, levels, pathways, partners, links. **Edit this.** |
| `index.html` | Ride the BRIDGE Line, the full immersive experience |
| `express.html` | Partner Express, the 90-second executive summary |
| `present.html` | Presentation mode for meetings (press F for full screen, N for notes) |
| `prospectus.html` | The printable prospectus, and custom proposals from the builder |
| `overview.html` | The one-page overview for internal champions and review committees |
| `downloads/*.pdf` | The prospectus and one-page overview PDFs (rebuild them after content changes, see below) |
| `assets/css/` | Styles. `system.css` is shared; `ride.css` is the original Metro design; `sections.css` and `readiness.css` hold the newer sections |
| `assets/js/common.js` | Renders shared sections from `content.js`, and runs the partnership form |
| `assets/js/ride.js` | Animations, sound, the train, the builder, the boarding gate |
| `*.jpg` | Photos (kept in the root so existing links keep working) |
| `tools/` | Scripts to prerender the static HTML, rebuild the PDFs and the share image |

## Common updates

**Change a number.** Find it in `metrics` and edit `value` (a plain number) and `display` (what shows, like `'102+'`). Always update `period` too. Use `status: 'documented'` only when the figure matches a primary record (a form export, sign-in sheet, roster or campaign page). Use `'reported'` for figures from recaps or planning notes. Count people, not forms; label registrations as registrations; never add totals from different periods.

**Add a new metric** (students served, mentorship connections, survey results). These already exist with `value: null`. Fill in `value`, `display`, `period` and an optional `note`. It appears automatically in the right category. Outcomes show only once a value exists.

**Cohort growth.** The records show 21 was the fall 2026 cohort size, so `fall2026.basis` is `'fellows'` and no application growth claim is made. Edit `growth` to update the term-by-term bars. Planned seats are shown with a dashed bar and never as results.

**Update a program.** Edit its entry in `programs`. Change `status` to `'confirmed'` when the date, venue and lineup are locked. Use `'tentative'` for anything uncertain. Do not list speakers or venues until they are confirmed.

**Change partnership packages or benefits.** Packages live in `tiers` and benefits in `benefits`. Each package lists its own `benefitIds`; never write "everything in the level below". Each benefit has a `scope` (per program, season, partnership or per gift), a `stack` rule, and `limited` / `approval` flags. The rules engine (`X.rules` in `assets/js/common.js`) reads these, and the builder, Partner Express, the deck, the prospectus, the one-page overview and generated proposals all use it. Core rules, which the tests enforce: titles come only from a package chosen explicitly, never from a total; designated support is confirmed before payment; only unrestricted gifts go to online checkout. After any change, run `python tools/test-rules.py`.

**Add a sponsor or partner.** Add the name to the right list in `relationships`. Use `formal` only for written partnerships and `sponsor` only for organizations that have given money. A speaker's employer goes under `speaker`. Empty lists stay hidden.

**Add a testimonial or story.** Add to `testimonials` (or `stories`) with `approved: true` only after you have written permission. Never name or quote a minor. The section stays hidden until one approved entry exists.

**Documents.** `documents` lists what partners can ask for and whether it is listed here, available on request or in preparation. Change `availability` as documents become ready. Only add a `file` for a document cleared for publication, and never publish a document that shows a home address or signature (the IRS letter in the drive does, so send it on request instead).

**Show fundraising progress.** Set `goals.raised` to a number and `goals.raisedAsOf` to a date.

**Approved dollar-to-impact statements.** In `costAreas`, fill `equivalency` (for example `'$250 covers lunch for one workshop'`) only after it is confirmed against the budget.

**Presentation.** `present.html` builds 12 slides from `content.js`. Add `?for=Organization%20Name` to personalize the opening and role slides. Presenter view opens private notes in a second window. Sound is off until the presenter turns it on. `present.html?print=1` is what the offline deck PDF is made from.

**Add a scheduling link.** Paste a Calendly or Google booking link into `links.booking`. Every "Schedule a conversation" button switches from email to that link.

**Photos of younger students.** List any such photo in `photos` with `minors: true`. These stay out of the PDF and share images. Confirm media consent before publishing any photo of a minor.

**Timeline, continuity, tracks, rooms.** Edit `timeline`, `continuity`, `portfolios` and `rooms`. In `continuity`, move an item from `'in-progress'` to `'in-place'` only when it is actually operating. In `rooms`, every story must come from an event record; never invent a quote, and never name or quote a younger student.

**Governance.** `org.governance.summary` is shown on the site, the prospectus and the one-page overview. Update it the day the Board is seated, and add members to `org.leadership` only once elected.

## Tests

With the site served locally (`python -m http.server 8765` in the repository folder):

```bash
python tools/test-rules.py     # partnership rules and builder, 53 scenarios
python tools/test-site.py      # site behavior, accessibility and mobile, 40 checks
python tools/test-deck.py      # presentation: transitions, sound timing, fit at 5 screen sizes
python tools/test-endpoint.py  # form success and failure handling against a mock endpoint
```

Set `CHROME_PATH` if Playwright's own Chromium is not installed. Run all four before publishing.

## Keeping the static HTML in sync

The essential sections are written into the HTML files as well, between `<!--pre-->` and `<!--/pre-->` markers, so the site is readable if JavaScript fails. After editing `content.js`:

```bash
pip install playwright
python -m playwright install chromium
python tools/prerender.py
python tools/build-prospectus.py
```

Commit the changed HTML files and the three PDFs (prospectus, one-page overview, pitch deck). Never edit text between the `pre` markers by hand; it is overwritten on the next run.

## Receiving form submissions directly

Right now the partnership forms prepare a ready-to-send email (Gmail, Outlook, or the visitor's email app) with the full summary written in. Nothing is sent automatically, and the site never claims a message was sent.

To receive submissions directly instead:

1. Create a free form at [formspree.io](https://formspree.io) using info@bridgethedistrict.org.
2. Copy the form's endpoint, which looks like `https://formspree.io/f/abcdwxyz`. It is public and safe to publish. It is not a password.
3. In `content.js`, set `form.endpoint` to that URL and `form.provider` to `'formspree'`.
4. Submit a test from the live site and confirm it arrives. The success message appears only when Formspree confirms receipt. If the request fails, the visitor sees that nothing was sent and gets the email option.

Never put API keys, passwords or private tokens in any file in this repository.

## Rebuilding the PDFs

The prospectus PDF is generated from `prospectus.html` and the one-page overview from `overview.html`, so both always match `content.js`. After content changes:

```bash
pip install playwright
python -m playwright install chromium
python tools/build-prospectus.py
```

Commit both files in `downloads/`. The script warns you if any page overflows. If it does, shorten the copy. Anyone can also open `prospectus.html` and use Print, then Save as PDF.

The share image (`assets/og-image.jpg`) comes from `tools/og-image.html`. Open it at 1200 by 630 pixels and screenshot it if you need to change it.

## Moving to an official domain

1. Buy the domain and point it at GitHub Pages (Settings, then Pages, then Custom domain). GitHub adds a `CNAME` file.
2. In `content.js`, set `site.url` and `site.officialDomain` to the new address.
3. Replace `https://englandomotanwa-sys.github.io/bridge-2027/` with the new address in `index.html` and `express.html` (the `canonical`, `og:url`, `og:image` and JSON-LD lines), `robots.txt` and `sitemap.xml`.

All other links are relative, so they keep working on the new domain.

## The brand system

Two identities, never merged:

- **BRIDGE the District** is the permanent institution. Its logo is the B monogram (Capitol dome in the upper bowl, bridge arches in the lower bowl, red, yellow and blue routes crossing the middle) beside the wordmark. Never add a season or year to it.
- **The BRIDGE Line** is the seasonal campaign. It uses the round "BR" line bullet, the name, and a separate season tag (for example "Spring 2027"). Change the season in `content.js` under `brand.campaignSeason`; nothing else needs editing.

Logo files are in `assets/brand/`: `monogram.svg` (full color), `monogram-reversed.svg` (on navy), `monogram-circle.svg`, `monogram-simplified.svg` and `monogram-simplified-reversed.svg` (small sizes and favicons), `monogram-mono-navy.svg` and `monogram-mono-white.svg` (one color), PNG exports, and `email-signature.html`. The public guide is `brand.html` (not indexed by search engines).

**Core colors** (use for identity, buttons, headings and text): BRIDGE Navy #0B1F3B, District Red #E31937, Capital Blue #0073FF, Opportunity Yellow #FFC300, District Stone #F8F7F2. For small text on light backgrounds use the darker inks #B5102A (red) and #0062D9 (blue) so contrast passes.

**Route colors** (navigation only: pathway chips, map lines, station markers): Maroon #8C1D40, Green #00A651, Teal #0E9AA7, Silver #A2A9B4, Orange #F26B21, Purple #7A4FBF, Sky #5AB2FF. Do not use route colors for logos, buttons or headings.

**Type:** Montserrat for headings, Inter for text, VT323 only for the departure-board displays. All are self-hosted in `assets/fonts/`, so nothing loads from Google.

If an official logo file is produced, replace the SVGs in `assets/brand/` with the same file names, then rerun `tools/build-prospectus.py` and rerender the share image from `tools/og-image.html`.

## House rules for copy

- No em dashes.
- Every number needs a period, and a source if it comes from outside BRIDGE.
- Describe students by their talent and their access, never by deficits.
- Keep "planned" and "confirmed" honest.
