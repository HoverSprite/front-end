import React, { useEffect, useState } from 'react';
import { fetchQRCode } from '../../service/DataService';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Oval } from 'react-loader-spinner'; // Ensure you have this package installed
import { API_URL } from '../../utils/axiosConfig';


const QRCodeComponent = ({ orderId, content }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const order_id = searchParams.get('orderId');

    useEffect(() => {
        const fetchQR = async (userId, orderId) => {
            try {
                const api = API_URL + `/otp/verify/${orderId}`;
                const data = await fetchQRCode(orderId, api);
                setQrCodeUrl(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load QR code.');
                setLoading(false);
            }
        };

        fetchQR(1, order_id);
    }, [orderId, content]);

    return (
        <div style={{
            padding: '0',
            margin: '0',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                margin: '20px',
                padding: '20px',
                width: '55%',
                height: 'auto',
                maxWidth: '500px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #00796b', // Darker border for contrast
                borderRadius: '12px',
                boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
                backgroundColor: '#ffffff',
                transition: 'transform 0.3s, box-shadow 0.3s',
                ':hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                }
            }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Oval color="#00796b" height={50} width={50} /> {/* Loading spinner */}
                        <p style={{ margin: '10px 0', fontSize: '18px', color: '#555' }}>Loading QR code...</p>
                    </div>
                ) : error ? (
                    <p style={{ margin: '0', fontSize: '18px', color: 'red' }}>{error}</p>
                ) : (
                    <img src={qrCodeUrl} alt="QR Code" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }} />
                )}
            </div>
        </div>
    );
};

export default QRCodeComponent;
