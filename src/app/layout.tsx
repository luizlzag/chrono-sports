import type { Metadata } from "next";
import { Passion_One } from "next/font/google";
import { TransactionProvider } from "@/context/TransactionContext";

import "./globals.css";

const inter = Passion_One(
  { subsets: ["latin"], weight:["400","700","900"] },
  );

export const metadata: Metadata = {
  title: "Chrono Sports",
  description: "Pagina venda Chrono Sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TransactionProvider>
          {children}
        </TransactionProvider>
      </body>
    </html>
  );
}
