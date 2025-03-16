import axios from "axios";

const apiLink = "https://new-muay-thai-sales-api.vercel.app";

const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token de autenticação não encontrado.");
    return token;
};

const fetchData = async (endpoint, requiresAuth = true) => {
    const headers = requiresAuth ? { Authorization: getToken() } : {};
    const res = await axios.get(`${apiLink}${endpoint}`, { headers });
    return res.data;
};

const postData = async (endpoint, data, requiresAuth = true) => {
    const headers = {
        "Content-Type": "application/json",
        ...(requiresAuth && { Authorization: getToken() }),
    };
    const res = await axios.post(`${apiLink}${endpoint}`, JSON.stringify(data), { headers });
    return res.data;
};

const putData = async (endpoint, data, requiresAuth = true) => {
    const headers = {
        "Content-Type": "application/json",
        ...(requiresAuth && { Authorization: getToken() }),
    };
    const res = await axios.put(`${apiLink}${endpoint}`, JSON.stringify(data), { headers });
    return res.data;
};

const deleteData = async (endpoint, requiresAuth = true) => {
    const headers = requiresAuth ? { Authorization: getToken() } : {};
    const res = await axios.delete(`${apiLink}${endpoint}`, { headers });
    return res.data;
};

// Login
export const login = async (email, password) => {
    try {
        const res = await axios.post(`${apiLink}/auth/login`, { email, password });
        const { token, user } = res.data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        return res.data;
    } catch (err) {
        const error = err;
        return error.response?.data || { error: "Erro ao buscar dados" };
    }
};

// Produtos
export const getProducts = async () => fetchData("/products");

// Estoque
export const getStock = async () => {
    const gymId = JSON.parse(localStorage.getItem("user") || "{}")?.gymId;
    return fetchData(`/stock/gym/${gymId}`);
};

// Metas
export const getGoals = async () => {
    const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
    return fetchData(`/goals/${userId}`);
};

// Vendas
export const getSales = async () => {
    const gymId = JSON.parse(localStorage.getItem("user") || "{}")?.gymId;
    return fetchData(`/sales/gym/${gymId}`);
};

// Criar Pagamento
export const createPayment = async (paymentType, transaction) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!transaction || !user) {
        return { error: "Ocorreu um erro ao realizar o pagamento." };
    }

    const data = {
        userId: user.id,
        gymId: user.gymId,
        transactionId: transaction.id,
        paymentType,
        productsData: transaction.cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        })),
    };

    return postData("/payment", data);
};

// Transações
export const getRecentTransaction = async () => fetchData("/transaction/active");
export const createTransaction = async (transactionData) => postData("/transaction", transactionData);
export const updateTransaction = async (transactionId, transactionData) => putData(`/transaction/${transactionId}`, transactionData);
export const getTransaction = async (transactionId) => fetchData(`/transaction/${transactionId}`);
export const getTransactions = async () => fetchData("/transaction");
export const deleteTransaction = async (transactionId) => deleteData(`/transaction/${transactionId}`);

// Confirmação de Estoque
export const getStockConfirmation = async () => fetchData("/stock-confirmation/confirmation");
export const createStockConfirmation = async (createData) => postData("/stock-confirmation/confirmation", createData);
