"use client";
import { createContext, useState, useContext } from "react";
import { getRecentTransaction, createTransaction, updateTransaction, getTransaction } from "@/api/axios/api";
import { Item } from "@/app/types/cartTypes";

interface TransactionRequest {
    cart: Item[];
}

interface TransactionResponse {
    id: number;
    gymId: number;
    userId: number;
    paymentLinkId: string | null;
    paymentIntentId: string | null;
    status: string;
    cart: Item[];
    totalAmount: string;
    currency: string;
    createdAt: string;
    updatedAt: string;
    softDelete: boolean;
}

interface TransactionContextType {
    transaction: TransactionResponse | null;
    setTransaction: (transaction: TransactionResponse | null) => void;
    fetchTransaction: () => Promise<void>;
    createTransaction: (transactionData: TransactionRequest) => Promise<void>;
    updateTransaction: (transactionData: TransactionRequest, transactionId: number) => Promise<void>;
    getTransaction: (transactionId: number) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
    const [transaction, setTransaction] = useState<TransactionResponse | null>(null);

    const fetchTransaction = async () => {
        try {
            const data = await getRecentTransaction();
            setTransaction(data);
        } catch (error) {
            console.error("Erro ao obter transação:", error);
        }
    };

    const handleCreateTransaction = async (transactionData: TransactionRequest) => {
        try {
            const response = await createTransaction(transactionData);
            setTransaction(response);
        } catch (error) {
            console.error("Erro ao criar transação:", error);
        }
    };

    const handleUpdateTransaction = async (transactionData: TransactionRequest, transactionId: number) => {
        try {
            const response = await updateTransaction(transactionData, transactionId);
            if (!response) setTransaction(null);
            setTransaction(response);
        } catch (error) {
            console.error("Erro ao atualizar transação:", error);
        }
    };

    const handleGetTransaction = async (transactionId: number) => {
        try {
            const response = await getTransaction(transactionId);
            setTransaction(response);
        } catch (error) {
            console.error("Erro ao obter transação:", error);
        }
    }

    return (
        <TransactionContext.Provider value={{ transaction, setTransaction, fetchTransaction, createTransaction: handleCreateTransaction, updateTransaction: handleUpdateTransaction, getTransaction: handleGetTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error("useTransaction must be used within a TransactionProvider");
    }
    return context;
};
