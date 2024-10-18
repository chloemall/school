import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './components/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <div className="dark-theme"> {/* Added a CSS class for dark theme */}
          <App />
        </div>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
