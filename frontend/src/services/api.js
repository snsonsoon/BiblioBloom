import axios from "axios";
const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // FastAPI 백엔드 주소
  headers: {
    "Content-Type": "application/json",
  },
});

// 회원가입 요청
export const signup = async (userData) => {
  const response = await api.post("/user/signup", userData);
  return response.data;
};
// 로그인 요청
export const login = async (credentials) => {
  const response = await api.post("/user/login", credentials, { withCredentials: true });
  return response.data;
};
// 로그아웃 요청
export const logout = async () => {
  const response = await api.post("/user/logout", {}, { withCredentials: true }); // 쿠키 삭제
  return response.data;
};
// 사용자 리뷰 통계 API
export const getUserReviewStatistics = async (userId) => {
  const response = await api.get(`/statistics/get_user_review_statistics/${userId}`);
  return response.data;
};
// 장르 비율 API
export const getGenreRatio = async (userId) => {
  const response = await api.get(`/statistics/get_genre_ratio/${userId}`);
  return response.data;
};
// TopReaders API 호출
export const getTopReaders = async () => {
  const response = await api.get("/statistics/top_users_by_books_read");
  return response.data;
};

export const getRecommendedBooks = async () => {
  const response = await api.get("/books/top?limit=5");
  return response.data;
};

export const getBooks = async () => {
  const response = await api.get("/books/search");
  return response.data;
};

// 책 상세 정보 가져오기
export const getBookDetails = async (bookId) => {
  try {
    const response = await api.get(`/books/${bookId}`);
    return response.data; // API에서 반환한 책 상세 데이터
  } catch (err) {
    console.error("Error fetching book details:", err);
    throw err;
  }
};
// 소장 도서관 정보 가져오기
export const getLibrariesByBook = async (bookId) => {
  try {
    const response = await api.get(`/books/${bookId}/own_libraries`);
    return response.data; // API에서 반환한 도서관 데이터
  } catch (err) {
    console.error("Error fetching libraries by book:", err);
    throw err;
  }
};
// 서평 정보 가져오기
export const getReviewsByBook = async (bookId) => {
  try {
    const response = await api.get(`/books/${bookId}/reviews`);
    return response.data; // API에서 반환한 서평 데이터
  } catch (err) {
    console.error("Error fetching reviews by book:", err);
    throw err;
  }
};

export const getTopReviews = async (sort_by = "newest", limit = 3) => {
  const response = await api.get("/reviews/sorted", {
    params: { sort_by, limit },
  });
  return response.data;
};

export const getSortedReviews = async (sort_by = "newest") => {
  const response = await api.get("/reviews/sorted", {
    params: { sort_by },
  });
  return response.data;
};

// reviews.js
export const addReview = async (reviewData) => {
  const response = await api.post("/reviews/add", reviewData);
  return response.data;
}; 

export const getReviewDetails = async (isbn, user_id) => {
  const response = await api.get(`/reviews/details/${isbn}/${user_id}`); // 경로 파라미터 사용
  return response.data;
};
export const likeReview = async (isbn, user_id) => {
  const response = await api.post(`/reviews/like/${isbn}/${user_id}`); // 경로 파라미터 사용
  return response.data;
};

export const searchLibraries = async (libraryName) => {
  const response = await api.get(`/libraries/search?library_name=${libraryName}`);
  return response.data;
};

// 도서관 상세 정보 가져오기
export const getLibraryDetails = async (library_id) => {
  const response = await api.get(`/libraries/${library_id}`);
  return response.data;
};
// 소장 도서 목록 가져오기
export const getBooksByLibrary = async (library_id) => {
  const response = await api.get(`/libraries/${library_id}/books`);
  return response.data;
};

export default api;