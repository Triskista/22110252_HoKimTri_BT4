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

/**
 * Tìm kiếm sản phẩm với Fuzzy Search
 */
const searchProductsApi = (q, page = 1, limit = 10, filters = {}) => {
  let url = `/v1/api/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`;
  
  if (filters.category) url += `&category=${encodeURIComponent(filters.category)}`;
  if (filters.minPrice !== undefined) url += `&minPrice=${filters.minPrice}`;
  if (filters.maxPrice !== undefined) url += `&maxPrice=${filters.maxPrice}`;
  if (filters.minDiscount !== undefined) url += `&minDiscount=${filters.minDiscount}`;
  if (filters.minRating !== undefined) url += `&minRating=${filters.minRating}`;
  if (filters.sortBy) url += `&sortBy=${filters.sortBy}`;
  if (filters.sortOrder !== undefined) url += `&sortOrder=${filters.sortOrder}`;
  
  return axios.get(url);
}

/**
 * Lọc sản phẩm
 */
const filterProductsApi = (page = 1, limit = 10, filters = {}) => {
  let url = `/v1/api/filter?page=${page}&limit=${limit}`;
  
  if (filters.category) url += `&category=${encodeURIComponent(filters.category)}`;
  if (filters.minPrice !== undefined) url += `&minPrice=${filters.minPrice}`;
  if (filters.maxPrice !== undefined) url += `&maxPrice=${filters.maxPrice}`;
  if (filters.minDiscount !== undefined) url += `&minDiscount=${filters.minDiscount}`;
  if (filters.minRating !== undefined) url += `&minRating=${filters.minRating}`;
  if (filters.sortBy) url += `&sortBy=${filters.sortBy}`;
  if (filters.sortOrder !== undefined) url += `&sortOrder=${filters.sortOrder}`;
  
  return axios.get(url);
}

/**
 * Lấy danh sách danh mục
 */
const getCategoriesApi = () => {
  return axios.get('/v1/api/categories');
}

/**
 * Lấy thống kê giá
 */
const getPriceStatsApi = () => {
  return axios.get('/v1/api/price-stats');
}

const createProductApi = (title, description, price, category, image, discount = 0, tags = []) => {
  return axios.post('/v1/api/products', { title, description, price, category, image, discount, tags });
}

const updateProductApi = (id, title, description, price, category, image, discount, views, rating, stock, tags) => {
  return axios.put(`/v1/api/products/${id}`, { title, description, price, category, image, discount, views, rating, stock, tags });
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
  getProductsApi, searchProductsApi, filterProductsApi, getCategoriesApi, getPriceStatsApi,
  createProductApi, updateProductApi, deleteProductApi
}
