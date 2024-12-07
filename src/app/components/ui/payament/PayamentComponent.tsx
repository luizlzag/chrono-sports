'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { QrCodePix } from 'qrcode-pix';
import domtoimage from 'dom-to-image';

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function SimplePixPayment() {
  const [qrCode, setQrCode] = useState<string>(''); // QR Code gerado em base64
  const [codigo, setCodigo] = useState<string>(''); // Código payload do PIX
  const [amount, setAmount] = useState<number>(0); // Valor recebido via URL
  const [loading, setLoading] = useState<boolean>(false); // Indicador de carregamento
  const divRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();

  // Informações fixas do PIX
  const pixInfo = {
    key: '48904663806', // Chave PIX
    name: 'Chrono Sports', // Nome
    city: 'São José do Rio Preto', // Cidade
    transactionId: `Chrono-${Date.now()}`, // Identificador único
    message: 'Pagamento do pedido', // Mensagem opcional
  };

  // Processar o valor do pagamento vindo da URL
  useEffect(() => {
    const amountParam = searchParams.get('amount');
    if (amountParam) {
      const parsedAmount = parseFloat(amountParam);
      if (!isNaN(parsedAmount)) {
        setAmount(parsedAmount);
      } else {
        console.error('Erro ao converter o valor de amount:', amountParam);
      }
    } else {
      console.error('O parâmetro amount está vazio ou ausente.');
    }
  }, [searchParams]);

  // Função para gerar o QR Code PIX
  async function generatePix() {
    try {
      setLoading(true); // Exibir indicador de carregamento
      const qrcodePix = QrCodePix({
        version: '01',
        key: pixInfo.key,
        name: pixInfo.name,
        city: pixInfo.city,
        transactionId: pixInfo.transactionId,
        message: pixInfo.message,
        value: amount,
      });

      const raw = qrcodePix.payload(); // Código PIX para ser copiado
      const base64 = await qrcodePix.base64(); // QR Code em base64
      setQrCode(base64);
      setCodigo(raw);
    } catch (error) {
      console.error('Erro ao gerar o QR Code PIX:', error);
    } finally {
      setLoading(false); // Ocultar indicador de carregamento
    }
  }

  // Gerar o QR Code assim que o valor do pagamento for carregado
  useEffect(() => {
    if (amount > 0) {
      generatePix();
    }
  }, [amount]);

  // Função para baixar o QR Code como imagem
  function downloadQrCode() {
    if (!divRef.current) return;

    domtoimage.toPng(divRef.current).then((url: string) => {
      const link = document.createElement('a');
      link.download = 'pix-qrcode.png';
      link.href = url;
      link.click();
    }).catch((error) => {
      console.error('Erro ao baixar o QR Code:', error);
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div
        ref={divRef}
        className="bg-white p-4 shadow-lg rounded-lg w-80 text-center"
      >
        <h1 className="text-xl font-bold text-gray-800 mb-4">Pagamento via PIX</h1>
        <p className="text-gray-600">Nome: {pixInfo.name}</p>
        <p className="text-gray-600">Cidade: {pixInfo.city}</p>
        <p className="text-gray-600 mb-4">Mensagem: {pixInfo.message}</p>
        {loading ? (
          <p className="text-gray-500">Gerando QR Code...</p>
        ) : (
          <div className="mb-4">
            {qrCode ? (
              <img src={qrCode} alt="QR Code PIX" className="mx-auto" />
            ) : (
              <p className="text-red-600">Erro ao gerar QR Code</p>
            )}
          </div>
        )}
        <p className="text-xl font-bold text-gray-800">
          {formatter.format(amount)}
        </p>
      </div>
      <div className="mt-4 flex space-x-4">
        <button
          onClick={downloadQrCode}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Baixar QR Code
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(codigo)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Copiar Código PIX
        </button>
      </div>
    </div>
  );
}
