// Fixed and interface strings, copied byte for byte from garage/pack/CONTENT_SEEDS.md
// § Fixed strings and § Interface strings. Locked with the tests at specs-v1: a red-pen at C2 or C3
// changes them only through the re-tag rule in garage/pack/CHECKPOINTS.md. Read by the unit tests
// (tests/unit/) and the browser specs (e2e/specs/). (Diane, 2026-10-04)

export const HOME_HEADING = 'Is it still here?';
export const CHECK_BUTTON = 'Check presence';
export const LINES = ['Establishing here.', 'Comparing here with here.', 'No actionable elsewhere detected.'] as const;
export const RESULT_HEADING = 'STILL HERE.';
export const RESULT_ACTIONS = ['Download PDF', 'Download PNG', 'Copy certificate link', 'Check another'] as const;
export const FOOTER = 'Confirms successful completion of this form. No physical inspection occurred.';
export const ZONE_LABEL = 'Jurisdiction of here:';
export const NOT_LOCATED = 'We could not locate this certificate. The object, however, is still here.';
export const FUTURE = 'This certificate has not been issued yet. The object, however, is still here.';
export const NOT_FOUND = 'We could not locate this page. The page, however, is still here.';
export const ENTERPRISE_CTA = 'Enterprise clients: please remain where you are. A representative will be in touch.';
export const STATUS_CONSTANT = 'All systems operational';
export const STATUS_TITLES = [
  'Unexpected concentration of elsewhere on floor three',
  'Scheduled relocation of the flagship research asset (Fridays)',
  'Investigating reports of a bench',
] as const;
export const FOOTER_ACK = 'A Vandalway Industries company';
export const JULES_PHRASE = 'Previously created WHERE-r-YOU';
export const RESEARCH_ENTERPRISE = 'Full text available to Enterprise clients.';
export const PRESENCE_BODY = '{"status":"STILL HERE"}';
export const EXAMPLES = [
  'Car keys',
  'Phone',
  'Wallet',
  'Glasses',
  'Folding chair',
  'The Moon',
  'A hot-air balloon',
  'An emotional-support peacock',
  'A time capsule (contents unknown)',
  'A lighthouse',
] as const;
export const CAREERS_TITLES = [
  'Senior Presence Engineer',
  'Customer Support Contractor (six weeks)',
  'Director of Elsewhere (on hold)',
] as const;
export const GUESTBOOK_TITLE = 'Guestbook temporarily unavailable';

// Interface strings (decided at C1, locked here).
export const UNDER_HEADING = 'Name an object. We will confirm its presence.';
export const EMPTY_INPUT = 'Name an object to check its presence.';
export const PORTFOLIO_LINE = 'Kept in Your Presence Portfolio on this device.';
export const BEFORE_2026 =
  "Your device's clock reads earlier than 1 January 2026, a moment our records cannot express. The object, however, is still here.";
export const PREPARING_PDF = 'Preparing PDF…';
export const PREPARING_PNG = 'Preparing PNG…';
export const EXPORT_FAILED = 'The file could not be prepared. Your certificate is still here: try again, or copy its link.';
export const COPIED = 'Certificate link copied.';
export const CLIPBOARD_REFUSED = 'Copy this link to keep the certificate:';
export const FAILURE_LINKS = ['Verify a certificate', 'Check an object'] as const;
export const VERIFY_LABELS = { identifier: 'Certificate identifier', name: 'Object name', button: 'Verify' } as const;
export const VERIFY_EMPTY = "Enter the certificate identifier and the object's name.";
export const PORTFOLIO_HEADING = 'Your Presence Portfolio';
export const PORTFOLIO_EMPTY = 'Nothing has been certified on this device yet. Everything you certify here stays here.';
export const PORTFOLIO_ACTIONS = ['Open', 'Download PDF', 'Download PNG'] as const;
export const RETURN_HOME = 'Return home';

// The menu and the footer (PRD diff item 8; ACCEPTANCE E0 item 2).
export const MENU = [
  ['Verify', '/verify'],
  ['Portfolio', '/portfolio'],
  ['Leadership', '/leadership'],
  ['Research', '/research/'],
  ['Case studies', '/case-studies/'],
  ['Status', '/status'],
  ['Careers', '/careers'],
  ['Enterprise', '/enterprise'],
] as const;
export const FOOTER_LINKS = [
  ['Terms of Presence', '/legal/terms'],
  ['Privacy', '/legal/privacy'],
  ['A Vandalway Industries company', 'https://vandalwayind.com/'],
] as const;

// Terms of Presence and Privacy, required sentences (CONTENT_SEEDS.md § Drafts judged at C3).
export const TERMS = [
  'Every certificate confirms successful completion of this form. No physical inspection occurred.',
  'Every object receives the same certificate.',
  'The certificate identifier is a checksum calculated in your browser. It catches typing errors and casual edits. Anyone who reads our code can produce a valid one.',
  'A certificate link contains the name of the object it certifies.',
] as const;
export const PRIVACY = [
  'This site runs no analytics and loads nothing from any other website.',
  "Our host, GitHub Pages, logs visitors' IP addresses for its own security. We cannot read those logs.",
  'Your Presence Portfolio is kept in your browser on your device. We never receive it.',
  'Safari may clear it if you do not use STILL HERE within seven days of browsing. Clearing your browser\'s data for this site clears it too.',
  'The object\'s name and time in a certificate link come after the # and are never sent to any server or written to any log.',
  'Your time zone is read by your browser to print on your certificate and is never sent anywhere.',
  'The server for vandalwayind.com keeps an access log for its hit counter. The log is deleted after seven days; only the running total is kept.',
  'Mail sent to isitstillhere.com or vandalwayind.com is refused. Nothing is received.',
] as const;
// The other companies' own documentation the privacy page links (S9 item 2).
export const GITHUB_PAGES_LOGGING_DOC = 'https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages';
export const WEBKIT_TRACKING_PREVENTION_DOC = 'https://webkit.org/tracking-prevention/';

// PRD R7: the fourteen names of "no tells".
export const NO_TELLS = ['Adrian Vale', 'Memorial bench', 'Lucas', 'My car keys', ...EXAMPLES] as const;

// The storage key of Your Presence Portfolio (E7 item 3).
export const PORTFOLIO_KEY = 'stillhere.portfolio.v1';

// Identifier vectors (CONTENT_SEEDS.md § Identifier vectors): published, then derived.
export const VECTORS = [
  { name: 'Folding chair', time: '2026-10-03T10:52:00Z', id: 'SH-00PP-9AGR-1GTB' },
  { name: 'folding  CHAIR ', time: '2026-10-03T10:52:00Z', id: 'SH-00PP-9AGR-1GTB' },
  { name: 'Memorial bench', time: '2026-10-03T10:52:01Z', id: 'SH-00PP-9AHN-M3JT' },
  { name: 'The Moon', time: '2026-10-03T10:52:00Z', id: 'SH-00PP-9AG8-3CK2' },
] as const;
export const DERIVED_VECTORS = [
  { name: 'A time capsule (contents unknown)', time: '2027-10-03T10:52:00Z', id: 'SH-01MR-P6G7-6TA1' },
  { name: 'Folding chair', time: '2026-10-02T09:01:00Z', id: 'SH-00PK-EEC2-0EPR' },
  { name: 'Memorial bench', time: '2026-10-01T15:40:00Z', id: 'SH-00PH-HEGC-M3YK' },
] as const;

// Colours of DESIGN.md (the front matter), as CSS rgb() triples, for computed-style checks.
export const DESIGN_COLOURS: Record<string, [number, number, number]> = {
  graphite: [0x16, 0x16, 0x18],
  canvas: [0xfa, 0xf7, 0xf0],
  surface: [0xf1, 0xee, 0xe7],
  hairline: [0xdf, 0xdc, 0xd6],
  'graphite-muted': [0x4c, 0x4c, 0x4a],
  'verification-green': [0x06, 0x98, 0x52],
};
export const FONT_FAMILIES = ['Inter', 'Inter Tight', 'JetBrains Mono', 'Cormorant Garamond'] as const;

// The pages of PRD R24, by path, with the file research 3's URL table serves each from.
export const PAGES: { path: string; file: string; heading?: string }[] = [
  { path: '/', file: 'index.html' },
  { path: '/leadership', file: 'leadership.html' },
  { path: '/research/', file: 'research/index.html' },
  { path: '/research/competitive-landscape', file: 'research/competitive-landscape.html' },
  { path: '/research/directionality-of-here', file: 'research/directionality-of-here.html' },
  { path: '/research/six-feet-to-the-left', file: 'research/six-feet-to-the-left.html' },
  { path: '/case-studies/', file: 'case-studies/index.html' },
  { path: '/case-studies/municipal-infrastructure', file: 'case-studies/municipal-infrastructure.html' },
  { path: '/case-studies/public-seating', file: 'case-studies/public-seating.html' },
  { path: '/case-studies/civic-rest-sector', file: 'case-studies/civic-rest-sector.html' },
  { path: '/status', file: 'status.html' },
  { path: '/careers', file: 'careers.html' },
  { path: '/enterprise', file: 'enterprise.html' },
  { path: '/verify', file: 'verify.html' },
  { path: '/portfolio', file: 'portfolio.html' },
  { path: '/c/', file: 'c/index.html' },
  { path: '/legal/terms', file: 'legal/terms.html' },
  { path: '/legal/privacy', file: 'legal/privacy.html' },
];
export const NOT_FOUND_FILE = '404.html';

// Leadership, PRD R26's order: id, portrait.
export const LEADERSHIP = [
  ['clive', 'p01'],
  ['diane', 'p02'],
  ['martin', 'p03'],
  ['jules', 'p04'],
  ['petra', 'p05'],
  ['susan', 'p06'],
  ['lucas', 'p07'],
  ['graham', 'p08'],
  ['len', 'p09'],
  ['adrian', 'p10'],
  ['bev', 'p11'],
  ['malcolm', 'p13'],
] as const;

// GitHub Pages' four addresses (X6 item 4; research 3 §2).
export const PAGES_IPV4 = ['185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153'] as const;
