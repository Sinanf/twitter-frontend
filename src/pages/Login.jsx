import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTwitter, FaApple } from 'react-icons/fa'; 
import { FcGoogle } from 'react-icons/fc'; 
import '../App.css';

/**
 * Login Bileşeni: Güncellenmiş versiyon.
 * Artık /auth/login endpoint'ine POST isteği atıyor.
 */
function Login({ onLogin }) {
  // --- LOCAL STATE (YEREL DURUM) ---
  const [email, setEmail] = useState("");     
  const [password, setPassword] = useState("");  
  const [error, setError] = useState("");      
  const navigate = useNavigate();              

  /**
   * Giriş Formu Gönderimi (Submit Handler)
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Önceki hataları temizle

    try {
      // 1. DEĞİŞİKLİK: Artık GET değil POST yapıyoruz.
      // Backend'deki 'LoginRequest' DTO'su { email, password } bekliyor.
      const res = await axios.post('http://localhost:8080/auth/login', {
        email: email,       // BURASI ÇOK ÖNEMLİ: 'username' değil 'email' gönderiyoruz!
        password: password
      });
      
      // Giriş başarılıysa Backend bize User objesini (res.data) döner.
      
      // 2. Sonraki isteklerde (Tweet atma vb.) kullanmak için şifreyi saklıyoruz.
      // Çünkü SecurityConfig 'httpBasic' kullanıyor.
      const authData = { username: email, password: password };

      // 3. App.jsx'e durumu bildir
      onLogin(authData, res.data); 
      
      // 4. Yönlendir
      navigate('/');

    } catch (err) {
      console.error("Giriş başarısız:", err);
      // Hata mesajını kullanıcıya göster
      if (err.response && err.response.status === 401) {
        setError("E-posta veya şifre hatalı.");
      } else {
        setError("Giriş yapılamadı. Sunucu hatası.");
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        
        {/* LOGO BÖLÜMÜ */}
        <div className="login-logo">
          <FaTwitter size={40} color="#e7e9ea" /> {/* Logo boyutunu ve rengini CSS ile uyumlu yaptım */}
        </div>
        
        <h2 className="login-header">Twitter'a giriş yap</h2>
        
        {/* HATA BİLDİRİMİ */}
        {error && <div className="error-text" style={{color: '#f4212e', marginBottom: '15px'}}>{error}</div>}

        {/* GİRİŞ FORMU */}
        <form onSubmit={handleLogin} className="login-form">
          <input 
            type="email" 
            placeholder="E-posta" 
            className="login-input"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Şifre" 
            className="login-input"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          
          <button type="submit" className="login-btn-primary">İleri</button>
          
          <button type="button" className="login-btn-outline" style={{marginTop:'10px'}}>Şifreni mi unuttun?</button>
        </form>

        <p className="login-footer">
          Hesabın yok mu? <span onClick={() => navigate('/register')}>Kaydol</span>
        </p>
      </div>
    </div>
  );
}

export default Login;