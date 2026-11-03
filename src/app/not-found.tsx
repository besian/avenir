import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="wrap page-intro" style={{ paddingBottom: 'clamp(56px,8vw,112px)' }}>
      <p className="eyebrow">Page not found</p>
      <h1 className="h-display">We can’t find that page.</h1>
      <p className="lead" style={{ maxWidth: '52ch' }}>It may have moved. Try the homepage, or search with ⌘K.</p>
      <div className="btn-row" style={{ marginTop: 8 }}>
        <Link href="/" className="btn btn--primary">Go to the homepage</Link>
        <Link href="/properties" className="btn btn--outline">Find a home</Link>
      </div>
    </section>
  );
}
