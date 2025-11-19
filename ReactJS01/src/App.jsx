import { Outlet } from 'react-router-dom';
import Header from './components/layout/header';
import axios from './util/axios.customize';
import { useContext, useEffect } from 'react';
import { AuthContext } from './components/context/auth.context';
import { Spin } from 'antd';

function App() {
  const { auth, setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      // avoid calling /account when there is no token (no need)
      const token = localStorage.getItem('access_token');
      if (!token) {
        setAppLoading(false);
        return;
      }

      try {
        const res = await axios.get('/v1/api/account');
        // Only set auth if backend returned a user object
        if (res && res.user && res.user.email) {
          setAuth({
            isAuthenticated: true,
            user: {
              email: res.user.email,
              name: res.user.name || '',
              role: res.user.role || 'user'
            }
          })
        } else {
          // If response shape is unexpected, treat as unauthenticated only if no token exists
          if (!localStorage.getItem('access_token')) {
            setAuth({ isAuthenticated: false, user: {} })
          }
        }
      } catch (error) {
        console.log("User not authenticated", error);
        // Do not override auth if a token exists (prevents race with a recent login)
        if (!localStorage.getItem('access_token')) {
          setAuth({ isAuthenticated: false, user: {} })
        }
      } finally {
        setAppLoading(false);
      }
    }

    fetchAccount()
  }, [setAuth, setAppLoading])

  return (
    <>
      {appLoading === true ?
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          <Spin />
        </div>
        :
        <>
          <Header />
          <Outlet />
        </>
      }
    </>
  )
}

export default App
