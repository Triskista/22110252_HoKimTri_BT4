import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row, Card } from 'antd';
import { resetPasswordApi } from '../util/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';

const ResetPassword = () => {
  const navigate = useNavigate();
  const params = useParams();
  const urlToken = params?.token;

  const onFinish = async (values) => {
    const token = values.token ?? urlToken;
    const { password, confirm } = values;
    if (password !== confirm) {
      notification.error({ message: 'Lỗi', description: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    const res = await resetPasswordApi(token, password);
    if (res && res.EC === 0) {
      notification.success({ message: 'Thành công', description: res.EM });
      navigate('/login');
    } else {
      notification.error({ message: 'Lỗi', description: res?.EM || 'Lỗi' });
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
                Đặt Lại Mật Khẩu
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: 14 }}>
                Nhập mật khẩu mới của bạn
              </p>
            </div>

            <Form
              name="reset"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
              {!urlToken && (
                <Form.Item
                  label={<span style={{ color: '#e2e8f0' }}>Token</span>}
                  name="token"
                  rules={[{ required: true, message: 'Vui lòng nhập token' }]}
                >
                  <Input placeholder="Nhập token từ email" />
                </Form.Item>
              )}

              <Form.Item
                label={<span style={{ color: '#e2e8f0' }}>Mật khẩu mới</span>}
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                  { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
              </Form.Item>

              <Form.Item
                label={<span style={{ color: '#e2e8f0' }}>Xác nhận mật khẩu</span>}
                name="confirm"
                dependencies={["password"]}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu' },
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
                  Đặt Lại Mật Khẩu
                </Button>
              </Form.Item>
            </Form>

            <Divider style={{ borderColor: '#334155' }} />

            <div style={{ textAlign: 'center' }}>
              <Link to={'/login'} style={{ color: '#cbd5e1', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <ArrowLeftOutlined /> Quay về trang đăng nhập
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ResetPassword;