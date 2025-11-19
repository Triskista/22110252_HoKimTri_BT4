import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, Spin } from 'antd';
import { getAllUserApi } from '../util/api';

const UserPage = () => {
  const [datasource, setDatasource] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    setLoading(true)
    const res = await getAllUserApi();
    if (res && res.length) {
      setDatasource(res)
    }
    setLoading(false)
  }

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <span style={{ color: '#0ea5e9', fontWeight: 500 }}>{text}</span>,
      width: 250
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ color: '#f1f5f9' }}>{text}</span>,
      width: 200
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (text) => (
        <Tag
          color={text === 'admin' ? 'red' : 'green'}
          style={{
            fontSize: 12,
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: 6
          }}
        >
          {text?.toUpperCase() || 'USER'}
        </Tag>
      ),
      width: 120
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #082f49 100%)',
      padding: '60px 20px 40px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            Danh Sách Người Dùng
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: 14 }}>
            Tổng người dùng: <span style={{ fontWeight: 700, color: '#0ea5e9' }}>{datasource.length}</span>
          </p>
        </div>

        {/* Users Table */}
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
              bordered
              dataSource={datasource}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 10, style: { color: '#e2e8f0' } }}
              style={{ backgroundColor: 'transparent' }}
              scroll={{ x: 600 }}
            />
          </Card>
        )}
      </div>
    </div>
  )
}

export default UserPage;
