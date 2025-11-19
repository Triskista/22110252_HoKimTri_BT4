import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

// Set config defaults when creating the instance
// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  if (response && response.data) return response.data;
  return response;
}, function (error) {
  // Any status codes that fall outside the range of 2xx cause this function to trigger
  // Forward the error to the caller so upstream code can handle it in try/catch
  if (error?.response?.data) return Promise.reject(error.response.data);
  return Promise.reject(error);
});

export default instance;
