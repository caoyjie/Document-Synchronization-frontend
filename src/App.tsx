import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import './App.css';

// Navigation component to handle active link styling
const Navigation = () => {
  const location = useLocation();
  
  return (
    <div className="app-links">
      <Link to="/" className={`app-link ${location.pathname === '/' ? 'active' : ''}`}>
        Home
      </Link>
      <Link to="/help" className={`app-link ${location.pathname === '/help' ? 'active' : ''}`}>
        Help
      </Link>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="app-header">
          <div className="title-container">
            <img src={process.env.PUBLIC_URL + '/icon.png'} alt="Sync to Notion Icon" className="app-icon" />
            <h1 className="app-title">Sync to Notion</h1>
          </div>
          <Navigation />
        </div>
        
        <Routes>
          <Route path="/" element={<FileUpload />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer className="app-footer">
          <p>Need assistance? Contact us at <a href="mailto:support@sync2notion.com">support@sync2notion.com</a></p>
        </footer>
      </div>
    </Router>
  );
}

export default App;