import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  const isAuthenticated: boolean = sessionStorage.getItem('isAuthenticated') === 'true';

  return isAuthenticated? <Outlet /> : <Navigate to={'/login'}/>
}

export default ProtectedRoutes