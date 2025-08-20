import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const data = await api.post('/auth/login', { email, password })
    console.log(data.data)
    return {
      success: true,
      data: data.data,
      error: null
    }
  },
  signup: async (name, email, password) => await api.post('/auth/signup', { name, email, password }),
  getMe: async () => {


    const data = await api.get('/auth', { withCredentials: true })
    console.log(data.data)
    return {
      success: true,
      user: data.data,
      error: null,

    }

  },
};

export const billsAPI = {
  getBills: () => api.get('/bills'),
  getBill: (id) => api.get(`/bills/${id}`),
  createBill: (billData) => api.post('/bills', billData),
  updateBill: (id, billData) => api.put(`/bills/${id}`, billData),
  deleteBill: (id) => api.delete(`/bills/${id}`),
  updateBillStatus: (billId, friendId, status) =>
    api.put(`/bills/${billId}/status`, { friendId,  status }),
};

export const usersAPI = {
  getFriends: () => api.get('/users/me/friends'),
  addFriend: (email) => api.post('/users/me/friends', { email }),
  removeFriend: (friendId) => api.delete(`/users/me/friends/${friendId}`),
};

export default api;
