import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Row, Spin, Button, Tag, Empty } from 'antd';
import { ShoppingCartOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getProductsApi } from '../util/api';

const ProductsPage = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef();

  const fetch = async (p = 1) => {
    setLoading(true);
    const res = await getProductsApi(p, limit);
    if (res && res.EC === 0) {
      const data = res.data || [];
      setItems(prev => p === 1 ? data : [...prev, ...data]);
      const meta = res.meta || {};
      setHasMore((meta.page * meta.limit) < meta.total);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetch(1);
  }, []);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        const next = page + 1;
        setPage(next);
        fetch(next);
      }
    }, { rootMargin: '300px' });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef.current, hasMore, loading, page]);

  const getCategoryColor = (category) => {
    const colors = {
      'electronics': 'cyan',
      'clothes': 'magenta',
      'beauty': 'red',
      'books': 'orange'
    };
    return colors[category] || 'blue';
  }

  const getCategoryLabel = (category) => {
    const labels = {
      'electronics': '🖥️ Điện tử',
      'clothes': '👕 Quần áo',
      'beauty': '💄 Làm đẹp',
      'books': '📚 Sách'
    };
    return labels[category] || category;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #082f49 100%)',
      padding: '60px 20px 40px',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          marginBottom: 60,
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: 48,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 12
          }}>
            Cửa Hàng Sản Phẩm
          </h1>
          <p style={{
            fontSize: 16,
            color: '#cbd5e1',
            marginBottom: 0
          }}>
            Khám phá hơn {items.length}+ sản phẩm chất lượng cao
          </p>
        </div>

        {/* Products Grid */}
        {items.length === 0 && !loading ? (
          <Empty description="Chưa có sản phẩm" style={{ marginTop: 60 }} />
        ) : (
          <Row gutter={[20, 20]}>
            {items.map(item => (
              <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                <Card
                  hoverable
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    border: '1px solid rgba(51, 65, 85, 0.6)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.borderColor = '#0ea5e9';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(14, 165, 233, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.6)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  cover={
                    <div style={{
                      position: 'relative',
                      backgroundColor: '#0f172a',
                      height: 200,
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, transparent 100%)'
                    }}>
                      <img
                        alt={item.title}
                        src={item.image}
                        style={{
                          height: '100%',
                          width: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                        onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
                      />
                      <Tag
                        color={getCategoryColor(item.category)}
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      >
                        {getCategoryLabel(item.category)}
                      </Tag>
                    </div>
                  }
                  bodyStyle={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1
                  }}
                >
                  <h4 style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#f1f5f9',
                    marginBottom: 8,
                    lineHeight: 1.3,
                    minHeight: 40
                  }}>
                    {item.title}
                  </h4>

                  <p style={{
                    fontSize: 12,
                    color: '#cbd5e1',
                    marginBottom: 12,
                    lineHeight: 1.4,
                    flex: 1,
                    minHeight: 36
                  }}>
                    {item.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 12,
                    borderTop: '1px solid rgba(51, 65, 85, 0.5)'
                  }}>
                    <span style={{
                      fontSize: 18,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      ${item.price}
                    </span>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<ShoppingCartOutlined />}
                      size="small"
                      style={{ fontSize: 14 }}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Loader / Load More */}
        <div style={{
          textAlign: 'center',
          marginTop: 60,
          marginBottom: 40
        }} ref={loaderRef}>
          {loading ? (
            <Spin size="large" />
          ) : hasMore ? (
            <div>
              <p style={{ color: '#cbd5e1', marginBottom: 16 }}>
                <ArrowDownOutlined /> Kéo xuống để tải thêm sản phẩm
              </p>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  const next = page + 1;
                  setPage(next);
                  fetch(next);
                }}
                style={{
                  fontSize: 14,
                  height: 44,
                  paddingX: 32
                }}
              >
                Tải thêm sản phẩm
              </Button>
            </div>
          ) : (
            <p style={{
              color: '#64748b',
              fontSize: 16
            }}>
              ✓ Đã tải tất cả sản phẩm
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage;
