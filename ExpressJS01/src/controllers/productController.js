const { getProducts, createProduct, updateProduct, deleteProduct } = require('../services/productService');

const getProductsController = async (req, res) => {
  const { page, limit, category } = req.query;
  const data = await getProducts({ page, limit, category });
  return res.status(200).json(data);
}

const createProductController = async (req, res) => {
  const { title, description, price, category, image } = req.body;
  if (!title || !description || !price || !category) {
    return res.status(400).json({ EC: 1, EM: 'Thiếu thông tin bắt buộc' });
  }
  const data = await createProduct(title, description, price, category, image);
  return res.status(200).json(data);
}

const updateProductController = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, image } = req.body;
  const data = await updateProduct(id, { title, description, price, category, image });
  return res.status(200).json(data);
}

const deleteProductController = async (req, res) => {
  const { id } = req.params;
  const data = await deleteProduct(id);
  return res.status(200).json(data);
}

module.exports = { getProductsController, createProductController, updateProductController, deleteProductController };
