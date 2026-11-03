import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { RepairWizard } from '@/components/RepairWizard';
import { IC } from '@/lib/icons';
import { CONTACT } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Report a repair',
  description: 'Tell us what needs fixing and how urgent it is. For emergencies or any risk to safety, call us now.',
};

export default function RepairPage() {
  return (
    <section className="wrap repair-page" aria-label="Report a repair">
      <a href={CONTACT.tel} className="emerg-strip">
        <Icon d={IC.alert} size={22} stroke={2.2} color="var(--color-accent-400)" />
        <span className="emerg-strip__txt">
          <strong>Emergency or risk to safety?</strong> Don’t use the form — call us now.
        </span>
        <span className="emerg-strip__num">{CONTACT.phone}</span>
      </a>
      <RepairWizard />
    </section>
  );
}
