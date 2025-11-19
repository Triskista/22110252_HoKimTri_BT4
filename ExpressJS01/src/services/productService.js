const Product = require('../models/product');

const getProducts = async ({ page = 1, limit = 10, category }) => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const filter = {};
    if (category) filter.category = category;

    const total = await Product.countDocuments(filter);
    const data = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return { EC: 0, EM: 'OK', data, meta: { total, page, limit } };
  } catch (error) {
    console.log(error);
    return { EC: 1, EM: 'Lỗi hệ thống' };
  }
}

const createProduct = async (title, description, price, category, image) => {
  try {
    const product = await Product.create({ title, description, price, category, image });
    return { EC: 0, EM: 'Thêm sản phẩm thành công', data: product };
  } catch (error) {
    console.log(error);
    return { EC: 1, EM: 'Lỗi hệ thống' };
  }
}

const updateProduct = async (id, { title, description, price, category, image }) => {
  try {
    const product = await Product.findByIdAndUpdate(id, { title, description, price, category, image }, { new: true });
    if (!product) return { EC: 1, EM: 'Sản phẩm không tồn tại' };
    return { EC: 0, EM: 'Cập nhật sản phẩm thành công', data: product };
  } catch (error) {
    console.log(error);
    return { EC: 1, EM: 'Lỗi hệ thống' };
  }
}

const deleteProduct = async (id) => {
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) return { EC: 1, EM: 'Sản phẩm không tồn tại' };
    return { EC: 0, EM: 'Xóa sản phẩm thành công' };
  } catch (error) {
    console.log(error);
    return { EC: 1, EM: 'Lỗi hệ thống' };
  }
}

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) return;

    const categories = ['electronics', 'clothes', 'beauty', 'books'];
    const samples = [];
    for (let i = 1; i <= 150; i++) {
      samples.push({
        title: `Sample product ${i}`,
        description: `Description for product ${i}`,
        price: Math.floor(Math.random() * 200) + 1,
        category: categories[(i - 1) % categories.length],
        // use picsum.photos with a seeded path so each product has a stable placeholder image
        image: `https://picsum.photos/seed/product${i}/400/300`
      })
    }
    await Product.insertMany(samples);
    console.log('Seeded sample products');
  } catch (error) {
    console.log('Error seeding products: ', error);
  }
}

module.exports = { getProducts, seedProducts, createProduct, updateProduct, deleteProduct };
