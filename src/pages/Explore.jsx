import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { userService } from '../api/userService'; // Servis Eklendi

function Explore({ auth }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.length < 2) {
        setResults([]);
        return;
    }

    setLoading(true);
    try {
        // SERVİS KULLANIMI
        const res = await userService.searchUsers(val, { auth: auth });
        setResults(res.data);
    } catch (err) {
        console.error("Arama hatası:", err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="content-area">
        {/* Sabit Arama Çubuğu */}
        <div style={{ padding: '10px 15px', position: 'sticky', top: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9, backdropFilter: 'blur(5px)' }}>
            <div style={{ 
                display: 'flex', alignItems: 'center', backgroundColor: '#202327', 
                borderRadius: '9999px', padding: '12px 20px', color: '#71767b', border: '1px solid transparent'
            }}>
                <FaSearch />
                <input 
                    type="text" 
                    placeholder="Twitter'da Ara" 
                    value={query}
                    onChange={handleSearch}
                    style={{
                        backgroundColor: 'transparent', border: 'none', color: 'white',
                        marginLeft: '15px', outline: 'none', fontSize: '15px', width: '100%'
                    }}
                />
            </div>
        </div>

        {/* Sonuç Listesi */}
        <div style={{ marginTop: '10px' }}>
            {loading && <div style={{padding:'20px', color:'#71767b', textAlign:'center'}}>Aranıyor...</div>}
            
            {results.map(user => {
                // Her kullanıcı için baş harfi hesapla
                const initial = user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';

                return (
                    <div key={user.id} className="user-result-item" style={{
                        display: 'flex', alignItems: 'center', gap: '15px', padding: '15px',
                        borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s'
                    }}>
                        
                        {/* AVATAR MANTIĞI: Resim varsa göster, yoksa Baş Harf */}
                        {user.avatar ? (
                             <img src={user.avatar} style={{width:'40px', height:'40px', borderRadius:'50%', objectFit:'cover'}} alt="" />
                        ) : (
                            <div style={{
                                width:'40px', height:'40px', borderRadius:'50%', backgroundColor:'#333', 
                                color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:'18px'
                            }}>
                                {initial}
                            </div>
                        )}
                        
                        <div style={{flex: 1}}>
                            <div style={{fontWeight:'bold', fontSize:'15px'}}>
                                {user.firstName} {user.lastName}
                            </div>
                            <div style={{color:'#71767b', fontSize:'14px'}}>
                                @{user.email?.split('@')[0]}
                            </div>
                        </div>
                        
                        <button style={{
                            backgroundColor: 'white', color: 'black', border: 'none',
                            padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer'
                        }}>
                            Takip Et
                        </button>
                    </div>
                );
            })}
            
            {/* Sonuç Bulunamadı Mesajı */}
            {query.length >= 2 && results.length === 0 && !loading && (
                 <div style={{padding:'30px', textAlign:'center', color:'#71767b'}}>
                     "{query}" için sonuç bulunamadı.
                 </div>
            )}
        </div>
    </div>
  );
}

export default Explore;