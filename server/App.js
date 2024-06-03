import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import QrCodePage from './components/QrCodePage';
import StudentListPage from './components/StudentListPage';
import QrCodeNewPage from './components/QrCodeNewPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<QrCodePage />} />
                <Route path="/New-Qr-Scan" element={<QrCodeNewPage />} />
                <Route path="/student-list" element={<StudentListPage />} />
            </Routes>
        </Router>
    );
}

export default App;
