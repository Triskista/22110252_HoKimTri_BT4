import React, { useState } from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { forgotPasswordApi } from '../util/api';
import { Link } from 'react-router-dom';

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
        // optionally show reset link in dev
        if (res.data?.resetLink) {
          notification.info({
            message: 'Reset link (dev)',
            description: res.data.resetLink,
            duration: 0
          })
        }
        // Set 60-second cooldown
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
          message: 'Error',
          description: res?.EM || 'Lỗi'
        })
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify={"center"} style={{ marginTop: "30px" }}>
      <Col xs={24} md={16}>
        <fieldset style={{
          padding: "15px",
          margin: "5px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}>
          <legend>Quên mật khẩu</legend>
          <Form
            name="forgot"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập email' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
                disabled={cooldown > 0 || loading}
              >
                {cooldown > 0 ? `Thử lại sau ${cooldown}s` : 'Gửi yêu cầu'}
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <div style={{ textAlign: 'center' }}>
            <Link to={'/login'}>Quay về trang đăng nhập</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  )
}

export default ForgotPassword;
