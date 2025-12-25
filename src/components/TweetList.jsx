import { useEffect, useState } from 'react';
import { tweetService } from '../api/tweetService';
import TweetItem from './TweetItem';
import NewTweet from './NewTweet';
import ProfileCard from './ProfileCard';

function TweetList({ auth, user, isProfileMode }) {
  const [tweets, setTweets] = useState([]);
  
  // Auth yapılandırması
  const authConfig = auth ? { auth: auth } : null;

  // Tweetleri çeker, sıralar ve formatlar
  const fetchTweets = async () => {
    if (!authConfig) return;

    try {
      // Profil modu mu yoksa genel akış mı?
      const promise = (isProfileMode && user?.id)
        ? tweetService.getUserTweets(user.id, authConfig)
        : tweetService.getAllTweets(authConfig);

      const res = await promise;

      // Tarihe göre sırala (Yeniden eskiye)
      const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Frontend formatına uygun hale getir (Data Mapping)
      const formattedTweets = sorted.map(t => ({
          id: t.id, 
          content: t.content || "", 
          likes: t.likeCount,
          retweets: t.retweetCount || 0,
          commentCount: t.commentCount || 0,
          isLiked: t.isLikedByMe,
          createdAt: t.createdAt, 
          user: { 
              firstName: t.userFirstName, 
              email: t.userEmail,
              avatar: t.userAvatar
          }
      }));
      
      setTweets(formattedTweets);
      
    } catch (err) {
      console.error("Tweet yükleme hatası:", err);
    }
  };

  // Mod veya kullanıcı değişince listeyi yenile
  useEffect(() => {
    fetchTweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfileMode, user?.id]);

  return (
    <div className="content-area">
      {/* Yapışkan Başlık */}
      <div className="header" style={{position:'sticky', top:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(12px)', zIndex:9}}>
          {isProfileMode ? user?.firstName : "Anasayfa"}
      </div>
      
      {/* Profil Kartı veya Tweet Atma Kutusu */}
      {isProfileMode ? (
          <ProfileCard user={user} />
      ) : (
        <div style={{borderBottom: '1px solid var(--border-color)'}}>
            <NewTweet 
                user={user} 
                authConfig={authConfig} 
                onTweetPosted={fetchTweets} 
            />
        </div>
      )}

      {/* Tweet Listesi */}
      {tweets.map((tweet, index) => (
        <TweetItem 
            // ID yoksa index kullanarak çökmesini engelle (Defansif Kodlama)
            key={tweet.id ? tweet.id : `fallback-${index}`} 
            tweet={tweet} 
            authConfig={authConfig}
            currentUser={user}
            onRefresh={fetchTweets} 
        />
      ))}
    </div>
  );
}

export default TweetList;