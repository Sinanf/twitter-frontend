// Home.jsx
import TweetList from '../components/TweetList';

function Home({ auth, user, isProfileMode }) {
  return (
    <>
      {/* isProfileMode bilgisini TweetList'e aktarıyoruz */}
      <TweetList auth={auth} user={user} isProfileMode={isProfileMode} />
    </>
  );
}
export default Home;