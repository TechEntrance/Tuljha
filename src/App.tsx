import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Organizations from './pages/Organizations';
import FoodOrders from './pages/FoodOrders';
import Invoices from './pages/Invoices';
import Expenses from './pages/Expenses';
import Downloads from './pages/Downloads';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/" element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/organizations" element={
                <PrivateRoute>
                  <Layout>
                    <Organizations />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/food-orders" element={
                <PrivateRoute>
                  <Layout>
                    <FoodOrders />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/invoices" element={
                <PrivateRoute>
                  <Layout>
                    <Invoices />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/expenses" element={
                <PrivateRoute>
                  <Layout>
                    <Expenses />
                  </Layout>
                </PrivateRoute>
              } />
              <Route path="/downloads" element={
                <PrivateRoute>
                  <Layout>
                    <Downloads />
                  </Layout>
                </PrivateRoute>
              } />
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white'
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;