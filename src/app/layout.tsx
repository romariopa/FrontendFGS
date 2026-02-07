import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/utils/cn";
import { I18nProvider } from "@/i18n/I18nContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simulador del Ahorro Digital",
  description: "Explora productos y simula tu ahorro con nosotros.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={cn(inter.className, "min-h-screen bg-gray-50")}>
        <I18nProvider>
          <Navbar />
          <main className="container mx-auto py-8 px-4">{children}</main>
        </I18nProvider>
      </body>
    </html>
  );
}
