import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  res => res.data,
  err => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const productsApi = {
  getAll:       (category) => api.get('/products', { params: category ? { category } : {} }),
  getById:      (id)       => api.get(`/products/${id}`),
  getCategories:()         => api.get('/products/meta/categories'),
};

export const ordersApi = {
  create:       (data)             => api.post('/orders', data),
  track:        (orderNumber)      => api.get(`/orders/track/${orderNumber}`),
  getAll:       ()                 => api.get('/orders'),
  updateStatus: (id, status, msg)  => api.patch(`/orders/${id}/status`, { status, message: msg }),
};

export const paymentsApi = {
  initiate: (data)  => api.post('/payments/initiate', data),
  confirm:  (data)  => api.post('/payments/confirm', data),
  getStatus:(txnId) => api.get(`/payments/${txnId}`),
};

export const eventsApi = {
  book:        (data) => api.post('/events/book', data),
  getAll:      ()     => api.get('/events'),
  sendContact: (data) => api.post('/events/contact', data),
};

export const getImageUrl = (filename) => `/images/${filename}`; 
export default api;
