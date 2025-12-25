import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTwitter } from 'react-icons/fa';
import '../App.css'; // Aynı CSS'leri kullanıyoruz

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Backend artık 4 parametre bekliyor: Ad, Soyad, Email, Şifre
      await axios.post('http://localhost:8080/auth/register', {
        firstName,
        lastName,
        email,
        password
      });
      
      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      navigate('/login'); // Başarılı olunca Login'e at
    } catch (err) {
      console.error("Kayıt hatası:", err);
      setError("Kayıt yapılamadı. Bilgileri kontrol edin.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        
        <div className="login-logo">
          <FaTwitter size={50} color="#1d9bf0" />
        </div>
        
        <h2 className="login-header">Hesabını oluştur</h2>
        
        {error && <div className="error-text">{error}</div>}

        <form onSubmit={handleRegister} className="login-form">
          
          {/* GÜNCELLEME: Ad ve Soyad artık yan yana değil, alt alta ve tam genişlikte */}
          
          <input 
            type="text" 
            placeholder="Ad" 
            className="login-input"
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            required 
          />

          <input 
            type="text" 
            placeholder="Soyad" 
            className="login-input"
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            required 
          />

          {/* Diğer inputlar aynı kalıyor */}
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