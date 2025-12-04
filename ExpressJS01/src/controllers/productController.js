const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../services/productService');
const { advancedSearch, filterProducts, getCategories, getPriceStats } = require('../services/searchService');

const getProductsController = async (req, res) => {
  const { page, limit, category } = req.query;
  const data = await getProducts({ page, limit, category });
  return res.status(200).json(data);
}

const searchProductsController = async (req, res) => {
  try {
    const { q, page = 1, limit = 10, category, minPrice, maxPrice, minDiscount, minRating, sortBy, sortOrder } = req.query;

    if (!q) {
      return res.status(400).json({ EC: 1, EM: 'Query parameter "q" is required' });
    }

    const result = await advancedSearch({
      query: q,
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      minDiscount: minDiscount ? parseInt(minDiscount) : 0,
      minRating: minRating ? parseFloat(minRating) : 0,
      sortBy: sortBy || 'relevance',
      sortOrder: sortOrder ? parseInt(sortOrder) : -1,
      useFuzzy: true
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log('Error in searchProductsController:', error);
    return res.status(500).json({ EC: 1, EM: 'Lỗi hệ thống' });
  }
}

const filterProductsController = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, minPrice, maxPrice, minDiscount, minRating, sortBy, sortOrder } = req.query;

    const result = await filterProducts({
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      minDiscount: minDiscount ? parseInt(minDiscount) : 0,
      minRating: minRating ? parseFloat(minRating) : 0,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder ? parseInt(sortOrder) : -1
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log('Error in filterProductsController:', error);
    return res.status(500).json({ EC: 1, EM: 'Lỗi hệ thống' });
  }
}

const getCategoriesController = async (req, res) => {
  try {
    const result = await getCategories();
    return res.status(200).json(result);
  } catch (error) {
    console.log('Error in getCategoriesController:', error);
    return res.status(500).json({ EC: 1, EM: 'Lỗi hệ thống' });
  }
}

const getPriceStatsController = async (req, res) => {
  try {
    const result = await getPriceStats();
    return res.status(200).json(result);
  } catch (error) {
    console.log('Error in getPriceStatsController:', error);
    return res.status(500).json({ EC: 1, EM: 'Lỗi hệ thống' });
  }
}

const createProductController = async (req, res) => {
  const { title, description, price, category, image, discount = 0, tags = [] } = req.body;
  if (!title || !description || !price || !category) {
    return res.status(400).json({ EC: 1, EM: 'Thiếu thông tin bắt buộc' });
  }
  const data = await createProduct(title, description, price, category, image, discount, tags);
  return res.status(200).json(data);
}

const updateProductController = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, image, discount, views, rating, stock, tags } = req.body;
  const data = await updateProduct(id, { title, description, price, category, image, discount, views, rating, stock, tags });
  return res.status(200).json(data);
}

const deleteProductController = async (req, res) => {
  const { id } = req.params;
  const data = await deleteProduct(id);
  return res.status(200).json(data);
}

const getProductDetailController = async (req, res) => {
  const { id } = req.params;
  const data = await getProductById(id);
  return res.status(200).json(data);
};

module.exports = { 
  getProductsController, 
  createProductController, 
  updateProductController, 
  deleteProductController,
  searchProductsController,
  filterProductsController,
  getCategoriesController,
  getPriceStatsController,
  getProductDetailController,
};
