import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Index from './router'; // Import the router (where you defined the routes)

const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Index /> {/* Renders the routes */}
    </BrowserRouter>
  </React.StrictMode>
);
