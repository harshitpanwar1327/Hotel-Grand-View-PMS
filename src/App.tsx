import './App.css'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoutes from './components/ProtectedRoutes';
import Login from './pages/auth/Login';
import Navigation from './components/Navigation';

const Dashboard = lazy(() => import('./pages/main/Dashboard'));
const CheckIn = lazy(() => import('./pages/main/CheckIn'));
const Bookings = lazy(() => import('./pages/main/Bookings'));
const Rooms = lazy(() => import('./pages/main/Rooms'));

function App() {
  const location = useLocation();
  const hideNavigationBar: string[] = ['/', '/login'];

  const isAuthenticated: boolean = sessionStorage.getItem('isAuthenticated') === 'true';

  return (
    <main id='main-content'>
      {!hideNavigationBar.includes(location.pathname) && <Navigation />}

      <Suspense fallback={<div className='flex justify-center items-center w-screen h-screen'>Loading...</div>}>
        <Routes>
          <Route path='/' element={isAuthenticated? <Navigate to={'/dashboard'}/> : <Login />} />
          <Route path='/login' element={isAuthenticated? <Navigate to={'/dashboard'}/> : <Login />} />

          <Route element={<ProtectedRoutes />}>
            <Route path='/dashboard' element={<Dashboard />}/>
            <Route path='/check-in' element={<CheckIn />}/>
            <Route path='/bookings' element={<Bookings />}/>
            <Route path='/rooms' element={<Rooms />}/>
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </main>
  )
}

export default App