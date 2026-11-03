/** Re-mounts on every navigation, giving each page the soft fade-up entrance from the prototype. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
