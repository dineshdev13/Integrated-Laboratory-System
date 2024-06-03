import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav style={{ backgroundColor: '#dddddd', padding: '10px', display: 'flex'}}>
            <div>
                <Link to="/" style={{ marginRight: '10px', color: '#333' }}>Scan QR Code</Link>
                <Link to="/New-Qr-Scan" style={{ marginRight: '10px', color: '#333' }}>New QR Code Scanner</Link>
                <Link to="/student-list" style={{ color: '#333' }}>Student List</Link>
            </div>
        </nav>
    );
}

export default Navbar;
