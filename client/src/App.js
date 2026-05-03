import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import BookVehicle from './pages/BookVehicle';
import BookingSuccess from './pages/BookingSuccess';

// Protected Route
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={styles.loading}>Loading... ⏳</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

const styles = {
  loading: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '100vh', fontSize: '24px'
  }
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/client/dashboard" element={
            <ProtectedRoute role="client">
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/owner/dashboard" element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/client/book/:id" element={
            <ProtectedRoute role="client">
              <BookVehicle />
            </ProtectedRoute>
          } />
          <Route path="/client/booking-success" element={
            <ProtectedRoute role="client">
              <BookingSuccess />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;