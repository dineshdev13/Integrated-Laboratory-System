import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';

import './QrCodePage.css'; // Import external CSS file

function QrCode({ onScanSuccess }) {
    const scannerRef = useRef(null);

    useEffect(() => {
        if (!scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner('reader', {
                qrbox: {
                    width: 250,
                    height: 250,
                },
                fps: 5,
            });

            scannerRef.current.render(success, error);
        }

        function success(result) {
            onScanSuccess(result);
        }

        function error(err) {
            console.warn(err);
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error('Failed to clear scanner:', error);
                });
                scannerRef.current = null;
            }
        };
    }, [onScanSuccess]);

    return <div id="reader" className="qr-code-scanner"></div>;
}

function QrCodeNewPage() {
    const [scanResult, setScanResult] = useState(null);
    const [manualName, setManualName] = useState('');
    const [manualRollNumber, setManualRollNumber] = useState('');
    const [submittedName, setSubmittedName] = useState('');
    const [submittedRollNumber, setSubmittedRollNumber] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (scanResult) {
            const [scannedName, scannedRollNumber] = scanResult.split('$');
            submitData(scannedName, scannedRollNumber);
        }
    }, [scanResult]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        submitData(manualName, manualRollNumber);
    };

    const submitData = (name, roll) => {
        try {
            axios.post('http://localhost:5000/api/servernew', {
                Name: name,
                Numbers: roll
            }).then(response => {
                console.log('Data posted successfully:', response.data);
                setSubmittedName(name);
                setSubmittedRollNumber(roll);
            });
        } catch (error) {
            console.error('Error submitting time entry:', error);
            alert('Failed to submit time entry. Please try again later.');
        }
    };

    return (
        <div className="qr-page-container">
            <Navbar />
            <h2>Enter New Student Details</h2>
            <div className="qr-page-content">
                <div className="manual-entry">
                    <form onSubmit={handleFormSubmit}>
                        <label>
                            Student Name:
                            <input
                                type="text"
                                value={manualName}
                                onChange={(e) => setManualName(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Roll Number:
                            <input
                                type="text"
                                value={manualRollNumber}
                                onChange={(e) => setManualRollNumber(e.target.value)}
                                required
                            />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                    {submittedName && submittedRollNumber && (
                        <div className="last-submitted">
                            <p>Last Submitted:</p>
                            <p>Name: {submittedName}</p>
                            <p>Roll Number: {submittedRollNumber}</p>
                        </div>
                    )}
                </div>
                <QrCode onScanSuccess={setScanResult} />
            </div>
        </div>
    );
}

export default QrCodeNewPage;
