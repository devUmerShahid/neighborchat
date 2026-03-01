import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Rooms from './pages/Rooms';
import Chats from './pages/Chats';
import ChatRoom from './pages/ChatRoom';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authPages = ['/', '/login', '/signup'];
    if (user) {
      // Redirect to rooms only if on an auth page
      if (authPages.includes(location.pathname)) {
        navigate('/rooms');
      }
    } else {
      // Redirect to login if on a protected page
      if (!authPages.includes(location.pathname)) {
        navigate('/login');
      }
    }
  }, [user]);

  return (
    <>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* App routes */}
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/chat/:roomId" element={<ChatRoom />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomNav />
    </>
  );
}

export default App;