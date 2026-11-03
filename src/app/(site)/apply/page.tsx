import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ApplyWizard } from '@/components/ApplyWizard';

export const metadata: Metadata = {
  title: 'Refer or apply',
  description: 'Apply for supported accommodation, or refer someone as a local authority, support agency or charity. It takes about five minutes.',
};

export default function ApplyPage() {
  return (
    <section className="wizard-page" aria-label="Refer or apply">
      <Suspense>
        <ApplyWizard />
      </Suspense>
    </section>
  );
}
