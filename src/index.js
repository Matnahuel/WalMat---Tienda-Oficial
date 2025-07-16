import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { ToastContainer } from 'react-toastify';

import { CarritoProvider } from './context/CarritoContext';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </React.StrictMode>
);