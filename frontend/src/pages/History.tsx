import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../lib/api';

interface Scan {
  id: number;
  url: string;
  risk_score: number;
  prediction: string;
  status: string;
  created_at: string;
}

const History: React.FC = () => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await api.get('/scans/');
        setScans(response.data);
      } catch (error) {
        console.error('Failed to fetch scans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, []);

  const getStatusIcon = (prediction: string) => {
    if (prediction === 'Safe') return CheckCircle;
    if (prediction === 'Phishing') return XCircle;
    return AlertTriangle;
  };

  const getStatusColor = (prediction: string) => {
    if (prediction === 'Safe') return 'text-green-600 bg-green-50';
    if (prediction === 'Phishing') return 'text-red-600 bg-red-50';
    return 'text-yellow-600 bg-yellow-50';
  };

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
            <h1 className="text-3xl font-bold text-slate-900">Scan History</h1>
            <p className="text-slate-600 mt-2">View all your past URL scans.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : scans.length === 0 ? (
              <div className="text-center py-12">
                <HistoryIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">No scans yet</h3>
                <p className="text-slate-500">Start scanning URLs to see your history here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">URL</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Result</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Risk Score</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scans.map((scan, idx) => {
                      const Icon = getStatusIcon(scan.prediction);
                      return (
                        <motion.tr
                          key={scan.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="max-w-xs truncate text-slate-700">{scan.url}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium">
                              <Icon className="w-4 h-4" />
                              {scan.prediction}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-slate-700 font-medium">{scan.risk_score}/100</span>
                          </td>
                          <td className="py-4 px-4 text-slate-500 text-sm">
                            {new Date(scan.created_at).toLocaleDateString()}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default History;
