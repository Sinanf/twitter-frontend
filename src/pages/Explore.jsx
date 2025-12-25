import { useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import reactLogo from '../assets/react.svg';

// 'auth' prop'unu parametre olarak alıyoruz
function Explore({ auth }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    
    // 2 harften azsa arama yapma
    if (val.length < 2) {
        setResults([]);
        return;
    }

    setLoading(true);
    try {
        // İŞTE ÇÖZÜM BURADA:
        // İsteği atarken 'auth' bilgisini gönderiyoruz.
        // Backend artık bizi tanıyacak ve cevap verecek.
        const res = await axios.get(`http://localhost:8080/user/search?query=${val}`, {
            auth: auth // App.jsx'ten gelen {username, password} bilgisi
        });
        
        setResults(res.data);
    } catch (err) {
        console.error("Arama hatası:", err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="content-area">
        {/* Arama Çubuğu */}
        <div style={{ padding: '10px 15px', position: 'sticky', top: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9, backdropFilter: 'blur(5px)' }}>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#202327', 
                borderRadius: '9999px', 
                padding: '12px 20px',
                color: '#71767b',
                border: '1px solid transparent'
            }}>
                <FaSearch />
                <input 
                    type="text" 
                    placeholder="Twitter'da Ara" 
                    value={query}
                    onChange={handleSearch}
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'white',
                        marginLeft: '15px',
                        outline: 'none',
                        fontSize: '15px',
                        width: '100%'
                    }}
                />
            </div>
        </div>

        {/* Sonuç Listesi */}
        <div style={{ marginTop: '10px' }}>
            {loading && <div style={{padding:'20px', color:'#71767b', textAlign:'center'}}>Aranıyor...</div>}
            
            {results.map(user => (
                <div key={user.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '15px',
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                }}
                className="user-result-item"
                // Üzerine gelince veya tıklayınca efekt eklenebilir
                >
                    <img src={user.avatar || reactLogo} style={{width:'40px', height:'40px', borderRadius:'50%', objectFit:'cover'}} alt="" />
                    
                    <div style={{flex: 1}}>
                        {/* ARTIK GERÇEK İSİMLERİ GÖSTERİYORUZ */}
                        <div style={{fontWeight:'bold', fontSize:'15px'}}>
                            {user.firstName} {user.lastName}
                        </div>
                        <div style={{color:'#71767b', fontSize:'14px'}}>
                            @{user.email?.split('@')[0]}
                        </div>
                    </div>
                    
                    <button style={{
                        backgroundColor: 'white',
                        color: 'black',
                        border: 'none',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}>Takip Et</button>
                </div>
            ))}
            
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