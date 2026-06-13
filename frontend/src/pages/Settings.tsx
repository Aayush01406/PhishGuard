import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Lock, Palette } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Settings: React.FC = () => {
  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email alerts', toggle: true },
        { label: 'Threat notifications', toggle: true },
      ],
    },
    {
      title: 'Security',
      icon: Lock,
      items: [
        { label: 'Future Google OAuth', action: true },
      ],
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { label: 'Theme', value: 'Light' },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-2">Manage your account preferences.</p>
          </div>

          <div className="space-y-6">
            {settingsSections.map((section, sectionIdx) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIdx * 0.1 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
                  </div>

                  <div className="space-y-4">
                    {section.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
                      >
                        <span className="text-slate-700">{item.label}</span>
                        {item.value && <span className="text-slate-500">{item.value}</span>}
                        {item.toggle && (
                          <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        )}
                        {item.action && (
                          <button className="text-primary font-medium hover:text-green-600">
                            Coming Soon
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
