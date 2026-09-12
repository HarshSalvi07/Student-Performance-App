import { Routes, Route, useLocation } from 'react-router-dom'
import Register from './pages/register'
import Home from './pages/home'
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Navbar from './pages/navbar';
import Profile from './pages/profile';
import History from './pages/history';
import About from './pages/about';

function App() {
  const location = useLocation()

  const hideNavbar = 
  location.pathname === "/login" ||
  location.pathname === "/register"

  return (
    <div className='min-h-screen bg-[#F6F8FC]'>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/history' element={<History />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </div>
  );
}

export default App;