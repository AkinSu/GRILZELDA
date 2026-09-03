import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grilzelda",
  description: "Luxury Grillz & Appointment Services",
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
