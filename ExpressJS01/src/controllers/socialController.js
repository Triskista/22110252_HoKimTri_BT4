const { toggleFavorite, getFavoriteProductsByUser } = require('../services/favoriteService');
const { addComment, getCommentsByProduct } = require('../services/commentService');

// POST /v1/api/favorites/:productId - toggle yêu thích cho sản phẩm
const toggleFavoriteController = async (req, res) => {
  const userId = req.user.email; // dùng email user hiện tại
  const { productId } = req.params;

  const result = await toggleFavorite(userId, productId);
  return res.status(200).json(result);
};

// GET /v1/api/favorites - lấy danh sách sản phẩm yêu thích của user
const getFavoritesController = async (req, res) => {
  const userId = req.user.email;
  const result = await getFavoriteProductsByUser(userId);
  return res.status(200).json(result);
};

// POST /v1/api/products/:productId/comments - thêm bình luận
const addCommentController = async (req, res) => {
  const userId = req.user.email;
  const { productId } = req.params;
  const { content, rating } = req.body;

  if (!content) {
    return res.status(400).json({ EC: 1, EM: 'Nội dung bình luận là bắt buộc' });
  }

  const result = await addComment({ userId, productId, content, rating });
  return res.status(200).json(result);
};

// GET /v1/api/products/:productId/comments - lấy danh sách bình luận theo sản phẩm
const getCommentsController = async (req, res) => {
  const { productId } = req.params;
  const result = await getCommentsByProduct(productId);
  return res.status(200).json(result);
};

module.exports = {
  toggleFavoriteController,
  getFavoritesController,
  addCommentController,
  getCommentsController,
};


