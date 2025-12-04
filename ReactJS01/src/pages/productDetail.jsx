import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tag, Button, Spin, Input, List, message } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, ArrowLeftOutlined, CommentOutlined } from '@ant-design/icons';
import { getProductDetailApi, getCommentsApi, addCommentApi, toggleFavoriteApi, getFavoritesApi } from '../util/api';
import { calculateDiscountedPrice } from '../util/search';
import { useCart } from '../hooks/useCart';
import { AuthContext } from '../components/context/auth.context';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { auth } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productRes, commentsRes] = await Promise.all([
        getProductDetailApi(id),
        getCommentsApi(id),
      ]);

      if (productRes?.EC === 0) {
        setProduct(productRes.data);
      }

      if (commentsRes?.EC === 0) {
        setComments(commentsRes.data || []);
      }

      // Kiểm tra trạng thái yêu thích từ backend
      if (auth?.user?.email) {
        try {
          const favRes = await getFavoritesApi();
          if (favRes?.EC === 0 && Array.isArray(favRes.data)) {
            const favIds = favRes.data.map((p) => p._id);
            setIsFavorite(favIds.includes(id));
          }
        } catch (e) {
          // ignore favorite load error
        }
      }
    } catch (e) {
      console.error('Failed to load product detail', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, auth?.user?.email]);

  const handleAddToCart = () => {
    if (!product) return;
    const discountedPrice = product.discount ? calculateDiscountedPrice(product.price, product.discount) : product.price;
    addItem({
      id: product._id,
      name: product.title,
      description: product.description,
      price: discountedPrice,
      image: product.image,
      quantity: 1,
    });
    message.success('Đã thêm vào giỏ hàng');
  };

  const handleToggleFavorite = async () => {
    if (!auth?.user?.email) {
      message.warning('Vui lòng đăng nhập để sử dụng chức năng yêu thích');
      return;
    }
    try {
      const res = await toggleFavoriteApi(id);
      if (res?.EC === 0 && res?.data?.isFavorite !== undefined) {
        setIsFavorite(res.data.isFavorite);
      }
    } catch (e) {
      console.error('toggleFavorite error', e);
      message.error('Không thể cập nhật yêu thích');
    }
  };

  const handleAddComment = async () => {
    if (!auth?.user?.email) {
      message.warning('Vui lòng đăng nhập để bình luận');
      return;
    }
    if (!commentText.trim()) {
      message.warning('Vui lòng nhập nội dung bình luận');
      return;
    }
    try {
      setCommentLoading(true);
      const res = await addCommentApi(id, commentText.trim(), null);
      if (res?.EC === 0 && res.data) {
        setComments((prev) => [res.data, ...prev]);
        setCommentText('');
        message.success('Đã thêm bình luận');
      }
    } catch (e) {
      console.error('addComment error', e);
      message.error('Không thể thêm bình luận');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading || !product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  const discountedPrice = product.discount ? calculateDiscountedPrice(product.price, product.discount) : product.price;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #082f49 100%)',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ color: '#0ea5e9', marginBottom: 16 }}
        >
          Quay lại
        </Button>

        <Card
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(51, 65, 85, 0.6)',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 320px', maxWidth: 400 }}>
              <img
                src={product.image}
                alt={product.title}
                style={{ width: '100%', borderRadius: 12, objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
              />
              {product.category && (
                <Tag color="blue" style={{ marginTop: 12 }}>
                  {product.category}
                </Tag>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 260 }}>
              <h1 style={{ color: '#e2e8f0', fontSize: 28, marginBottom: 8 }}>
                {product.title}
              </h1>
              <p style={{ color: '#94a3b8', marginBottom: 16 }}>
                {product.description}
              </p>

              <div style={{ display: 'flex', gap: 12, marginBottom: 12, color: '#94a3b8', fontSize: 13 }}>
                {product.rating > 0 && <span>⭐ {product.rating}/5</span>}
                {product.views > 0 && <span>👁️ {product.views} lượt xem</span>}
                {product.buyerCount > 0 && <span>🛍️ {product.buyerCount} khách mua</span>}
                {product.commentCount > 0 && <span>💬 {product.commentCount} bình luận</span>}
              </div>

              <div style={{ marginBottom: 20 }}>
                {product.discount > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{
                      fontSize: 28,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      ${discountedPrice.toFixed(2)}
                    </span>
                    <span style={{ textDecoration: 'line-through', color: '#64748b' }}>
                      ${product.price}
                    </span>
                    <Tag color="red">-{product.discount}%</Tag>
                  </div>
                ) : (
                  <span style={{
                    fontSize: 28,
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    ${product.price}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ
                </Button>
                <Button
                  type={isFavorite ? 'primary' : 'default'}
                  icon={isFavorite ? <HeartFilled style={{ color: '#f97316' }} /> : <HeartOutlined />}
                  onClick={handleToggleFavorite}
                >
                  {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Comments section */}
        <Card
          style={{
            marginTop: 24,
            background: 'linear-gradient(135deg, #020617 0%, #020617 100%)',
            border: '1px solid rgba(51, 65, 85, 0.6)',
            borderRadius: 16,
          }}
          title={<span style={{ color: '#e2e8f0' }}>Bình luận</span>}
        >
          <div style={{ marginBottom: 16 }}>
            <Input.TextArea
              rows={3}
              placeholder="Viết bình luận của bạn..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button
              type="primary"
              icon={<CommentOutlined />}
              onClick={handleAddComment}
              loading={commentLoading}
              style={{ marginTop: 8 }}
            >
              Gửi bình luận
            </Button>
          </div>

          <List
            dataSource={comments}
            locale={{ emptyText: 'Chưa có bình luận nào' }}
            renderItem={(cmt) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <span style={{ color: '#e2e8f0', fontSize: 13 }}>
                      {cmt.userId || 'Ẩn danh'}
                      <span style={{ color: '#64748b', fontSize: 11, marginLeft: 8 }}>
                        {new Date(cmt.createdAt).toLocaleString()}
                      </span>
                    </span>
                  }
                  description={
                    <span style={{ color: '#cbd5e1', fontSize: 13 }}>
                      {cmt.content}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;


