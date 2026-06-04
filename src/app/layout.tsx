import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { AppLayoutWrapper } from "@/components/app-layout-wrapper";
import { SidebarProvider } from "@/contexts/sidebar-props-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ThrottleMarket - Premium Motorcycle & Riding Gear Marketplace",
  description: "Buy and sell motorcycles and riding gear in a premium modern marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-[calc(100vh-94px)] bg-background text-foreground antialiased`}>
        <Providers>
          <SidebarProvider>
            <AppLayoutWrapper>
              {children}
            </AppLayoutWrapper>
          </SidebarProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
