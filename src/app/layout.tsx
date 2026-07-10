import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import { StoreProvider } from "@/lib/store/StoreContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Shopper",
  description: "Scaffold del flujo Personal Shopper — ver docs/spec.md",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <StoreProvider>
          <NavBar />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
