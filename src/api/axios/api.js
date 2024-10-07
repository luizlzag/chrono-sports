import axios from "axios";

const apiLink = "https://muay-thai-sales-api.vercel.app";

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

export const getSalles = async () => {
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