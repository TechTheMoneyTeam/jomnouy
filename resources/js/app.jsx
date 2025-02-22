import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Index from './router'; 

const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Index /> 
        </BrowserRouter>
    </React.StrictMode>
);