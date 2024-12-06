import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import { AuthProvider } from './contexts/AuthContext';
import ProfilePage from './pages/ProfilePage';
import UserDashboard from './pages/UserDashboard';
import VotingPage from './pages/VotingPage';
import AdminDashboard from './pages/AdminDashboard';
import ElectionCreationPage from './pages/ElectionCreationPage';
import { AdminReportPage } from './pages/AdminReportPage';
import UserReportPage from './pages/UserReportPage';
import SecurityDashboard from './pages/SecuirtyDashboard';
import PublicDashboard from './pages/PublicDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicDashboard />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/vote" element={<VotingPage />} />
          <Route path="/create-election" element={<ElectionCreationPage />} />
          <Route path="/admin-report" element={<AdminReportPage />} />
          <Route path="/user-report" element={<UserReportPage />} />
          <Route path="/secuirity" element={<SecurityDashboard />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
