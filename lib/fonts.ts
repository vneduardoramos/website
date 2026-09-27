import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

/**
 * One typeface for the site, plus a mono for the credential lines and eyebrows.
 *
 * Plus Jakarta Sans carries both roles: headings take the heavy cuts, body
 * text the regular. The full weight range lets hierarchy do the work that a
 * second family used to do.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

/** Combined CSS-variable class string for <html>. */
export const fontVariables = `${jakarta.variable} ${jetbrains.variable}`;
export { jakarta, jetbrains };
