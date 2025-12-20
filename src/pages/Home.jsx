import TweetList from '../components/TweetList';

/**
 * Home Sayfa Bileşeni
 * Giriş yapmış kullanıcıların ana akışı (Feed) gördüğü temel sayfa yapısıdır.
 * * @param {Object} auth - Backend istekleri için gerekli temel kimlik doğrulama objesi
 * @param {Object} user - Giriş yapan kullanıcının profil detayları (id, firstName, vb.)
 */
function Home({ auth, user }) {
  return (
    <>
      {/* TweetList bileşeni, asıl API çağrılarını ve listeleme mantığını yönetir.
          Home bileşeni burada bir 'container' görevi görerek gerekli propları aşağı aktarır (Prop Drilling).
      */}
      <TweetList auth={auth} user={user} />
    </>
  );
}

export default Home;