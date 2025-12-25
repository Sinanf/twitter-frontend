import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTwitter } from 'react-icons/fa'; 
import toast from 'react-hot-toast'; 
import { authService } from '../api/authService'; 
import '../App.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState("");     
  const [password, setPassword] = useState("");  
  const navigate = useNavigate();              

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ARTIK SERVİS KULLANIYORUZ
      const res = await authService.login(email, password);
      
      onLogin({ username: email, password }, res.data); 
      
      toast.success("Giriş başarılı!"); // BAŞARILI BİLDİRİMİ
      navigate('/');
    } catch (err) {
      console.error("Giriş hatası:", err);
      // HATA BİLDİRİMİ
      if (err.response && err.response.status === 401) {
        toast.error("E-posta veya şifre hatalı.");
      } else {
        toast.error("Giriş yapılamadı. Sunucu hatası.");
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-logo"><FaTwitter size={40} color="#e7e9ea" /></div>
        <h2 className="login-header">Twitter'a giriş yap</h2>
        
        <form onSubmit={handleLogin} className="login-form">
          <input type="email" placeholder="E-posta" className="login-input"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Şifre" className="login-input"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
          
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