import axios from "axios";

const apiLink = "https://new-muay-thai-sales-api.vercel.app";

export const login = async (email, password) => {
    try {
        const res = await axios.post(apiLink+'/auth/login', { email, password });
        const { token, user } = res.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        return res.data;    
    } catch (err) {
        return err.response.data;
    }
}

export const getProducts = async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get(apiLink+'/products', {
            headers: {
                Authorization: `${token}`
            }
        });
        return res.data;
    } catch (err) {
        return err.response.data;
    }
}

export const getStock = async () => {
    try {
        const token = localStorage.getItem('token');
        const gymId = JSON.parse(localStorage.getItem('user')).gymId;
        const res = await axios.get(apiLink+'/stock/gym/'+gymId, {
            headers: {
                Authorization: `${token}`
            }
        });
        return res.data;
    } catch (err) {
        return err.response.data;
    }
}

export const getGoals = async () => {
    try {
        const token = localStorage.getItem('token');
        const idUser = JSON.parse(localStorage.getItem('user')).id;
        const res = await axios.get(apiLink+'/goals/'+idUser, {
            headers: {
                Authorization: `${token}`
            }
        });
        return res.data;
    } catch (err) {
        return err.response.data;
    }
}

export const getSales = async () => {
    try {
        const token = localStorage.getItem('token');
        const gymId = JSON.parse(localStorage.getItem('user')).gymId;
        const res = await axios.get(apiLink+'/sales/gym/'+gymId, {
            headers: {
                Authorization: `${token}`
            }
        });
        return res.data;
    } catch (err) {
        return err.response.data;
    }
}

export const createPayment = async (paymentType, transaction) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!transaction || !user || !token) {
        return { error: 'Ocorreu um erro ao realizar o pagamento. Tente novamente' };
    }

    let productsData = transaction.cart.map(item => {
        return {
            productId: item.id,
            quantity: item.quantity
        }
    });

    let data = JSON.stringify({
        userId: user.id,
        gymId: user.gymId,
        transactionId: transaction.id,
        paymentType: paymentType,
        productsData: productsData
    });

    let headers = {
        headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json'
        }
    };

    const res = await axios.post(apiLink+'/payment', data, headers);
    return res.data;
}

export const getRecentTransaction = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(apiLink+'/transaction/active', {
        headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json'
        }
    });
    return res.data;
}

export const createTransaction = async (transactionData) => {
    const token = localStorage.getItem('token');
    const data = JSON.stringify(transactionData);
    let headers = {
        headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json'
        }
    };

    const res = await axios.post(apiLink+'/transaction', data, headers);
    return res.data;
}

export const updateTransaction = async (transactionData, transactionId) => {
    const token = localStorage.getItem('token');
    const data = JSON.stringify(transactionData);
    let headers = {
        headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json'
        }
    };

    const res = await axios.put(apiLink+'/transaction/'+transactionId, data, headers);
    return res.data;
}

export const getTransaction = async (transactionId) => {
    const token = localStorage.getItem('token');
    const res = await axios.get(apiLink+'/transaction/'+transactionId, {
        headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json'
        }
    });
    return res.data;
}

export const getTransactions = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(apiLink+'/transaction', {
        headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json'
        }
    });
    return res.data;
}

export const deleteTransaction = async (transactionId) => {
    const token = localStorage.getItem('token');
    const res = await axios.delete(apiLink+'/transaction/'+transactionId, {
        headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json'
        }
    });
    return res.data;
}
