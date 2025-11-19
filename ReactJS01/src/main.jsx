import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { ConfigProvider, theme } from 'antd'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import ForgotPassword from './pages/forgotPassword.jsx';
import ResetPassword from './pages/resetPassword.jsx';
import ProductsPage from './pages/products.jsx';
import AdminPage from './pages/admin.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'admin',
        element: <AdminPage />
      },
      {
        path: "user",
        element: <UserPage />
      },
    ]
  },
  {
    path: "register",
    element: <RegisterPage />
  },
  {
    path: "login",
    element: <LoginPage />
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "reset-password/:token",
    element: <ResetPassword />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#0ea5e9',
          colorBgBase: '#0f172a',
          colorBorder: '#1e293b',
          colorText: '#e2e8f0',
          borderRadius: 8,
        },
      }}
    >
      <AuthWrapper>
        <RouterProvider router={router} />
      </AuthWrapper>
    </ConfigProvider>
  </React.StrictMode>,
)
