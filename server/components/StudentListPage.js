import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Pagination from './Pagination'; // Import Pagination component
import './StudentListPage.css'; // Import external CSS file

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} - ${day}-${month}-${year}`;
}

function StudentListPage() {
    const [entries, setEntries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(10); // Display 10 entries per page
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchEntries() {
            try {
                const response = await axios.get('http://localhost:5000/api/server');
                setEntries(response.data);
            } catch (error) {
                console.error('Error fetching entries data:', error);
            }
        }

        fetchEntries();
    }, []);

    // Get current entries for the current page
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="page-container">
            <Helmet>
                <title>Student Laboratory Register</title>
            </Helmet>
            <Navbar />
            <h2 className="page-title">Entries List</h2>
            <div className="table-container">
                <table className="entry-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Roll Number</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Lab No</th> {/* New column */}
                            <th>System No</th> {/* New column */}
                        </tr>
                    </thead>
                    <tbody>
                        {currentEntries.map(entry => (
                            <tr key={entry._id}>
                                <td>{entry.studentname}</td>
                                <td>{entry.rollnumber}</td>
                                <td>{formatDateTime(entry.startTime)}</td>
                                <td>{formatDateTime(entry.endTime)}</td>
                                <td>{entry.labNumber}</td> {/* Render Lab No */}
                                <td>{entry.systemNumber}</td> {/* Render System No */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                entriesPerPage={entriesPerPage}
                totalEntries={entries.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
}

export default StudentListPage;
