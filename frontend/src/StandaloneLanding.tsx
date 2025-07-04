import React from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';

const StandaloneLanding: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default StandaloneLanding;
