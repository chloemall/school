import React, { useState } from 'react';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import './Header.css'; // Custom CSS file for styling

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCancel = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/">
          <div className="logo">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-29%20at%2012.49.12%20PM.jpeg?alt=media&token=f7d14585-7ff9-48fe-98c3-3c4e76b453fe"
              alt="SHA Logo"
              className="logo-img"
            />
          </div>
        </Link>

        {/* Title */}
        <div className="site-title">
          <h1>A.I.C Tharaka Bible College</h1>
        </div>

        {/* Desktop Nav Links */}
        <nav className="nav-links">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/roll">Jobs Vacancies</Link></li>
            <li><Link to="/career">Careers</Link></li>

            <li><Link to="/guest">About us</Link></li>
            <li><Link to="/video">Tenders</Link></li>
            <li><Link to="/pdf">Contact Us</Link></li>
          </ul>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </div>
      </div>

      {/* Mobile Modal Menu */}
      <Modal
        title="Menu"
        visible={isMenuOpen}
        onCancel={handleCancel}
        footer={null}
        className="mobile-menu-modal"
      >
        <ul className="mobile-nav">
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
          <li><Link to="/roll" onClick={toggleMenu}>Jobs Vacancies</Link></li>

          <li><Link to="/career" onClick={toggleMenu}>Careers</Link></li>

          <li><Link to="/guest" onClick={toggleMenu}>About us</Link></li>
          <li><Link to="/video" onClick={toggleMenu}>Tenders</Link></li>
          <li><Link to="/pdf" onClick={toggleMenu}>Contact Us</Link></li>
        </ul>
      </Modal>
    </header>
  );
};

export default Header;
