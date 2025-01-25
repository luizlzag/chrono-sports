import { Suspense } from "react";
import PaymentPage from "./PaymentPage";
import { PaymentProvider } from "@/context/PaymentContext";

const Page = () => {
    return (
        <PaymentProvider>
            <Suspense fallback={<div>Carregando...</div>}>
                <PaymentPage />
            </Suspense>
        </PaymentProvider>
    );
}

export default Page;
