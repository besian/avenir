import { IC } from './icons';

export const CONTACT = {
  phone: '+44 7507 921011',
  tel: 'tel:+447507921011',
  email: 'info@avenirhousing.co.uk',
  directorEmail: 'ismail@avenirhousing.co.uk',
  address: '656 Streatham High Road, SW16 3QL',
  mapsUrl: 'https://maps.app.goo.gl/fsE7RHoMwUdPWpNe8',
};

export const NAV_LINKS = [
  { label: 'Find a home', href: '/properties' },
  { label: 'Refer or apply', href: '/apply' },
  { label: 'Landlords', href: '/landlords' },
  { label: 'Support', href: '/support' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_EXPLORE = [
  { label: 'Find a home', href: '/properties' },
  { label: 'Landlords', href: '/landlords' },
  { label: 'Support', href: '/support' },
];

export const FOOTER_HELP = [
  { label: 'Refer or apply', href: '/apply' },
  { label: 'Report a repair', href: '/repair' },
  { label: 'Contact us', href: '/contact' },
];

export const HREF = {
  applySelf: '/apply?for=self',
  refer: '/apply?for=referral',
};

export const PATHS = [
  { kicker: 'I need a home', title: 'Apply for accommodation', body: 'Tell us about your situation. We’ll call you back within two working days.', cta: 'Start application', icon: IC.user, href: HREF.applySelf },
  { kicker: 'I’m referring someone', title: 'Make a referral', body: 'For local authorities, support agencies and charities. Takes about five minutes.', cta: 'Start referral', icon: IC.userPlus, href: HREF.refer },
  { kicker: 'I’m a landlord', title: 'Let your property to us', body: 'Partner with a community interest company to create secure, sustainable homes.', cta: 'Work with us', icon: IC.building, href: '/landlords' },
  { kicker: 'I’m a tenant', title: 'Report a repair', body: 'Tell us what needs fixing and how urgent it is. Add photos if it helps.', cta: 'Report a repair', icon: IC.wrench, href: '/repair' },
];

export const APPROACH = [
  { title: 'Trauma-informed spaces', text: 'Bare or impersonal rooms can trigger distress for people with difficult experiences. We make every home warm and welcoming from day one.' },
  { title: 'Person-centred homes', text: 'Living spaces reflect each person’s preferences and needs, and tenants are encouraged to personalise them — building ownership, independence and belonging.' },
  { title: 'Holistic support', text: 'Whether it’s financial hardship, mental health or other barriers, we connect people with charities, community organisations and specialist workshops.' },
  { title: 'Joined-up partnerships', text: 'Working with Local Authorities, Housing Associations and community groups across London to tackle the root causes of homelessness.' },
].map((a, i) => ({ ...a, n: `0${i + 1}` }));

export const WHO_WE_HELP = ['Formerly homeless individuals', 'Vulnerable adults', 'People leaving temporary or unsafe housing'];

export const TEAM = [
  { name: 'Ismail Hasan', role: 'Director & Co-founder' },
  { name: 'Amaan Hafeez', role: 'Director & Co-founder' },
  { name: 'Anis Hasan', role: 'Finance Manager' },
  { name: 'Rayaan Hafeez', role: 'Housing Manager' },
];

export interface Faq { q: string; a: string; bullets?: string[] }

export const FAQS: Faq[] = [
  { q: 'What support do you provide?', a: 'Support is tailored to each resident and may include:', bullets: ['Help with budgeting and managing benefits', 'Support accessing healthcare and mental health services', 'Life skills training (e.g. cooking, cleaning, job readiness)', 'Assistance with moving towards independent living', 'Emotional support and signposting to other services'] },
  { q: 'How do I apply for accommodation?', a: 'You can apply directly, or be referred by a local authority, support agency or charity. We assess each application to make sure we can meet the individual’s needs.' },
  { q: 'How long can someone stay?', a: 'It depends on the individual’s needs and progress. Some residents stay a few months, others longer — until they’re ready to move on to more independent housing.' },
  { q: 'Are staff on-site?', a: 'Our trained support workers are available to provide guidance and assistance. Staff presence depends on the property and the needs of residents.' },
  { q: 'Do you work with other organisations?', a: 'Yes. We partner with local authorities, health services, charities and community organisations so residents receive comprehensive care and support.' },
  { q: 'How is your service funded?', a: 'Through a combination of rent (often covered by Housing Benefit), local authority funding and charitable contributions.' },
  { q: 'Can residents have visitors?', a: 'Visitors are welcome within reasonable limits, with safeguarding and safety procedures in place to protect all residents.' },
  { q: 'How do you keep residents safe?', a: 'Well-managed properties with risk assessments, safeguarding policies and trained staff. Safety and dignity are always our top priorities.' },
];

export const PARTNERS = [
  { title: 'Landlords', body: 'Let your property to a community interest company that houses and supports vulnerable adults.' },
  { title: 'Local Authorities', body: 'Joined-up support that tackles the root causes of homelessness.' },
  { title: 'Housing Associations', body: 'Helping individuals move towards stability and independence.' },
  { title: 'Charities & community groups', body: 'Connecting residents with the right resources and opportunities.' },
];

export const PARTNER_STEPS = [
  { n: '01', title: 'Tell us about it', body: 'Share your property or organisation and what you’re looking for.' },
  { n: '02', title: 'We review together', body: 'We assess suitability and agree how we’ll work together.' },
  { n: '03', title: 'Homes made welcoming', body: 'We prepare comfortable, welcoming homes and support each tenant to settle and thrive.' },
];

export const SUPPORT_AREAS = [
  { title: 'Budgeting & benefits', body: 'Help managing money and claiming what you’re entitled to.', icon: IC.shield },
  { title: 'Health & wellbeing', body: 'Support accessing healthcare and mental health services.', icon: IC.help },
  { title: 'Life skills', body: 'Cooking, cleaning and getting job-ready.', icon: IC.home },
  { title: 'Moving on', body: 'Steps towards independent living, at your pace.', icon: IC.door },
  { title: 'Someone to talk to', body: 'Emotional support and signposting to other services.', icon: IC.message },
];

export const COMPLAINT_STEPS = [
  { time: '24–48 hrs', title: 'We acknowledge', body: 'We’ll confirm we’ve received your complaint.' },
  { time: '3 days', title: 'We investigate', body: 'A full written response within 3 working days — we’ll keep you updated if it takes longer.' },
  { time: '10 days', title: 'Escalation', body: 'Not satisfied? Our Director reviews it, with a final response within 10 working days.' },
];

export const CHANNELS = [
  { label: 'Call us', value: CONTACT.phone, hint: 'Fastest for urgent issues', href: CONTACT.tel, icon: IC.phone, external: false },
  { label: 'Email', value: CONTACT.email, hint: 'We reply within a working day', href: `mailto:${CONTACT.email}`, icon: IC.mail, external: false },
  { label: 'Visit', value: CONTACT.address, hint: 'Open in maps', href: CONTACT.mapsUrl, icon: IC.pin, external: true },
];

export const CONTACT_TOPICS = ['A referral', 'A partnership or property', 'An existing tenancy', 'A complaint', 'Something else'];

// Apply / refer wizard
export const APPLY_STEPS = ['Who it’s for', 'Contact details', 'Situation', 'Review & send'];
export const SITUATIONS = ['Homeless or rough sleeping', 'Temporary accommodation', 'Unsafe housing', 'Leaving hospital, prison or care', 'Sofa surfing', 'Something else'];
export const CONTACT_PREFS = ['Phone call', 'Text message', 'Email'];

// Repair wizard
export const REPAIR_STEPS = ['Issue', 'Urgency', 'Details', 'Your details'];
export const REPAIR_CATEGORIES: [string, string][] = [
  ['Plumbing', IC.drop], ['Heating & hot water', IC.flame], ['Electrical', IC.zap], ['Damp & mould', IC.waves],
  ['Doors, windows & locks', IC.door], ['Appliances', IC.fridge], ['Something else', IC.help],
];
export const REPAIR_URGENCIES: [string, string][] = [
  ['Emergency', 'Risk to safety — fire, flood, gas, no secure entry'],
  ['Urgent', 'Affects daily living — no heating or hot water'],
  ['Routine', 'Can be scheduled — minor faults, wear and tear'],
];
export const REPAIR_LOCATIONS = ['Kitchen', 'Bathroom', 'Bedroom', 'Living area', 'Hallway or stairs', 'Outside'];
