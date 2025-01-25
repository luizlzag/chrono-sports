'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface PaymentData {
  paymentLink: string;
  setPaymentLink: (link: string) => void;
}

const PaymentContext = createContext<PaymentData | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [paymentLink, setPaymentLink] = useState<string>('');

  return (
    <PaymentContext.Provider value={{ paymentLink, setPaymentLink }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}
