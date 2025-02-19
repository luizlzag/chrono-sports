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
  const { fetchTransaction, updateTransaction } = useTransaction();

  const handleBack = async (status: string|null) => {
    if (!transaction) {
      alert("Erro ao atualizar transação: transação não encontrada.");
      return;
    }

    switch (status) {
      case "cancel":
        await updateTransaction({ status: "canceled" }, transaction?.id);
        break;
      case "processing":
        await updateTransaction({ status: "waiting_payment" }, transaction?.id);
        break;
      default:
        break;
    }

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
