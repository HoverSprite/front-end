import axios from "axios";
export const API_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


export const getPersonList = async () => {
    const response = await fetch('http://localhost:8080/persons');
    const data = await response.json();
    console.log(data);
    return data;
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export const verify = async (url) => {
    const custom_api = axios.create({
        baseURL: url,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // let otc = localStorage.getItem("otc");
    let otc = "658197";
    try {
        await delay(1000);
        const response = await custom_api.post(``, { otp: otc });
        return response;
    } catch (error) {
        console.log("Error verifying: " + error);
    }
}


export const fetchQRCode = async (userId, orderId, content) => {
    try {
        const response = await api.get(`/user/${userId}/otp/qr/${orderId}?content=${encodeURIComponent(content)}`, {
            responseType: 'arraybuffer', // Important to handle binary data
        });

        const imageBlob = new Blob([response.data], { type: 'image/png' });
        const imageObjectURL = URL.createObjectURL(imageBlob);

        return imageObjectURL; // Return the image URL
    } catch (error) {
        console.error('Error fetching QR code: ', error);
        throw error; // Optionally throw the error to be handled by the caller
    }
};

export const sendUpdatedOrderToAPI = async (updatedOrder) => {
    try {
        console.log(updatedOrder)
        const response = await api.put(`/user/2/receptionist/orders/${updatedOrder.id}`, updatedOrder);
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
    }
};

export const getListOfOrders = async () => {
    try {
        return await api.get('/user/1/farmer/orders');
    } catch (error) {
        console.error('Error updating order:', error);
    }
};

export const getOrderDetails = async (orderId) => {
    try {
        return await api.get(`/user/1/farmer/orders/${orderId}`);
    } catch (error) {
        console.error('Error get detail order:', error);
    }
}

export const fetchAvailableSprayersAPI = async (user_id, order_id) => {
    return await api.get(`/user/${user_id}/receptionist/orders/${order_id}/available-sprayers`);
};

export const sendFeedbackToAPI = async (user_id, order_id, feedback) => {
    return await api.post(`/user/${user_id}/orders/${order_id}/feedbacks/`,feedback);
}

export const verifyEmail = async (email) => {
    return await api.get(`/auth/email?email=${email}`);
}

export const createAcount = async(account) => {
    return await api.post(`/auth/signup`, account);
}

export const login = async(credential) => {
    return await api.post(`/auth/signin`, credential);
}