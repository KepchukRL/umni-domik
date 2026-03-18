import React, { useState, useEffect, useContext } from 'react';
import Header from './components/Header/Header';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Dashboard from './components/Dashboard/Dashboard';
import Settings from './components/Settings/Settings';
import History from './components/History/History';
import AdminPanel from './components/Admin/AdminPanel';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { NotificationProvider } from './contexts/NotificationContext';
import styles from './App.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('login');
  const [showRegister, setShowRegister] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('login');
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setCurrentPage('dashboard');
  };

  const handleRegisterSuccess = () => {
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderBody = () => {
    if (!isAuthenticated) {
      return showRegister ? (
        <RegisterForm 
          onSwitchToLogin={() => setShowRegister(false)} 
          onRegisterSuccess={handleRegisterSuccess}
        />
      ) : (
        <LoginForm 
          onSwitchToRegister={() => setShowRegister(true)} 
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} activePage={currentPage} />;
      case 'settings':
        return <Settings onNavigate={handleNavigate} activePage={currentPage} />;
      case 'history':
        return <History onNavigate={handleNavigate} activePage={currentPage} />;
      case 'admin':
        return user?.role === 'admin' ? (
          <AdminPanel onNavigate={handleNavigate} activePage={currentPage} />
        ) : (
          <Dashboard onNavigate={handleNavigate} activePage='dashboard' />
        );
      default:
        return <Dashboard onNavigate={handleNavigate} activePage={currentPage} />;
    }
  };

  return (
    <div className={styles.app}>
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <main className={styles.main}>
        {renderBody()}
      </main>
      
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;