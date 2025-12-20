import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FaRegComment, FaRetweet, FaRegHeart, FaHeart, FaTrash, FaImage, FaPollH, FaSmile, FaCalendarAlt } from 'react-icons/fa';
import '../App.css';
import reactLogo from '../assets/react.svg';

// user prop'unun eklendiğinden emin ol
function TweetList({ auth, user }) {
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const authConfig = useMemo(() => auth ? { auth: auth } : null, [auth]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  // fetchTweets fonksiyonunu bu şekilde güncelle:
  const fetchTweets = useCallback(() => {
    if (!authConfig) return;
    axios.get('http://localhost:8080/tweet', authConfig)
      .then(res => {
        // 1. KESİN SIRALAMA: En yeni tarih en üstte
        const sorted = [...res.data].sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // 2. VERİ EŞLEŞTİRME: Backend'den gelen retweetCount'u retweets'e bağla
        const formattedTweets = sorted.map(t => ({
          id: t.id,
          content: t.content,
          likes: t.likeCount,
          retweets: t.retweetCount || 0, // Eğer null gelirse 0 yaz
          isLiked: t.isLikedByMe,
          createdAt: t.createdAt,
          user: {
            firstName: t.userFirstName,
            email: t.userEmail
          }
        }));

        setTweets(formattedTweets);
      })
      .catch(() => console.error("Tweetler yüklenemedi."));
  }, [authConfig]);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  const handleLike = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.post(`http://localhost:8080/like/${id}`, {}, authConfig);
      fetchTweets();
    } catch {
      console.error("Like hatası.");
    }
  };

  const handleRetweet = async (tweetContent, e) => {
    e.stopPropagation();
    // userId kontrolü: Backend save metodu için zorunludur
    if (!tweetContent || !user?.id) return;
    try {
      const rtPayload = {
        content: `RT: ${tweetContent}`,
        userId: user.id
      };
      await axios.post('http://localhost:8080/tweet', rtPayload, authConfig);
      fetchTweets();
    } catch (err) {
      console.error("RT hatası:", err.response?.data);
    }
  };

  const handlePostTweet = async () => {
    if (!content.trim() || !user?.id) return;
    setLoading(true);
    try {
      const payload = {
        content: content.trim(),
        userId: user.id
      };
      await axios.post('http://localhost:8080/tweet', payload, authConfig);
      setContent("");
      fetchTweets();
    } catch (err) {
      console.error("Tweet atma hatası:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Silmek istediğine emin misin?")) return;
    try {
      await axios.delete(`http://localhost:8080/tweet/${id}`, authConfig);
      fetchTweets();
    } catch {
      alert("Silme yetkiniz yok.");
    }
  };

  return (
    <div className="content-area">
      <div className="header">Anasayfa</div>

      <div className="tweet-box">
        <img src={reactLogo} className="tweet-avatar" alt="profil" />
        <div className="input-wrapper">
          <textarea className="tweet-input" placeholder="Neler oluyor?!" value={content} onChange={(e) => setContent(e.target.value)} />
          <div className="tweet-tools">
            <div className="tool-icons">
              <FaImage /> <FaPollH /> <FaSmile /> <FaCalendarAlt />
            </div>
            <button className="tweet-btn" onClick={handlePostTweet} disabled={loading}>Gönder</button>
          </div>
        </div>
      </div>

      {tweets.map(tweet => (
        <div key={tweet.id} className="tweet">
          <img src={reactLogo} className="tweet-avatar" alt="avatar" />
          <div className="tweet-content">
            <div className="user-info">
              <span className="name">{tweet.user.firstName || "Kullanıcı"}</span>
              <span className="username">@{tweet.user.email?.split('@')[0]}</span>
              <span className="tweet-date">{formatDate(tweet.createdAt)}</span>
            </div>
            <p className="tweet-text">{tweet.content}</p>
            <div className="tweet-actions">
              <button className="action-btn comment"><FaRegComment /> 0</button>

              {/* RT BUTONU VE SAYISI */}
              <button
                className={`action-btn retweet ${tweet.content.startsWith('RT:') ? 'rt-active' : ''}`}
                onClick={(e) => handleRetweet(tweet.content, e)}
              >
                <FaRetweet />
                {/* Buradaki değişkenin 'retweets' (yukarıdaki map ile aynı) olduğuna emin ol */}
                <span>{tweet.retweets}</span>
              </button>

              <button
                className={`action-btn like ${tweet.isLiked ? 'liked' : ''}`}
                onClick={(e) => handleLike(tweet.id, e)}
              >
                {tweet.isLiked ? <FaHeart color="#f91880" style={{ fill: '#f91880' }} /> : <FaRegHeart />}
                <span>{tweet.likes}</span>
              </button>

              <button className="action-btn delete" onClick={(e) => handleDelete(tweet.id, e)}>
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TweetList;