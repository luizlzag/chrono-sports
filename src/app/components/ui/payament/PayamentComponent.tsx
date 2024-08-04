"use client";
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';

// Carregue o Stripe com sua Publishable Key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);


type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function PaymentCheckout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const searchParams = useSearchParams();

  const encryptData = (data: string | number, secretKey: string) => {
    return CryptoJS.AES.encrypt(String(data), secretKey).toString();
};

// Função para descriptografar
const decryptData = (ciphertext: string, secretKey: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};


  

  useEffect(() => {
    const amountParam = searchParams.get('amount');
    const cartParam = searchParams.get('cart');
    if (amountParam) {
      try {
        const decryptedAmount = decryptData(decodeURIComponent(amountParam), '/Bin/Bash#2507');
        const parsedAmount = parseFloat(decryptedAmount);

        // Verifica se a conversão foi bem-sucedida
        if (!isNaN(parsedAmount)) {
            setAmount(parsedAmount);
        } else {
            console.error('Erro ao converter o valor de amount:', decryptedAmount);
        }
    } catch (error) {
        console.error('Erro ao descriptografar amount:', error);
    }
    }
    if (cartParam) {
      // Descriptografa os dados do carrinho
      const decryptedCart = decryptData(decodeURIComponent(cartParam), '/Bin/Bash#2507');
      setCartItems(JSON.parse(decryptedCart));
  }
}, [searchParams]);

  const handlePaymentMethodChange = (method: 'card' | 'pix') => {
    setPaymentMethod(method);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setPaymentProcessing(true);

    try {
      let response;
      if (paymentMethod === 'card') {
        const cardElement = elements.getElement(CardElement);
        // Crie um método de pagamento com cartão
        const { paymentMethod: cardPaymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement!,
        });

        // Enviar dados de pagamento para a API
        response = await axios.post('/api/payment', {
          amount: amount * 100, // Converter para centavos
          currency: 'brl',
          paymentMethodId: cardPaymentMethod?.id,
          cartItems,
        });
      } else if (paymentMethod === 'pix') {
        // Lógica para pagamento via PIX
        response = await axios.post('/api/payment', {
          amount: amount * 100, // Converter para centavos
          currency: 'brl',
          paymentMethodType: 'pix',
          cartItems,
        });
      }

      if (response?.data.success) {
        alert('Pagamento realizado com sucesso!');
      } else {
        setErrorMessage('Ocorreu um erro ao processar o pagamento.');
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const router = useRouter();

  const handleCancelSale = () => {
    // Limpa os itens do carrinho
    localStorage.removeItem('cart');
    setCartItems([]);
    // Redireciona para a página inicial
    router.push('/pages/home');
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Resumo do Pedido</h2>
      <ul className="mb-4">
        {cartItems.map(item => (
          <li key={item.id} className="flex justify-between mb-2">
            <span>{item.name} (x{item.quantity})</span>
            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between font-bold text-lg mb-6">
        <span>Total:</span>
        <span>R$ {amount.toFixed(2)}</span>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Selecione o método de pagamento:</h3>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handlePaymentMethodChange('card')}
            className={`px-4 py-2 rounded-md transition duration-300 ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Cartão de Crédito
          </button>
          <button
            type="button"
            onClick={() => handlePaymentMethodChange('pix')}
            className={`px-4 py-2 rounded-md transition duration-300 ${paymentMethod === 'pix' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            PIX
          </button>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="card-element" className="block text-sm font-medium text-gray-700">
              Informações do Cartão
            </label>
            <div className="mt-1">
              <CardElement
                id="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#32325d',
                      '::placeholder': { color: '#a0aec0' },
                    },
                    invalid: { color: '#fa755a' },
                  },
                }}
                className="p-3 border rounded-md"
              />
            </div>
          </div>
          {errorMessage && <div className="text-red-600">{errorMessage}</div>}
          <button
            type="submit"
            disabled={!stripe || paymentProcessing}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-blue-700"
          >
            {paymentProcessing ? 'Processando...' : `Pagar R$${amount.toFixed(2)}`}
          </button>
        </form>
      )}

      {paymentMethod === 'pix' && (
        <div className="space-y-6">
          <p className="text-gray-800">
            O pagamento por PIX será processado. Um código QR será gerado.
          </p>
          <button
            onClick={handleSubmit}
            disabled={paymentProcessing}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-green-700"
          >
            {paymentProcessing ? 'Processando...' : `Gerar QR Code PIX`}
          </button>
          {errorMessage && <div className="text-red-600">{errorMessage}</div>}
        </div>
      )}

       {/* Botão de Cancelar Venda */}
       <div className="mt-6">
        <button
          onClick={handleCancelSale}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-red-700"
        >
          Cancelar Venda
        </button>
      </div>
    </div>
  );
}
