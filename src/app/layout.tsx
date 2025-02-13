import type { Metadata } from "next";
import { Passion_One } from "next/font/google";
import { TransactionProvider } from "@/context/TransactionContext";
import { PaymentProvider } from "@/context/PaymentContext";
import { Toaster } from "react-hot-toast";

import "./globals.css";

const inter = Passion_One(
  { subsets: ["latin"], weight:["400","700","900"] },
  );

export const metadata: Metadata = {
  title: "Chrono Sports",
  description: "Pagina venda Chrono Sports",
  icons: '/logo.png'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PaymentProvider>
          <TransactionProvider>
            <Toaster />
            {children}
          </TransactionProvider>
        </PaymentProvider>
      </body>
    </html>
  );
}
