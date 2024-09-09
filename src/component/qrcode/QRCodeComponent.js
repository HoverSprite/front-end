import React, { useEffect, useState } from 'react';
import { API_URL, fetchQRCode } from '../../service/DataService';

const QRCodeComponent = ({ orderId, content }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        const fetchQR = async (userId, orderId) => {
            const api = API_URL + `/user/${userId}/otp/verify/${orderId}`;
            const data = await fetchQRCode(userId, orderId, api)
            setQrCodeUrl(data)
        };

        fetchQR(1, 1);
    }, [orderId, content]);

    return (
        <div style={{ margin: '0', padding: '0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            ) : (
                <p>Loading QR code...</p>
            )}
        </div>
    );
};

export default QRCodeComponent;
