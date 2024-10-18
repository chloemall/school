// Import necessary modules
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Button } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import Home from './modules/Home';
import SideMenu from './components/SideMenu';
import Login from './modules/Login';
import { useAuth } from './components/AuthContext';
import Library from './modules/Library';
import Roll from './modules/Roll';
import Pdf from './modules/Pdf';
import List from './modules/List';
import Video from './modules/Video';
import Guest from './modules/Guest';
import Students from './modules/Students';
import Subject from './modules/Subject';
import Career from './modules/Career';
import Exam from './modules/Exam';
import Marks from './modules/Marks';
import Dash from './modules/Dash';
import Tube from './modules/Tube';
import Footer from './Footer';
import Header from './Header'; // New Header for specific pages

const { Sider, Content } = Layout;

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulating loading for 1 second, replace with your actual authentication check logic

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      if (!user && !['/', '/pdf', '/login', '/roll', '/video', '/career', '/guest'].includes(location.pathname)) {
        navigate('/login');
      }
    }, 2500);

    return () => clearTimeout(redirectTimer);
  }, [user, location.pathname, navigate]);

  useEffect(() => {
    const logoutTimer = setTimeout(() => {
      setUser(null);
    }, 3600000); // 1 hour

    return () => clearTimeout(logoutTimer);
  }, [user, setUser]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    backgroundColor: '#333',
    zIndex: 999,
    display: collapsed ? 'none' : 'block',
  };

  const isLoginPage = location.pathname === '/login';
  const isHomePage = location.pathname === '/';
  const isRollPage = location.pathname === '/roll';
  const isCareerPage = location.pathname === '/career';
  const isVideoPage = location.pathname === '/video';
  const isGuestPage = location.pathname === '/guest';
  const isPdfPage = location.pathname === '/pdf';
  
  // Pages to show the new header
  const showNewHeader = isHomePage || isLoginPage || isRollPage || isVideoPage || isCareerPage || isGuestPage || isPdfPage;

  const showMenuIcon = !showNewHeader; // Hide menu icon on pages with the new header

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {showMenuIcon && ( // Conditionally render the sidebar and toggle button
        <>
          <div style={{ position: 'fixed', top: 20, left: 20, zIndex: 1000 }}>
            <Button type="link" onClick={toggleSidebar} style={{ borderRadius: '50%', backgroundColor: 'green', padding: 10 }}>
              {collapsed ? (
                <MenuOutlined style={{ fontSize: '15px', color: '#fff' }} />
              ) : (
                <CloseOutlined style={{ fontSize: '15px', color: '#fff' }} />
              )}
            </Button>
          </div>
          <div style={sidebarStyle}>
            <Sider collapsible collapsed={collapsed} trigger={null}>
              <SideMenu />
            </Sider>
          </div>
        </>
      )}

      <Layout style={{ marginLeft: showMenuIcon ? (collapsed ? 0 : 200) : 0, transition: 'margin-left 0.3s ease' }}>
        
        {/* Conditionally render the new header on specific pages */}
        {showNewHeader && <Header />}
        
        <Content style={{ padding: '20px' }}>
          <Routes>
            <Route path="/list" element={user ? <List /> : <Navigate to="/login" />} />
            <Route path="/library" element={user ? <Library /> : <Navigate to="/login" />} />
            <Route path="/students" element={user ? <Students /> : <Navigate to="/login" />} />
            <Route path="/subject" element={user ? <Subject /> : <Navigate to="/login" />} />
            <Route path="/exam" element={user ? <Exam /> : <Navigate to="/login" />} />
            <Route path="/marks" element={user ? <Marks /> : <Navigate to="/login" />} />
            <Route path="/dash" element={user ? <Dash /> : <Navigate to="/login" />} />
            <Route path="/tube" element={user ? <Tube /> : <Navigate to="/login" />} />
            
            <Route path="/roll" element={<Roll />} />
            <Route path="/pdf" element={<Pdf />} />
            <Route path="/career" element={<Career />} />
            <Route path="/login" element={<Login />} />
            <Route path="/video" element={<Video />} />
            <Route path="/guest" element={<Guest />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Content>
        
        <Footer /> {/* Footer component rendered here */}
      </Layout>
    </Layout>
  );
}

export default App;
