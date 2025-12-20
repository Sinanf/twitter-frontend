import { Link } from 'react-router-dom';
import { FaTwitter, FaHome, FaHashtag, FaUser, FaSignOutAlt } from 'react-icons/fa';
import reactLogo from '../assets/react.svg';

/**
 * Sidebar Bileşeni
 * @param {Object} user - Giriş yapmış kullanıcının bilgilerini tutar
 * @param {Function} onLogout - Çıkış yapma işlemini tetikleyen fonksiyon
 */
function Sidebar({ user, onLogout }) {
  return (
    <div className="sidebar">
      {/* Twitter Logo Bölümü */}
      <div style={{ padding: '12px' }}>
        <FaTwitter size={30} color="var(--twitter-blue)" />
      </div>

      {/* Ana Navigasyon Menüsü */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link to="/" className="nav-item" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '15px', padding: '10px' }}>
          <FaHome size={26} /> 
          <span style={{ fontSize: '20px', fontWeight: '500' }}>Anasayfa</span>
        </Link>
        
        <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', cursor: 'pointer' }}>
          <FaHashtag size={26} /> 
          <span style={{ fontSize: '20px', fontWeight: '500' }}>Keşfet</span>
        </div>
        
        <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', cursor: 'pointer' }}>
          <FaUser size={26} /> 
          <span style={{ fontSize: '20px', fontWeight: '500' }}>Profil</span>
        </div>
      </nav>

      {/* Kullanıcı Profil Kartı ve Çıkış Bölümü */}
      {/* Sadece kullanıcı login olduğunda görüntülenir */}
      {user && (
        <div 
          onClick={onLogout} 
          className="sidebar-user-card"
          style={{ marginTop: 'auto', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#16181c', borderRadius: '9999px', cursor: 'pointer' }}
        >
          {/* Kullanıcı Avatarı */}
          <img src={reactLogo} style={{ width: '40px', height: '40px', border: '1px solid var(--twitter-blue)', borderRadius: '50%', padding: '2px' }} alt="Avatar" />
          
          {/* Kullanıcı Bilgileri (Ad ve Email'den türetilen Username) */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: '700', whiteSpace: 'nowrap' }}>{user.firstName || "Kullanıcı"}</div>
            <div style={{ color: 'var(--text-gray)', fontSize: '13px' }}>@{user.email?.split('@')[0]}</div>
          </div>
          
          {/* Çıkış Yap İkonu */}
          <FaSignOutAlt color="red" />
        </div>
      )}
    </div>
  );
}

export default Sidebar;