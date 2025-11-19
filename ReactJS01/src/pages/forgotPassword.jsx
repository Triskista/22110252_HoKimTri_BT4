import React, { useState } from 'react';
import { Button, Col, Divider, Form, Input, notification, Row, Card } from 'antd';
import { forgotPasswordApi } from '../util/api';
import { Link } from 'react-router-dom';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const onFinish = async (values) => {
    const { email } = values;
    setLoading(true);
    try {
      const res = await forgotPasswordApi(email);
      if (res && res.EC === 0) {
        notification.success({
          message: 'Yêu cầu đặt lại mật khẩu',
          description: res.EM || 'Vui lòng kiểm tra email'
        });
        if (res.data?.resetLink) {
          notification.info({
            message: 'Reset link (dev)',
            description: res.data.resetLink,
            duration: 0
          })
        }
        setCooldown(60);
        const interval = setInterval(() => {
          setCooldown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        notification.error({
          message: 'Lỗi',
          description: res?.EM || 'Lỗi'
        })
      }
    } finally {
      setLoading(false);
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
                Quên Mật Khẩu
              </h1>
              <p style={{ color: '#cbd5e1', fontSize: 14 }}>
                Nhập email để nhận link đặt lại mật khẩu
              </p>
            </div>

            <Form
              name="forgot"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
              <Form.Item
                label={<span style={{ color: '#e2e8f0' }}>Email</span>}
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="your@email.com" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={cooldown > 0 || loading}
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
                  {cooldown > 0 ? `Thử lại sau ${cooldown}s` : 'Gửi yêu cầu'}
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

export default ForgotPassword;
