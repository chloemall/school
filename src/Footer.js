import React from 'react';
import {
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined, MailOutlined 
} from '@ant-design/icons';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo and College Description */}
        <div className="footer-section footer-about">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-29%20at%2012.49.12%20PM.jpeg?alt=media&token=f7d14585-7ff9-48fe-98c3-3c4e76b453fe"
            alt="College Logo"
            className="footer-logo"
          />
          <p className="footer-text">
            The college prepares students for ministry through biblical
            teaching, leadership training, and cross-cultural communication for
            diverse contexts.
          </p>
        </div>

        {/* Contact Information */}
        <div className="footer-section footer-contact">
          <h3>Contact Us</h3>
          <p>
            <PhoneOutlined /> +254 712 345 678
          </p>
          <p>
              <MailOutlined /> <a href="mailto:aictharakabiblecollege@gmail.com"></a>aictharakabiblecollege@gmail.com
            </p>
            <p></p>
          <p>
            <EnvironmentOutlined /> Tharaka, Kenya
          </p>
          <p>
            <ClockCircleOutlined /> Mon-Fri: 8:30am - 6pm
          </p>
          <p>Sat: 9am - 5pm</p>
          <p>
          A.I.C Tharaka Bible College is located at A.I.C Rugiika 17 kilometers from Mitunguu along Mitunguu- Marimanti road which is in Marimanti ward, Tharaka sub county in Tharaka Nithi county in Kenya. Our Nairobi campus is located at A.I.C Kayole North which is Kayole near Mihang'o stage.
          </p>
        </div>

        {/* Footer Links */}
        <div className="footer-section footer-links">
          <h3>Quick Links</h3>
            <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/roll">Jobs Vacancies</Link></li>
            <li><Link to="/career">Careers</Link></li>

            <li><Link to="/guest">About us</Link></li>
            <li><Link to="/video">Tenders</Link></li>
            <li><Link to="/pdf">Contact Us</Link></li>
          
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
