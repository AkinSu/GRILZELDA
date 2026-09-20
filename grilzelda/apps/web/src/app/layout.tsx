import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // `default` covers any page that doesn't set its own title; `template` wraps
  // the ones that do, so a page only has to supply its own half of the string.
  title: {
    default: "Grilzelda — Store",
    template: "Grilzelda — %s",
  },
  description: "Custom-fitted gold grillz, made to order. Book a fitting or order a mold kit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
