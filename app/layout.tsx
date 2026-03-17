import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SurveySense Ecommerce Demo",
  description: "Demo ecommerce frontend integrated with SurveySense backend",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
