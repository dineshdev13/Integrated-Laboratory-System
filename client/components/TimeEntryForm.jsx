import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import './TimeEntryForm.css'; // Import the CSS file

function TimeEntryForm() {
    const [studentName, setStudentName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [entries, setEntries] = useState([]);
    const [systemDetails, setSystemDetails] = useState({ labNumber: '', systemNumber: '' });
    const [isSystemDetailsEntered, setIsSystemDetailsEntered] = useState(false);

    useEffect(() => {
        // Load system details from localStorage
        const savedLabNumber = localStorage.getItem('labNumber') || '';
        const savedSystemNumber = localStorage.getItem('systemNumber') || '';
        setSystemDetails({ labNumber: savedLabNumber, systemNumber: savedSystemNumber });

        // Check if system details are already entered
        if (savedLabNumber && savedSystemNumber) {
            setIsSystemDetailsEntered(true);
        }

        // Fetch entries data from backend when component mounts
        async function fetchEntries() {
            try {
                const response = await axios.get('http://localhost:5000/api/times');
                setEntries(response.data);
            } catch (error) {
                console.error('Error fetching entries data:', error);
            }
        }

        fetchEntries();

        // Set default start and end times
        const now = new Date();
        const defaultStartTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
        const defaultEndTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hours from now
        setStartTime(defaultStartTime);
        setEndTime(defaultEndTime);
    }, []);

    const fetchEntries = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/times');
            setEntries(response.data);
        } catch (error) {
            console.error('Error fetching entries data:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Save system details to localStorage
        localStorage.setItem('labNumber', systemDetails.labNumber);
        localStorage.setItem('systemNumber', systemDetails.systemNumber);

        try {
            await axios.post('http://localhost:5000/api/times', {
                studentname: studentName,
                rollnumber: rollNumber,
                startTime: startTime,
                endTime: endTime,
                labNumber: systemDetails.labNumber,
                systemNumber: systemDetails.systemNumber
            });
            // Handle success, e.g., show a success message or redirect
            alert('Time entry submitted successfully!');

            // Re-fetch entries and reset form fields
            fetchEntries();
            setStudentName('');
            setRollNumber('');
            const now = new Date();
            const newStartTime = new Date(now.getTime() + 5 * 60 * 60 * 1000); // 30 minutes from now
            const newEndTime = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 3 hours from now
            setStartTime(newStartTime);
            setEndTime(newEndTime);
        } catch (error) {
            console.error('Error submitting time entry:', error);
            // Handle error, e.g., display an error message to the user
            alert('Failed to submit time entry. Please try again later.');
        }
    };

    return (
        <div>
            <Helmet>
                <title>Student Laboratory Entry</title>
            </Helmet>
            <div className="time-entry-form-container">
                <h2>Student Laboratory Register</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="studentName">Student Name:</label>
                        <select
                            name="studentNameAndRollNumber"
                            id="studentNameAndRollNumber"
                            value={`${studentName}-${rollNumber}`} // Set the combined value
                            onChange={(e) => {
                                const selectedIndex = e.target.selectedIndex;
                                const selectedValue = e.target.value;
                                const [selectedStudentName, selectedRollNumber] = selectedValue.split('-'); // Split the value
                                setStudentName(selectedStudentName);
                                setRollNumber(selectedRollNumber);
                            }}
                            required
                        >
                            <option value="">Select a student</option>
                            {entries.map((entry) => (
                                <option key={entry._id} value={`${entry.studentName}-${entry.rollNumber}`}>
                                    {entry.studentName} - {entry.rollNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startTime">Start Time:</label>
                        <input
                            type="datetime-local"
                            id="startTime"
                            value={startTime.toISOString().slice(0, 16)}
                            onChange={(e) => setStartTime(new Date(e.target.value))}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="endTime">End Time:</label>
                        <input
                            type="datetime-local"
                            id="endTime"
                            value={endTime.toISOString().slice(0, 16)}
                            onChange={(e) => setEndTime(new Date(e.target.value))}
                            required
                        />
                    </div>
                    <div className="inline-fields">
                        <div>
                            <label htmlFor="labNumber">Lab Number:</label>
                            <input
                                type="text"
                                id="labNumber"
                                value={systemDetails.labNumber}
                                onChange={(e) => setSystemDetails({ ...systemDetails, labNumber: e.target.value })}
                                disabled={isSystemDetailsEntered}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="systemNumber">System Number:</label>
                            <input
                                type="text"
                                id="systemNumber"
                                value={systemDetails.systemNumber}
                                onChange={(e) => setSystemDetails({ ...systemDetails, systemNumber: e.target.value })}
                                disabled={isSystemDetailsEntered}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default TimeEntryForm;
