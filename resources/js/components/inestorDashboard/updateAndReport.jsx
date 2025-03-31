import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InvestorUpdates = () => {
    const [updates, setUpdates] = useState([]);
    const [user_id, setUserId] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        console.log("User data from localStorage:", userData);

        if (userData) {
            try {
                const user = JSON.parse(userData);
                console.log("Parsed user object:", user);
                setUserId(user.user_id);  // Set user_id
                fetchInvestorUpdates(user.user_id); // Fetch updates immediately after setting user_id
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        } else {
            console.log("No user data found in localStorage");
        }
    }, []);

    const fetchInvestorUpdates = async (userId) => {
        if (userId) {
            try {
                const response = await axios.get(`/api/investor/${userId}/updates-report`);
                setUpdates(response.data);
                console.log("Fetched updates:", response.data);
            } catch (error) {
                console.error("Error fetching updates:", error);
            }
        } else {
            console.log("No user_id found in localStorage");
        }
    };

    return (
        <div>
            <h2>Project Updates {user_id}</h2>
            <ul>
                {updates.map(update => (
                    <li key={update.id}>
                        <h3>{update.title}</h3>
                        <p>{update.description}</p>
                        {update.file_path && <a href={`/storage/${update.file_path}`} download>Download File</a>}
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InvestorUpdates;
