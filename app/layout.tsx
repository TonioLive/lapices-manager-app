import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lápices Manager",
  description:
    "Plataforma de gestión educativa para Lápices Escuelas Infantiles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const bodyAttributesToRemove = [
                  'cz-shortcut-listen',
                  'data-new-gr-c-s-check-loaded',
                  'data-gr-ext-installed',
                  'data-lt-installed',
                  'spellcheck'
                ];

                bodyAttributesToRemove.forEach((attribute) => {
                  document.body.removeAttribute(attribute);
                });

                const htmlAttributesToRemove = [
                  'data-lt-installed'
                ];

                htmlAttributesToRemove.forEach((attribute) => {
                  document.documentElement.removeAttribute(attribute);
                });
              } catch (error) {}
            `,
          }}
        />

        {children}
      </body>
    </html>
  );
}