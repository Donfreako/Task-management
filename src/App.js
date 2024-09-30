import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import AuthContext from './context/AuthContext'
import React,{useContext} from 'react'

function App() {
  let {user} = useContext(AuthContext);
  return (
    <Router>
    <AuthProvider>
    <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>        
    </div>
    </AuthProvider>
    </Router>
  );
}

export default App;
