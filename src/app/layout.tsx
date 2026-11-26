import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ماتش داي | نتائج المباريات",
  description: "نتائج ومواعيد مباريات كرة القدم باللغة العربية",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
