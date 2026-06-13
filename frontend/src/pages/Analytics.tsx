import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Loader2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';
import Sidebar from '../components/Sidebar';
import api from '../lib/api';

interface AnalyticsData {
  scan_activity: Array<{ date: string; scans: number; phishing: number }>;
  risk_distribution: Array<{ name: string; value: number; color: string }>;
  total_scans: number;
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/scans/analytics');
        setAnalytics(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const scanData = analytics?.scan_activity || [
    { date: 'Mon', scans: 0, phishing: 0 },
    { date: 'Tue', scans: 0, phishing: 0 },
    { date: 'Wed', scans: 0, phishing: 0 },
    { date: 'Thu', scans: 0, phishing: 0 },
    { date: 'Fri', scans: 0, phishing: 0 },
    { date: 'Sat', scans: 0, phishing: 0 },
    { date: 'Sun', scans: 0, phishing: 0 },
  ];

  const riskData = analytics?.risk_distribution || [
    { name: 'Safe', value: 0, color: '#22C55E' },
    { name: 'Suspicious', value: 0, color: '#F59E0B' },
    { name: 'High Risk', value: 0, color: '#F97316' },
    { name: 'Phishing', value: 0, color: '#EF4444' },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Threat Analytics</h1>
            <p className="text-slate-600 mt-2">Visualize your security data and trends.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-slate-900">Scan Activity</h2>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scanData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="scans"
                      stroke="#22C55E"
                      strokeWidth={3}
                      dot={{ fill: '#22C55E' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="phishing"
                      stroke="#EF4444"
                      strokeWidth={3}
                      dot={{ fill: '#EF4444' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-slate-900">Risk Distribution</h2>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Analytics;
