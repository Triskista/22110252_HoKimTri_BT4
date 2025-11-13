import { Result } from 'antd';
import CrownOutlined from '@ant-design/icons/CrownOutlined';
import { useContext } from 'react';
import { AuthContext } from '../components/context/auth.context';

const HomePage = () => {
  const { auth, appLoading } = useContext(AuthContext);
  
  return (
    <div style={{ padding: 20 }}>
      <Result
        icon={<CrownOutlined />}
        title="TRANG CHỦ NHẬP WEB TOKEN (ReactJS.05) - Hãy Đăng Kí Tài Khoản"
      />
      <div style={{ marginTop: 20, textAlign: 'center', color: '#666' }}>
        <p>Debug Info:</p>
        <p>appLoading: {appLoading ? 'true' : 'false'}</p>
        <p>isAuthenticated: {auth?.isAuthenticated ? 'true' : 'false'}</p>
        <p>userName: {auth?.user?.name || 'N/A'}</p>
      </div>
    </div>
  )
}

export default HomePage;
