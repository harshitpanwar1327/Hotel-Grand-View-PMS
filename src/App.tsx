import './App.css'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoutes from './components/ProtectedRoutes';

const Login = lazy(() => import('./pages/auth/Login'));
const Dashboard = lazy(() => import('./pages/main/Dashboard'));
const CheckIn = lazy(() => import('./pages/main/CheckIn'));
const Bookings = lazy(() => import('./pages/main/Bookings'));
const Rooms = lazy(() => import('./pages/main/Rooms'));
const Hotels = lazy(() => import('./pages/main/Hotels'));
const Navigation = lazy(() => import('./components/Navigation'));

function App() {
  const location = useLocation();
  const hideNavigationBar: string[] = ['/'];

  const isAuthenticated: boolean = sessionStorage.getItem('isAuthenticated') === 'true';

  return (
    <main id='main-content' className='w-full flex overflow-hidden'>
      {!hideNavigationBar.includes(location.pathname) && <Navigation />}

      <Suspense fallback={<div className='grow flex justify-center items-center'>Loading...</div>}>
        <Routes>
          <Route path='/' element={isAuthenticated? <Navigate to={'/dashboard'}/> : <Login />} />

          <Route element={<ProtectedRoutes allowedRoles={["Owner"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/hotels" element={<Hotels />} />
          </Route>

          <Route element={<ProtectedRoutes allowedRoles={["Owner", "Receptionist"]}/>}>
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/bookings" element={<Bookings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </main>
  )
}

export default App