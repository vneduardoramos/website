// Passthrough root layout. The real <html>/<body> is rendered by the nested
// root layouts (app/[locale]/layout.tsx for the localized site,
// app/admin/layout.tsx for the admin shell) and by the self-contained global
// app/not-found.tsx. Next.js still requires a top-level layout so the global
// not-found page has a root to render within; it must not render <html>/<body>
// itself or those tags would nest.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
