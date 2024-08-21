import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import { FooterWithSitemap } from "./components/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RiBuzz",
  description: "Conectando emprendedores apasionados con oportunidades",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="description" content="RiBuzz" />
        <title>RiBuzz</title>
      </head>
      <body>
        <Navbar/>
        {children}
        <FooterWithSitemap/>
      </body>
    </html>
  );
}