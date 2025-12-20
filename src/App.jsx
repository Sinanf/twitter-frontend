import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import './App.css';

/**
 * App Bileşeni: Uygulamanın en üst seviye sarmalayıcısıdır.
 * Kimlik doğrulama durumunu yönetir ve rotaları bu duruma göre korur.
 */
function App() {
  // --- AUTH STATE (KİMLİK DURUMU) ---
  // auth: Kullanıcı adı ve şifreyi (Basic Auth için) tutar. null ise giriş yapılmamıştır.
  const [auth, setAuth] = useState(null); 
  // user: Backend'den dönen profil bilgilerini (firstName, email, id vb.) tutar.
  const [user, setUser] = useState(null); 

  /**
   * Giriş İşlemi: Login sayfasından gelen verilerle durumu günceller.
   * @param {Object} authData - {username, password} şeklinde Basic Auth objesi.
   * @param {Object} userData - Backend'den gelen kullanıcı profil objesi.
   */
  const handleLogin = (authData, userData) => {
    setAuth(authData);
    setUser(userData);
  };

  /**
   * Çıkış İşlemi: Kimlik bilgilerini sıfırlayarak kullanıcıyı korumalı alanın dışına atar.
   */
  const handleLogout = () => {
    setAuth(null);
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        {/* KORUMALI ROTA MANTIĞI: 
            Kullanıcı giriş yaptıysa (auth varsa) Sidebar ve İçerik alanını gösterir.
        */}
        {auth ? (
          <div className="app-layout">
            {/* Yan Menü: Kullanıcı bilgilerini ve Logout fonksiyonunu alır */}
            <Sidebar user={user} onLogout={handleLogout} />
            
            <div className="content-area">
              <Routes>
                {/* Ana Akış Sayfası */}
                <Route path="/" element={<Home auth={auth} user={user} />} />
                {/* Bilinmeyen rotaları ana sayfaya yönlendirir */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        ) : (
          /* GİRİŞ YAPILMAMIŞ ALAN (Public Area):
             Kullanıcı giriş yapmamışsa sadece Login sayfasını görür.
          */
          <div className="landing-wrapper">
            <Routes>
              {/* Giriş Sayfası */}
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              {/* Login harici her isteği otomatik olarak /login sayfasına çeker */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;