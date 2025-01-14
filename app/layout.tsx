import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import AppContextProvider from "./context/AppContextProvider";
import { ThemeProvider } from "next-themes";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "certify",
  description: "Certificate generation and validation using Web3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap the entire layout in the ThemeProvider */}
        <ThemeProvider attribute="class" defaultTheme="light">
          <Theme accentColor="purple">
            <AppContextProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </AppContextProvider>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
