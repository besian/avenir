/**
 * Property listings.
 *
 * PLACEHOLDER DATA — these six homes are illustrative only. Replace them with
 * real listings (and drop photos into /public/images/properties/<id>/) before
 * going live. Everything on the listings page, map view, property pages,
 * homepage "available now" strip and search palette reads from this array.
 */

export type PropertyStatus = 'Available' | 'Coming soon' | 'Full';
export type SupportLevel = 'Low' | 'Medium' | 'High';

export interface Property {
  id: string;
  title: string;
  area: string;
  pc: string;
  type: string;
  beds: number;
  bedsUnit: 'Bedrooms' | 'One-bed flats';
  baths: number;
  bathsUnit: 'Bathrooms' | 'Private bathrooms';
  rec: number;
  support: SupportLevel;
  status: PropertyStatus;
  /** Sort order on listings — lower first. 0 = available now. */
  ord: number;
  avail: string;
  staff: string;
  suitable: string;
  la: string;
  photos: number;
  /** Position of the pin on the placeholder map, in % of the map box. */
  mx: number;
  my: number;
  summary: string;
  features: string[];
  transport: [place: string, time: string][];
}

const shared = ['Fully furnished', 'Bills included', 'Wi-Fi', 'Shared kitchen', 'Washing machine', 'Shared lounge'];

export const PROPERTIES: Property[] = [
  {
    id: 'AH-101', title: '24 Leigham Court Road', area: 'Streatham', pc: 'SW16 1EH', type: 'Shared supported house',
    beds: 5, bedsUnit: 'Bedrooms', baths: 3, bathsUnit: 'Bathrooms', rec: 1, support: 'Medium', status: 'Available', ord: 0,
    avail: 'Available now', staff: 'Daily support visits', suitable: 'Single adults, 18+', la: 'Lambeth', photos: 12, mx: 46, my: 38,
    summary: 'A bright Victorian house with a large garden, five minutes from Streatham station.',
    features: [...shared, 'Private garden', 'Bike storage'],
    transport: [['Streatham station', '6 min walk'], ['Buses 57, 109, 250', '2 min walk'], ['Streatham Common', '8 min walk']],
  },
  {
    id: 'AH-102', title: '8 Norbury Crescent', area: 'Norbury', pc: 'SW16 3LX', type: 'Shared supported house',
    beds: 4, bedsUnit: 'Bedrooms', baths: 2, bathsUnit: 'Bathrooms', rec: 1, support: 'Medium', status: 'Available', ord: 1,
    avail: 'From 1 Nov 2026', staff: 'Daily support visits', suitable: 'Single adults, 18+', la: 'Croydon', photos: 9, mx: 42, my: 58,
    summary: 'A quiet, family-sized home on a residential street with two shared bathrooms.',
    features: [...shared, 'Dining room', 'Rear patio'],
    transport: [['Norbury station', '5 min walk'], ['Buses 60, 109', '3 min walk'], ['Norbury Park', '10 min walk']],
  },
  {
    id: 'AH-103', title: '51 Smallwood Road', area: 'Tooting', pc: 'SW17 0TN', type: 'Detached house',
    beds: 3, bedsUnit: 'Bedrooms', baths: 2, bathsUnit: 'Bathrooms', rec: 1, support: 'Medium', status: 'Available', ord: 0,
    avail: 'Available now', staff: 'Daily support visits', suitable: 'Single adults, 18+', la: 'Wandsworth', photos: 14, mx: 22, my: 34,
    summary: 'Contemporary two-storey detached home with spacious bedrooms, two full bathrooms and open-plan living areas, plus a landscaped front garden.',
    features: [...shared, 'Open-plan living', 'Landscaped front garden'],
    transport: [['Tooting Broadway (Northern line)', '8 min walk'], ['Tooting station', '10 min walk'], ['Tooting Bec Common', '12 min walk']],
  },
  {
    id: 'AH-104', title: '117 Addiscombe Road', area: 'Croydon', pc: 'CR0 6SR', type: 'Shared supported house',
    beds: 6, bedsUnit: 'Bedrooms', baths: 3, bathsUnit: 'Bathrooms', rec: 2, support: 'High', status: 'Coming soon', ord: 2,
    avail: 'From Jan 2027', staff: 'Staff on site daily', suitable: 'Vulnerable adults, 18+', la: 'Croydon', photos: 6, mx: 72, my: 78,
    summary: 'A newly refurbished house with on-site staff presence and a ground-floor accessible room.',
    features: [...shared, 'Accessible ground-floor room', 'Staff office'],
    transport: [['East Croydon station', '9 min walk'], ['Tram — Lebanon Road', '3 min walk'], ['Croydon town centre', '12 min walk']],
  },
  {
    id: 'AH-105', title: '42 Acre Lane', area: 'Brixton', pc: 'SW2 5RF', type: 'Self-contained flats',
    beds: 3, bedsUnit: 'One-bed flats', baths: 3, bathsUnit: 'Private bathrooms', rec: 0, support: 'Low', status: 'Full', ord: 9,
    avail: 'Currently full', staff: 'Weekly support visits', suitable: 'Adults moving towards independence', la: 'Lambeth', photos: 8, mx: 50, my: 14,
    summary: 'Three one-bedroom flats close to Brixton’s shops, market and transport links.',
    features: ['Fully furnished', 'Wi-Fi', 'Private kitchen', 'Private bathroom', 'Secure entry', 'Bike storage'],
    transport: [['Brixton (Victoria line)', '6 min walk'], ['Clapham North (Northern line)', '9 min walk'], ['Brockwell Park', '14 min walk']],
  },
  {
    id: 'AH-106', title: '305 London Road', area: 'Mitcham', pc: 'CR4 3LB', type: 'Shared supported house',
    beds: 5, bedsUnit: 'Bedrooms', baths: 2, bathsUnit: 'Bathrooms', rec: 1, support: 'Medium', status: 'Available', ord: 0,
    avail: 'Available now', staff: 'Daily support visits', suitable: 'Single adults, 18+', la: 'Merton', photos: 11, mx: 24, my: 66,
    summary: 'A spacious semi-detached house with a large shared kitchen and off-street parking.',
    features: [...shared, 'Off-street parking', 'Garden'],
    transport: [['Mitcham Junction', '8 min walk'], ['Tram — Mitcham', '5 min walk'], ['Mitcham Common', '6 min walk']],
  },
];

export const AREAS = ['Streatham', 'Norbury', 'Tooting', 'Croydon', 'Brixton', 'Mitcham'];

const pl = (n: number, one: string, many: string) => (n === 1 ? one : many);

/** Sort by `ord` (stable), matching the prototype. */
export const byOrder = (a: Property, b: Property) => a.ord - b.ord;

export function getProperty(id: string) {
  return PROPERTIES.find((p) => p.id.toLowerCase() === id.toLowerCase());
}

export function propertyHref(p: Pick<Property, 'id'>) {
  return `/properties/${p.id.toLowerCase()}`;
}

export function labels(p: Property) {
  const bedsLabel = p.bedsUnit === 'Bedrooms' ? pl(p.beds, 'bedroom', 'bedrooms') : 'one-bed flats';
  return {
    addressLine: `${p.area}, London ${p.pc}`,
    bedsLabel,
    bathsLabel: p.bathsUnit === 'Bathrooms' ? pl(p.baths, 'bathroom', 'bathrooms') : 'private baths',
    recLabel: pl(p.rec, 'reception', 'receptions'),
    specLine: `${p.beds} ${bedsLabel} · ${p.baths} bath · ${p.type.toLowerCase()}`,
  };
}

export function description(p: Property) {
  return [
    `${p.summary} Each room is furnished with care, and residents are encouraged to personalise their space and build a sense of ownership and belonging.`,
    `Support is tailored to each resident — from budgeting and benefits to healthcare and life skills — with ${p.staff.toLowerCase()} from our trained team.`,
  ];
}

export function keyFacts(p: Property): { label: string; value: string }[] {
  return (
    [
      ['Property type', p.type],
      [p.bedsUnit, String(p.beds)],
      [p.bathsUnit, String(p.baths)],
      ['Reception rooms', String(p.rec)],
      ['Bills', p.features.includes('Bills included') ? 'Included' : 'Not included'],
      ['Support level', p.support],
      ['Staff presence', p.staff],
      ['Suitable for', p.suitable],
      ['Local authority', p.la],
    ] as const
  ).map(([label, value]) => ({ label, value }));
}

export const availableHomes = () => PROPERTIES.filter((p) => p.status === 'Available');

export function availabilitySummary() {
  const avail = availableHomes();
  const now = avail.filter((p) => p.ord === 0).length;
  return {
    label: `${now} ${pl(now, 'home', 'homes')} available now`,
    areas: `In ${[...new Set(avail.map((p) => p.area))].join(', ')} — more coming in Croydon from January.`,
  };
}

export const featuredHomes = () => availableHomes().slice().sort(byOrder).slice(0, 3);

export const homesCount = (n: number) => `${n}${pl(n, ' home', ' homes')}`;
