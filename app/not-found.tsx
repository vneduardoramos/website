import Link from "next/link";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export default function RootNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body className="font-sans">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow">Error 404</p>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-foreground">This page wandered off.</h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted">The page you are looking for does not exist or has moved.</p>
          <Link href="/" className="btn-primary btn-lg mt-8">Back home</Link>
        </div>
      </body>
    </html>
  );
}
