import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileProvider from './context/profile';
import { AuthContextProvider } from './context/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
