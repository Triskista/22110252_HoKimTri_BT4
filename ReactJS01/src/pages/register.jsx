import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row, Card } from 'antd';
import { createUserApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { name, email, password } = values;

    const res = await createUserApi(name, email, password);
    if (res && res._id) {
      notification.success({
        message: "Đăng kí thành công",
        description: "Hãy đăng nhập để tiếp tục"
      });
      navigate("/login");
    } else {
      notification.error({
        message: "Đăng kí thất bại",
        description: "Email có thể đã được sử dụng"
      })
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #082f49 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Row justify="center" style={{ width: '100%' }}>
        <Col xs={24} sm={20} md={14} lg={10}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(51, 65, 85, 0.6)',
              borderRadius: 16,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '40px' }}
          >
            <div style={{ marginBottom: 30, textAlign: 'center' }}>
              <h1 style={{
                fontSize: 32,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 8
              }}>
                Đăng Kí
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: 14 }}>
                Tạo tài khoản mới để bắt đầu
              </p>
            </div>

            <Form
              name="register"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
              <Form.Item
                label={<span style={{ color: '#e2e8f0' }}>Tên đăng nhập</span>}
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nhập tên của bạn" />
              </Form.Item>

              <Form.Item
                label={<span style={{ color: '#e2e8f0' }}>Email</span>}
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="your@email.com" />
              </Form.Item>

              <Form.Item
                label={<span style={{ color: '#e2e8f0' }}>Mật khẩu</span>}
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
              </Form.Item>

              <Form.Item
                label={<span style={{ color: '#e2e8f0' }}>Xác nhận mật khẩu</span>}
                name="confirm"
                dependencies={["password"]}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                    }
                  })
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: '100%',
                    height: 44,
                    fontSize: 16,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
                  }}
                >
                  Đăng Kí
                </Button>
              </Form.Item>
            </Form>

            <Divider style={{ borderColor: '#334155' }} />

            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <p style={{ color: '#cbd5e1', fontSize: 14, marginBottom: 0 }}>
                Đã có tài khoản?{' '}
                <Link to={'/login'} style={{ color: '#0ea5e9', fontWeight: 600 }}>
                  Đăng nhập
                </Link>
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link to={'/'} style={{ color: '#cbd5e1', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <ArrowLeftOutlined /> Quay về trang chủ
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
