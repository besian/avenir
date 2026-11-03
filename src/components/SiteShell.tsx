import { UIProvider, type PaletteHome } from './UIProvider';
import { Header } from './Header';
import { ClosingBanner, Footer } from './Chrome';
import { getProperties } from '@/lib/firebase/server';

/** Public-site chrome: header, search palette, closing banner and footer. */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const homes: PaletteHome[] = (await getProperties()).map((p) => ({ id: p.id, title: p.title, area: p.area, avail: p.avail, type: p.type }));
  return (
    <UIProvider homes={homes}>
      <div className="site">
        <Header />
        <main className="main">
          {children}
          <ClosingBanner />
        </main>
        <Footer />
      </div>
    </UIProvider>
  );
}
