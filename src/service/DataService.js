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

/**
 * Fetch user ID and role by email
 * @param {string} email - The email address of the user to look up.
 * @returns {Promise<Object>} - The user ID and role.
 */
export const getUserIdByEmail = async (email) => {
    try {
        const response = await api.get(`/user-id?email=${encodeURIComponent(email)}`);
        console.log('User ID and Role:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user ID by email:', error);
        throw error;
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

// Modified to fetch assigned orders with coordinates for sprayer
export const getAssignedOrdersWithCoordinates = async () => {
    try {
        const response = await api.get('/orders/assigned-orders');
        return response.data;
    } catch (error) {
        console.error('Error fetching assigned orders with coordinates:', error);
        throw error;
    }
};

// Modified to fetch all orders for the current sprayer
export const viewAssignedOrders = async () => {
    try {
        const response = await api.get('/orders/orders');  // Uses the new "/orders/orders" endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching assigned orders:', error);
        throw error;
    }
};
