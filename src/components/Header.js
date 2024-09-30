import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import TaskList from '../tasklist';

const Header = () => {
    let { user, logout } = useContext(AuthContext);
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to={'/'} style={{ marginRight: '10px' }}>Home</Link>
            <span style={{ marginRight: '10px' }}>|</span>
            {
                user ? (
                    <button onClick={logout} style={{ cursor: 'pointer' }}>Logout</button>
                ) : (
                    <Link to={'/login'}>Login</Link>
                )
            }
            {user && <TaskList />}
        </div>
    );
}

export default Header;
