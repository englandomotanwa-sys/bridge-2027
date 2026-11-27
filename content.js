/* =====================================================================
   BRIDGE the District: SITE CONTENT
   ---------------------------------------------------------------------
   This is the one file to edit for routine updates. Every page
   (index.html, express.html, present.html, prospectus.html, overview.html)
   reads it. After editing, run tools/prerender.py so the static HTML
   matches (see docs/MAINTENANCE.md).

   Rules of the road:
   - Never publish a number you cannot document. Set value: null to hide.
   - Every metric needs a period (when it was measured) and a status.
       status: 'documented' = matched to a primary record (form export, roster,
                              campaign page, determination letter) in the
                              November 2026 records review
               'reported'   = from an internal recap or planning document,
                              not yet matched to a primary record
   - Keep counts honest: applicants are not fellows, registrations are not
     attendance, total participations are not unique people.
   - Program status: 'confirmed' | 'planned' | 'tentative'
   - Pathway status: 'existing' | 'proposed'
   - This file is public. Never put student names, contact details,
     banking details, private correspondence or internal governance notes here.
   - Do not use em dashes in copy.
   ===================================================================== */
window.BRIDGE = {

  /* ---------- Site and sharing ---------- */
  site: {
    url: 'https://englandomotanwa-sys.github.io/bridge-2027/',
    officialDomain: '',            // bridgethedistrict.org is registered. Set it here only once the site is served there.
    ogImage: 'assets/og-image.jpg',
    contentReviewed: 'November 2026'
  },

  /* ---------- Organization ---------- */
  org: {
    name: 'BRIDGE the District',
    short: 'BRIDGE',
    city: 'Washington, DC',
    email: 'info@bridgethedistrict.org',
    programsEmail: 'programs@bridgethedistrict.org',
    phone: '',
    mission: 'BRIDGE the District closes opportunity gaps by supporting youth to excel within and beyond the classroom.',
    tagline: 'For students. By students. With students.',
    positioning: 'Student-powered. Institutionally grounded. Built to last.',
    differentiator: 'We develop the leaders who open doors, while expanding access for the students who will walk through them next.',
    founded: '2025',
    taxStatus: {
      label: '501(c)(3) public charity',
      detail: 'Recognized by the IRS in September 2025, effective July 9, 2025. Gifts are tax-deductible as allowed by law.',
      ein: '39-3160840',
      verified: true                 // IRS determination letter dated September 16, 2025
    },
    legal: 'Incorporated in the District of Columbia as a nonprofit corporation on July 9, 2025.',
    foundingStory: 'BRIDGE began in the summer of 2025 with two community days for DC families, run by college students who wanted younger students to have the doors they had to find on their own. Within months it was incorporated, recognized as a public charity and training its first cohort of Impact Scholars.',
    /* Founders: both named in the Articles of Incorporation (July 2025). */
    founders: [
      { name: 'England Meadows', role: 'Co-Founder and Executive Director' },
      { name: 'Eva Wadley', role: 'Co-Founder' }
    ],
    leadership: [
      { name: 'England Meadows', role: 'Co-Founder and Executive Director' }
    ],
    /* The student leadership team, by role. Names are added only with each person's approval. */
    team: [
      { role: 'Executive Director', text: 'Sets direction, holds partner relationships and approves spending above $1,000.' },
      { role: 'Fellowship lead', text: 'Runs the Impact Scholar Fellowship, supervises Track Leads and approves spending up to $1,000.' },
      { role: 'Community and events lead', text: 'Leads fellow events, community programming and the BRIDGE brand.' },
      { role: 'Operations manager', text: 'Keeps the spring calendar, records and logistics moving.' },
      { role: 'Track Leads', text: 'Nine returning Impact Scholars who lead the three tracks, interview applicants and approve spending under $250.' }
    ],
    governance: {
      summary: 'BRIDGE is governed by bylaws adopted at incorporation, which provide for a volunteer Board of Directors of three to fifteen members. Board seats have not yet been filled. Seating the Board is a current leadership priority, and members will be listed publicly once elected. Day to day, the Executive Director leads a student leadership team under written role descriptions and spending limits.',
      status: 'in-progress'
    },
    recognition: [],
    fellowship: {
      name: 'Impact Scholar Fellowship',
      summary: 'College students from DC-area universities, including Howard, American and George Washington, train together, then plan, host and lead BRIDGE programs across three tracks, including work alongside younger students in DC schools.'
    }
  },

  /* ---------- Links ---------- */
  links: {
    give: 'https://givebutter.com/ride-the-bridge-line-2027-nyda1s',
    givePrefill: true,
    recurringAvailable: false,
    booking: '',                     // no public scheduling link exists yet. Email is used until one is approved.
    tracker: 'https://docs.google.com/spreadsheets/d/10MHdr2RtLGzFgJDUOKc7_TVcTc9U5Hi18Xtzlk1saZg/edit',
    prospectusPdf: 'downloads/BRIDGE-the-District-Partnership-Prospectus-2027.pdf',
    overviewPdf: 'downloads/BRIDGE-the-District-One-Page-Overview-2027.pdf',
    instagram: ''
  },

  /* ---------- Partnership form ----------
     No form endpoint has been approved yet, so the form prepares an email with
     the full summary. Nothing is sent automatically, and the site never shows
     a success message unless a real endpoint returns success. */
  form: {
    endpoint: '',
    provider: ''
  },

  /* ---------- Fundraising ---------- */
  goals: {
    season: 'Spring 2027',
    amount: 10000,
    builtAs: 'forty commitments of $250',
    raised: null,
    raisedAsOf: ''
  },

  /* ---------- Impact metrics ----------
     category: 'reach' | 'demand' | 'delivery' | 'outcomes'
     highlight: true puts it in the strip under the hero (pick four). */
  metrics: [
    { id: 'apps', category: 'demand', value: 101, display: '101', label: 'students applied for 40 spring 2027 Impact Scholar seats', period: 'Applications, Oct 26 to Nov 23, 2026', note: '102 submissions from 101 people. Applicants, not accepted fellows.', status: 'documented', highlight: true },
    { id: 'fellows', category: 'reach', value: 21, display: '21', label: 'Impact Scholars in the fall 2026 cohort', period: 'Fall 2026', note: 'Up from 18 in the 2025 to 2026 cohort.', status: 'documented', highlight: true },
    { id: 'cohort25', category: 'reach', value: 18, display: '18', label: 'Impact Scholars in the first cohort', period: '2025 to 2026', note: '', status: 'reported' },
    { id: 'supporters', category: 'reach', value: 106, display: '106', label: 'supporters gave in the 24-hour BRIDGE to Impact campaign', period: 'December 29, 2025', note: 'Per the public campaign page.', status: 'documented', highlight: true },
    { id: 'goalpct', category: 'demand', value: 138, display: '138%', label: 'of the BRIDGE to Impact goal raised: $4,855 against $3,500', period: 'December 29, 2025', note: 'Per the public campaign page.', status: 'documented', highlight: true },
    { id: 'policy', category: 'delivery', value: 60, display: '60+', label: 'attendees at BRIDGE to Policy & Law', period: 'October 24, 2026', note: 'From the event record. Total attendance, not unique people across programs.', status: 'reported' },
    { id: 'rtr', category: 'demand', value: 98, display: '98', label: 'registrations for Read the Room', period: 'October 5, 2026', note: 'Registrations, not confirmed attendance.', status: 'reported' },
    { id: 'build', category: 'delivery', value: 35, display: 'About 35', label: 'students at BUILD DC Day at American University', period: 'March 26, 2026', note: 'Approximate count from the event record.', status: 'reported' },
    { id: 'schools', category: 'reach', value: 3, display: '3', label: 'schools whose students took part in BRIDGE programming', period: 'Fall 2026', note: 'Annunciation Catholic School, Parkmont School and J.O. Wilson Elementary School.', status: 'reported' },
    { id: 'unis', category: 'demand', value: 4, display: '4', label: 'universities represented among spring 2027 applicants', period: 'Spring 2027 application cycle', note: 'Howard, American, George Washington and the University of Maryland.', status: 'documented' },
    { id: 'speakers', category: 'delivery', value: null, derive: 'speakers', display: '', label: 'professional guest speakers across three fall programs', period: 'Fall 2026', note: 'Counted from the speaker list. Speakers appear in their individual capacity.', status: 'documented' },
    { id: 'programs', category: 'delivery', value: null, derive: 'pastPrograms', display: '', label: 'documented programs delivered', period: 'Fall 2026, through November 20', note: '', status: 'documented' },
    // Collected from spring 2027 onward. They stay hidden while value is null.
    { id: 'unique', category: 'reach', value: null, display: '', label: 'unique young people reached across programs', period: '', note: '', status: 'documented' },
    { id: 'participations', category: 'reach', value: null, display: '', label: 'total program participations', period: '', note: '', status: 'documented' },
    { id: 'returning', category: 'demand', value: null, display: '', label: 'returning participants', period: '', note: '', status: 'documented' },
    { id: 'leaders', category: 'outcomes', value: null, display: '', label: 'Impact Scholars who led a program', period: '', note: '', status: 'documented' },
    { id: 'mentor', category: 'outcomes', value: null, display: '', label: 'mentoring connections still active 30 days later', period: '', note: '', status: 'documented' },
    { id: 'feedback', category: 'outcomes', value: null, display: '', label: 'of participants who would recommend BRIDGE', period: '', note: 'From the standard post-program survey.', status: 'documented' }
  ],
  impactNotes: {
    outcomes: 'We have not yet published outcome figures. Standard surveys and follow-up begin with the spring 2027 season, and results will appear here once collected and reviewed.'
  },
  statusLabels: { documented: 'Documented', reported: 'Reported' },

  /* ---------- Growth: cohort sizes (fellows, not applications) ---------- */
  fall2026: { value: 21, basis: 'fellows' },
  growth: [
    { label: '2025 to 2026 cohort', value: 18, kind: 'fellows', status: 'reported' },
    { label: 'Fall 2026 cohort', value: 21, kind: 'fellows', status: 'documented' },
    { label: 'Spring 2027 seats', value: 40, kind: 'planned', status: 'planned', note: '16 Opportunity, 14 Community, 10 Leadership, plus 9 returning Track Leads' }
  ],

  /* ---------- Methodology: how we count ---------- */
  methodology: [
    { term: 'Applicants and submissions', text: 'We count people, not forms. Spring 2027 had 102 submissions from 101 people. Applicants are never presented as fellows.' },
    { term: 'Registrations and attendance', text: 'A registration is an intent to come. We label registration counts as registrations until sign-in sheets confirm attendance.' },
    { term: 'Participations and unique people', text: 'One student at three programs is three participations and one person. Until our participant records link across programs, we report event totals only and say so.' },
    { term: 'Reporting periods', text: 'Every figure carries the date or season it describes. We do not combine periods to make a bigger number.' },
    { term: 'Documented and reported', text: 'Documented figures match a primary record. Reported figures come from an internal recap and are labeled until they are checked.' }
  ],

  /* ---------- Measurement: what we track now, and what starts next ---------- */
  measurement: {
    current: [
      'Sign-in at every program, kept by the Impact Scholar running it',
      'A written event record and recap within 48 hours of each program',
      'Application records, reviewed by two readers and an interview panel',
      'Public campaign records for every fundraising campaign',
      'Feedback forms and pre and post surveys at selected programs'
    ],
    planned: [
      'One participant record that links attendance across programs, so we can report unique people',
      'A standard five-question survey after every program',
      'A start and end of term self-assessment for Impact Scholars',
      'A 30-day check on mentoring connections made at programs',
      'Partner-school feedback each term',
      'An annual impact summary for partners'
    ],
    plannedNote: 'Planned measures begin with the spring 2027 season. They are listed so partners know what to expect, not as results.'
  },

  /* ---------- The problem: outside data ---------- */
  gapStats: [
    { value: '55%', text: "of DC's public high school class of 2024 enrolled in college or another postsecondary program within six months of graduating, down a point from the year before.", source: 'DC Policy Center, State of D.C. Schools 2024–25', url: 'https://www.dcpolicycenter.org/publications/stateofdcschools2024-25/' },
    { value: '80%+', text: 'of jobs in the District of Columbia are projected to require education or training beyond high school by 2031, the highest share in the country.', source: 'Georgetown University Center on Education and the Workforce, After Everything (2023)', url: 'https://cew.georgetown.edu/cew-reports/projections2031/' },
    { bars: [['Black students', 22], ['White students', 57]], title: 'Who took AP courses in DC, 2021–22', text: 'Same city, very different doors.', source: 'DC Racial Equity, Academic Achievement Gap brief, citing the Community College Research Center', url: 'https://www.dcracialequity.org/achievement-gap-brief' }
  ],

  /* ---------- Where BRIDGE works ---------- */
  focusAreas: [
    { name: 'Educational equity', color: '#e4002b', text: 'Talent is everywhere in this city. Access is not. We work on access.' },
    { name: 'College access', color: '#2f6fd6', text: 'Campus visits, college students as guides, and honest answers about what comes next.' },
    { name: 'Workforce and professional development', color: '#ffb000', text: 'Career exposure in the fields DC runs on: law, policy, health and media.' },
    { name: 'University and community connection', color: '#19a35b', text: 'College students from DC campuses bring campus knowledge into DC schools and neighborhoods.' },
    { name: 'Student leadership development', color: '#ff7a1a', text: 'Impact Scholars plan, host and lead every program.' },
    { name: 'Civic and community engagement', color: '#9aa6c4', text: 'Mock committees, Black History Week, community nights.' },
    { name: 'Social capital and network access', color: '#a66be0', text: 'Students leave with a person to follow up with, not just a certificate.' }
  ],

  /* ---------- What the research says (non-deficit framing: access, not ability) ---------- */
  research: [
    { claim: 'Who you know shapes where you go.', text: 'In a study of 21 billion friendships, the share of friends from higher-income backgrounds among people from lower-income backgrounds was among the strongest predictors of upward mobility researchers have found. Connections across lines of income are a matter of exposure, which institutions can change.', source: 'Chetty et al., Social Capital I, Nature (2022), Opportunity Insights', url: 'https://doi.org/10.1038/s41586-022-04996-4', bridge: 'Every BRIDGE program is built so students leave with a professional they can contact again.' },
    { claim: 'Early experience is unevenly shared.', text: 'Seventy percent of first-year college students expect to complete an internship, but only 48 percent of seniors report having done one. First-generation, Black and Latino students are less likely to hold paid internships.', source: 'Strada Education Foundation, From College to Career (2024), using NSSE 2022 data', url: 'https://stradaeducation.org/report/from-college-to-career-students-internship-expectations-and-experiences', bridge: 'Industry programs put college students in rooms with practitioners before the internship search begins.' },
    { claim: 'Near-peers can open doors, and grow while doing it.', text: 'In a school-level randomized trial, a near-peer college advising model raised college enrollment for low-income and Hispanic students, though not for all students overall. In a separate study, college students who served as near-peer counselors were nearly twice as likely to persist in college themselves.', source: 'Bettinger and Evans, College Guidance for All (Stanford GSB); McCallen et al., Journal of Higher Education Outreach and Engagement (2023)', url: 'https://www.gsb.stanford.edu/faculty-research/publications/college-guidance-all-randomized-experiment-pre-college-advising', url2: 'https://openjournals.libs.uga.edu/jheoe/article/view/2957', bridge: 'BRIDGE invests in both groups: younger students gain near-peer guides, and the guides develop as leaders.' }
  ],
  researchNote: 'These studies describe national patterns and other programs. They inform how BRIDGE is designed. They are not evidence of BRIDGE results, which we report separately above.',

  /* ---------- Organizational timeline (verified against records) ----------
     kind: 'program' | 'legal' | 'fellowship' | 'funding' | 'plan' */
  timeline: [
    { date: 'Jul to Aug 2025', kind: 'program', title: 'The first community days', text: 'Giveback Day (July 11) and a Back to School Bash (August 3) for DC families, funded by a small grant.' },
    { date: 'Jul 9, 2025', kind: 'legal', title: 'Incorporated in DC', text: 'BRIDGE the District is incorporated as a District of Columbia nonprofit corporation.' },
    { date: 'Sep 16, 2025', kind: 'legal', title: 'Recognized as a public charity', text: 'The IRS recognizes BRIDGE as a 501(c)(3) public charity, effective from incorporation. EIN 39-3160840.' },
    { date: 'Fall 2025', kind: 'fellowship', title: 'The first Impact Scholars', text: 'Fellowship coordinators are appointed and the first cohort of 18 Impact Scholars begins. BRIDGE hosts an Indigenous Peoples Day program at American University (October 13) and writes its first middle school curriculum.' },
    { date: 'Dec 29, 2025', kind: 'funding', title: 'BRIDGE to Impact', text: '106 supporters give $4,855 in 24 hours, 138% of the $3,500 goal.' },
    { date: 'Spring 2026', kind: 'program', title: 'A full spring season', text: 'BRIDGE to Media (February 17), College Immersion Day, BUILD DC Day at American University (March 26), Pizza & Professors and Voices of Impact (April).' },
    { date: 'Fall 2026', kind: 'fellowship', title: 'Three tracks, 21 scholars', text: 'The fellowship runs as three tracks: Opportunity, Community and Leadership. Programs include Read the Room (October 5), BRIDGE to Policy & Law (October 24), a Parkmont School college immersion day (November 18) and BRIDGE to Health (November 20).' },
    { date: 'Nov 2026', kind: 'fellowship', title: '101 applicants for 40 seats', text: 'The spring application draws 101 college students. Nine returning fellows step up as Track Leads.' },
    { date: 'Jan to Apr 2027', kind: 'plan', title: 'The spring BRIDGE Line', text: 'Ten planned programs, Friday school visits and the first founding-chapter application.' }
  ],
  timelineNote: 'BRIDGE was founded and began programming in summer 2025. Its legal recognition as a public charity dates from September 2025, effective July 9, 2025.',

  /* ---------- Built for continuity ----------
     status: 'in-place' (operating now) | 'in-progress' (being built, with a date) */
  continuity: [
    { name: 'Returning Track Leads', status: 'in-place', text: 'Nine returning Impact Scholars lead the three tracks, so experience carries from one cohort to the next.' },
    { name: 'A written library', status: 'in-place', text: 'The BRIDGE Library holds step-by-step guides, such as planning a program and hosting a school visit on campus, so no program depends on one person remembering how.' },
    { name: 'A record of every program', status: 'in-place', text: 'Each program gets a sign-in sheet, a standard event record and a recap within 48 hours, filed in shared drives by term.' },
    { name: 'Spending limits by role', status: 'in-place', text: 'Track Leads approve under $250, the fellowship lead up to $1,000, and the Executive Director above that.' },
    { name: 'A decision log', status: 'in-place', text: 'Leadership decisions are written down with the date and the reason, so new leaders can see why things are the way they are.' },
    { name: 'Fair selection', status: 'in-place', text: 'Two readers score each application, two Track Leads score each interview on four criteria, and nobody scores someone they know.' },
    { name: 'Shared inboxes', status: 'in-place', text: 'Partners write to role inboxes, not personal accounts, so conversations survive leadership changes.' },
    { name: 'Role cards and named backups', status: 'in-progress', text: 'Every leadership role is getting a written role card and a named backup in January 2027.' },
    { name: 'End-of-term handoff', status: 'in-progress', text: 'Each term closes with a written handoff and archive. The first full cycle under this system ends in April 2027.' },
    { name: 'A Board of Directors', status: 'in-progress', text: 'Our bylaws provide for a volunteer Board. Seats are not yet filled, and seating the Board is a current priority.' }
  ],
  continuityNote: 'A student-led organization has to plan for graduation every year. These are the systems that let BRIDGE outlast any one class of leaders. We mark what is operating now and what is still being built.',

  /* ---------- Three portfolios (the fellowship tracks) ---------- */
  portfolios: [
    { id: 'opportunity', name: 'BRIDGE to Opportunity', color: '#2f6fd6', code: 'OP', seats: 16,
      purpose: 'Brings college exposure and near-peer mentoring to younger students in DC schools.',
      activities: ['Friday visits with partner schools, six visits across two school groups from February to April', 'Campus visits and the Next Up college tour day', 'Capstone and mentoring projects with middle and high school students'],
      serves: 'Middle and high school students in partner schools, led by Impact Scholars.',
      measures: 'Visits held, students reached per visit, school feedback each term.' },
    { id: 'community', name: 'BRIDGE to Community', color: '#ffb000', code: 'CM', seats: 14,
      purpose: 'Builds belonging and cross-campus connection, and brings BRIDGE into public life in DC.',
      activities: ['Hall Pass Hub community nights', 'Black History Week across campuses', 'Pizza & Professors and other campus conversations'],
      serves: 'College students across DC campuses and the wider community.',
      measures: 'Attendance by sign-in, returning attendees, post-program survey.' },
    { id: 'leadership', name: 'BRIDGE to Leadership', color: '#e4002b', code: 'LD', seats: 10,
      purpose: 'Runs the institutional side: career programs, fundraising, content and the systems that let BRIDGE grow.',
      activities: ['Industry programs: Medicine, Policy & Law, Media & Entertainment', 'The winter fundraiser and partner relationships', 'The BRIDGE Library and the founding-chapter application'],
      serves: 'Impact Scholars preparing to lead, and college students exploring careers.',
      measures: 'Programs led by scholars, professionals engaged, partner follow-through.' }
  ],
  portfolioNote: 'Seat counts are the spring 2027 plan, with nine returning Track Leads across the three tracks.',

  /* ---------- The Rooms We Open: documented moments, no invented quotes ----------
     Each story is drawn from an event record. No younger student is named or quoted.
     Photos of younger students are not used here. */
  rooms: [
    { room: 'The committee room', date: 'October 24, 2026', place: 'AU Washington College of Law', img: 'policy_write.jpg', alt: 'Students writing notes at a long table during a workshop',
      text: 'More than 60 people came to BRIDGE to Policy & Law, presented with The Hill Girl\'s Guide and the WCL Black Law Students Association. After a panel of Hill staff and lobbyists, students drafted amendments in a mock immigration committee and negotiated them.',
      led: 'Planned and run by Impact Scholars.' },
    { room: 'The exam room', date: 'November 20, 2026', place: 'AAMC', img: 'listen.jpg', alt: 'Students listening during a BRIDGE program',
      text: 'BRIDGE to Health followed one patient through four perspectives: a hematologist, a DC Medicaid pharmacist, a Medicaid office leader and a national policy analyst. Students then pitched a plan to the room.',
      led: 'Planned and run by a BRIDGE student leader.' },
    { room: 'The stage', date: 'October 5, 2026', place: 'True Reformer Building', img: 'panel.jpg', alt: 'A student panelist answering a question on stage',
      text: 'Read the Room opened Banned Books Week with 98 registrations. College students moderated a panel of founders and authors, then ran a spelling bee.',
      led: 'Moderated by Howard and American University students.' },
    { room: 'The campus', date: 'November 18, 2026', place: 'American University', img: '', alt: '',
      text: 'High school students from Parkmont School spent a college immersion day at American University, guided by college students a few years ahead of them.',
      led: 'Guided by Impact Scholars.' }
  ],
  roomsNote: 'Drawn from BRIDGE event records. We publish student quotes only with written permission, and we never name or quote younger students.',

  /* ---------- Fall 2026: what already happened ---------- */
  pastPrograms: [
    { n: 'Many organizations, one room', where: 'American University', text: 'Students from across campus filled a room for an honest conversation, run by students.' },
    { n: 'LINKED', where: 'Banned Books Week', text: 'A Banned Books Week experience designed and run by BRIDGE fellows.' },
    { n: 'Read the Room', where: 'True Reformer Building', text: 'A student-moderated panel of founders and authors, then a spelling bee.' },
    { n: 'BRIDGE to Policy & Law', where: 'AU Washington College of Law', text: 'Hill staff and lobbyists, then a mock immigration committee and a legal case study. Presented with The Hill Girl\'s Guide.' },
    { n: 'College immersion day', where: 'American University, with Parkmont School', text: 'High school students spent a day on a college campus, guided by Impact Scholars.' },
    { n: 'BRIDGE to Health', where: 'AAMC', text: 'One patient, four perspectives: a hematologist, DC Medicaid and the American Heart Association, with dinner from AAMC.' },
    { n: 'Community asset mapping', where: 'Annunciation Catholic School', text: 'Impact Scholars and middle school students mapped the resources in their community.' }
  ],

  /* ---------- Theory of change (the model map) ----------
     evidence type: 'activity' (what we do now), 'output' (what those activities produce, documented),
                    'measured' (a documented figure, uses metricId),
                    'intended' (an outcome we are working toward, not claimed as a result) */
  model: [
    { id: 'resources', name: 'Institutional resources and partnerships', short: 'Resources', kind: 'established',
      text: 'Institutions bring what students cannot easily reach alone: rooms, expertise, funding and introductions.',
      evidence: [ { type: 'activity', text: 'Fall 2026 programs were hosted at AU Washington College of Law, AAMC and the True Reformer Building, with The Hill Girl\'s Guide, Brown Kids Read and Our Kids Read as collaborators.' }, { type: 'measured', metricId: 'supporters' } ] },
    { id: 'programs', name: 'BRIDGE programming, training and infrastructure', short: 'Programming', kind: 'established',
      text: 'Career programs, community nights, school visits and Impact Scholar training, run on one season calendar across three tracks.',
      evidence: [ { type: 'measured', metricId: 'programs' }, { type: 'activity', text: '{programs} programs are planned for spring 2027, January to April, plus six Friday school visits.' } ] },
    { id: 'scholars', name: 'College students developed as Impact Scholars and community leaders', short: 'Impact Scholars', kind: 'transfer',
      text: 'The transfer station. College students train as Impact Scholars, then design, host and lead each program. Every investment passes through them.',
      evidence: [ { type: 'measured', metricId: 'fellows' }, { type: 'measured', metricId: 'apps' }, { type: 'output', text: 'Returning scholars become Track Leads: nine for spring 2027.' } ] },
    { id: 'college', name: 'Pathway one: college students', short: 'College students', kind: 'branch', line: 'red',
      text: 'College students gain leadership experience, professional exposure, mentors and access to professional networks.',
      evidence: [ { type: 'activity', text: 'Students moderated panels, sat beside professionals and negotiated amendments in a mock committee.' }, { type: 'measured', metricId: 'speakers' }, { type: 'intended', text: 'Leadership experience and professional relationships that carry into careers. Measured from spring 2027 with a start and end of term self-assessment.' } ] },
    { id: 'younger', name: 'Pathway two: younger students', short: 'Younger students', kind: 'branch', line: 'blue',
      text: 'Younger students gain college exposure, near-peer mentors, enrichment and access to resources.',
      evidence: [ { type: 'activity', text: 'Impact Scholars visit partner schools on Fridays and bring students to college campuses.' }, { type: 'measured', metricId: 'schools' }, { type: 'intended', text: 'Younger students who can picture themselves on a college campus, because they have been there. Measured from spring 2027 with partner-school feedback.' } ] },
    { id: 'outcomes', name: 'Long-term outcomes', short: 'Outcomes', kind: 'intended',
      text: 'Stronger educational pathways, wider networks, more access to institutions and a more connected city.',
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
    { n: 'Black History Week', d: 'Feb 15–20', iso: '2027-02-15', type: 'civic', status: 'planned', img: 'rtr_panel.jpg', cap: 'Read the Room',
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
     Keep categories honest. A speaker's employer is not a sponsor. A prospect is not a partner.
     Empty lists are hidden. Logos: add only with written permission. */
  relationships: [
    { type: 'formal', label: 'Formal institutional partners', note: 'Organizations with a written partnership agreement.', items: [] },
    { type: 'sponsor', label: 'Financial sponsors', note: 'Organizations that have made a financial gift or sponsorship.', items: [] },
    { type: 'collaborator', label: 'Program collaborators', note: 'Organizations that co-presented or co-ran a BRIDGE program.', items: ["The Hill Girl's Guide", 'WCL Black Law Students Association', 'Brown Kids Read', 'Our Kids Read'] },
    { type: 'inkind', label: 'In-kind contributors', note: 'Organizations that contributed goods or services.', items: ['AAMC (dinner at BRIDGE to Health)'] },
    { type: 'venue', label: 'Host venues', note: 'Places that hosted a BRIDGE program.', items: ['American University', 'AU Washington College of Law', 'AAMC', 'True Reformer Building'] },
    { type: 'school', label: 'Schools', note: 'Schools whose students took part in BRIDGE programming.', items: ['Annunciation Catholic School', 'Parkmont School', 'J.O. Wilson Elementary School'] },
    { type: 'university', label: 'Universities our scholars come from', note: 'Where Impact Scholars and applicants study. Not formal institutional partners.', items: ['Howard University', 'American University', 'George Washington University', 'University of Maryland (spring 2027 applicants)'] },
    { type: 'speaker', label: "Guest speakers' organizations", note: 'Where our guest speakers work. Speakers took part in their individual capacity; this does not mean their employer sponsors or endorses BRIDGE.', items: ['Zillow', 'theGROUP', 'Office of Rep. Troy Carter', 'Howard University College of Medicine', 'DC Department of Health Care Finance (DC Medicaid)', 'American Heart Association', 'Books N Bros', 'Perfect Timing Podcast'] }
  ],

  /* ---------- Real voices ----------
     Only approved quotes with written permission. Never quote a minor.
     Each: { quote, name, role, kind: 'scholar'|'school'|'mentor'|'partner', approved: true } */
  testimonials: [],
  stories: [],

  /* ---------- Documents partners can request ----------
     availability: 'public' (linked here) | 'request' (sent on request) | 'preparing' (not yet available)
     file: only for documents cleared for publication. */
  documents: [
    { label: 'IRS determination letter (501(c)(3))', availability: 'request', file: '' },
    { label: 'EIN', availability: 'public', value: '39-3160840' },
    { label: 'DC certificate of incorporation', availability: 'request', file: '' },
    { label: 'Bylaws', availability: 'request', file: '' },
    { label: 'W-9', availability: 'preparing', file: '' },
    { label: 'Spring 2027 program budget', availability: 'preparing', file: '' },
    { label: 'Certificate of insurance', availability: 'preparing', file: '' }
  ],
  documentStatus: { public: 'Listed here', request: 'On request', preparing: 'In preparation' },

  /* ---------- Case for support ---------- */
  caseForSupport: {
    headline: 'Demand is not the problem. Capacity is.',
    points: [
      { k: 'The need', text: 'DC is one of the most credentialed job markets in the country, and the path into it is uneven for the young people who grow up here. Access to people and rooms is part of that path.' },
      { k: 'The model', text: 'BRIDGE trains college students to open those rooms for each other and for younger students. One investment develops two groups of students.' },
      { k: 'The moment', text: 'Applications rose to 101 for 40 spring seats. The fellowship has grown each term, from 18 scholars to 21 to a planned 40.' },
      { k: 'The ask', text: 'A $10,000 spring goal, built as forty commitments of $250. It funds ten programs, school visits and the training that lets new scholars lead them.' }
    ],
    goalNote: 'The spring budget is being finalized for leadership approval. Partners who fund a specific program receive a report on how their gift was used.'
  },

  /* ---------- Kinds of funding, and how each works ---------- */
  fundingTypes: [
    { id: 'gift', name: 'Charitable gift', text: 'A donation with no goods or services in return beyond a thank-you. You may direct it to one program or leave it unrestricted.' },
    { id: 'restricted', name: 'Program-restricted gift', text: 'A gift for one program. We use it for that program, and if the program changes we ask you before redirecting it.' },
    { id: 'sponsorship', name: 'Program sponsorship', text: 'Support acknowledged by name at a program, such as "Lunch presented by". Recognition is an acknowledgment, not advertising or an endorsement.' },
    { id: 'grant', name: 'Grant', text: 'Foundation or institutional funding under a written agreement with its own reporting terms.' },
    { id: 'inkind', name: 'In-kind contribution', text: 'Goods, space or services. We acknowledge what was given; we do not assign it a dollar value.' }
  ],
  fundingNote: 'Ask your own tax advisor how a gift or sponsorship is treated for you. BRIDGE provides a written acknowledgment for every gift.',

  /* ---------- How partnership works (requires leadership approval before publication) ---------- */
  principles: [
    'Partnership does not include access to student names, contact details or rosters.',
    'Students choose whether to stay in touch with a professional they meet.',
    'Partnership does not include a hiring pipeline or guaranteed introductions to candidates.',
    'Photos of younger students are never used in partner recognition or marketing.',
    'Recognition is an acknowledgment of support. It does not mean BRIDGE endorses a product, and partners do not control program content.',
    'We may decline support that does not fit our mission or would put students in an awkward position.'
  ],

  /* ---------- Partnership rules (PROPOSED: every package and benefit requires leadership approval) ----------
     One source of truth for the website, Partner Express, the deck, the prospectus, the one-page overview,
     the builder and generated proposals. The rules engine in assets/js/common.js (X.rules) reads it.

     Core rules
     1. A partnership title comes only from a package the partner explicitly chooses.
        Totals never convert into titles. Five $500 program sponsorships are five Station Partner
        sponsorships, not a Founding Rider partnership.
     2. Money, designation, title, benefits, availability and payment status are calculated separately.
     3. Benefits never say "everything in the previous level". Each package lists its own benefit ids.
     4. Online checkout only handles gifts whose designation it can carry: an unrestricted gift.
        Program, season and institutional support goes through confirmation first, so the
        designation is recorded before any money moves.
     5. Nothing on the site reserves a benefit. Limited benefits are subject to confirmation.

     benefit fields
       scope:  'per-program' | 'season' | 'partnership' | 'per-gift'
       stack:  'per-program' (one per program supported) | 'once' (never duplicated) | 'per-gift'
       limited: true when only a fixed number can exist (e.g. one presenting partner per program)
       approval: true when BRIDGE must review it before it is promised
       duration, owner: what it lasts and who fulfills it */
  benefits: {
    ack:          { short: 'Written acknowledgment', label: 'A written acknowledgment of your support', scope: 'per-gift', stack: 'once', duration: 'Sent after payment is received', owner: 'Operations manager' },
    recap:        { short: 'Program recap', label: 'A short written recap from the scholars who ran the program', scope: 'per-program', stack: 'per-program', duration: 'Within two weeks of the program', owner: 'Track Lead' },
    invite:       { short: 'Invitation to attend', label: 'An invitation to attend the program and meet the scholars', scope: 'per-program', stack: 'per-program', duration: 'That program only', owner: 'Track Lead' },
    moment:       { short: 'Named moment (limited)', label: 'A named moment at the program, such as "Lunch presented by"', scope: 'per-program', stack: 'per-program', limited: true, approval: true, duration: 'That program only', owner: 'Track Lead' },
    progPresent:  { short: 'Presenting one program (limited)', label: 'Presenting acknowledgment for one program', scope: 'per-program', stack: 'per-program', limited: true, approval: true, duration: 'That program only', owner: 'Executive Director' },
    seasonAck:    { short: 'Named at each spring program', label: 'Acknowledged by name at each spring 2027 program', scope: 'season', stack: 'once', duration: 'Spring 2027 season', owner: 'Fellowship lead' },
    seasonReport: { short: 'Season report', label: 'One season report with documented counts', scope: 'season', stack: 'once', duration: 'Sent after the season ends in April 2027', owner: 'Executive Director' },
    propose:      { short: 'Propose speakers or mentors, subject to review', label: 'The opportunity to propose speakers, mentors or employee engagement, subject to BRIDGE program review, fit, availability and safeguarding requirements', scope: 'season', stack: 'once', approval: true, duration: 'Spring 2027 season', owner: 'Fellowship lead' },
    founding:     { short: '2027 Founding Rider archive listing', label: 'Listed as a 2027 Founding Rider in the season archive', scope: 'partnership', stack: 'once', duration: 'The archive listing is permanent. Active recognition ends with the spring 2027 season.', owner: 'Executive Director' },
    seasonPresent:{ short: 'Season presenting (limited)', label: 'Presenting acknowledgment for the spring 2027 season', scope: 'season', stack: 'once', limited: true, approval: true, duration: 'Spring 2027 season', owner: 'Executive Director' },
    planning:     { short: 'Planning conversation', label: 'A planning conversation with BRIDGE leadership', scope: 'partnership', stack: 'once', duration: 'Before the partnership begins', owner: 'Executive Director' },
    agreement:    { short: 'Written agreement', label: 'A written agreement setting scope, recognition, reporting and timing', scope: 'partnership', stack: 'once', approval: true, duration: 'Term set in the agreement', owner: 'Executive Director' },
    checkins:     { short: 'Leadership check-ins', label: 'Regular check-ins with BRIDGE leadership', scope: 'partnership', stack: 'once', duration: 'Term set in the agreement', owner: 'Executive Director' }
  },

  /* track: 'program' (Track A) | 'season' (Track B) | 'institutional' (Track C)
     amount: null means the amount is set in conversation.
     perProgram: the package is chosen for one specific program at a time.
     checkout: 'confirm' (designation recorded before payment) | 'online' */
  tracks: {
    program: { name: 'Program partnerships', label: 'Track A', text: 'Support one program you choose. Recognition applies to that program only.' },
    season: { name: 'Season partnerships', label: 'Track B', text: 'Support the whole spring 2027 season. Recognition applies to the season, not to every program\'s individual benefits.' },
    institutional: { name: 'Institutional partnerships', label: 'Track C', text: 'Fund the institution: training, evaluation, coordination and growth, across a year or more.' }
  },
  tiers: [
    { id: 'supporter', track: 'program', amount: 250, name: 'Station Supporter', card: 'Program · Track A', perProgram: true,
      blurb: 'Back one program on the line.', benefitIds: ['ack', 'recap'] },
    { id: 'partner', track: 'program', amount: 500, name: 'Station Partner', card: 'Program · Track A', perProgram: true, tag: 'Most direct',
      blurb: 'Back one program and put your name on one moment of it.', benefitIds: ['ack', 'recap', 'invite', 'moment'] },
    { id: 'progpresenting', track: 'program', amount: null, name: 'Program Presenting Partner', card: 'Program · Track A', perProgram: true, approval: true,
      blurb: 'Present one program. Amount and scope set together.', benefitIds: ['ack', 'recap', 'invite', 'progPresent', 'planning'] },
    { id: 'line', track: 'season', amount: 1000, name: 'Line Partner', card: 'Season · Track B',
      blurb: 'Support the spring 2027 season as a whole.', benefitIds: ['ack', 'seasonAck', 'seasonReport'] },
    { id: 'founding', track: 'season', amount: 2500, name: 'Founding Rider', card: 'Season · Track B', approval: true, inaugural: true,
      blurb: 'An inaugural partner of the 2027 BRIDGE Line. Chosen explicitly, for 2027 only.', benefitIds: ['ack', 'seasonAck', 'seasonReport', 'propose', 'founding'] },
    { id: 'seasonpresenting', track: 'season', amount: 5000, name: 'Season Presenting Partner', card: 'Season · Track B', approval: true,
      blurb: 'Present the spring 2027 season.', benefitIds: ['ack', 'seasonAck', 'seasonReport', 'propose', 'seasonPresent', 'planning'] },
    { id: 'institutional', track: 'institutional', amount: 10000, plus: true, name: 'Institutional Impact Partner', card: 'Institutional · Track C', approval: true,
      blurb: 'Fund the infrastructure behind every program, for a year or more.', benefitIds: ['ack', 'planning', 'agreement', 'checkins', 'seasonReport'] }
  ],
  foundingRules: [
    'Founding Rider exists for the inaugural 2027 season only and is not offered in later years.',
    'It is granted only when chosen explicitly and approved by BRIDGE, never because a total reaches $2,500.',
    'The archive listing is permanent. Active recognition and benefits end with the spring 2027 season.',
    'Renewal in later years is a new partnership at whatever levels exist then.'
  ],
  unrestricted: {
    name: 'Unrestricted gift',
    text: 'Any amount, used where the season needs it most. It carries no partnership title and no recognition beyond a written acknowledgment, and it can be given online.'
  },
  tierNote: 'All levels and benefits are proposed for the 2027 season and require confirmation. Titles come only from the package you choose, never from your total. Limited benefits, such as named moments and presenting acknowledgment, are confirmed in writing before they are promised.',
  lifecycle: ['Exploring', 'Proposed selections', 'Inquiry sent', 'Initial review', 'Conversation', 'Written proposal', 'Availability confirmed', 'Agreement approved', 'Payment or commitment', 'Partnership active', 'Benefits delivered', 'Impact report', 'Renewal'],
  changePolicy: 'If a program you support is rescheduled, we tell you and your support follows the new date. If it changes substantially or is canceled, we ask you to choose another program, unrestricted use, or a refund, and we record your choice in writing. We never redirect a designated gift without your consent.',

  /* ---------- Ways to give beyond the levels ---------- */
  supportTypes: [
    { id: 'unrestricted', name: 'Unrestricted operating support', text: 'The most flexible gift. It funds whatever the season needs most, including the training and coordination behind every program.' },
    { id: 'program', name: 'Program-specific support', text: 'Direct your gift to one program, such as BRIDGE to Medicine or the Next Up Tour. We use it for that program.' },
    { id: 'recurring', name: 'Recurring giving', text: 'A monthly gift that lets BRIDGE plan ahead.' },
    { id: 'volunteer', name: 'Employee volunteer engagement', text: 'Bring a team to host a table, lead a workshop or welcome college students for a site visit.' },
    { id: 'mentor', name: 'Professional mentorship', text: 'Speak at a program, sit at a mentor table, or stay in touch with a scholar who asks to.' },
    { id: 'custom', name: 'Customized institutional partnership', text: 'A multi-program or year-long partnership designed around shared goals.' },
    { id: 'inkind', name: 'In-kind support', text: 'Food, books, space, transportation, printing, photo and video, supplies and prizes.' }
  ],

  /* ---------- Partnership journeys, by institution type ----------
     steps: how a partnership usually moves. docs: what that partner usually asks for.
     time: a realistic lead time. */
  audiences: [
    { id: 'individual', name: 'Individual donors', ways: ['Any amount, online', 'Station Supporter or Station Partner', 'Monthly giving, set up with our team'], tiers: ['supporter', 'partner'], support: ['unrestricted', 'recurring'],
      steps: ['Give online or email us', 'Receive a written acknowledgment', 'Get a recap from the program you backed'], docs: ['Gift acknowledgment', 'EIN'], time: 'Same day' },
    { id: 'local', name: 'Local businesses', ways: ['Name a moment at a program', 'Food, printing, space or prizes in-kind', 'Station Partner or Line Partner'], tiers: ['partner', 'line'], support: ['inkind', 'program'],
      steps: ['Pick a program and a moment', 'Confirm by email what you will provide', 'Join us at the program'], docs: ['W-9', 'Gift acknowledgment'], time: 'Two to four weeks before the program' },
    { id: 'corporate', name: 'Corporations', ways: ['Present a program', 'Employee mentors and volunteer days', 'A season or year-long partnership'], tiers: ['founding', 'seasonpresenting', 'institutional'], support: ['volunteer', 'mentor', 'custom'],
      steps: ['A first conversation about your goals', 'A written proposal from BRIDGE', 'Your internal review', 'A short agreement and a planning call'], docs: ['IRS determination letter', 'W-9', 'Program budget', 'Possibly a certificate of insurance'], time: 'Six to twelve weeks' },
    { id: 'association', name: 'Firms and professional associations', ways: ['Speakers and mentors for an industry program', 'Member engagement with students', 'Line Partner or Founding Rider'], tiers: ['line', 'founding'], support: ['mentor', 'program'],
      steps: ['Choose an industry program', 'Match speakers or mentors to it', 'Confirm roles a month ahead'], docs: ['Program outline', 'IRS determination letter'], time: 'Four to eight weeks' },
    { id: 'university', name: 'Universities', ways: ['Space for programs', 'Campus visits for younger students', 'Co-designed programs with student groups'], tiers: [], support: ['inkind', 'custom'],
      steps: ['Identify the office or student group', 'Agree on space, dates and roles', 'Follow the campus event process'], docs: ['Event details', 'Campus visit plan'], time: 'One term ahead' },
    { id: 'school', name: 'K to 12 schools', ways: ['Friday school visits with Impact Scholars', 'A college immersion day on campus', 'Capstone and mentoring projects'], tiers: [], support: ['custom'],
      steps: ['A conversation with a school leader', 'Agree on dates, grade levels and supervision', 'Plan visits under the school\'s rules'], docs: ['Visit plan', 'Any documents the school requires for visitors'], time: 'Four to eight weeks' },
    { id: 'foundation', name: 'Foundations', ways: ['Unrestricted operating support', 'Program grants', 'Multi-year support'], tiers: ['institutional'], support: ['unrestricted', 'program', 'custom'],
      steps: ['An introductory call or letter of inquiry', 'A proposal on your timeline', 'Agreement and reporting schedule'], docs: ['IRS determination letter', 'Budget', 'Governance information'], time: 'Follows your grant cycle' },
    { id: 'public', name: 'Public agencies', ways: ['Speakers from public service', 'Site visits to agencies', 'Program support where eligible'], tiers: [], support: ['mentor', 'program'],
      steps: ['A conversation with the right office', 'Confirm what is permitted under agency rules', 'Plan the engagement'], docs: ['Organization information', 'Program outline'], time: 'Varies by agency' },
    { id: 'inkind', name: 'Community organizations', ways: ['Co-present a program', 'Books, food, space or materials', 'Shared outreach to students'], tiers: [], support: ['inkind', 'program'],
      steps: ['Find the program that fits both missions', 'Agree on roles in writing', 'Run it together and share the recap'], docs: ['Program outline'], time: 'Four to six weeks' }
  ],

  /* ---------- Internal champion toolkit ---------- */
  champion: {
    intro: 'Bringing BRIDGE to your organization? These are the pieces most people need for an internal conversation.',
    short: 'BRIDGE the District is a student-powered 501(c)(3) in Washington, DC (EIN 39-3160840). It trains college students as Impact Scholars, who plan and lead career, civic and community programs and bring younger students from DC schools onto campuses and into professional rooms. In 2026 its fellowship grew from 18 to 21 scholars, and 101 students applied for 40 spring 2027 seats.',
    recommendation: 'I recommend that we support BRIDGE the District for its spring 2027 season. BRIDGE is a registered 501(c)(3) led by college students, who run programs that connect DC students with professionals in fields like ours. The partnership I am proposing is [level or program], at [amount], which would [specific program or engagement]. It fits our [community, talent or education] goals because [reason]. BRIDGE has run comparable programs, including BRIDGE to Policy & Law with more than 60 attendees in October 2026. They can provide their IRS determination letter and a written acknowledgment, and they will send a recap after the program. I suggest we confirm by [date] so the engagement can be planned with the student team.',
    funding: 'Spring 2027 goal: $10,000, built as forty commitments of $250. Gifts can be unrestricted or directed to one of ten planned programs. Levels run from $250 to $10,000 and up; gifts of $5,000 and up start with a planning conversation.',
    process: ['Email info@bridgethedistrict.org with the subject "Documentation request".', 'Tell us which documents you need and your deadline.', 'We reply with what we can send, and when. If something is not yet available, we will say so plainly.']
  },

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
      institution: 'Engagement with college students across DC campuses, and a program built around your expertise.',
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
     minors: true keeps a photo out of the downloadable prospectus, the one-page overview,
     share images and partner recognition. Confirm media consent for every photo of younger students. */
  photos: {
    'kids.jpg': { minors: true },
    'kids2.jpg': { minors: true }
  },

  /* ---------- FAQ and due diligence ----------
     group: 'giving' | 'organization' | 'students' | 'partnership' */
  faq: [
    { group: 'giving', q: 'Is my gift tax-deductible?', a: 'BRIDGE the District is recognized by the IRS as a 501(c)(3) public charity (EIN 39-3160840), effective July 9, 2025. Gifts are tax-deductible as allowed by law, and every gift receives a written acknowledgment. Ask your own tax advisor how a gift or sponsorship applies to you.' },
    { group: 'giving', q: 'What is the difference between unrestricted and program gifts?', a: 'An unrestricted gift funds whatever the season needs most, including the training and coordination behind every program. A program gift is directed to one program you choose, and we use it for that program. If a program changes, we ask you before redirecting a restricted gift.' },
    { group: 'giving', q: 'What is the difference between a gift and a sponsorship?', a: 'A gift receives a thank-you and nothing else in return. A sponsorship is acknowledged by name at a program. In both cases, recognition is an acknowledgment, not advertising, and it does not mean BRIDGE endorses your products.' },
    { group: 'giving', q: 'Can we give something other than money?', a: 'Yes. Food, books, space, transportation, printing, photo and video, supplies and prizes all keep a program running. So does your team\'s time and expertise.' },
    { group: 'organization', q: 'Who governs BRIDGE?', a: 'BRIDGE is a DC nonprofit corporation governed by bylaws adopted at incorporation, which provide for a volunteer Board of Directors. Board seats have not yet been filled, and seating the Board is a current priority. Until then, the Executive Director leads a student leadership team under written role descriptions and spending limits.' },
    { group: 'organization', q: 'Who runs BRIDGE day to day?', a: 'Co-Founder and Executive Director England Meadows leads BRIDGE with a student leadership team: a fellowship lead, a community and events lead, an operations manager and nine returning Track Leads.' },
    { group: 'organization', q: 'What happens when student leaders graduate?', a: 'Continuity is designed in. Returning scholars become Track Leads, every program is documented in a shared library, partners write to shared inboxes, and each term ends with a written handoff. See Built for Continuity on this page.' },
    { group: 'organization', q: 'What documents can you provide?', a: 'Our IRS determination letter, certificate of incorporation and bylaws are available on request. A W-9, a spring program budget and a certificate of insurance are in preparation. Email info@bridgethedistrict.org with the subject "Documentation request" and we will tell you what we can send and when.' },
    { group: 'organization', q: 'How do you manage money?', a: 'Spending is approved by role: Track Leads under $250, the fellowship lead up to $1,000 and the Executive Director above that. Gifts for a specific program are used for that program, and program partners receive a report on how their gift was used. BRIDGE is a young organization and has not had a financial audit.' },
    { group: 'students', q: 'How do you protect students?', a: 'We never share student names, contact details or rosters with partners, and we never name or quote younger students publicly. Work with younger students happens with partner schools, under each school\'s rules. Ask us for the specific safety requirements of any program you would join; we will share them in writing, and we will tell you plainly if something you need is not yet in place.' },
    { group: 'students', q: 'How are Impact Scholars selected?', a: 'Two readers score each application. Shortlisted applicants join a group interview scored by two Track Leads on four criteria, and nobody scores someone they know. Applicants who are not selected are invited to stay connected, and alternates are ranked.' },
    { group: 'students', q: 'How do you measure impact?', a: 'Today we document sign-ins, event records, applications and campaign results, with a date on every figure. Starting in spring 2027 we add a standard post-program survey, a scholar self-assessment, a 30-day mentoring check and partner-school feedback. We publish outcome figures only once they are collected and reviewed.' },
    { group: 'partnership', q: 'Does a speaker\'s organization become a partner?', a: 'No. When professionals speak at BRIDGE, they take part in their individual capacity. We list formal partners and sponsors separately, and we do not list prospective partners at all.' },
    { group: 'partnership', q: 'Does partnership give us access to students for recruiting?', a: 'No. Partnership does not include student contact details, rosters or a hiring pipeline. Students meet professionals at programs and decide for themselves whether to stay in touch.' },
    { group: 'partnership', q: 'Can we choose which program we support?', a: 'Yes. Choose any program on the line, take the season pass to support them all, or give unrestricted support.' },
    { group: 'partnership', q: 'How do larger partnerships work?', a: 'For gifts of $5,000 and up, we start with a conversation so the partnership fits your goals and what BRIDGE can deliver well. We then send a written proposal and confirm the partnership in writing.' }
  ],
  faqGroups: { giving: 'Giving', organization: 'The organization', students: 'Students and impact', partnership: 'Partnership' }
};
