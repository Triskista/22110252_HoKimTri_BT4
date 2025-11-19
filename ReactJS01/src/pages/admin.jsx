import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Table, Tooltip, notification, Select, Space, Empty, Spin, Card, Row, Col, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { createProductApi, updateProductApi, deleteProductApi, getProductsApi } from '../util/api';
import { AuthContext } from '../components/context/auth.context';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const categories = ['electronics', 'clothes', 'beauty', 'books'];

  // Check if user is admin
  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.role !== 'admin') {
      notification.error({ message: 'Bạn không có quyền truy cập' });
      navigate('/');
    }
  }, [auth, navigate]);

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    const res = await getProductsApi(1, 1000); // fetch all
    if (res && res.EC === 0) {
      setProducts(res.data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setIsEditing(false);
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  }

  const handleEditProduct = (record) => {
    setIsEditing(true);
    setEditingId(record._id);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      price: record.price,
      category: record.category,
      image: record.image
    });
    setIsModalVisible(true);
  }

  const handleDeleteProduct = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn chắc chắn muốn xóa sản phẩm này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        const res = await deleteProductApi(id);
        if (res && res.EC === 0) {
          notification.success({ message: 'Xóa sản phẩm thành công' });
          fetchProducts();
        } else {
          notification.error({ message: res?.EM || 'Lỗi' });
        }
      }
    });
  }

  const handleSaveProduct = async (values) => {
    try {
      let res;
      if (isEditing) {
        res = await updateProductApi(editingId, values.title, values.description, values.price, values.category, values.image);
      } else {
        res = await createProductApi(values.title, values.description, values.price, values.category, values.image);
      }

      if (res && res.EC === 0) {
        notification.success({ message: isEditing ? 'Cập nhật thành công' : 'Thêm sản phẩm thành công' });
        setIsModalVisible(false);
        form.resetFields();
        fetchProducts();
      } else {
        notification.error({ message: res?.EM || 'Lỗi' });
      }
    } catch (error) {
      notification.error({ message: 'Lỗi hệ thống' });
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      'electronics': 'cyan',
      'clothes': 'magenta',
      'beauty': 'red',
      'books': 'orange'
    };
    return colors[category] || 'blue';
  }

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span style={{ color: '#f1f5f9' }}>{text}</span>,
      width: 200
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (text) => <Tag color={getCategoryColor(text)}>{text}</Tag>,
      width: 120
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (text) => <span style={{ color: '#10b981', fontWeight: 600 }}>${text}</span>,
      width: 100
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <span style={{ color: '#cbd5e1' }}>{text?.substring(0, 50)}...</span>,
      width: 250
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleEditProduct(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => handleDeleteProduct(record._id)} />
          </Tooltip>
        </Space>
      ),
      width: 100
    },
  ];

  if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
    return <Empty style={{ marginTop: 50 }} description="Bạn không có quyền truy cập" />;
  }

  return (
    <div style={{
      padding: '40px 20px',
      backgroundColor: '#0f172a',
      backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #082f49 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontSize: 40,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 12
          }}>
            Quản Lý Sản Phẩm
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: 14 }}>
            Tổng sản phẩm: <span style={{ fontWeight: 700, color: '#0ea5e9' }}>{products.length}</span>
          </p>
        </div>

        {/* Add Product Button */}
        <div style={{ marginBottom: 24 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddProduct}
            size="large"
            style={{
              fontSize: 16,
              height: 44,
              paddingX: 24,
              background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
            }}
          >
            Thêm sản phẩm mới
          </Button>
        </div>

        {/* Products Table */}
        {loading ? (
          <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 60 }} />
        ) : (
          <Card
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(51, 65, 85, 0.5)',
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            bodyStyle={{ padding: 0, overflow: 'hidden' }}
          >
            <Table
              dataSource={products}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 10, style: { color: '#e2e8f0' } }}
              style={{ backgroundColor: 'transparent' }}
              scroll={{ x: 1000 }}
            />
          </Card>
        )}

        {/* Add/Edit Product Modal */}
        <Modal
          title={
            <span style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 600 }}>
              {isEditing ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
            </span>
          }
          visible={isModalVisible}
          onOk={() => form.submit()}
          onCancel={() => setIsModalVisible(false)}
          okText={isEditing ? 'Cập nhật' : 'Thêm'}
          cancelText="Hủy"
          okButtonProps={{
            style: {
              background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
              border: 'none'
            }
          }}
          style={{
            backgroundColor: '#1e293b'
          }}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveProduct}
            style={{ color: '#f1f5f9', marginTop: 20 }}
          >
            <Form.Item
              label={<span style={{ color: '#e2e8f0' }}>Tên sản phẩm</span>}
              name="title"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: '#e2e8f0' }}>Mô tả</span>}
              name="description"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
              <Input.TextArea rows={3} placeholder="Nhập mô tả sản phẩm" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={<span style={{ color: '#e2e8f0' }}>Giá</span>}
                  name="price"
                  rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                >
                  <InputNumber min={0} placeholder="Nhập giá sản phẩm" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span style={{ color: '#e2e8f0' }}>Danh mục</span>}
                  name="category"
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                >
                  <Select placeholder="Chọn danh mục">
                    {categories.map(cat => <Select.Option key={cat} value={cat}>{cat}</Select.Option>)}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={<span style={{ color: '#e2e8f0' }}>URL ảnh</span>}
              name="image"
            >
              <Input placeholder="Nhập URL ảnh sản phẩm" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default AdminPage;
