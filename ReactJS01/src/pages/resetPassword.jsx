import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { resetPasswordApi } from '../util/api';
import { useNavigate, useParams, Link } from 'react-router-dom';

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
    <Row justify={"center"} style={{ marginTop: "30px" }}>
      <Col xs={24} md={16}>
        <fieldset style={{
          padding: "15px",
          margin: "5px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}>
          <legend>Đặt lại mật khẩu</legend>
          <Form
            name="reset"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            {!urlToken && (
              <Form.Item
                label="Token"
                name="token"
                rules={[{ required: true, message: 'Vui lòng nhập token' }]}
              >
                <Input />
              </Form.Item>
            )}

            <Form.Item
              label="Mật khẩu mới"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirm"
              rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">Đặt lại mật khẩu</Button>
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

export default ResetPassword;
