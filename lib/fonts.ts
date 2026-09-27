import { Montserrat, JetBrains_Mono } from "next/font/google";

/**
 * One typeface for the site, plus a mono for the credential lines and eyebrows.
 *
 * Montserrat carries both roles: headings take the heavy cuts, body text the
 * regular. It is a geometric face, so it runs a little wide at body sizes;
 * `display: "swap"` and the full weight range keep the hierarchy doing the work
 * that a second family used to do.
 */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

/** Combined CSS-variable class string for <html>. */
export const fontVariables = `${montserrat.variable} ${jetbrains.variable}`;
export { montserrat, jetbrains };
