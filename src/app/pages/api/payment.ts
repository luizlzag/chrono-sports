// pages/api/payment.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20', // Verifique a versão atual na documentação do Stripe
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { amount, currency, paymentMethodId } = req.body;

      // Criação do pagamento
      const paymentIntent = await stripe.paymentIntents.create({
        amount, // Valor em centavos
        currency, // Exemplo: 'brl'
        payment_method: paymentMethodId,
        confirm: true,
      });

      res.status(200).json({ success: true, paymentIntent });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
