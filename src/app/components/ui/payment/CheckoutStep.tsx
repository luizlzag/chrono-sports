// components/CheckoutStep.tsx
import React from "react";
import CardPayment from "./CardPayment";
import { TransactionResponse } from "@/context/TransactionContext";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import PixPayment from "./PixPayment";

interface CheckoutStepProps {
  paymentMethod: string;
  transaction: TransactionResponse | null;
  router: AppRouterInstance;
  setCheckoutStep: (step: "cart" | "payment") => void;
  deleteTransaction: (id: number) => void;
}

const CheckoutStep: React.FC<CheckoutStepProps> = ({
  paymentMethod,
  transaction,
  router,
  setCheckoutStep,
  deleteTransaction
}) => {
  const handleBack = async () => {
    if (transaction?.id) {
      await deleteTransaction(transaction.id);
    }
    setCheckoutStep("cart");
  };

  return (
    <div className="space-y-4">
      {paymentMethod === "CREDIT_CARD" && (
        <CardPayment
          transaction={transaction}
          router={router}
          onBack={handleBack}
        />
      )}
      {paymentMethod === "PIX" && (
        <PixPayment
          transaction={transaction}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default CheckoutStep;
