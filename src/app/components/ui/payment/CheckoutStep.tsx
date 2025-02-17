// components/CheckoutStep.tsx
import React from "react";
import CardPayment from "./CardPayment";
import { TransactionResponse, useTransaction } from "@/context/TransactionContext";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import PixPayment from "./PixPayment";

interface CheckoutStepProps {
  paymentMethod: string;
  transaction: TransactionResponse | null;
  router: AppRouterInstance;
  setCheckoutStep: (step: "cart" | "payment") => void;
}

const CheckoutStep: React.FC<CheckoutStepProps> = ({
  paymentMethod,
  transaction,
  router,
  setCheckoutStep
}) => {
  const { fetchTransaction } = useTransaction();

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
