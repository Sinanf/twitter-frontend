import { Link } from 'react-router-dom';
import { FaTwitter, FaHome, FaHashtag, FaUser, FaSignOutAlt } from 'react-icons/fa';

function Sidebar({ user, onLogout }) {
  const navItemStyle = { 
    textDecoration: 'none', color: 'white', display: 'flex', 
    alignItems: 'center', gap: '15px', padding: '12px', fontSize: '20px', fontWeight: '500' 
  };

  // Baş harfi al (Yoksa 'U' olsun)
  const initial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="sidebar">
      <div style={{ padding: '12px' }}>
        <FaTwitter size={30} color="var(--twitter-blue)" />
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <Link to="/" className="nav-item" style={navItemStyle}>
          <FaHome size={26} /> <span>Anasayfa</span>
        </Link>
        <Link to="/explore" className="nav-item" style={navItemStyle}>
           <FaHashtag size={26} /> <span>Keşfet</span>
        </Link>
        <Link to="/profile" className="nav-item" style={navItemStyle}>
            <FaUser size={26} /> <span>Profil</span>
        </Link>
      </nav>

      {user && (
        <div onClick={onLogout} className="sidebar-user-card" style={{ 
            marginTop: 'auto', marginBottom: '20px', display: 'flex', alignItems: 'center', 
            gap: '12px', padding: '12px', background: '#16181c', borderRadius: '9999px', cursor: 'pointer' 
        }}>
          {/* AVATAR MANTIĞI: Resim varsa göster, yoksa Baş Harf */}
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt="Avatar" 
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #333' }} 
            />
          ) : (
            <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', background: '#333', 
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' 
            }}>
                {initial}
            </div>
          )}

          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: '700', whiteSpace: 'nowrap' }}>{user.firstName}</div>
            <div style={{ color: '#71767b', fontSize: '13px' }}>@{user.email?.split('@')[0]}</div>
          </div>

          <FaSignOutAlt color="#f4212e" />
        </div>
      )}
    </div>
  );
}

export default Sidebar;