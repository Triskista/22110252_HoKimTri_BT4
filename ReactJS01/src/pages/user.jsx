import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { getAllUserApi } from '../util/api';

const UserPage = () => {
  const [datasource, setDatasource] = useState([])

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    const res = await getAllUserApi();
    if (res && res.length) {
      setDatasource(res)
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Table
        bordered
        dataSource={datasource}
        columns={columns}
        rowKey="_id"
      />
    </div>
  )
}

export default UserPage;
