/* =====================================================================
   BRIDGE the District: SITE CONTENT
   ---------------------------------------------------------------------
   This is the one file to edit for routine updates. Every page
   (index.html, express.html, present.html, prospectus.html) reads it.

   Rules of the road:
   - Never publish a number you cannot document. Set value: null to hide.
   - Every metric needs a period (when it was measured) and a status.
       status: 'verified'  = checked against records by BRIDGE leadership
               'reported'  = carried over from the previous site, not yet re-checked
   - Program status: 'confirmed' | 'planned' | 'tentative'
   - Pathway status: 'existing' (BRIDGE runs related programming now)
                     'proposed' (an opportunity we would build with a partner)
   - Anything with show:false or an empty value stays hidden on the site.
   - Do not use em dashes in copy.
   See docs/MAINTENANCE.md for step-by-step instructions.
   ===================================================================== */
window.BRIDGE = {

  /* ---------- Site and sharing ---------- */
  site: {
    // Public address of the site. When an official domain is live, change this
    // (and sitemap.xml / robots.txt). Relative links keep working either way.
    url: 'https://englandomotanwa-sys.github.io/bridge-2027/',
    officialDomain: '',            // e.g. 'https://www.example.org/' once purchased and verified. Leave '' until then.
    ogImage: 'assets/og-image.jpg'
  },

  /* ---------- Organization ---------- */
  org: {
    name: 'BRIDGE the District',
    short: 'BRIDGE',
    city: 'Washington, DC',
    email: 'info@bridgethedistrict.org',
    phone: '',                       // leave '' unless approved for publication
    mission: 'BRIDGE the District closes opportunity gaps by supporting youth to excel within and beyond the classroom.',
    tagline: 'For students. By students. With students.',
    positioning: 'A student-powered infrastructure for opportunity in Washington, DC.',
    taxStatus: {
      label: '501(c)(3) public charity',
      detail: 'Gifts are tax-deductible as allowed by law.',
      ein: '',                       // add only if approved for publication
      verified: false                // set true once leadership confirms the IRS determination
    },
    founded: '',                     // e.g. '2024'. Hidden while empty.
    foundingStory: '',               // approved founding story, 2 to 4 sentences. Hidden while empty.
    leadership: [
      { name: 'England Meadows', role: 'Co-Founder & Co-Executive Director' }
      // { name: '', role: 'Co-Founder & Co-Executive Director' },
    ],
    recognition: [
      { name: 'Rising Futures Award', from: 'BUILD', year: '2026' }
    ],
    fellowship: {
      name: 'Impact Scholar Fellowship',
      summary: 'College students from Howard, American, George Washington and Georgetown universities train together, then plan, host and lead BRIDGE programs, including work alongside younger students in DC schools.'
    }
  },

  /* ---------- Links ---------- */
  links: {
    give: 'https://givebutter.com/ride-the-bridge-line-2027-nyda1s',
    givePrefill: true,               // adds ?amount= to the giving link. Confirm Givebutter honors it, or set false.
    recurringAvailable: false,       // set true once monthly giving is confirmed on the giving page
    booking: '',                     // a scheduling link (Calendly, Google Calendar). Hidden while empty; email is used instead.
    tracker: 'https://docs.google.com/spreadsheets/d/10MHdr2RtLGzFgJDUOKc7_TVcTc9U5Hi18Xtzlk1saZg/edit',
    prospectusPdf: 'downloads/BRIDGE-the-District-Partnership-Prospectus-2027.pdf',
    instagram: ''                    // e.g. 'https://www.instagram.com/...'. Hidden while empty.
  },

  /* ---------- Partnership form ----------
     GitHub Pages cannot receive form posts on its own. Until an endpoint is set,
     the form prepares an email with the full summary (nothing is sent automatically).
     To receive submissions directly, create a free form at Formspree (or similar),
     paste its public endpoint URL here, and set provider. No secret keys belong here. */
  form: {
    endpoint: '',                    // e.g. 'https://formspree.io/f/xxxxxxx'
    provider: ''                     // 'formspree' | 'generic-json'
  },

  /* ---------- Fundraising ---------- */
  goals: {
    season: 'Spring 2027',
    amount: 10000,                   // the published spring goal
    raised: null,                    // set a number to show progress publicly. Hidden while null.
    raisedAsOf: ''
  },

  /* ---------- Impact metrics ----------
     category: 'reach' | 'demand' | 'delivery' | 'outcomes'
     highlight: true puts it in the strip under the hero (pick four). */
  metrics: [
    { id: 'apps', category: 'demand', value: 102, display: '102+', label: 'applications to the spring Impact Scholar Fellowship', period: 'Spring 2027 application cycle', note: 'Applications received, not students accepted.', status: 'reported', highlight: true },
    { id: 'tracker', category: 'reach', value: 430000, display: '430K+', label: 'views of our free opportunity tracker', period: 'All time, as of fall 2026', note: 'A public list of internships, fellowships and programs, shared free with anyone.', status: 'reported', highlight: true },
    { id: 'opps', category: 'reach', value: 750, display: '750+', label: 'opportunities listed in the tracker', period: 'As of fall 2026', note: '', status: 'reported' },
    { id: 'unis', category: 'reach', value: 4, display: '4', label: 'universities represented among Impact Scholars', period: '2026 to 2027 fellowship year', note: 'Howard, American, George Washington and Georgetown.', status: 'reported' },
    { id: 'schools', category: 'reach', value: 1, display: '1', label: 'school where fellows mentored younger students', period: 'Fall 2026', note: 'Annunciation Catholic School.', status: 'reported' },
    { id: 'books', category: 'delivery', value: 600, display: '600+', label: 'books given to young readers with Brown Kids Read and Our Kids Read', period: 'Through fall 2026', note: '', status: 'reported' },
    { id: 'supporters', category: 'reach', value: 104, display: '104', label: 'supporters in the 24-hour BRIDGE to Impact campaign', period: 'BRIDGE to Impact campaign, 2026', note: 'The campaign passed its goal by 29% by 4 PM.', status: 'reported', highlight: true },
    { id: 'goalpct', category: 'demand', value: 29, display: '29%', label: 'above goal in the 24-hour BRIDGE to Impact campaign, reached by 4 PM', period: 'BRIDGE to Impact campaign, 2026', note: '', status: 'reported', highlight: true },
    { id: 'speakers', category: 'delivery', value: null, derive: 'speakers', display: '', label: 'professional guest speakers across three fall programs', period: 'Fall 2026', note: 'Counted from the speaker list below. Speakers appear in their individual capacity.', status: 'reported' },
    { id: 'programs', category: 'delivery', value: null, derive: 'pastPrograms', display: '', label: 'documented programs delivered', period: 'Fall 2026', note: '', status: 'reported' },
    // Add these as soon as they are documented. They stay hidden while value is null.
    { id: 'served', category: 'reach', value: null, display: '', label: 'students served', period: '', note: '', status: 'verified' },
    { id: 'returning', category: 'demand', value: null, display: '', label: 'returning participants', period: '', note: '', status: 'verified' },
    { id: 'waitlist', category: 'demand', value: null, display: '', label: 'students on a waitlist', period: '', note: '', status: 'verified' },
    { id: 'workshops', category: 'delivery', value: null, display: '', label: 'workshops conducted', period: '', note: '', status: 'verified' },
    { id: 'hours', category: 'delivery', value: null, display: '', label: 'service hours', period: '', note: '', status: 'verified' },
    { id: 'leaders', category: 'outcomes', value: null, display: '', label: 'Impact Scholars who led a program', period: '', note: '', status: 'verified' },
    { id: 'mentor', category: 'outcomes', value: null, display: '', label: 'documented mentorship connections', period: '', note: '', status: 'verified' },
    { id: 'secured', category: 'outcomes', value: null, display: '', label: 'educational or professional opportunities secured', period: '', note: '', status: 'verified' },
    { id: 'feedback', category: 'outcomes', value: null, display: '', label: 'of participants who would recommend BRIDGE', period: '', note: 'From a participant survey.', status: 'verified' },
    { id: 'schoolfb', category: 'outcomes', value: null, display: '', label: 'partner-school feedback', period: '', note: '', status: 'verified' }
  ],
  impactNotes: {
    outcomes: 'We publish outcome figures only after they are documented and reviewed. None are shown yet.'
  },

  /* ---------- Fall 2026 to Spring 2027 comparison ----------
     The previous site compared "21 applications" in fall 2026 with 102+ in spring 2027.
     Confirm what 21 counted before the comparison returns:
       basis: 'applications' -> shows the side by side growth comparison
       basis: 'fellows'      -> shows 21 as the fall cohort size, with no growth claim
       basis: 'unverified'   -> hides the fall figure entirely (current setting) */
  fall2026: { value: 21, basis: 'unverified' },

  /* ---------- The problem: outside data ---------- */
  gapStats: [
    { value: '55%', text: "of DC's public high school class of 2024 enrolled in college or another postsecondary program within six months of graduating, down a point from the year before.", source: 'DC Policy Center, State of D.C. Schools 2024–25', url: 'https://www.dcpolicycenter.org/publications/stateofdcschools2024-25/' },
    { value: '16%', text: "of DC public high school students met the SAT college and career readiness benchmark in 2024–25, down four points from the year before.", source: 'DC Policy Center, State of D.C. Schools 2024–25', url: 'https://www.dcpolicycenter.org/publications/stateofdcschools2024-25/' },
    { bars: [['Black students', 22], ['White students', 57]], title: 'Who took AP courses in DC, 2021–22', text: 'Same city, very different doors.', source: 'DC Racial Equity, Academic Achievement Gap brief, citing the Community College Research Center', url: 'https://www.dcracialequity.org/achievement-gap-brief' }
  ],

  /* ---------- Where BRIDGE works ---------- */
  focusAreas: [
    { name: 'Educational equity', color: '#e4002b', text: 'Talent is everywhere in this city. Access is not. We work on access.' },
    { name: 'College access', color: '#2f6fd6', text: 'Campus visits, college students as guides, and honest answers about what comes next.' },
    { name: 'Workforce and professional development', color: '#ffb000', text: 'Career exposure in the fields DC runs on: law, policy, health and media.' },
    { name: 'University and community connection', color: '#19a35b', text: 'Students from four universities bring campus knowledge into DC schools and neighborhoods.' },
    { name: 'Student leadership development', color: '#ff7a1a', text: 'Impact Scholars plan, host and lead every program.' },
    { name: 'Civic and community engagement', color: '#9aa6c4', text: 'Mock committees, Black History Week, community nights.' },
    { name: 'Social capital and network access', color: '#a66be0', text: 'Students leave with a person to follow up with, not just a certificate.' }
  ],

  /* ---------- Theory of change (the model map) ----------
     evidence type: 'established' (happening now), 'measured' (documented figure, uses metricId),
                    'intended' (what we are working toward, not claimed as a result) */
  model: [
    { id: 'resources', name: 'Institutional resources and partnerships', short: 'Resources', kind: 'established',
      text: 'Institutions bring what students cannot easily reach alone: rooms, expertise, funding and introductions.',
      evidence: [ { type: 'established', text: 'Fall 2026 programs were hosted at AU Washington College of Law, AAMC and the True Reformer Building, with The Hill Girl\'s Guide, Brown Kids Read and Our Kids Read as collaborators.' } ] },
    { id: 'programs', name: 'BRIDGE programming, training and infrastructure', short: 'Programming', kind: 'established',
      text: 'Career exploration programs, community nights, campus visits and Impact Scholar training, run on one season calendar.',
      evidence: [ { type: 'measured', metricId: 'programs' }, { type: 'established', text: '{programs} programs are planned for spring 2027, January to April.' } ] },
    { id: 'scholars', name: 'College students developed as Impact Scholars and community leaders', short: 'Impact Scholars', kind: 'transfer',
      text: 'The transfer station. College students train as Impact Scholars, then design, host and lead each program. Every investment passes through them.',
      evidence: [ { type: 'measured', metricId: 'apps' }, { type: 'measured', metricId: 'unis' } ] },
    { id: 'college', name: 'Pathway one: college students', short: 'College students', kind: 'branch', line: 'red',
      text: 'College students receive leadership development, professional exposure, mentorship and access to professional networks.',
      evidence: [ { type: 'established', text: 'Students moderated panels, sat beside professionals and negotiated amendments in a mock committee.' }, { type: 'measured', metricId: 'speakers' }, { type: 'intended', text: 'Leadership experience and professional relationships that carry into careers.' } ] },
    { id: 'younger', name: 'Pathway two: younger students', short: 'Younger students', kind: 'branch', line: 'blue',
      text: 'Younger students receive educational enrichment, college exposure, mentorship and access to resources.',
      evidence: [ { type: 'established', text: 'Fellows read with and mentored younger students at Annunciation Catholic School.' }, { type: 'measured', metricId: 'books' }, { type: 'intended', text: 'Younger students who can picture themselves on a college campus, because they have been there.' } ] },
    { id: 'outcomes', name: 'Long-term outcomes', short: 'Outcomes', kind: 'intended',
      text: 'Stronger educational pathways, expanded social capital, increased institutional access and a more connected community.',
      evidence: [ { type: 'intended', text: 'These are the outcomes we are working toward. We do not present them as proven results.' } ] }
  ],

  /* ---------- Spring 2027 programs (the BRIDGE Line) ----------
     type: 'career' | 'scholar' | 'community' | 'civic' | 'younger' */
  programs: [
    { n: 'Winter Fundraiser', d: 'Jan 9', iso: '2027-01-09', type: 'community', status: 'planned', img: 'group2.jpg', cap: 'Our community',
      why: 'Every spring program starts with resources. This night is where the community builds them together.',
      audience: 'BRIDGE supporters, families, alumni and friends.',
      t: 'The season kicks off with a community fundraiser that helps fund every stop after it.',
      outputs: 'Funds raised toward the spring season.', intended: 'A wider base of community supporters.',
      makesPossible: 'Event costs, so more of what is raised can go to programs.',
      a: ['<b>$250</b> to be a founding season supporter', 'Food, treats or raffle prizes in-kind', 'Match the first $500 raised'] },
    { n: 'Fellow Retreat', d: 'Jan 16', iso: '2027-01-16', type: 'scholar', status: 'planned', img: 'retreat.jpg', cap: 'Fellow retreat introductions',
      why: 'Students lead best when they have trained together first.',
      audience: 'The spring cohort of Impact Scholars.',
      t: 'The spring Impact Scholar cohort meets, sets goals and starts building the season.',
      outputs: 'A trained cohort with goals and roles for the season.', intended: 'Scholars ready to plan and lead programs on their own.',
      makesPossible: 'Training space, materials and welcome kits for incoming scholars.',
      a: ['Welcome kits for incoming scholars', 'A space for the day', '<b>$500</b> toward the retreat'] },
    { n: 'BRIDGE to Medicine', d: 'Jan 30', iso: '2027-01-30', type: 'career', status: 'planned', img: 'listen.jpg', cap: 'A BRIDGE room',
      why: 'The path into medicine is long, and the people who can explain it are hard to reach.',
      audience: 'Pre-health college students from Howard, American and beyond.',
      t: 'Pre-health students meet the doctors, nurses and researchers they want to become.',
      outputs: 'Conversations and mentor tables with health professionals.', intended: 'Clearer next steps toward health careers, and professionals students can follow up with.',
      makesPossible: 'Food, materials and space for students to meet professionals in a relaxed setting.',
      a: ['<b>$250</b> Station Supporter', 'A clinician speaker or mentor table', '<b>$500</b>: "Brunch presented by…"'] },
    { n: 'Hall Pass Hub', d: 'Feb 6', iso: '2027-02-06', type: 'community', status: 'planned', img: 'duo.jpg', cap: 'Connection past the event',
      why: 'Belonging is part of opportunity. Students show up for each other first.',
      audience: 'College students across DC campuses.',
      t: 'A student-built social night: games, conversation and community across campuses.',
      outputs: 'A cross-campus community night.', intended: 'Stronger peer networks across campuses.',
      makesPossible: 'Food, games and prizes for the night.',
      a: ['Food or snacks in-kind', 'Prizes for the night', '<b>$250</b> toward the night'] },
    { n: 'Black History Week', d: 'Feb 15–19', iso: '2027-02-15', type: 'civic', status: 'planned', img: 'rtr_panel.jpg', cap: 'Read the Room',
      why: 'Student voices belong at the center of how DC tells its history.',
      audience: 'Students at Howard, American and George Washington universities.',
      t: 'A week of programming that celebrates Black history in DC and puts student voices at the center.',
      outputs: 'A week of student-led programs across campuses.', intended: 'Civic engagement and a deeper connection to DC history.',
      makesPossible: 'Speakers, performers, venues and materials.',
      a: ['<b>$500</b> toward the week', 'A speaker, performer or venue', 'Books or materials for attendees'] },
    { n: 'BRIDGE to Policy & Law', d: 'Feb 20', iso: '2027-02-20', type: 'career', status: 'planned', img: 'policy.jpg', cap: 'A past BRIDGE to Policy', returning: true,
      why: 'Laws shape students\' lives, but the rooms where they are written can feel closed.',
      audience: 'College students interested in law, policy and public service.',
      t: 'The Room Where It Happens: a Black History Week luncheon where students sit with lawyers, lobbyists and Hill staff, then split into hands-on law and policy workshops.',
      outputs: 'A main panel and two hands-on law and policy workshops.', intended: 'Students who understand how policy is made and know professionals they can contact.',
      makesPossible: 'Lunch, workshop materials and space for students to work with practitioners.',
      a: ['<b>$250</b> Station Supporter', 'A lawyer, lobbyist or staffer as speaker', '<b>$500</b>: name the coffee bar or a session'] },
    { n: 'Hall Pass Hub', d: 'Mar 14', iso: '2027-03-14', type: 'community', status: 'planned', img: 'group.jpg', cap: 'BRIDGE community',
      why: 'Community keeps students coming back between bigger programs.',
      audience: 'College students across DC campuses.',
      t: 'The second Hall Pass of the spring.',
      outputs: 'A cross-campus community night.', intended: 'Stronger peer networks across campuses.',
      makesPossible: 'Food, giveaways and prizes for the night.',
      a: ['Food or snacks in-kind', 'Giveaways and prizes', '<b>$250</b> toward the night'] },
    { n: 'BRIDGE to Media & Entertainment', d: 'Mar 20', iso: '2027-03-20', type: 'career', status: 'planned', img: 'rtr_speaker.jpg', cap: 'On stage at Read the Room',
      why: 'DC runs on stories. Students should meet the people who tell them.',
      audience: 'Students interested in journalism, media, entertainment and communications.',
      t: 'Students meet the people behind DC newsrooms, studios, stages and brands.',
      outputs: 'Conversations with media and entertainment professionals.', intended: 'Real knowledge of media careers and contacts in the field.',
      makesPossible: 'Speakers, a venue and materials.',
      a: ['<b>$250</b> Station Supporter', 'A creator, journalist or producer as speaker', 'Tickets, studio tours or a venue'] },
    { n: 'Next Up Tour', d: 'Apr 9', iso: '2027-04-09', type: 'younger', status: 'planned', img: 'kids.jpg', cap: 'Fellows at Annunciation Catholic School',
      why: 'Seeing a campus in person changes what feels possible.',
      audience: 'Younger students from DC schools, led by Impact Scholars.',
      t: 'Younger students visit college campuses, led by BRIDGE scholars.',
      outputs: 'Campus visits led by college students.', intended: 'Younger students who can picture themselves in college.',
      makesPossible: 'Transportation and lunch for the tour group.',
      a: ['Transportation for students', 'Lunch for the tour group', '<b>$500</b>: "Bus by…"'] },
    { n: 'Closing Dinner', d: 'Apr 24', iso: '2027-04-24', type: 'scholar', status: 'planned', img: 'cohort.jpg', cap: 'Impact Scholars at the retreat',
      why: 'Leaders grow when their work is seen.',
      audience: 'Impact Scholars, partners and supporters.',
      t: 'The season ends where it began: everyone at one table, celebrating what the scholars built.',
      outputs: 'A season recap shared with partners.', intended: 'Scholars who return as leaders the following year.',
      makesPossible: 'The dinner, recognition for scholars and the season recap.',
      a: ['<b>$500</b> toward the dinner', 'Centerpieces, catering or a venue', '<b>$1,000</b>: name the toast'] }
  ],
  programTypes: {
    career:    { label: 'Career exploration', color: '#e4002b', model: 'college' },
    scholar:   { label: 'Scholar leadership', color: '#ffffff', model: 'scholars' },
    community: { label: 'Community', color: '#ffb000', model: 'outcomes' },
    civic:     { label: 'Civic engagement', color: '#a66be0', model: 'outcomes' },
    younger:   { label: 'Younger students', color: '#2f6fd6', model: 'younger' }
  },
  programStatus: {
    confirmed: 'Confirmed',
    planned: 'Planned',
    tentative: 'Tentative'
  },
  programStatusNote: 'Dates are planned. Speakers, venues and partners are listed only once confirmed.',

  /* ---------- Fall 2026: what already happened ---------- */
  pastPrograms: [
    { n: 'Many organizations, one room', where: 'American University', text: 'Students from across campus filled a room for an honest conversation, run by students.' },
    { n: 'LINKED', where: 'Banned Books Week', text: 'A Banned Books Week experience designed and run by BRIDGE fellows.' },
    { n: 'Read the Room', where: 'True Reformer Building', text: 'A student-moderated panel of founders and authors, then a spelling bee.' },
    { n: 'BRIDGE to Law & Policy', where: 'AU Washington College of Law', text: 'Hill staff and lobbyists, then a mock immigration committee and a legal case study. Presented with The Hill Girl\'s Guide.' },
    { n: 'BRIDGE to Health', where: 'AAMC', text: 'One patient, four perspectives: a hematologist, DC Medicaid and the American Heart Association, with dinner from AAMC.' }
  ],

  /* ---------- People who have joined BRIDGE programs ---------- */
  speakers: [
    { program: 'Law & Policy', name: 'Petrina A. Thomas', role: 'In-house lobbyist, Zillow' },
    { program: 'Law & Policy', name: 'Kwabena Nsiah', role: 'Lobbyist, theGROUP' },
    { program: 'Law & Policy', name: 'Shelby Adams', role: 'Legislative Assistant, Rep. Troy Carter' },
    { program: 'Law & Policy', name: 'Karla Rodriguez', role: 'Congressional Communications Director' },
    { program: 'Law & Policy', name: 'Iyanla Kollock', role: "Founder, The Hill Girl's Guide" },
    { program: 'Health', name: 'James G. Taylor VI, MD', role: 'Center for Sickle Cell Disease, Howard University' },
    { program: 'Health', name: 'Tayiana J. Reed, PharmD', role: 'Pharmacist, DC Medicaid' },
    { program: 'Health', name: 'Janay C. Johnson, DrPH', role: 'Senior Policy Analyst, American Heart Association' },
    { program: 'Health', name: 'Kate Christopherson', role: 'Office of the State Medicaid Director, DC' },
    { program: 'Read the Room', name: 'Ssanyu Lukoma', role: 'Founder, Brown Kids Read · 88th Miss Howard' },
    { program: 'Read the Room', name: 'Sidney Keys III', role: 'Founder, Books N Bros' },
    { program: 'Read the Room', name: 'Sydnie Collins', role: 'Founder, Perfect Timing Podcast' }
  ],

  /* ---------- Relationships, by type ----------
     Keep categories honest. A speaker's employer is not a sponsor.
     Empty lists are hidden. Logos: add only with written permission (logo: 'assets/logos/file.svg'). */
  relationships: [
    { type: 'formal', label: 'Formal institutional partners', note: 'Organizations with a written partnership agreement.', items: [] },
    { type: 'sponsor', label: 'Financial sponsors', note: 'Organizations that have made a financial gift or sponsorship.', items: [] },
    { type: 'collaborator', label: 'Program collaborators', note: 'Organizations that co-presented or co-ran a BRIDGE program.', items: ["The Hill Girl's Guide", 'Brown Kids Read', 'Our Kids Read'] },
    { type: 'inkind', label: 'In-kind contributors', note: 'Organizations that contributed goods or services.', items: ['AAMC (dinner at BRIDGE to Health)'] },
    { type: 'venue', label: 'Host venues', note: 'Places that hosted a BRIDGE program.', items: ['AU Washington College of Law', 'AAMC', 'True Reformer Building'] },
    { type: 'school', label: 'Schools', note: 'Schools where Impact Scholars worked with younger students.', items: ['Annunciation Catholic School'] },
    { type: 'university', label: 'Participating universities', note: 'Universities whose students are Impact Scholars. Not formal institutional partners.', items: ['Howard University', 'American University', 'George Washington University', 'Georgetown University'] },
    { type: 'speaker', label: "Guest speakers' organizations", note: 'Where our guest speakers work. Speakers took part in their individual capacity; this does not mean their employer sponsors or endorses BRIDGE.', items: ['Zillow', 'theGROUP', 'Office of Rep. Troy Carter', 'Howard University College of Medicine', 'DC Department of Health Care Finance (DC Medicaid)', 'American Heart Association', 'Books N Bros', 'Perfect Timing Podcast', 'Black Law Students Association (BLSA)'] },
    { type: 'recognition', label: 'Recognition', note: '', items: ['BUILD, 2026 Rising Futures Award'] }
  ],

  /* ---------- Real voices ----------
     Only approved quotes with written permission. Never quote a minor by name.
     Each: { quote, name, role, kind: 'scholar'|'student'|'school'|'mentor', photo: '', approved: true }
     The testimonial and story sections stay hidden until an approved entry exists. */
  testimonials: [],
  stories: [],

  /* ---------- Public documents ----------
     Each: { label: 'IRS determination letter', file: 'docs/public/irs-determination.pdf' }
     Hidden while empty. Only add documents cleared for publication. */
  documents: [],

  /* ---------- Partnership levels (PROPOSED: confirm before publishing) ----------
     online: true shows a Give button (Givebutter). online: false asks for a conversation. */
  tiers: [
    { id: 'supporter', amount: 250, name: 'Station Supporter', card: 'Single trip', online: true,
      blurb: 'Back one program on the line and keep its doors open.',
      benefits: ['You choose the program', 'A thank-you from the scholars who ran it', 'Photos from the day'] },
    { id: 'partner', amount: 500, name: 'Station Partner', card: 'Express', online: true, tag: 'Recommended',
      blurb: 'Your name on one real moment at the program you choose.',
      benefits: ['Everything in Station Supporter', '"Coffee bar by…" or "Lunch presented by…"', 'Thanked from the stage at your program', 'A seat in the room to meet the scholars'] },
    { id: 'line', amount: 1000, name: 'Line Partner', card: 'Season pass', online: true,
      blurb: 'Ride the whole spring, January to April.',
      benefits: ['Everything in Station Partner', 'Recognized at every spring program', 'Name a moment at the Closing Dinner', 'A season recap with photos and results'] },
    { id: 'founding', amount: 2500, name: 'Founding Rider', card: 'Founding Rider', online: true,
      blurb: 'One of the first partners to build the BRIDGE Line. Your name stays on the map.',
      benefits: ['Everything in Line Partner', 'Your name on the 2027 BRIDGE Line map, here and at events', 'First pick of which moment you name', 'Speak or host a table at a program you choose'] },
    { id: 'presenting', amount: 5000, name: 'Presenting Partner', card: 'Presenting', online: false,
      blurb: 'Present one spring program and shape a team engagement around it.',
      benefits: ['Everything in Founding Rider', 'Presenting recognition on one spring program', 'A team engagement designed with you: a panel, mentor table or site visit', 'A planning conversation with BRIDGE leadership'] },
    { id: 'institutional', amount: 10000, plus: true, name: 'Institutional Impact Partner', card: 'Institutional', online: false,
      blurb: 'Invest in the infrastructure behind every program, across a season or a full year.',
      benefits: ['A partnership designed together, across programs or a full year', 'Support for Impact Scholar training and program operations', 'Regular check-ins with BRIDGE leadership', 'Recognition agreed together'] }
  ],
  tierNote: 'Levels and benefits are proposed for the 2027 season and may be adjusted with each partner. Any amount helps, and larger partnerships start with a conversation.',

  /* ---------- Ways to give beyond the levels ---------- */
  supportTypes: [
    { id: 'unrestricted', name: 'Unrestricted operating support', text: 'The most flexible gift. It funds whatever the season needs most, including the training and coordination behind every program.' },
    { id: 'program', name: 'Program-specific support', text: 'Direct your gift to one program, such as BRIDGE to Medicine or the Next Up Tour. We use it for that program.' },
    { id: 'recurring', name: 'Recurring giving', text: 'A monthly gift that lets BRIDGE plan ahead.' },
    { id: 'volunteer', name: 'Employee volunteer engagement', text: 'Bring a team to host a table, lead a workshop or welcome students for a site visit.' },
    { id: 'mentor', name: 'Professional mentorship', text: 'Speak at a program, sit at a mentor table, or stay in touch with a scholar after the event.' },
    { id: 'custom', name: 'Customized institutional partnership', text: 'A multi-program or year-long partnership designed around shared goals.' },
    { id: 'inkind', name: 'In-kind support', text: 'Food, books, space, transportation, printing, photo and video, supplies and prizes.' }
  ],

  /* ---------- Who partners, and how ---------- */
  audiences: [
    { id: 'individual', name: 'Individual donors', ways: ['Any amount, online', 'Station Supporter or Station Partner', 'Monthly giving, set up with our team'], tiers: ['supporter', 'partner'], support: ['unrestricted', 'recurring'] },
    { id: 'local', name: 'Local businesses', ways: ['Name a moment at a program', 'Food, printing, space or prizes in-kind', 'Station Partner or Line Partner'], tiers: ['partner', 'line'], support: ['inkind', 'program'] },
    { id: 'corporate', name: 'Corporate partners', ways: ['Present a program', 'Employee mentors and volunteer days', 'A season or year-long partnership'], tiers: ['founding', 'presenting', 'institutional'], support: ['volunteer', 'mentor', 'custom'] },
    { id: 'association', name: 'Professional associations', ways: ['Speakers and mentors for an industry program', 'Member engagement with students', 'Line Partner or Founding Rider'], tiers: ['line', 'founding'], support: ['mentor', 'program'] },
    { id: 'university', name: 'Universities', ways: ['Space for programs', 'Campus visits for younger students', 'Co-designed programs with student groups'], tiers: [], support: ['inkind', 'custom'] },
    { id: 'foundation', name: 'Foundations', ways: ['Unrestricted operating support', 'Program grants', 'Multi-year support'], tiers: ['institutional'], support: ['unrestricted', 'program', 'custom'] },
    { id: 'philanthropy', name: 'Philanthropic institutions', ways: ['Capacity building for Impact Scholar training', 'Institutional Impact Partner', 'Introductions to other funders'], tiers: ['institutional'], support: ['unrestricted', 'custom'] },
    { id: 'inkind', name: 'In-kind contributors', ways: ['Food and catering', 'Books and materials', 'Transportation, space, printing, photo and video'], tiers: [], support: ['inkind'] }
  ],

  /* ---------- Every Fare Opens a Door: what funding pays for ----------
     equivalency: approved text tying a dollar amount to a cost (e.g. "$250 covers lunch for one workshop").
     Leave '' until it is confirmed against the actual budget. */
  costAreas: [
    { name: 'Educational materials', text: 'Workshop handouts, books and the supplies students work with.', programs: ['BRIDGE to Policy & Law', 'Next Up Tour'], equivalency: '' },
    { name: 'Student transportation', text: 'Getting younger students to campuses and students to program sites.', programs: ['Next Up Tour'], equivalency: '' },
    { name: 'Program accessibility', text: 'Food, materials and logistics that remove reasons not to show up.', programs: ['Every program'], equivalency: '' },
    { name: 'School visits', text: 'Impact Scholars working with younger students in their schools.', programs: ['School mentoring'], equivalency: '' },
    { name: 'Professional development experiences', text: 'Rooms where students meet, question and work beside professionals.', programs: ['BRIDGE to Medicine', 'BRIDGE to Policy & Law'], equivalency: '' },
    { name: 'Community engagement', text: 'Community nights and week-long programs that bring campuses together.', programs: ['Hall Pass Hub', 'Black History Week'], equivalency: '' },
    { name: 'Impact Scholar training', text: 'The retreat, training sessions and leadership materials that prepare scholars to lead.', programs: ['Fellow Retreat'], equivalency: '' },
    { name: 'Organizational infrastructure', text: 'Coordination, communications, tools and compliance behind every program.', programs: ['Every program'], equivalency: '' },
    { name: 'Industry exploration programs', text: 'Career programs built around a field and the people working in it.', programs: ['BRIDGE to Medicine', 'BRIDGE to Policy & Law', 'BRIDGE to Media & Entertainment'], equivalency: '' }
  ],

  /* ---------- Industry pathways ----------
     status 'existing' = BRIDGE runs related programming now (listed in programs).
     status 'proposed' = an opportunity we would build with a partner. */
  pathways: [
    { id: 'law', name: 'Law and Public Policy', code: 'LP', color: '#e4002b', status: 'existing',
      focus: 'Legal career exploration, civic education, public service, mentorship and access to the policy workforce.',
      why: 'Policy shapes every student\'s life, yet the people who write it are rarely in the room with them. DC is the one city where that distance can close in an afternoon.',
      looks: ['Speak or host a workshop at BRIDGE to Policy & Law', 'Bring a mock hearing or case study to students', 'Open your office or chamber for a visit'],
      students: 'A working picture of legal and policy careers, and practitioners they can contact.',
      institution: 'Early relationships with students preparing for law school, the Hill and public service.',
      programs: ['BRIDGE to Policy & Law', 'Black History Week'] },
    { id: 'health', name: 'Healthcare', code: 'HC', color: '#19a35b', status: 'existing',
      focus: 'Healthcare career exposure, professional mentorship, educational pathways and workforce development.',
      why: 'The health workforce needs people from the communities it serves. Students see more paths into medicine when they meet the people already on them.',
      looks: ['A clinician or researcher at a mentor table', 'Case-based stations like the ones at BRIDGE to Health', 'Shadowing or a site visit'],
      students: 'Clarity about health careers beyond the obvious ones, and mentors who will answer follow-up questions.',
      institution: 'A pipeline of pre-health students who already know your organization.',
      programs: ['BRIDGE to Medicine'] },
    { id: 'tech', name: 'Technology', code: 'TX', color: '#2f6fd6', status: 'proposed',
      focus: 'Digital equity, AI literacy, technology career exploration and responsible innovation.',
      why: 'Technology careers are growing fast in the region, and AI is changing what every job looks like. Students deserve an early, honest look at both.',
      looks: ['Co-design a BRIDGE to Technology program', 'An AI literacy workshop led with Impact Scholars', 'A site visit to your team'],
      students: 'Hands-on exposure to technology careers and responsible use of AI.',
      institution: 'Engagement with students across four universities, and a program built around your expertise.',
      programs: [] },
    { id: 'finance', name: 'Financial Services', code: 'FS', color: '#ffb000', status: 'proposed',
      focus: 'Financial literacy, economic mobility, professional development and career access.',
      why: 'Financial knowledge compounds. Students who learn how money and careers in finance work early carry that advantage forward.',
      looks: ['A financial literacy workshop for college or younger students', 'Career conversations with your analysts and advisors', 'Sponsorship of a program aligned with economic mobility'],
      students: 'Practical financial skills and an inside look at finance careers.',
      institution: 'Visible commitment to economic mobility in DC, with students who become future colleagues.',
      programs: [] },
    { id: 'media', name: 'Media and Communications', code: 'MC', color: '#ff7a1a', status: 'existing',
      focus: 'Media literacy, storytelling, journalism and communications career exposure.',
      why: 'Students consume more media than any generation before them. Few get to meet the people who make it.',
      looks: ['Speak at BRIDGE to Media & Entertainment', 'A studio or newsroom tour', 'A storytelling or media literacy workshop'],
      students: 'Media literacy and real contacts in journalism, entertainment and communications.',
      institution: 'Connection with student storytellers and a fresh audience for your work.',
      programs: ['BRIDGE to Media & Entertainment'] },
    { id: 'consulting', name: 'Consulting and Professional Services', code: 'CP', color: '#9aa6c4', status: 'proposed',
      focus: 'Leadership development, problem-solving, professional readiness and mentorship.',
      why: 'Impact Scholars already plan, budget and run programs. Consultants can help them do it with the frameworks professionals use.',
      looks: ['A case challenge for Impact Scholars', 'Pro bono support for BRIDGE operations', 'Mentorship for scholar leaders'],
      students: 'Structured problem-solving and professional readiness.',
      institution: 'Meaningful volunteer engagement for your team, and early access to leaders.',
      programs: [] },
    { id: 'education', name: 'Education and Philanthropy', code: 'EP', color: '#a66be0', status: 'existing',
      focus: 'College access, educational equity, student success, school-university partnerships and sustainable community engagement.',
      why: 'BRIDGE connects colleges and schools through the people best placed to bridge them: college students who were in those classrooms recently.',
      looks: ['Support for the Next Up Tour and school visits', 'Unrestricted or program support', 'Co-design a school and university initiative'],
      students: 'College exposure, mentorship and resources, delivered by near-peers.',
      institution: 'A student-led model for school and university connection that you can help grow.',
      programs: ['Next Up Tour', 'Fellow Retreat'] }
  ],

  /* ---------- Photo registry ----------
     minors: true keeps a photo out of the downloadable prospectus and share images.
     Confirm media consent for every photo that shows younger students. */
  photos: {
    'kids.jpg': { minors: true },
    'kids2.jpg': { minors: true }
  },

  /* ---------- FAQ ---------- */
  faq: [
    { q: 'Is my gift tax-deductible?', a: 'BRIDGE the District is a 501(c)(3) public charity. Gifts are tax-deductible as allowed by law.' },
    { q: 'What is the difference between unrestricted and program gifts?', a: 'An unrestricted gift funds whatever the season needs most, including the training and coordination behind every program. A program gift is directed to one program you choose, and we use it for that program.' },
    { q: 'Can we give something other than money?', a: 'Yes. Food, books, space, transportation, printing, photo and video, supplies and prizes all keep a program running. So does your team\'s time and expertise.' },
    { q: 'Does a speaker\'s organization become a partner?', a: 'No. When professionals speak at BRIDGE, they take part in their individual capacity. We list formal partners and sponsors separately.' },
    { q: 'Can we choose which program we support?', a: 'Yes. Choose any program on the line, take the season pass to support them all, or give unrestricted support.' },
    { q: 'How do larger partnerships work?', a: 'For gifts of $5,000 and up, we start with a conversation so the partnership fits your goals and what BRIDGE can deliver well.' }
  ]
};
