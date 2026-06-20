import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Shield,
  Search,
  History,
  Ban,
  BarChart3,
  Settings,
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/dashboard', icon: Shield, label: 'Dashboard' },
    { path: '/scanner', icon: Search, label: 'URL Scanner' },
    { path: '/history', icon: History, label: 'Scan History' },
    { path: '/blocked', icon: Ban, label: 'Blocked Domains' },
    { path: '/analytics', icon: BarChart3, label: 'Threat Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col"
    >
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-green-600 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">PhishGuard</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
