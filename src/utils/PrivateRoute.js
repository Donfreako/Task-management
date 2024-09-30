import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

const PrivateRoute = ({children, ...rest}) =>{
    let {user} = useContext(AuthContext)
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;