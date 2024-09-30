import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')) : null);
  const [user, setUser] = useState(() => localStorage.getItem('authUser') ? jwtDecode(localStorage.getItem('authUser')) : null);
  const [loading, setLoading] = useState(true); 

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    let response = await fetch('http://127.0.0.1:8000/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })
    });
    let data = await response.json();
    if (response.status === 200){
        setAuthUser(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem('authUser', JSON.stringify(data));
        navigate('/');
    } else {
        alert('something went wrong');
    }
  };

  const logout = () => {
    setAuthUser(null);
    setUser(null);
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  const updateToken = async () => {
    console.log('update called')
    let response = await fetch('http://127.0.0.1:8000/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'refresh': authUser.refresh })
    });
    let data = await response.json();
    if (response.status === 200){
        setAuthUser(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem('authUser', JSON.stringify(data));
    } else {
        logout();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (authUser) {
        updateToken();
      }
    }, 4000);
    setLoading(false);
    return () => clearInterval(interval);
  }, [authUser]);

  const contextData = {
    user,
    loginUser,
    logout,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

