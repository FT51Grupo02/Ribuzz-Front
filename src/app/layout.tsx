import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { FooterWithSitemap } from "@/components/Footer/Footer";
import { AuthProvider } from "@/components/Context/AuthContext";
import { CartProvider } from "@/components/Context/CartContext";
import Script from "next/script";

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
      </head>
      <body className="flex flex-col min-h-screen">
        
            <AuthProvider>
              <CartProvider>
                <Navbar />
                <main className="flex-grow">
                  {children}
                </main>
                <FooterWithSitemap />
              </CartProvider>
            </AuthProvider>
            <Script src="/node_modules/flowbite/dist/flowbite.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
