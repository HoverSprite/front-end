import axiosInstance, { noTokenApi } from './../utils/axiosConfig';
// Use the configured axios instance
const api = axiosInstance;
const no_token_api_data = noTokenApi;


export const getPersonList = async () => {
    try {
        const response = await api.get('/persons');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching person list:', error);
        throw error;
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const verify = async (url) => {
    const custom_api = axiosInstance.create({
        baseURL: url,
    });

    let otc = "658197";
    try {
        await delay(1000);
        const response = await custom_api.post('', { otp: otc });
        return response;
    } catch (error) {
        console.log("Error verifying: " + error);
        throw error;
    }
}

export const fetchQRCode = async (orderId, content) => {
    try {
        const response = await api.get(`/otp/qr/${orderId}?content=${encodeURIComponent(content)}`, {
            responseType: 'arraybuffer',
        });

        const imageBlob = new Blob([response.data], { type: 'image/png' });
        return URL.createObjectURL(imageBlob);
    } catch (error) {
        console.error('Error fetching QR code: ', error);
        throw error;
    }
};

// Modified to accept user
export const sendUpdatedOrderToAPI = async (updatedOrder) => {
    try {
        const response = await api.put(`/orders/${updatedOrder.id}`, updatedOrder);
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
};

export const sendCreateOrderToAPI = async (createdOrder) => {
    try {
        const response = await api.post(`/orders`, createdOrder);
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
};
// Modified to accept user
export const getListOfOrders = async () => {
    try {
        const response = await api.get('/orders');
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
    }
};

export const getOrderDetails = async (orderId) => {
    try {
        return await api.get(`/orders/${orderId}`);
    } catch (error) {
        console.error('Error get detail order:', error);
    }
}

export const fetchAvailableSprayersAPI = async (order_id) => {
    return await api.get(`/orders/${order_id}/available-sprayers`);
};

export const sendFeedbackToAPI = async (order_id, feedback) => {
    return await api.post(`/orders/${order_id}/feedbacks/`, feedback);
}

export const verifyEmail = async (email) => {
    return await no_token_api_data.get(`/auth/email?email=${email}`);
}
