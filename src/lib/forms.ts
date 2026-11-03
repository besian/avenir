/**
 * Form submission — FRONT-END ONLY for now.
 *
 * Every form on the site (apply/refer, repair, landlord enquiry, contact)
 * calls one of these functions. They currently resolve locally with a
 * generated reference so the full flow and confirmation screens work.
 *
 * To go live, replace the body of `send()` with a real call — e.g. a
 * Next.js Route Handler that emails the team, or a CRM / form-service
 * endpoint. Keep the return shape ({ ref }) so the UI doesn't change.
 */

export type FormKind = 'apply' | 'repair' | 'landlord' | 'contact';

const PREFIX: Record<FormKind, string> = { apply: 'AV', repair: 'AR', landlord: 'AL', contact: 'AC' };

async function send(kind: FormKind, payload: Record<string, unknown>): Promise<{ ref: string }> {
  // TODO: POST payload to the backend once one exists.
  void payload;
  return { ref: `${PREFIX[kind]}-${Math.floor(1000 + Math.random() * 9000)}` };
}

export const submitApplication = (p: Record<string, unknown>) => send('apply', p);
export const submitRepair = (p: Record<string, unknown>) => send('repair', p);
export const submitLandlordEnquiry = (p: Record<string, unknown>) => send('landlord', p);
export const submitContact = (p: Record<string, unknown>) => send('contact', p);
