import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { BlockchainProvider } from '@/contexts/BlockchainContext';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import TransactionsPage from '@/pages/TransactionsPage';
import BlockchainPage from '@/pages/BlockchainPage';
import SecurityPage from '@/pages/SecurityPage';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <AuthProvider>
      <BlockchainProvider>
        <Router>
          <div className="min-h-screen">
            <Helmet>
              <title>BlockBank - Secure Blockchain Banking</title>
              <meta name="description" content="Experience the future of banking with our secure blockchain-powered platform. Manage your digital assets with confidence." />
            </Helmet>
            
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/transactions" 
                element={
                  <ProtectedRoute>
                    <TransactionsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/blockchain" 
                element={
                  <ProtectedRoute>
                    <BlockchainPage />
                  </ProtectedRoute>
                } 
              />
               <Route 
                path="/security" 
                element={
                  <ProtectedRoute>
                    <SecurityPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            
            <Toaster />
          </div>
        </Router>
      </BlockchainProvider>
    </AuthProvider>
  );
}

export default App;