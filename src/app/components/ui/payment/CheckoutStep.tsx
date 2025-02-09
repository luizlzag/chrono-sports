// components/CheckoutStep.tsx
import React from "react";
import CardPayment from "./CardPayment";
import { TransactionResponse } from "@/context/TransactionContext";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface CheckoutStepProps {
  paymentMethod: string;
  transaction: TransactionResponse | null;
  router: AppRouterInstance;
  setCheckoutStep: (step: "cart" | "payment") => void;
  fetchTransaction: () => void;
}

const CheckoutStep: React.FC<CheckoutStepProps> = ({
  paymentMethod,
  transaction,
  router,
  setCheckoutStep,
  fetchTransaction
}) => {
  const handleBack = async () => {
    await fetchTransaction();
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
    </div>
  );
};

export default CheckoutStep;
