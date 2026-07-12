import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileProvider from './context/profile';
import { AuthContextProvider } from './context/auth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
