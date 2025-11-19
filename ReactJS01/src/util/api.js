import axios from './axios.customize';

const createUserApi = (name, email, password) => {
  const URL_API = "/v1/api/register";
  const data = {
    name, email, password
  }

  return axios.post(URL_API, data)
}

const loginApi = (email, password) => {
  const URL_API = "/v1/api/login";
  const data = {
    email, password
  }

  return axios.post(URL_API, data)
}

const getAllUserApi = () => {
  const URL_API = "/v1/api/user"
  return axios.get(URL_API)
}

const getProductsApi = (page = 1, limit = 10, category) => {
  let url = `/v1/api/products?page=${page}&limit=${limit}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  return axios.get(url);
}

const createProductApi = (title, description, price, category, image) => {
  return axios.post('/v1/api/products', { title, description, price, category, image });
}

const updateProductApi = (id, title, description, price, category, image) => {
  return axios.put(`/v1/api/products/${id}`, { title, description, price, category, image });
}

const deleteProductApi = (id) => {
  return axios.delete(`/v1/api/products/${id}`);
}

const forgotPasswordApi = (email) => {
  const URL_API = "/v1/api/forgot-password";
  return axios.post(URL_API, { email });
}

const resetPasswordApi = (token, password) => {
  const URL_API = "/v1/api/reset-password";
  return axios.post(URL_API, { token, password });
}

export {
  createUserApi, loginApi, getAllUserApi,
  forgotPasswordApi, resetPasswordApi,
  getProductsApi, createProductApi, updateProductApi, deleteProductApi
}
