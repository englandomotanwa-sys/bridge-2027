# 2027 upgrade report

Branch: `upgrade/institutional-platform`. The original site is preserved at tag `baseline-2026-11-27`.

## Needs your verification before publishing

Each item is in `content.js` unless noted.

1. **Fall 2026 figure of 21.** Was it applications or accepted fellows? The fall to spring "~5x" comparison is hidden until `fall2026.basis` is set. The cohort photo shows about twenty scholars, which suggests 21 may be the fellow count.
2. **Every carried-over metric** (`status: 'reported'`) needs a check against records, and each reporting period I assigned needs confirming: 102+ applications (spring 2027 cycle), 430K+ tracker views and 750+ opportunities ("as of fall 2026"), 104 supporters and 29% over goal ("BRIDGE to Impact campaign, 2026": the exact date is unknown), 600+ books ("through fall 2026"), 4 universities, 1 school.
3. **Nonprofit status.** The site says "501(c)(3) public charity". Confirm the IRS determination, and supply an EIN or documents only if you want them published.
4. **Leadership.** Only England Meadows is listed. The site mentions a co-founder and a co-executive director role. Add the other leaders if they approve.
5. **Founding story and year.** Hidden until provided. Past grant drafts mention co-founders and listening tours, but those were drafts, not approved copy.
6. **Spring 2027 programs.** All ten are marked "Planned". Mark each one "Confirmed" once it is locked.
7. **Relationship categories.** Check that each organization is in the right category. In particular: AAMC is listed as a host venue and an in-kind contributor (dinner); The Hill Girl's Guide, Brown Kids Read and Our Kids Read are listed as collaborators; Annunciation Catholic School is listed as a school where fellows mentored. Alpha Phi Alpha appeared in the old logo marquee with no stated role, so I removed it until you tell me its role.
8. **Photos of younger students** (`kids.jpg`, `kids2.jpg`). Confirm media consent with the school and families. They are excluded from the PDF and share image either way.
9. **Outside facts kept from the old site:** Brown Kids Read founded in 2018 by then-13-year-old Ssanyu Lukoma; "88th Miss Howard"; speaker titles; the 2026 Rising Futures Award from BUILD.
10. **Givebutter `?amount=` prefill.** The old code assumed it works. Test it, or set `links.givePrefill: false`.
11. **Domain.** "bridgethedistrict.org" was printed on the old site but is not linked or used anywhere now. Only the email address is used.

## Corrections made to outside statistics

- 55% college enrollment: this is for the **class of 2024**, within six months of graduating. The old site said "class of 2023–24".
- 16% SAT benchmark: 2024–25, **down four points**. I removed the old claim that state test results improved, because I could not confirm it in the source.
- AP participation (22% Black vs 57% white students): **2021–22**, across DC. The old site said "DCPS" and gave no year.

## Proposed amounts and benefits needing approval

`tiers` in `content.js`:

- $250 Station Supporter, $500 Station Partner, $1,000 Line Partner and $2,500 Founding Rider. These are unchanged from the old site, except that the unverified "Limited" tag was removed from Founding Rider.
- **New:** $5,000 Presenting Partner (presenting recognition on one program, a co-designed team engagement, a planning conversation with leadership).
- **New:** $10,000+ Institutional Impact Partner (a co-designed season or year partnership, support for scholar training and operations, regular check-ins, recognition agreed together).
- Line Partner benefit wording changed from "photos and outcomes" to "photos and results", so it does not promise outcome data.
- Other items needing your approval: the unrestricted and program-gift explanations (a program gift is "used for that program"), and the FAQ answers.
- `costAreas.equivalency` is empty everywhere. No dollar-to-impact claims are made.

## Technical dependencies

- **Form backend:** none exists. Forms prepare a pre-written email and never claim success. To receive submissions directly, add a Formspree endpoint (`form.endpoint`). See MAINTENANCE.md.
- **Scheduling link:** none. "Schedule a conversation" opens an email until `links.booking` is set.
- **Recurring giving:** not shown on the Givebutter page, so the site says "email us to set one up" (`links.recurringAvailable`).
- **Official domain:** steps are in MAINTENANCE.md.
