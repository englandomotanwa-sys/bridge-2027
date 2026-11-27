# Maintaining the BRIDGE the District website

This site is plain HTML, CSS and JavaScript. There is no build step and nothing to install to edit it. GitHub Pages publishes whatever is on the `main` branch.

**Almost every update happens in one file: `content.js`.** Edit it on GitHub (open the file, click the pencil icon, commit). The site updates within a minute or two.

## The files

| File | What it is |
|---|---|
| `content.js` | All facts, numbers, programs, levels, pathways, partners, links. **Edit this.** |
| `index.html` | Ride the BRIDGE Line, the full immersive experience |
| `express.html` | Partner Express, the 90-second executive summary |
| `present.html` | Presentation mode for meetings (press F for full screen, N for notes) |
| `prospectus.html` | The printable prospectus, and custom proposals from the builder |
| `downloads/…Prospectus-2027.pdf` | The downloadable PDF (rebuild it after content changes, see below) |
| `assets/css/` | Styles. `system.css` is shared; `ride.css` is the original Metro design; `sections.css` holds the newer sections |
| `assets/js/common.js` | Renders shared sections from `content.js`, and runs the partnership form |
| `assets/js/ride.js` | Animations, sound, the train, the builder, the boarding gate |
| `*.jpg` | Photos (kept in the root so existing links keep working) |
| `tools/` | Scripts to rebuild the PDF and the share image |

## Common updates

**Change a number.** Find it in `metrics` and edit `value` (a plain number) and `display` (what shows, like `'102+'`). Always update `period` too. Set `status: 'verified'` once leadership has checked it against records.

**Add a new metric** (students served, mentorship connections, survey results). These already exist with `value: null`. Fill in `value`, `display`, `period` and an optional `note`. It appears automatically in the right category. Outcomes show only once a value exists.

**Show the fall vs. spring application comparison.** Set `fall2026.basis` to `'applications'` if 21 was the number of fall applications, or `'fellows'` if it was the number of accepted fellows. It stays hidden while it says `'unverified'`.

**Update a program.** Edit its entry in `programs`. Change `status` to `'confirmed'` when the date, venue and lineup are locked. Use `'tentative'` for anything uncertain. Do not list speakers or venues until they are confirmed.

**Change partnership levels or benefits.** Edit `tiers`. `online: true` shows a Give button. `online: false` shows "Schedule a conversation". The fare chart, builder ladder, deck and PDF all update from the same list.

**Add a sponsor or partner.** Add the name to the right list in `relationships`. Use `formal` only for written partnerships and `sponsor` only for organizations that have given money. A speaker's employer goes under `speaker`. Empty lists stay hidden.

**Add a testimonial or story.** Add to `testimonials` (or `stories`) with `approved: true` only after you have written permission. Never name or quote a minor. The section stays hidden until one approved entry exists.

**Publish a W-9 or IRS determination letter.** Put the PDF in `docs/public/`, then add `{ label: 'IRS determination letter', file: 'docs/public/your-file.pdf' }` to `documents`.

**Show fundraising progress.** Set `goals.raised` to a number and `goals.raisedAsOf` to a date.

**Approved dollar-to-impact statements.** In `costAreas`, fill `equivalency` (for example `'$250 covers lunch for one workshop'`) only after it is confirmed against the budget.

**Add a scheduling link.** Paste a Calendly or Google booking link into `links.booking`. Every "Schedule a conversation" button switches from email to that link.

**Photos of younger students.** List any such photo in `photos` with `minors: true`. These stay out of the PDF and share images. Confirm media consent before publishing any photo of a minor.

## Receiving form submissions directly

Right now the partnership forms prepare a ready-to-send email (Gmail, Outlook, or the visitor's email app) with the full summary written in. Nothing is sent automatically, and the site never claims a message was sent.

To receive submissions directly instead:

1. Create a free form at [formspree.io](https://formspree.io) using info@bridgethedistrict.org.
2. Copy the form's endpoint, which looks like `https://formspree.io/f/abcdwxyz`. It is public and safe to publish. It is not a password.
3. In `content.js`, set `form.endpoint` to that URL and `form.provider` to `'formspree'`.
4. Submit a test from the live site and confirm it arrives. The success message appears only when Formspree confirms receipt. If the request fails, the visitor sees that nothing was sent and gets the email option.

Never put API keys, passwords or private tokens in any file in this repository.

## Rebuilding the PDF prospectus

The PDF is generated from `prospectus.html`, so it always matches `content.js`. After content changes:

```bash
pip install playwright
python -m playwright install chromium
python tools/build-prospectus.py
```

Commit the updated `downloads/BRIDGE-the-District-Partnership-Prospectus-2027.pdf`. The script warns you if any page overflows. If it does, shorten the copy. Anyone can also open `prospectus.html` and use Print, then Save as PDF.

The share image (`assets/og-image.jpg`) comes from `tools/og-image.html`. Open it at 1200 by 630 pixels and screenshot it if you need to change it.

## Moving to an official domain

1. Buy the domain and point it at GitHub Pages (Settings, then Pages, then Custom domain). GitHub adds a `CNAME` file.
2. In `content.js`, set `site.url` and `site.officialDomain` to the new address.
3. Replace `https://englandomotanwa-sys.github.io/bridge-2027/` with the new address in `index.html` and `express.html` (the `canonical`, `og:url`, `og:image` and JSON-LD lines), `robots.txt` and `sitemap.xml`.

All other links are relative, so they keep working on the new domain.

## House rules for copy

- No em dashes.
- Every number needs a period, and a source if it comes from outside BRIDGE.
- Describe students by their talent and their access, never by deficits.
- Keep "planned" and "confirmed" honest.
