import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTwitter, FaApple } from 'react-icons/fa'; 
import { FcGoogle } from 'react-icons/fc'; 
import '../App.css';

/**
 * Login Bileşeni: Kullanıcı kimlik doğrulama işlemlerini ve giriş arayüzünü yönetir.
 * @param {Function} onLogin - Başarılı giriş sonrası kullanıcı bilgilerini üst bileşene (App.jsx) ileten fonksiyon.
 */
function Login({ onLogin }) {
  // --- LOCAL STATE (YEREL DURUM) ---
  const [email, setEmail] = useState("");     // Kullanıcı e-posta girişi
  const [password, setPassword] = useState("");  // Kullanıcı şifre girişi
  const [error, setError] = useState("");      // Hata mesajlarını tutan durum
  const navigate = useNavigate();              // Sayfa yönlendirme hook'u

  /**
   * Giriş Formu Gönderimi (Submit Handler)
   * Formun varsayılan yenilenme davranışını durdurur ve backend ile haberleşir.
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engeller
    try {
      // Basic Auth için kimlik bilgilerini hazırlar
      const authData = { username: email, password: password };
      
      // Backend'deki '/auth/me' uç noktasına, kimlik bilgileriyle GET isteği atarak kullanıcıyı doğrular
      const userResponse = await axios.get('http://localhost:8080/auth/me', { auth: authData });
      
      // Doğrulama başarılıysa:
      // 1. Üst bileşendeki state'i (auth ve kullanıcı verisi) günceller
      onLogin(authData, userResponse.data); 
      // 2. Kullanıcıyı ana sayfaya yönlendirir
      navigate('/');
    } catch (err) {
      // Doğrulama başarısızsa hata detayını loglar ve kullanıcıya uyarı gösterir
      console.error("Giriş başarısız:", err);
      setError("Giriş başarısız. Bilgilerinizi kontrol edin.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        
        {/* LOGO BÖLÜMÜ: Marka kimliği */}
        <div className="login-logo">
          <FaTwitter size={120} color="#1d9bf0" />
        </div>
        
        <h2 className="login-header">Twitter'a giriş yap</h2>
        
        {/* SOSYAL GİRİŞ BUTONLARI: (Şu an için sadece görsel tasarım) */}
        <div className="social-buttons">
          <button className="social-btn google-btn">
            <FcGoogle size={22} /> Google ile kaydolun
          </button>
          
          <button className="social-btn apple-btn">
            <FaApple size={22} color="black" /> Apple ile kaydolun
          </button>
        </div>

        {/* AYRAÇ: Sosyal giriş ve Form arası görsel bölücü */}
        <div className="separator">
          <span>veya</span>
        </div>

        {/* HATA BİLDİRİMİ: Sadece hata varsa görüntülenir */}
        {error && <div className="error-text">{error}</div>}

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
          
          {/* İLERİ BUTONU: Form submit işlemini tetikler */}
          <button type="submit" className="login-btn-primary">İleri</button>
          
          <button type="button" className="login-btn-outline">Şifreni mi unuttun?</button>
        </form>

        {/* KAYIT YÖNLENDİRMESİ */}
        <p className="login-footer">
          Hesabın yok mu? <span onClick={() => navigate('/register')}>Kaydol</span>
        </p>
      </div>
    </div>
  );
}

export default Login;