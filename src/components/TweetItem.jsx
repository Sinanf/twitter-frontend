import { useState } from 'react';
import { FaRegComment, FaRetweet, FaRegHeart, FaHeart, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast'; 
import { tweetService } from '../api/tweetService'; 

function TweetItem({ tweet, authConfig, currentUser, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));
  };

  const handleToggleComment = async () => {
      if (!isCommentOpen) {
          setLoadingComments(true);
          try {
              const res = await tweetService.getCommentsByTweetId(tweet.id, authConfig);
              setComments(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
          } catch (error) {
              console.error("Yorum hatası:", error);
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
      toast.success("Yanıt gönderildi!");
      onRefresh(); 
      const res = await tweetService.getCommentsByTweetId(tweet.id, authConfig);
      setComments(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Hata:", error);
      toast.error("Yorum gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => { await tweetService.likeTweet(tweet.id, authConfig); onRefresh(); };
  const handleRetweet = async () => { 
      await tweetService.retweet(tweet.id, authConfig); 
      toast.success("Retweetlendi!");
      onRefresh(); 
  };
  const handleDelete = async () => { 
      if(window.confirm("Bu tweeti silmek istiyor musunuz?")) {
          await tweetService.deleteTweet(tweet.id, authConfig); 
          toast.success("Tweet silindi.");
          onRefresh(); 
      }
  };

  // --- AVATAR MANTIĞI DÜZENLEMESİ ---
  // Artık tweet avatarı için resim etiketini (img) devre dışı bırakıp, 
  // yorumlardaki gibi doğrudan baş harf dairesini kullanıyoruz.
  const userInitial = tweet.user?.firstName ? tweet.user.firstName.charAt(0).toUpperCase() : "U";
  const isRetweet = tweet.content && tweet.content.startsWith('RT:');
  const currentUserInitial = currentUser?.firstName ? currentUser.firstName.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{borderBottom: '1px solid var(--border-color)'}}>
        <div className="tweet">
            {/* BURASI DÜZELTİLDİ: Artık img etiketi yok, doğrudan yorumlardaki yapı geldi */}
            <div className="tweet-avatar" style={{backgroundColor:'#333', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'bold', color:'white'}}>
                {userInitial}
            </div>

            <div className="tweet-content">
                <div className="user-info">
                    <span className="name">{tweet.user.firstName || "Kullanıcı"}</span>
                    <span className="username">@{tweet.user.email?.split('@')[0]}</span>
                    <span className="tweet-date">{formatDate(tweet.createdAt)}</span>
                </div>
                <p className="tweet-text">{tweet.content}</p>
                <div className="tweet-actions">
                    <button className="action-btn comment" onClick={handleToggleComment}>
                        <FaRegComment /> <span style={{marginLeft: '5px', fontSize:'13px'}}>{tweet.commentCount > 0 ? tweet.commentCount : ''}</span>
                    </button>
                    <button className={`action-btn retweet ${isRetweet ? 'rt-active' : ''}`} onClick={handleRetweet}>
                        <FaRetweet /> <span>{tweet.retweets > 0 ? tweet.retweets : ''}</span>
                    </button>
                    <button className={`action-btn like ${tweet.isLiked ? 'liked' : ''}`} onClick={handleLike}>
                        {tweet.isLiked ? <FaHeart /> : <FaRegHeart />} <span>{tweet.likes > 0 ? tweet.likes : ''}</span>
                    </button>
                    <button className="action-btn delete" onClick={handleDelete}><FaTrash /></button>
                </div>
            </div>
        </div>

        {isCommentOpen && (
            <div className="comment-area">
                <div className="comment-input-wrapper">
                    {/* Yanıt kutusu avatarı da harfe çekildi */}
                    <div style={{width:'36px', height:'36px', borderRadius:'50%', backgroundColor:'#333', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>
                        {currentUserInitial}
                    </div>
                    <div style={{flex: 1}}>
                         <textarea 
                            className="comment-textarea" 
                            placeholder="Yanıtını gönder..." 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault(); 
                                    handleSubmitComment();
                                }
                            }}
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
                    {loadingComments ? ( <p style={{color:'#71767b', paddingLeft:'50px', fontSize:'14px'}}>Yorumlar yükleniyor...</p> ) : ( comments.map(comment => (
                            <div key={comment.id} className="comment-item">
                                {/* Yorumlar kısmındaki çalışan yapı korunuyor */}
                                <div className="comment-avatar" style={{backgroundColor:'#333', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold'}}>
                                    {comment.userFirstName ? comment.userFirstName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="comment-body">
                                    <div className="comment-header">
                                        <span className="name">{comment.userFirstName || "Kullanıcı"}</span>
                                        <span className="username">@{comment.userEmail?.split('@')[0]}</span>
                                        <span className="date">· {formatDate(comment.createdAt)}</span>
                                    </div>
                                    <div className="comment-text">{comment.content}</div>
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