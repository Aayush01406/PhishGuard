import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Ban, Trash2, Shield } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../lib/api';

interface BlockedDomain {
  id: number;
  domain_name: string;
  risk_score: number;
  risk_level: string;
  reason: string;
  blocked_at: string;
}

const BlockedDomains: React.FC = () => {
  const [domains, setDomains] = useState<BlockedDomain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await api.get('/blocked-domains/');
      setDomains(response.data);
    } catch (error) {
      console.error('Failed to fetch blocked domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/blocked-domains/${id}`);
      fetchDomains();
    } catch (error) {
      console.error('Failed to remove domain:', error);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Safe':
        return 'text-green-600 bg-green-100';
      case 'Suspicious':
        return 'text-yellow-600 bg-yellow-100';
      case 'High Risk':
        return 'text-orange-600 bg-orange-100';
      case 'Phishing':
      case 'Blocked':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
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
            <h1 className="text-3xl font-bold text-slate-900">Blocked Domains</h1>
            <p className="text-slate-600 mt-2">Domains automatically blocked by PhishGuard.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : domains.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">No blocked domains</h3>
                <p className="text-slate-500">Great job! No phishing domains detected yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-4 px-3 text-sm font-semibold text-slate-600">Domain</th>
                      <th className="text-left py-4 px-3 text-sm font-semibold text-slate-600">Risk Score</th>
                      <th className="text-left py-4 px-3 text-sm font-semibold text-slate-600">Level</th>
                      <th className="text-left py-4 px-3 text-sm font-semibold text-slate-600">Date</th>
                      <th className="text-right py-4 px-3 text-sm font-semibold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domains.map((domain, idx) => (
                      <motion.tr
                        key={domain.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-3">
                          <div className="font-medium text-slate-900">{domain.domain_name}</div>
                          <div className="text-xs text-slate-500">{domain.reason}</div>
                        </td>
                        <td className="py-4 px-3">
                          <div className="text-lg font-semibold text-slate-900">{domain.risk_score}/100</div>
                        </td>
                        <td className="py-4 px-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(domain.risk_level)}`}>
                            {domain.risk_level}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-slate-500">
                          {new Date(domain.blocked_at).toLocaleDateString('en-GB')}
                        </td>
                        <td className="py-4 px-3 text-right">
                          <button
                            onClick={() => handleDelete(domain.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
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

export default BlockedDomains;
