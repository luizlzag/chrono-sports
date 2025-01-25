import { createPayment } from "@/api/axios/api";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { QRCodeSVG } from 'qrcode.react';
import { ClipboardCopy, Send } from 'lucide-react';
import { usePayment } from "@/context/PaymentContext";

interface CardPaymentProps {
  onBack: () => void;
  paymentMethod: string;
}

export default function CardPayment({ paymentMethod, onBack }: CardPaymentProps) {
  const { paymentLink, setPaymentLink } = usePayment();
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!paymentLink) {
      const fetchPaymentData = async () => {
        try {
          setLoading(true);
          const response = await createPayment(paymentMethod);
          setPaymentLink(response.url);
        } catch (error) {
          console.error('Erro ao criar pagamento:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPaymentData();
    }
  }, [paymentMethod, paymentLink, setPaymentLink]);

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className="text-2xl font-bold text-gray-800">Carregando...</div>
        <ClipLoader size={60} color="#111" />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg w-80 text-center">
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        QrCode para o link de pagamento por cartão
      </h1>
      <div className="flex justify-center mb-4">
        <QRCodeSVG value={paymentLink} size={200} />
      </div>
      <div className="border p-2 rounded w-full flex items-center justify-between mb-4">
        <span className="text-gray-600 text-sm truncate">{paymentLink}</span>
        <button onClick={handleCopy} className="text-blue-600 hover:text-blue-800">
          <ClipboardCopy size={20} color="#111" />
        </button>
      </div>
      {copied && <div className="text-green-600 text-sm mb-2">Copiado!</div>}
      <button
        onClick={() => window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(paymentLink)}`, '_blank')}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center w-full mb-2"
      >
        <Send size={20} className="mr-2" /> Enviar via WhatsApp
      </button>
      <button
        onClick={onBack}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
      >
        Voltar
      </button>
    </div>
  );
}
