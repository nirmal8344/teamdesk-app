import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Deals from './pages/Deals';
import Contacts from './pages/Contacts';
import Tasks from './pages/Tasks';
import { User } from './types';
import AIChatAssistant from './components/AIChatAssistant';
import LoginPage from './pages/LoginPage';
import Settings from './pages/Settings';
import ActivityFeed from './pages/ActivityFeed';
import Team from './pages/Team';
import Products from './pages/Products';
import Reports from './pages/Reports';
import Bookmarks from './pages/Bookmarks';
import Customization from './pages/Customization';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import * as authService from './services/authService';
import * as api from './services/api';

const MainLayout: React.FC<{ user: User, onUserUpdate: (user: User) => void, onLogout: () => void }> = ({ user, onUserUpdate, onLogout }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="md:ml-64 transition-all duration-300 ease-in-out">
                <Header 
                    user={user}
                    onLogout={onLogout} 
                    onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
                />
                <main className="p-4 md:p-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/activity" element={<ActivityFeed />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/leads" element={<Leads />} />
                        <Route path="/deals" element={<Deals />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/bookmarks" element={<Bookmarks />} />
                        <Route path="/customization" element={<Customization />} />
                        <Route path="/settings" element={<Settings user={user} onUserUpdate={onUserUpdate} />} />
                        {/* Redirect any other nested routes to the dashboard */}
                        <Route path="/*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
            <AIChatAssistant />
        </div>
    );
};


const App: React.FC = () => {
    const [authStatus, setAuthStatus] = useState<'checking' | 'loggedIn' | 'loggedOut'>('checking');
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            // In a real app, you'd verify a token here
            const isLoggedIn = authService.isAuthenticated();
            if (isLoggedIn) {
                try {
                    const user = await api.getCurrentUser();
                    setCurrentUser(user);
                    setAuthStatus('loggedIn');
                } catch {
                    // Token might be invalid
                    authService.logout();
                    setAuthStatus('loggedOut');
                }
            } else {
                setAuthStatus('loggedOut');
            }
        };
        checkAuth();
    }, []);

    const handleLogin = async () => {
        // After successful login API call
        const user = await api.getCurrentUser();
        setCurrentUser(user);
        setAuthStatus('loggedIn');
    };

    const handleLogout = async () => {
        await authService.logout();
        setCurrentUser(null);
        setAuthStatus('loggedOut');
    };
    
    const handleUserUpdate = (updatedUser: User) => {
        setCurrentUser(updatedUser);
    };

    if (authStatus === 'checking') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <HashRouter>
            <Routes>
                {authStatus === 'loggedIn' && currentUser ? (
                     <Route path="/*" element={<MainLayout user={currentUser} onUserUpdate={handleUserUpdate} onLogout={handleLogout} />} />
                ) : (
                    <>
                        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                        <Route path="/register" element={<RegisterPage onRegister={handleLogin} />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                )}
            </Routes>
        </HashRouter>
    );
};

export default App;
