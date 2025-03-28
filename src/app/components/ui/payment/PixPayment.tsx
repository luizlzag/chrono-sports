import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { TransactionResponse } from "@/context/TransactionContext";
import { SendWhatsAppMessage } from "@/app/utils/Common";

const chavePix = "00.000.000/0000-00";
const qrCodePixImage = "/pix.png";

interface PixPaymentProps {
  transaction: TransactionResponse | null;
  onBack: (status: string|null) => void;
}

export default function PixPayment({ transaction, onBack }: PixPaymentProps) {

  return (
    <motion.div
      className="bg-white p-6 shadow-xl rounded-lg w-full max-w-sm mx-auto text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button 
        onClick={() => onBack(null)} 
        className="flex items-center text-gray-600 hover:text-gray-800 transition"
      >
        <ArrowLeft size={24} />
        <span className="ml-2">Voltar</span>
      </button>

      <h1 className="text-2xl font-semibold text-gray-800 mb-3">Pagamento via PIX</h1>
      <p className="text-gray-600 text-sm">Cliente: <span className="font-medium">{transaction?.customerName}</span></p>

      <div className="mt-4 mb-4 bg-gray-100 p-4 rounded-lg">
        {qrCodePixImage ? (
          <img 
            src={qrCodePixImage} 
            alt="QR Code PIX" 
            className="mx-auto rounded-md shadow-sm" 
            width={220} 
            height={220} 
          />
        ) : (
          <p className="text-red-600">Erro ao gerar QR Code</p>
        )}
      </div>

      <p className="text-xl font-bold text-gray-800 mb-3">Total: R$ {transaction?.totalAmount}</p>

      <div className="flex flex-col gap-3 mt-4">
        <button 
          onClick={() => SendWhatsAppMessage(chavePix)} 
          className="flex items-center justify-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Enviar chave PIX WhatsApp
        </button>
        <button 
          onClick={() => onBack("cancel")} 
          className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Cancelar Transação
        </button>
        <button 
          onClick={() => onBack("processing")} 
          className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Pagamento Recebido
        </button>
      </div>
    </motion.div>
  );
}
