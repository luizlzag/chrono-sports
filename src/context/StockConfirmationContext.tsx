'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { handleTransactionError } from "./errorHandler";
import { getStockConfirmation } from '@/api/axios/api';

export type StockConfirmationGetResponse = {
    confirmed?: boolean;
    message?: string;
}

interface StockConfirmation {
    stockConfirmed: boolean;
    setStockConfirmed: (state: boolean) => void;
    fetchStockConfirmed: () => Promise<StockConfirmationGetResponse>;
}

const StockConfirmationContext = createContext<StockConfirmation | undefined>(undefined);

export function StockConfirmationProvider({ children }: { children: ReactNode }) {
    const [stockConfirmed, setStockConfirmed] = useState<boolean>(true);

    const fetchStockConfirmed = async (): Promise<StockConfirmationGetResponse> => {
        try {
            const data = await getStockConfirmation();
            setStockConfirmed(data.confirmed);
            return data;
        } catch (err) {
            handleTransactionError();
            throw Error("Error fetching stockConfirmations");
        }
    }
    
    return (
        <StockConfirmationContext.Provider value={{ stockConfirmed, setStockConfirmed, fetchStockConfirmed }}>
            { children }
        </StockConfirmationContext.Provider>
    );
}

export function useStockConfirmation() {
    const context = useContext(StockConfirmationContext);
    if (!context) {
        throw new Error('useStockConfirmation must be used within a StockConfirmationProvider');
    }
    return context;
}
