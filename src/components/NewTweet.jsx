import { useState } from 'react';
import { FaImage, FaPollH, FaSmile, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast'; // Toast Eklendi
import { tweetService } from '../api/tweetService';

function NewTweet({ user, authConfig, onTweetPosted }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const initial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';

  const handlePostTweet = async () => {
    if (!content.trim() || !user?.id) return;
    
    setLoading(true);
    try {
      await tweetService.postTweet(content.trim(), user.id, authConfig);
      setContent(""); 
      toast.success("Tweet gönderildi!"); // BAŞARILI
      onTweetPosted(); 
    } catch (err) {
      console.error("Hata:", err);
      toast.error("Tweet gönderilemedi."); // HATA
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tweet-box">
        {user?.avatar ? ( <img src={user.avatar} className="tweet-avatar" alt="profil" /> ) : ( <div className="tweet-avatar" style={{ backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' }}>{initial}</div> )}
        <div className="input-wrapper">
            <textarea className="tweet-input" placeholder="Neler oluyor?!" value={content} onChange={(e) => setContent(e.target.value)} />
            <div className="tweet-tools">
                <div className="tool-icons"><FaImage /><FaPollH /><FaSmile /><FaCalendarAlt /></div>
                <button className="tweet-btn" onClick={handlePostTweet} disabled={loading || !content.trim()}>{loading ? "..." : "Gönder"}</button>
            </div>
        </div>
    </div>
  );
}
export default NewTweet;