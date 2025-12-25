import { useState } from 'react';
import { FaImage, FaPollH, FaSmile, FaCalendarAlt } from 'react-icons/fa';
import { tweetService } from '../api/tweetService';
import reactLogo from '../assets/react.svg';

function NewTweet({ user, authConfig, onTweetPosted }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePostTweet = async () => {
    if (!content.trim() || !user?.id) return;
    
    setLoading(true);
    try {
      await tweetService.postTweet(content.trim(), user.id, authConfig);
      setContent(""); // Kutuyu temizle
      onTweetPosted(); // Listeyi yenilemesi için haber ver
    } catch (err) {
      console.error("Tweet atma hatası:", err);
      alert("Tweet gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tweet-box">
        <img src={reactLogo} className="tweet-avatar" alt="profil" />
        <div className="input-wrapper">
            <textarea 
                className="tweet-input" 
                placeholder="Neler oluyor?!" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
            />
            <div className="tweet-tools">
                <div className="tool-icons">
                    <FaImage /><FaPollH /><FaSmile /><FaCalendarAlt />
                </div>
                <button 
                    className="tweet-btn" 
                    onClick={handlePostTweet} 
                    disabled={loading || !content.trim()}
                >
                    {loading ? "..." : "Gönder"}
                </button>
            </div>
        </div>
    </div>
  );
}

export default NewTweet;