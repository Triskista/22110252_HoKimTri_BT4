const Product = require('../models/product');
const Fuse = require('fuse.js');

// Fuzzy search sản phẩm
const fuzzySearchProducts = async (query, options = {}) => {
  try {
    // Lấy tất cả sản phẩm từ database
    const products = await Product.find();

    // Cấu hình Fuse.js
    const fuseOptions = {
      keys: ['title', 'description', 'category', 'tags'],
      threshold: 0.3, // Độ chính xác cao hơn
      distance: 100,
      minMatchCharLength: 2,
      includeScore: true,
      ...options
    };

    const fuse = new Fuse(products, fuseOptions);
    const results = fuse.search(query);

    return results.map(result => ({
      ...result.item.toObject(),
      score: result.score
    }));
  } catch (error) {
    console.log('Error in fuzzySearchProducts:', error);
    throw error;
  }
}

// Lọc sản phẩm với nhiều điều kiện
const filterProducts = async ({
  page = 1,
  limit = 10,
  category,
  minPrice,
  maxPrice,
  minDiscount = 0,
  minRating = 0,
  sortBy = 'createdAt',
  sortOrder = -1,
  search = ''
} = {}) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // Xây dựng filter object
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined) {
      filter.price = { ...filter.price, $gte: minPrice };
    }

    if (maxPrice !== undefined) {
      filter.price = { ...filter.price, $lte: maxPrice };
    }

    if (minDiscount > 0) {
      filter.discount = { $gte: minDiscount };
    }

    if (minRating > 0) {
      filter.rating = { $gte: minRating };
    }

    // Full text search nếu có query
    if (search) {
      filter.$text = { $search: search };
    }

    const total = await Product.countDocuments(filter);

    // Xác định field và hướng sắp xếp
    const sortObj = {};
    if (sortBy === 'price') {
      sortObj.price = sortOrder;
    } else if (sortBy === 'views') {
      sortObj.views = sortOrder;
    } else if (sortBy === 'rating') {
      sortObj.rating = sortOrder;
    } else if (sortBy === 'discount') {
      sortObj.discount = sortOrder;
    } else if (sortBy === 'newest') {
      sortObj.createdAt = -1;
    } else {
      sortObj.createdAt = sortOrder;
    }

    const data = await Product.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      EC: 0,
      EM: 'OK',
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.log('Error in filterProducts:', error);
    return { EC: 1, EM: 'Lỗi hệ thống', data: [] };
  }
}

// Tìm kiếm kết hợp Fuzzy Search + Filter
const advancedSearch = async ({
  query = '',
  page = 1,
  limit = 10,
  category,
  minPrice,
  maxPrice,
  minDiscount = 0,
  minRating = 0,
  sortBy = 'relevance',
  sortOrder = -1,
  useFuzzy = true
} = {}) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    let results = [];

    // Nếu có query và useFuzzy = true, sử dụng Fuzzy Search
    if (query && useFuzzy) {
      results = await fuzzySearchProducts(query);
    } else {
      // Ngược lại, lấy tất cả sản phẩm và áp dụng filter
      const response = await filterProducts({
        page: 1,
        limit: 10000,
        category,
        minPrice,
        maxPrice,
        minDiscount,
        minRating,
        search: query,
        sortBy,
        sortOrder
      });
      results = response.data || [];
    }

    // Áp dụng các bộ lọc bổ sung
    if (category) {
      results = results.filter(p => p.category === category);
    }

    if (minPrice !== undefined) {
      results = results.filter(p => p.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      results = results.filter(p => p.price <= maxPrice);
    }

    if (minDiscount > 0) {
      results = results.filter(p => p.discount >= minDiscount);
    }

    if (minRating > 0) {
      results = results.filter(p => p.rating >= minRating);
    }

    // Sắp xếp kết quả
    if (sortBy === 'price') {
      results.sort((a, b) => sortOrder === 1 ? a.price - b.price : b.price - a.price);
    } else if (sortBy === 'views') {
      results.sort((a, b) => sortOrder === 1 ? a.views - b.views : b.views - a.views);
    } else if (sortBy === 'rating') {
      results.sort((a, b) => sortOrder === 1 ? a.rating - b.rating : b.rating - a.rating);
    } else if (sortBy === 'discount') {
      results.sort((a, b) => sortOrder === 1 ? a.discount - b.discount : b.discount - a.discount);
    } else if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Phân trang
    const total = results.length;
    const paginatedResults = results.slice((page - 1) * limit, page * limit);

    return {
      EC: 0,
      EM: 'OK',
      data: paginatedResults,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.log('Error in advancedSearch:', error);
    return { EC: 1, EM: 'Lỗi hệ thống', data: [] };
  }
}

// Lấy các danh mục có sẵn
const getCategories = async () => {
  try {
    const categories = await Product.distinct('category');
    return { EC: 0, EM: 'OK', data: categories };
  } catch (error) {
    console.log('Error in getCategories:', error);
    return { EC: 1, EM: 'Lỗi hệ thống', data: [] };
  }
}

// Lấy thống kê giá
const getPriceStats = async () => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    if (stats.length === 0) {
      return { EC: 0, EM: 'OK', data: { minPrice: 0, maxPrice: 0, avgPrice: 0 } };
    }

    return { EC: 0, EM: 'OK', data: stats[0] };
  } catch (error) {
    console.log('Error in getPriceStats:', error);
    return { EC: 1, EM: 'Lỗi hệ thống', data: {} };
  }
}

module.exports = {
  fuzzySearchProducts,
  filterProducts,
  advancedSearch,
  getCategories,
  getPriceStats
};
