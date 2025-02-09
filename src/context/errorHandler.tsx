import toast from "react-hot-toast";

export function handleTransactionError() {
    toast.error('Ocorreu um erro inesperado. Avise o adminstrador e tente novamente mais tarde!', {
        duration: 4000,
        position: "top-right",
        style: {
            background: "#ff4d4d",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "10px",
        },
    });
}
