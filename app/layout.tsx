import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { getConfig } from "@/utils/config";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppContextProvider from "@/context/AppContextProvider";
import { ThemeProvider } from "next-themes";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const cookieHeader = headerList.get("cookie");
  const initialState = cookieToInitialState(getConfig(), cookieHeader);


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap the entire layout in the ThemeProvider */}
        <ThemeProvider attribute="class" defaultTheme="light">
          <Theme accentColor="purple">
            <AppContextProvider>
              <Providers initialState={initialState}>   {/* Providers for wagmi connectors and getConfig */}
                <Navbar />
                <main>{children}</main>
                <Footer />
              </Providers>
            </AppContextProvider>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
