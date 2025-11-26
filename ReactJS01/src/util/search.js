import Fuse from 'fuse.js';

/**
 * Fuzzy search trong danh sách sản phẩm (client-side)
 */
export const fuzzySearchLocal = (products, query, options = {}) => {
  if (!query || query.trim() === '') {
    return products;
  }

  const fuseOptions = {
    keys: ['title', 'description', 'category', 'tags'],
    threshold: 0.3,
    distance: 100,
    minMatchCharLength: 2,
    includeScore: true,
    ...options
  };

  const fuse = new Fuse(products, fuseOptions);
  const results = fuse.search(query);

  return results.map(result => ({
    ...result.item,
    score: result.score
  }));
};

/**
 * Sắp xếp sản phẩm
 */
export const sortProducts = (products, sortBy = 'newest', sortOrder = -1) => {
  const sorted = [...products];

  if (sortBy === 'price') {
    sorted.sort((a, b) => sortOrder === 1 ? a.price - b.price : b.price - a.price);
  } else if (sortBy === 'views') {
    sorted.sort((a, b) => sortOrder === 1 ? a.views - b.views : b.views - a.views);
  } else if (sortBy === 'rating') {
    sorted.sort((a, b) => sortOrder === 1 ? a.rating - b.rating : b.rating - a.rating);
  } else if (sortBy === 'discount') {
    sorted.sort((a, b) => sortOrder === 1 ? a.discount - b.discount : b.discount - a.discount);
  } else if (sortBy === 'newest') {
    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return sorted;
};

/**
 * Lọc sản phẩm theo các tiêu chí
 */
export const filterProductsLocal = (products, filters = {}) => {
  let filtered = [...products];

  if (filters.category) {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice);
  }

  if (filters.minDiscount !== undefined && filters.minDiscount > 0) {
    filtered = filtered.filter(p => p.discount >= filters.minDiscount);
  }

  if (filters.minRating !== undefined && filters.minRating > 0) {
    filtered = filtered.filter(p => p.rating >= filters.minRating);
  }

  if (filters.minViews !== undefined && filters.minViews > 0) {
    filtered = filtered.filter(p => p.views >= filters.minViews);
  }

  return filtered;
};

/**
 * Kết hợp tìm kiếm + lọc
 */
export const searchAndFilter = (products, query = '', filters = {}, sortBy = 'newest') => {
  let results = products;

  // Bước 1: Tìm kiếm
  if (query) {
    results = fuzzySearchLocal(results, query);
  }

  // Bước 2: Lọc
  results = filterProductsLocal(results, filters);

  // Bước 3: Sắp xếp
  results = sortProducts(results, sortBy);

  return results;
};

/**
 * Format giá
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

/**
 * Tính giá sau khi giảm
 */
export const calculateDiscountedPrice = (price, discountPercent) => {
  return price * (1 - discountPercent / 100);
};
