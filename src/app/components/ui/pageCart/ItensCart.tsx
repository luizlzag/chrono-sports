// components/ItensCart.tsx
import React, { useEffect, useState } from "react";
import { IoMdAdd, IoMdRemove, IoMdTrash } from "react-icons/io";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { useTransaction } from "@/context/TransactionContext";
import { Item } from "@/app/types/cartTypes";

import CheckoutStep from "../payment/CheckoutStep";

interface ItensCartProps {
  openCart: boolean;
  setOpenCart: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ItensCart: React.FC<ItensCartProps> = ({ openCart, setOpenCart }) => {
    const { transaction, updateTransaction } = useTransaction();

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<string>("CREDIT_CARD");
    const [customerName, setCustomerName] = useState<string>("");
    const [checkoutStep, setCheckoutStep] = useState<"cart" | "payment">("cart");

    const router = useRouter();

    const calculateTotal = (): number => {
        if (!transaction) {
            return 0;
        }
        return transaction.cart.reduce((total, item) => total + item.price * (item.quantity ?? 1), 0);
    };

    const updateCart = async (updatedItems: Item[]) => {
        setLoading(true);
        if (!transaction) {
            alert("Erro ao atualizar carrinho: transação não encontrada.");
            setLoading(false);
            return;
        }
        await updateTransaction({ cart: updatedItems }, transaction.id);
        setLoading(false);
    };

    const incrementQuantity = (itemId: string) => {
        const updatedItems = transaction?.cart.map(
            (item) => item.id === itemId ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
        ) ?? [];
        updateCart(updatedItems);
    };

    const decrementQuantity = (itemId: string) => {
        const updatedItems = transaction?.cart.map((item) =>
        item.id === itemId
            ? { ...item, quantity: Math.max((item.quantity ?? 1) - 1, 0) }
            : item
        ) ?? [];
        updateCart(updatedItems);
    };

    const removeItem = (itemId: string) => {
        if (!transaction) {
            alert("Erro ao remover item: transação não encontrada.");
            return;
        }
        const updatedItems = transaction.cart.filter((item) => item.id !== itemId);
        updateCart(updatedItems);
    };

    // Verifica se o botão de pagamento deve estar desabilitado (exemplo para Pix com nome curto)
    const isPaymentButtonDisabled = (): boolean => {
        if (!transaction) {
            return true;
        }
        if (customerName.trim().length < 3) {
            return true;
        }
        if (transaction?.cart.length === 0) {
            return true;
        }
        return false;
    };

    // Em vez de redirecionar para outra página, avançamos para a etapa de pagamento.
    const handlePayment = async () => {
        if (!transaction?.id) {
            alert("Carrinho vazio, por favor adicione itens antes de prosseguir.");
            return;
        }
        setLoading(true);
        await updateTransaction({ paymentMethod: paymentMethod, customerName: customerName }, transaction.id);
        setCheckoutStep("payment");
        setLoading(false);
    };

  return (
    <>
        {loading && (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
            <ClipLoader size={60} color="#111" />
            </div>
        )}
        <div
            className={`relative ${
            loading ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
        >
            <div
                className="fixed rounded-full bottom-2 right-2 py-3 px-3 bg-red-700 opacity-90 hover:opacity-100 z-50 cursor-pointer"
                onClick={() => setOpenCart(!openCart)}
            >
                <IoMdAdd size={24} color="white" />
            </div>
            {openCart && (
            <div className="z-50">
                <div className="fixed bottom-16 right-3 bg-white px-6 py-4 z-50 rounded-lg shadow-lg w-80">
                {checkoutStep === "cart" ? (
                    <>
                    <div className="grid grid-cols-1 gap-4">
                        {transaction?.cart?.length ?? 0 > 0 ? (
                        transaction?.cart.map((item) => (
                            <div
                            key={item.id}
                            className="flex items-center justify-between"
                            >
                            <div className="flex items-center space-x-2">
                                <h1 className="text-gray-800 text-sm font-medium">
                                {item.name}
                                </h1>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                onClick={() => decrementQuantity(item.id)}
                                className="bg-gray-200 rounded p-1 hover:bg-gray-300"
                                >
                                <IoMdRemove size={16} />
                                </button>
                                <p className="text-gray-800 text-sm">
                                {item.quantity}
                                </p>
                                <button
                                onClick={() => incrementQuantity(item.id)}
                                className="bg-gray-200 rounded p-1 hover:bg-gray-300"
                                >
                                <IoMdAdd size={16} />
                                </button>
                            </div>
                            <p className="text-gray-800 text-sm font-medium">
                                {(item.price * (item.quantity ?? 1)).toFixed(2)}
                            </p>
                            <button
                                onClick={() => removeItem(item.id)}
                                className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                            >
                                <IoMdTrash size={16} />
                            </button>
                            </div>
                        ))
                        ) : (
                        <p className="text-gray-500">O carrinho está vazio.</p>
                        )}
                    </div>
                    <div className="grid gap-4 pt-4 border-t border-gray-200">
                        <p className="font-bold text-right text-lg">
                        Total: R${calculateTotal().toFixed(2)}
                        </p>
                        <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">
                            Meio de Pagamento
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-2 border rounded-md shadow-sm"
                        >
                            <option value="CREDIT_CARD">Cartão</option>
                            <option value="PIX">Pix</option>
                        </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-lg font-medium mb-2">
                            Nome do Cliente
                            </label>
                            <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full p-2 border rounded-md shadow-sm"
                            placeholder="Digite o nome do cliente"
                            />
                        </div>
                        <button
                            onClick={handlePayment}
                            disabled={isPaymentButtonDisabled()}
                            className="px-4 py-2 bg-red-700 rounded text-white w-full hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        PAGAMENTO
                        </button>
                    </div>
                    </>
                ) : (
                    <CheckoutStep
                        paymentMethod={paymentMethod}
                        setCheckoutStep={setCheckoutStep}
                        router={router}
                        transaction={transaction}
                    />
                )}
                </div>
                <div
                onClick={() => setOpenCart(false)}
                className="bg-gray-700 opacity-30 fixed top-0 w-full h-full z-0"
                ></div>
            </div>
            )}
        </div>
    </>
  );
};

export default ItensCart;
