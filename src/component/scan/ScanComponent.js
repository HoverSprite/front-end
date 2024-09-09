import React, { useEffect, useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { verify } from '../../service/DataService';
import './ScanComponent.css'; // Ensure this includes spinner styles

function ScanComponent() {
    const [scanResult, setScanResult] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleScan = (data) => {
        if (data && data.text && !scanned) {
            setScanResult(data.text);
            setScanned(true);
            setLoading(true); // Start loading spinner
        }
    };

    const handleError = (error) => {
        console.error(error);
        // Handle the error appropriately
    };

    useEffect(() => {
        const handleVerification = async () => {
            if (scanned) {
                try {
                    const result = await verify(scanResult);
                    if (result.status === 200) {
                        // TODO: Handle successful verification
                        console.log("Verification successful");
                    }
                } catch (error) {
                    console.error('Verification failed:', error);
                } finally {
                    setLoading(false); // Stop loading spinner
                }
            }
        };

        handleVerification();
    }, [scanned, scanResult]);

    return (
        <div className="scan-container">
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className="scan-content">
                <h2 className="scan-title">Scan the QR Code</h2>
                <QrScanner
                    delay={300}
                    style={{ width: '100%', maxWidth: '500px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
                    onError={handleError}
                    onScan={handleScan}
                />
                <p className="scan-instructions">Please align the QR code within the frame to scan.</p>
            </div>
        </div>
    );
}

export default ScanComponent;
