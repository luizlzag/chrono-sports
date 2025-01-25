import Image from 'next/image';
import { useState } from 'react';

interface PixPaymentProps {
    amount: number;
    qrCode: string;
    codigo: string;
    loading: boolean;
    pixInfo: {
        key: string;
        name: string;
        city: string;
        transactionId: string;
        message: string;
    };
    formatter: Intl.NumberFormat;
    downloadQrCode: () => void;
    onSwitchToCard: () => void;
    divRef: React.RefObject<HTMLDivElement>;
}

export default function PixPayment({
  amount,
  qrCode,
  codigo,
  loading,
  pixInfo,
  formatter,
  downloadQrCode,
  onSwitchToCard,
  divRef
}: PixPaymentProps) {
    return (
        <div ref={divRef} className="bg-white p-4 shadow-lg rounded-lg w-80 text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Pagamento via PIX</h1>
        <p className="text-gray-600">Nome: {pixInfo.name}</p>
        <p className="text-gray-600">Cidade: {pixInfo.city}</p>
        <p className="text-gray-600 mb-4">Mensagem: {pixInfo.message}</p>

        {loading ? (
            <p className="text-gray-500">Gerando QR Code...</p>
        ) : (
            <div className="mb-4">
            {qrCode ? <Image src={qrCode} alt="QR Code PIX" className="mx-auto" /> : <p className="text-red-600">Erro ao gerar QR Code</p>}
            </div>
        )}

        <p className="text-xl font-bold text-gray-800">{formatter.format(amount)}</p>

        <div className="mt-4 flex space-x-2">
            <button onClick={downloadQrCode} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">
            Baixar QR Code
            </button>
            <button onClick={() => navigator.clipboard.writeText(codigo)} className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700">
            Copiar Código PIX
            </button>
            <button onClick={onSwitchToCard} className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700">
            Venda por cartão
            </button>
        </div>
        </div>
    );
}
