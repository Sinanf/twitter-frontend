import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

// Servis fonksiyonlarını dışarı açıyoruz
export const tweetService = {
  // Tüm tweetleri çek
  getAllTweets: (authConfig) => {
    return axios.get(`${BASE_URL}/tweet`, authConfig);
  },

  // Kullanıcıya özel tweetleri çek
  getUserTweets: (userId, authConfig) => {
    return axios.get(`${BASE_URL}/tweet/findByUserId/${userId}`, authConfig);
  },

  // Tweet at
  postTweet: (content, userId, authConfig) => {
    return axios.post(`${BASE_URL}/tweet`, { content, userId }, authConfig);
  },

  // Like at
  likeTweet: (id, authConfig) => {
    return axios.post(`${BASE_URL}/like/${id}`, {}, authConfig);
  },

  // Retweet yap
  retweet: (id, authConfig) => {
    return axios.post(`${BASE_URL}/retweet/${id}`, {}, authConfig);
  },

  // Tweet sil
  deleteTweet: (id, authConfig) => {
    return axios.delete(`${BASE_URL}/tweet/${id}`, authConfig);
  },

  // Yorum yap
  postComment: (content, userId, tweetId, authConfig) => {
    const payload = { content, userId, tweetId };
    return axios.post(`${BASE_URL}/comment`, payload, authConfig);
  },

  // ... diğer metodların altına ekle:

  // Bir tweet'e ait yorumları getir
  getCommentsByTweetId: (tweetId, authConfig) => {
    // NOT: Backend Controller'ında bu endpointin (/comment/tweet/{id}) tanımlı olduğundan emin ol.
    // Eğer endpointin farklıysa (örn: /tweet/{id}/comments) burayı ona göre düzeltmelisin.
    return axios.get(`${BASE_URL}/comment/tweet/${tweetId}`, authConfig);
  },

  // Kullanıcı Arama
  searchUsers: (query) => {
    // Auth config gerektirmez (veya istersen ekleyebilirsin, public olsun şimdilik)
    return axios.get(`${BASE_URL}/user/search?query=${query}`);
  }
};
