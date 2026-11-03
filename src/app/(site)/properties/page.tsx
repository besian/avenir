import type { Metadata } from 'next';
import { PropertiesBrowser } from '@/components/PropertiesBrowser';
import { getProperties } from '@/lib/firebase/server';

export const metadata: Metadata = {
  title: 'Find a home',
  description: 'Safe, stable, furnished homes across South London, with support from our team.',
};

export default async function PropertiesPage() {
  const homes = await getProperties();
  return (
    <>
      <section className="wrap page-intro" style={{ paddingTop: 'clamp(48px,7vw,96px)', paddingBottom: 32 }}>
        <p className="eyebrow">Find a home</p>
        <h1 className="h-display">Safe, stable homes.</h1>
        <p className="lead" style={{ maxWidth: '52ch' }}>
          Furnished with care across South London, with support from our team. Rent is often covered by Housing Benefit.
        </p>
      </section>
      <PropertiesBrowser homes={homes} />
    </>
  );
}
