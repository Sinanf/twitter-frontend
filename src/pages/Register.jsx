import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTwitter } from 'react-icons/fa';
import toast from 'react-hot-toast'; // Toast
import { authService } from '../api/authService'; // Servis
import '../App.css';

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // SERVİS KULLANIMI
      await authService.register({ firstName, lastName, email, password });
      
      toast.success("Kayıt başarılı! Giriş yapabilirsiniz."); // TOAST
      navigate('/login'); 
    } catch (err) {
      console.error("Kayıt hatası:", err);
      toast.error("Kayıt yapılamadı. Bilgileri kontrol edin."); // TOAST
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-logo"><FaTwitter size={40} color="#e7e9ea" /></div>
        <h2 className="login-header">Hesabını oluştur</h2>
        
        <form onSubmit={handleRegister} className="login-form">
          <input type="text" placeholder="Ad" className="login-input"
            value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Soyad" className="login-input"
            value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <input type="email" placeholder="E-posta" className="login-input"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Şifre" className="login-input"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          <button type="submit" className="login-btn-primary">Kaydol</button>
        </form>

        <p className="login-footer">
          Zaten bir hesabın var mı? <span onClick={() => navigate('/login')}>Giriş yap</span>
        </p>
      </div>
    </div>
  );
}
export default Register;