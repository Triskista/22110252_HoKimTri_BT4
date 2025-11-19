import { Button, Row, Col, Card } from 'antd';
import { ShoppingOutlined, LockOutlined, ThunderboltOutlined, SafetyOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { AuthContext } from '../components/context/auth.context';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { auth } = useContext(AuthContext);

  const features = [
    {
      icon: <ShoppingOutlined style={{ fontSize: 32 }} />,
      title: 'Đa dạng sản phẩm',
      desc: 'Hơn 150 sản phẩm từ các danh mục khác nhau'
    },
    {
      icon: <LockOutlined style={{ fontSize: 32 }} />,
      title: 'Bảo mật',
      desc: 'JWT authentication và role-based access control'
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: 32 }} />,
      title: 'Hiệu suất',
      desc: 'Lazy loading và phân trang nhanh'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 32 }} />,
      title: 'Quản lý',
      desc: 'Admin panel quản lý sản phẩm đầy đủ'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #082f49 100%)',
      paddingBottom: 60
    }}>
      {/* Hero Section */}
      <div style={{
        padding: '80px 20px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.1) 0%, transparent 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 56,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 20,
            lineHeight: 1.2
          }}>
            Nền Tảng Thương Mại Hiện Đại
          </h1>

          <p style={{
            fontSize: 18,
            color: '#cbd5e1',
            maxWidth: 600,
            margin: '0 auto 40px',
            lineHeight: 1.6
          }}>
            Khám phá hàng trăm sản phẩm chất lượng với giao diện user-friendly và hệ thống quản lý an toàn
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {auth.isAuthenticated ? (
              <>
                <Link to="/products">
                  <Button type="primary" size="large" style={{ fontSize: 16, height: 48, paddingX: 32 }}>
                    Xem sản phẩm
                  </Button>
                </Link>
                {auth.user?.role === 'admin' && (
                  <Link to="/admin">
                    <Button size="large" style={{ fontSize: 16, height: 48, paddingX: 32, borderColor: '#0ea5e9', color: '#0ea5e9' }}>
                      Quản lý sản phẩm
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button type="primary" size="large" style={{ fontSize: 16, height: 48, paddingX: 32 }}>
                    Đăng kí ngay
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="large" style={{ fontSize: 16, height: 48, paddingX: 32, borderColor: '#0ea5e9', color: '#0ea5e9' }}>
                    Đăng nhập
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 40,
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 60,
          color: '#f1f5f9'
        }}>
          Tính Năng Nổi Bật
        </h2>

        <Row gutter={[24, 24]}>
          {features.map((feature, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <Card
                style={{
                  textAlign: 'center',
                  height: '100%',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(51, 65, 85, 0.5)',
                  borderRadius: 12,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = '#0ea5e9';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(14, 165, 233, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                bodyStyle={{ padding: '30px 20px' }}
              >
                <div style={{
                  fontSize: 48,
                  marginBottom: 20,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#f1f5f9' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>
                  {feature.desc}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Stats Section */}
      <div style={{
        padding: '60px 20px',
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(96, 165, 250, 0.05) 100%)',
        borderTop: '1px solid rgba(51, 65, 85, 0.5)',
        borderBottom: '1px solid rgba(51, 65, 85, 0.5)'
      }}>
        <Row gutter={[24, 24]} style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          {[
            { number: '150+', label: 'Sản phẩm' },
            { number: '4', label: 'Danh mục' },
            { number: '100%', label: 'Bảo mật' }
          ].map((stat, idx) => (
            <Col xs={24} sm={8} key={idx}>
              <div>
                <div style={{
                  fontSize: 42,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: 10
                }}>
                  {stat.number}
                </div>
                <p style={{ fontSize: 16, color: '#cbd5e1' }}>{stat.label}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default HomePage;
