import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    email: "",
    name: "",
    role: "user"
  },
  appLoading: true,
});

// Minimal JWT payload decoder (no validation) to extract role/email/name on client
const decodeTokenPayload = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // atob might not exist in some environments; use Buffer fallback
    let json = '';
    if (typeof atob === 'function') {
      json = decodeURIComponent(Array.from(atob(payload)).map(c => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } else {
      json = Buffer.from(payload, 'base64').toString('utf8');
    }
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
}

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      email: "",
      name: "",
      role: "user"
    }
  });

  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    // initialize auth from token if present
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const payload = decodeTokenPayload(token);
        if (payload && payload.email) {
          setAuth({
            isAuthenticated: true,
            user: {
              email: payload.email || '',
              name: payload.name || '',
              role: payload.role || 'user'
            }
          });
        }
      }
    } catch (err) {
      // ignore and keep logged out
    } finally {
      setAppLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      auth, setAuth, appLoading, setAppLoading
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}
