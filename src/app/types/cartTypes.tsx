export type Item = {
    id: string;
    imageUrl: string;
    name: string;
    price: number;
    quantity?: number;
    newQuantity?: number;
};

type PaymentTypes = {
    [key: string]: string;
}

export const PaymentMethod: PaymentTypes = {
    CREDIT_CARD: "Cartão de crédito",
    PIX: "Pix"
};

export const PaymentStatus: PaymentTypes = {
    paid: "Pago",
    waiting_payment: "Processando",
    pending: "Processando",
    canceled: "Cancelado",
    comission_paid: "Comissão recebida"
};
