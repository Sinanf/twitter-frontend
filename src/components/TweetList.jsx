import { useEffect, useState } from 'react';
import { tweetService } from '../api/tweetService';
import TweetItem from './TweetItem';
import NewTweet from './NewTweet';
import ProfileCard from './ProfileCard';

function TweetList({ auth, user, isProfileMode }) {
  const [tweets, setTweets] = useState([]);
  
  // Ref kullanarak auth bilgisini hafızada tutuyoruz (Döngüyü engeller)
  const authConfig = auth ? { auth: auth } : null;

  // Veri çekme fonksiyonu
  const fetchTweets = async () => {
    if (!authConfig) return;

    try {
      // Hangi servis kullanılacak?
      const promise = (isProfileMode && user?.id)
        ? tweetService.getUserTweets(user.id, authConfig)
        : tweetService.getAllTweets(authConfig);

      const res = await promise;

      // --- DEBUG İÇİN LOG (Konsolu kontrol et) ---
      // console.log("Gelen Tweetler:", res.data);

      // Sıralama
      const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Veriyi formatla
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
      console.error("Tweet listesi hatası:", err);
    }
  };

  // --- SONSUZ DÖNGÜ ÖNLEYİCİ ---
  // useEffect sadece bu değerler değiştiğinde çalışsın:
  useEffect(() => {
    fetchTweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfileMode, user?.id]); // authConfig'i bilerek buraya koymuyoruz, loop yapmasın.

  return (
    <div className="content-area">
      <div className="header" style={{position:'sticky', top:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(12px)', zIndex:9}}>
          {isProfileMode ? user?.firstName : "Anasayfa"}
      </div>
      
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

      {tweets.map((tweet, index) => (
        <TweetItem 
            // ÇÖZÜM: Eğer tweet.id varsa onu kullan, yoksa veya çakışıyorsa index kullan (Hata vermez)
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