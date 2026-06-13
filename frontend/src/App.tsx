import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import History from './pages/History';
import BlockedDomains from './pages/BlockedDomains';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  return (
    <Router>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-background"
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/history" element={<History />} />
          <Route path="/blocked" element={<BlockedDomains />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </motion.div>
    </Router>
  );
};

export default App;
