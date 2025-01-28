import { createPayment } from "@/api/axios/api";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { QRCodeSVG } from "qrcode.react";
import { ClipboardCopy, Send, CheckCircle } from "lucide-react";
import { usePayment } from "@/context/PaymentContext";
import { TransactionResponse } from "@/context/TransactionContext";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useTransaction } from "@/context/TransactionContext";
import { motion } from "framer-motion";

interface CardPaymentProps {
  onBack: () => void;
  paymentMethod: string;
  transaction: TransactionResponse | null;
  router: AppRouterInstance;
}

export default function CardPayment({
  router,
  transaction,
  paymentMethod,
  onBack,
}: CardPaymentProps) {
  const { getTransaction } = useTransaction();
  const { paymentLink, setPaymentLink } = usePayment();
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false); // Estado para animação de sucesso

  useEffect(() => {
    if (!transaction) {
      alert(
        "Erro ao criar link de pagamento. Redirecionando para a página principal."
      );
      router.push("/pages/home");
      return;
    }

    if (!paymentLink) {
      const fetchPaymentData = async () => {
        setLoading(true);
        try {
          const response = await createPayment(paymentMethod, transaction);
          setPaymentLink(response.url);
        } catch (error) {
          console.error("Erro ao criar link de pagamento:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPaymentData();
    }
  }, [router, transaction, paymentMethod, paymentLink, setPaymentLink]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (transaction) {
          await getTransaction(transaction?.id);
          if (transaction?.status === "paid") {
            clearInterval(interval);
            setSuccess(true);
            setTimeout(() => router.push("/pages/home"), 3000);
          }
        } else {
          alert(
            "Erro ao atualizar transação. Redirecionando para a página principal."
          )
          router.push("/pages/home");
          return;
        }
      } catch (error) {
        console.error("Erro ao atualizar transação:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [getTransaction, router, transaction]);

  const handleCopy = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className="text-2xl font-bold text-gray-800">Carregando...</div>
        <ClipLoader size={60} color="#111" />
      </div>
    );
  }

  if (success) {
    return (
      <motion.div
        className="flex flex-col justify-center items-center min-h-screen"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
      >
        <CheckCircle size={100} className="text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">
          Pagamento realizado com sucesso!
        </h1>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg w-80 text-center">
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        QrCode para o link de pagamento por cartão
      </h1>
      <div className="flex justify-center mb-4">
        <QRCodeSVG value={paymentLink || ""} size={200} />
      </div>
      <div className="border p-2 rounded w-full flex items-center justify-between mb-4">
        <span className="text-gray-600 text-sm truncate">{paymentLink}</span>
        <button onClick={handleCopy} className="text-blue-600 hover:text-blue-800">
          <ClipboardCopy size={20} color="#111" />
        </button>
      </div>
      {copied && <div className="text-green-600 text-sm mb-2">Copiado!</div>}
      <button
        onClick={() =>
          window.open(
            `https://web.whatsapp.com/send?text=${encodeURIComponent(
              paymentLink || ""
            )}`,
            "_blank"
          )
        }
        className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 flex items-center justify-center w-full mb-2"
      >
        <Send size={20} className="mr-2" /> Enviar via WhatsApp
      </button>
      <button
        onClick={onBack}
        className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 w-full"
      >
        Voltar
      </button>
    </div>
  );
}
