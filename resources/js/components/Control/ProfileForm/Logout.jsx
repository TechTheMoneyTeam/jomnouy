import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
       
        localStorage.clear();
        
       
        navigate('/');
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl">Logging out...</h1>
        </div>
    );
};

export default Logout;