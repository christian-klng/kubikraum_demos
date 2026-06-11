import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sockenwerk · Bestandsverwaltung",
  description:
    "Demo: Shopify-Inventar eines Socken-Händlers mit Statistiken und Produktdetails.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
