import { SiteShell } from '@/components/SiteShell';

// Property data comes from Firestore; pages are cached and refreshed at most
// every 5 minutes, or immediately when an admin saves (see /api/revalidate).
export const revalidate = 300;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
