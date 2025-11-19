import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Button } from 'antd';
import HomeOutlined from '@ant-design/icons/HomeOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import UserGroupAddOutlined from '@ant-design/icons/UserGroupAddOutlined';
import ShoppingOutlined from '@ant-design/icons/ShoppingOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import { AuthContext } from '../context/auth.context';

const Header = () => {

  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);

  const items = [
    {
      label: <Link to="/">Home</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="/products">Products</Link>,
      key: 'products',
      icon: <ShoppingOutlined />,
    },
    ...(auth.isAuthenticated && auth.user?.role === 'admin' ? [
      {
        label: <Link to="/admin">Admin</Link>,
        key: 'admin',
        icon: <LockOutlined />,
      }
    ] : []),
    ...(auth.isAuthenticated ? [
      {
        label: <Link to="/user">Users</Link>,
        key: 'user',
        icon: <UserGroupAddOutlined />,
      }
    ] : []),
    {
      label: `${auth?.user?.name ?? "Guest"}`,
      key: 'subMenu',
      icon: <SettingOutlined />,
      children: auth.isAuthenticated ? [
        {
          label: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <LogoutOutlined />
            Logout
          </span>,
          key: 'logout',
          onClick: () => {
            localStorage.clear("access_token");
            setAuth({
              isAuthenticated: false,
              user: {}
            });
            navigate("/");
          }
        }
      ] : [
        {
          label: <Link to="/login">Đăng nhập</Link>,
          key: 'login',
        }
      ],
    },
  ];

  const [current, setCurrent] = useState('home');
  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
      style={{
        background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)',
        borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
      }}
      theme="dark"
    />
  );
}

export default Header;
