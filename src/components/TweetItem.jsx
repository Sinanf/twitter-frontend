import { useState } from 'react';
import { FaRegComment, FaRetweet, FaRegHeart, FaHeart, FaTrash } from 'react-icons/fa';
import { tweetService } from '../api/tweetService'; 
import reactLogo from '../assets/react.svg';

function TweetItem({ tweet, authConfig, currentUser, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  const handleToggleComment = async () => {
      if (!isCommentOpen) {
          setLoadingComments(true);
          try {
              const res = await tweetService.getCommentsByTweetId(tweet.id, authConfig);
              const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              setComments(sorted);
          } catch (error) {
              console.error("Yorumlar yüklenemedi", error);
          } finally {
              setLoadingComments(false);
          }
      }
      setIsCommentOpen(!isCommentOpen);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !currentUser?.id) return;
    try {
      setLoading(true);
      await tweetService.postComment(commentText, currentUser.id, tweet.id, authConfig);
      setCommentText("");
      onRefresh(); 
      
      const res = await tweetService.getCommentsByTweetId(tweet.id, authConfig);
      setComments(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      
    } catch (error) {
        console.error("Yorum gönderme hatası:", error);
      alert("Yorum gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => { await tweetService.likeTweet(tweet.id, authConfig); onRefresh(); };
  const handleRetweet = async () => { await tweetService.retweet(tweet.id, authConfig); onRefresh(); };
  const handleDelete = async () => { 
      if(!window.confirm("Sil?")) return; 
      await tweetService.deleteTweet(tweet.id, authConfig); 
      onRefresh(); 
  };

  // ÇÖZÜM 1: Avatar Kontrolü (Dinamik Avatar Gösterimi)
  const userAvatar = tweet.user?.avatar;
  const userInitial = tweet.user?.firstName ? tweet.user.firstName.charAt(0) : "U";

  // ÇÖZÜM 2: startsWith hatasını önlemek için güvenli kontrol
  const isRetweet = tweet.content && tweet.content.startsWith('RT:');

  return (
    <div style={{borderBottom: '1px solid var(--border-color)'}}>
        <div className="tweet">
            {/* AVATAR ALANI GÜNCELLENDİ */}
            {userAvatar ? (
                 <img src={userAvatar} className="tweet-avatar" alt="avatar" />
            ) : (
                <div className="tweet-avatar" style={{backgroundColor:'#333', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'bold', color:'white'}}>
                    {userInitial}
                </div>
            )}

            <div className="tweet-content">
                <div className="user-info">
                    <span className="name">{tweet.user.firstName || "Kullanıcı"}</span>
                    <span className="username">@{tweet.user.email?.split('@')[0]}</span>
                    <span className="tweet-date">{formatDate(tweet.createdAt)}</span>
                </div>
                
                <p className="tweet-text">{tweet.content}</p>
                
                <div className="tweet-actions">
                    <button className="action-btn comment" onClick={handleToggleComment}>
                        <FaRegComment /> 
                        <span style={{marginLeft: '5px', fontSize:'13px'}}>
                            {tweet.commentCount > 0 ? tweet.commentCount : ''}
                        </span>
                    </button>
                    
                    {/* HATA BURADAYDI: isRetweet değişkeni ile güvenli hale getirdik */}
                    <button className={`action-btn retweet ${isRetweet ? 'rt-active' : ''}`} onClick={handleRetweet}>
                        <FaRetweet /> <span>{tweet.retweets}</span>
                    </button>
                    
                    <button className={`action-btn like ${tweet.isLiked ? 'liked' : ''}`} onClick={handleLike}>
                        {tweet.isLiked ? <FaHeart /> : <FaRegHeart />} 
                        <span>{tweet.likes}</span>
                    </button>
                    
                    <button className="action-btn delete" onClick={handleDelete}><FaTrash /></button>
                </div>
            </div>
        </div>

        {isCommentOpen && (
            <div className="comment-area">
                <div className="comment-input-wrapper">
                    {/* Buradaki avatar da dinamik olabilir ama şimdilik logo kalsın */}
                    <img src={reactLogo} style={{width:'36px', height:'36px', borderRadius:'50%'}} alt="" />
                    <div style={{flex: 1}}>
                         <textarea 
                            className="comment-textarea" 
                            placeholder="Yanıtını gönder..." 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            autoFocus 
                        />
                        <div className="comment-footer">
                            <button className="reply-btn" onClick={handleSubmitComment} disabled={loading || !commentText.trim()}>
                                {loading ? '...' : 'Yanıtla'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="comments-list">
                    {loadingComments ? (
                        <p style={{color:'#71767b', paddingLeft:'50px', fontSize:'14px'}}>Yorumlar yükleniyor...</p>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} className="comment-item">
                                <div className="comment-avatar" style={{backgroundColor:'#333', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold'}}>
                                    {comment.userFirstName ? comment.userFirstName.charAt(0) : 'U'}
                                </div>
                                <div className="comment-body">
                                    <div className="comment-header">
                                        <span className="name">{comment.userFirstName || "Kullanıcı"}</span>
                                        <span className="username">@{comment.userEmail?.split('@')[0]}</span>
                                        <span className="date">· {formatDate(comment.createdAt)}</span>
                                    </div>
                                    <div className="comment-text">
                                        {comment.content}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}
    </div>
  );
}

export default TweetItem;