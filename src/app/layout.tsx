import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';
import { UIProvider } from '@/components/UIProvider';
import { Header } from '@/components/Header';
import { ClosingBanner, Footer, MobileActionBar } from '@/components/Chrome';

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.avenirhousing.co.uk'),
  title: { default: 'Avenir Housing — Supporting people. Building futures.', template: '%s · Avenir Housing' },
  description:
    'Safe, supported accommodation for vulnerable adults across South London. Find a home, make a referral, report a repair or partner with us.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f5f4ef',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={archivo.variable}>
      <body>
        <UIProvider>
          <div className="site">
            <Header />
            <main className="main">
              {children}
              <ClosingBanner />
            </main>
            <Footer />
            <MobileActionBar />
          </div>
        </UIProvider>
      </body>
    </html>
  );
}
