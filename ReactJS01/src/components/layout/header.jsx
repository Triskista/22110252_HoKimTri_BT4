import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import HomeOutlined from '@ant-design/icons/HomeOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import UserGroupAddOutlined from '@ant-design/icons/UserGroupAddOutlined';
import { AuthContext } from '../context/auth.context';

const Header = () => {

  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log(">>> check auth ", auth)

  const items = [
    {
      label: <Link to="/">Home Page</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    ...(auth.isAuthenticated ? [
      {
        label: <Link to="/user">Users</Link>,
        key: 'user',
        icon: <UserGroupAddOutlined />,
      }
    ] : []),
    {
      label: `Welcome ${auth?.user?.name ?? ""}`,
      key: 'subMenu',
      icon: <SettingOutlined />,
      children: auth.isAuthenticated ? [
        {
          label: <span onClick={() => {
            localStorage.clear("access_token");
            setAuth({
              isAuthenticated: false,
              user: {}
            });
            navigate("/");
          }}>Logout</span>,
          key: 'logout',
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
    console.log('click ', e);
    setCurrent(e.key);
  };

  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
}

export default Header;
