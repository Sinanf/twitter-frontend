import TweetList from '../components/TweetList';

function Home({ auth, user, isProfileMode }) {
  return (
    // Profil modu veya Anasayfa akışı TweetList içinde yönetilir
    <TweetList auth={auth} user={user} isProfileMode={isProfileMode} />
  );
}

export default Home;