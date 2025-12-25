import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import './App.css';

function App() {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);

  const handleLogin = (authData, userData) => {
    setAuth(authData);
    setUser(userData);
  };

  const handleLogout = () => {
    setAuth(null);
    setUser(null);
  };

  return (
    <Router>
        
        <Toaster position="top-center" toastOptions={{duration: 3000}} />

        {auth ? (
          <div className="app-layout">
            <Sidebar user={user} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home auth={auth} user={user} isProfileMode={false} />} />
                <Route path="/profile" element={<Home auth={auth} user={user} isProfileMode={true} />} />
                <Route path="/explore" element={<Explore auth={auth} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        ) : (
          <div className="login-wrapper">
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        )}
    </Router>
  );
}

export default App;