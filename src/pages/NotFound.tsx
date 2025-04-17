import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="home-link">
          <svg className="home-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 