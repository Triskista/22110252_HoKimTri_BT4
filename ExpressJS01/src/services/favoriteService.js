const Favorite = require('../models/favorite');

const toggleFavorite = async (userId, productId) => {
  try {
    const existing = await Favorite.findOne({ userId, productId });
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return { EC: 0, EM: 'Đã bỏ khỏi danh sách yêu thích', data: { isFavorite: false } };
    }
    const fav = await Favorite.create({ userId, productId });
    return { EC: 0, EM: 'Đã thêm vào danh sách yêu thích', data: { isFavorite: true, favorite: fav } };
  } catch (error) {
    console.log('toggleFavorite error', error);
    return { EC: 1, EM: 'Lỗi hệ thống' };
  }
};

const getFavoriteProductsByUser = async (userId) => {
  try {
    const favorites = await Favorite.find({ userId }).populate('productId');
    const products = favorites
      .filter(f => f.productId)
      .map(f => f.productId);
    return { EC: 0, EM: 'OK', data: products };
  } catch (error) {
    console.log('getFavoriteProductsByUser error', error);
    return { EC: 1, EM: 'Lỗi hệ thống' };
  }
};

const getFavoriteCountForProduct = async (productId) => {
  try {
    const count = await Favorite.countDocuments({ productId });
    return { EC: 0, EM: 'OK', data: { count } };
  } catch (error) {
    console.log('getFavoriteCountForProduct error', error);
    return { EC: 1, EM: 'Lỗi hệ thống' };
  }
};

module.exports = {
  toggleFavorite,
  getFavoriteProductsByUser,
  getFavoriteCountForProduct,
};


