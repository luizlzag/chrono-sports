'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { QrCodePix } from 'qrcode-pix';
import { useRouter } from 'next/navigation';
import { useTransaction, TransactionResponse } from '@/context/TransactionContext';
import domtoimage from 'dom-to-image';
import PixPayment from '../../components/ui/payment/PixPayment';
import CardPayment from '../../components/ui/payment/CardPayment';

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function PaymentPage() {
    const router = useRouter();
    const { transaction } = useTransaction();
    const divRef = useRef<HTMLDivElement | null>(null);

    const [cart, setCart] = useState<TransactionResponse | null>(null);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
    const [qrCode, setQrCode] = useState<string>('');
    const [codigo, setCodigo] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Informações fixas do PIX
    const pixInfo = useMemo(() => ({
        key: '48904663806',
        name: 'Chrono Sports',
        city: 'São José do Rio Preto',
        transactionId: `Chrono-${Date.now()}`,
        message: 'Pagamento do pedido',
    }), []);

    const generatePix = useCallback(async (value: number) => {
        try {
            setLoading(true);
            const qrcodePix = QrCodePix({
                version: '01',
                key: pixInfo.key,
                name: pixInfo.name,
                city: pixInfo.city,
                transactionId: pixInfo.transactionId,
                message: pixInfo.message,
                value,
            });
        
            const raw = qrcodePix.payload();
            const base64 = await qrcodePix.base64();
            setQrCode(base64);
            setCodigo(raw);
        } catch (error) {
            console.error('Erro ao gerar o QR Code PIX:', error);
        } finally {
            setLoading(false);
        }
    }, [pixInfo]);

    // Função para baixar QR Code como imagem
    function downloadQrCode() {
        console.log('Baixando QR Code...');
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
    
    useEffect(() => {
        if (!transaction) {
            alert('Nenhum pedido encontrado. Redirecionando para a página inicial...');
            router.push('/pages/home');
            return;
        };

        setCart(transaction);
        const parsedAmount = parseFloat(transaction?.totalAmount);

        setTotalAmount(parsedAmount);
        generatePix(parsedAmount);

    }, [router, transaction, generatePix]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        {paymentMethod === "PIX" ? (
            <PixPayment
                amount={totalAmount}
                qrCode={qrCode}
                codigo={codigo}
                loading={loading}
                pixInfo={pixInfo}
                formatter={formatter}
                downloadQrCode={downloadQrCode}
                onSwitchToCard={() => setPaymentMethod("CREDIT_CARD")}
                divRef={divRef}
            />
        ) : (
            <CardPayment router={router} transaction={cart} paymentMethod={paymentMethod} onBack={() => setPaymentMethod("PIX")} />
        )}
        </div>
    );
}
