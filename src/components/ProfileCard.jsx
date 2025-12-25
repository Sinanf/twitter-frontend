import { FaCalendarAlt, FaMapMarkerAlt, FaLink } from 'react-icons/fa';

function ProfileCard({ user }) {
  if (!user) return null;

  // Baş harfi al
  const initial = user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
      <div style={{ height: '200px', backgroundColor: '#333639', position: 'relative' }}>
        
        {/* Büyük Profil Resmi Çerçevesi */}
        <div style={{
          position: 'absolute', bottom: '-65px', left: '20px',
          width: '130px', height: '130px', borderRadius: '50%',
          border: '4px solid black', backgroundColor: 'black', overflow: 'hidden'
        }}>
           {/* AVATAR MANTIĞI */}
           {user.avatar ? (
               <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           ) : (
               <div style={{ 
                   width: '100%', height: '100%', backgroundColor: '#16181c', color: 'white', 
                   display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', fontWeight: 'bold' 
               }}>
                   {initial}
               </div>
           )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px' }}>
        <button style={{
          background: 'transparent', border: '1px solid #536471', color: 'white',
          fontWeight: 'bold', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer'
        }}>
          Profili Düzenle
        </button>
      </div>

      <div style={{ marginTop: '15px', padding: '0 20px' }}>
        <div style={{ fontSize: '24px', fontWeight: '800' }}>{user.firstName} {user.lastName}</div>
        <div style={{ color: '#71767b', fontSize: '15px' }}>@{user.email?.split('@')[0]}</div>

        <div style={{ marginTop: '15px', fontSize: '15px', lineHeight: '1.5' }}>
          Yazılım geliştirici. Kod yazmayı ve kahve içmeyi sever. ☕️
        </div>

        <div style={{ display: 'flex', gap: '15px', marginTop: '15px', color: '#71767b', fontSize: '14px' }}>
          <div style={{display:'flex', alignItems:'center', gap:'5px'}}><FaMapMarkerAlt /> İstanbul</div>
          <div style={{display:'flex', alignItems:'center', gap:'5px'}}><FaLink /> github.com</div>
          <div style={{display:'flex', alignItems:'center', gap:'5px'}}><FaCalendarAlt /> Ocak 2024 tarihinde katıldı</div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '15px', fontSize: '14px' }}>
          <span><span style={{ fontWeight: 'bold', color: 'white' }}>142</span> <span style={{ color: '#71767b' }}>Takip edilen</span></span>
          <span><span style={{ fontWeight: 'bold', color: 'white' }}>8.452</span> <span style={{ color: '#71767b' }}>Takipçi</span></span>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;