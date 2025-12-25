import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'; // YENİ IMPORT
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
      <div className="app-container">
        {auth ? (
          <div className="app-layout">
            <Sidebar user={user} onLogout={handleLogout} />
            <div className="content-area">
              <Routes>
                <Route path="/" element={<Home auth={auth} user={user} isProfileMode={false} />} />
                <Route path="/profile" element={<Home auth={auth} user={user} isProfileMode={true} />} />
                <Route path="/explore" element={<Explore auth={auth} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        ) : (
          <div className="landing-wrapper">
            <Routes>
              {/* Giriş Yapmamış Kullanıcılar İçin Rotalar: */}
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register />} /> {/* ARTIK ÇALIŞACAK */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;