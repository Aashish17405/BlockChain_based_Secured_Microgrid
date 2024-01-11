import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './Authcontext'; // Assuming this is the path to your AuthContext

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
 </React.StrictMode>
);