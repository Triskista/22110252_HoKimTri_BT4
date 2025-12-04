const Comment = require('../models/comment');
const Product = require('../models/product');

const addComment = async ({ userId, productId, content, rating }) => {
  try {
    const comment = await Comment.create({ userId, productId, content, rating });

    // tăng bộ đếm comment cho sản phẩm
    await Product.findByIdAndUpdate(productId, {
      $inc: { commentCount: 1 },
    });

    return { EC: 0, EM: 'Thêm bình luận thành công', data: comment };
  } catch (error) {
    console.log('addComment error', error);
    return { EC: 1, EM: 'Lỗi hệ thống' };
  }
};

const getCommentsByProduct = async (productId) => {
  try {
    const comments = await Comment.find({ productId }).sort({ createdAt: -1 });
    return { EC: 0, EM: 'OK', data: comments };
  } catch (error) {
    console.log('getCommentsByProduct error', error);
    return { EC: 1, EM: 'Lỗi hệ thống' };
  }
};

const getCommentStatsByProduct = async (productId) => {
  try {
    const count = await Comment.countDocuments({ productId });
    const agg = await Comment.aggregate([
      { $match: { productId: require('mongoose').Types.ObjectId(productId) } },
      { $group: { _id: '$productId', avgRating: { $avg: '$rating' } } },
    ]);
    const avgRating = agg[0]?.avgRating || 0;

    return { EC: 0, EM: 'OK', data: { count, avgRating } };
  } catch (error) {
    console.log('getCommentStatsByProduct error', error);
    return { EC: 1, EM: 'Lỗi hệ thống' };
  }
};

module.exports = {
  addComment,
  getCommentsByProduct,
  getCommentStatsByProduct,
};


