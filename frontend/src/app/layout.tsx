import type { Metadata } from "next";
import { Geist, Geist_Mono , Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DiagnosisProvider } from "@/contexts/DiagnosisContext";

const outfit = Outfit({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agrilo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <LanguageProvider>
            <DiagnosisProvider>
              {children}
            </DiagnosisProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
