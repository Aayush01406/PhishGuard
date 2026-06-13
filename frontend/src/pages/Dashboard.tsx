import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Search,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Clock,
  Ban
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../lib/api';

interface Stats {
  total_scans: number;
  phishing_detected: number;
  safe_urls: number;
  detection_accuracy: number;
}

interface Scan {
  id: number;
  url: string;
  risk_score: number;
  prediction: string;
  status: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    total_scans: 0,
    phishing_detected: 0,
    safe_urls: 0,
    detection_accuracy: 94.7,
  });
  const [blockedCount, setBlockedCount] = useState(0);
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, scansResponse, blockedStatsResponse] = await Promise.all([
          api.get('/scans/stats'),
          api.get('/scans/'),
          api.get('/blocked-domains/stats')
        ]);
        setStats(statsResponse.data);
        setRecentScans(scansResponse.data.slice(0, 5));
        setBlockedCount(blockedStatsResponse.data.total_blocked);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Scans',
      value: stats.total_scans,
      icon: Search,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Phishing Detected',
      value: stats.phishing_detected,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      title: 'Safe URLs',
      value: stats.safe_urls,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Detection Accuracy',
      value: `${stats.detection_accuracy.toFixed(1)}%`,
      icon: Shield,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Blocked Domains',
      value: blockedCount,
      icon: Ban,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  const getRiskColor = (score: number) => {
    if (score <= 20) return 'text-green-600';
    if (score <= 50) return 'text-yellow-600';
    if (score <= 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskIcon = (prediction: string) => {
    if (prediction === 'Safe') return CheckCircle;
    return AlertTriangle;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-2">Welcome back! Here's your security overview.</p>
            </div>
            <Link
              to="/scanner"
              className="bg-primary text-white px-6 py-3 rounded-2xl font-semibold hover:bg-green-600 transition-all flex items-center gap-2"
            >
              New Scan
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {loading ? '...' : card.value}
                  </div>
                  <div className="text-sm text-slate-600">{card.title}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Scans */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Recent Scans</h2>
                <Link
                  to="/history"
                  className="text-primary text-sm font-medium hover:text-green-600"
                >
                  View all
                </Link>
              </div>
              {recentScans.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No scans yet</h3>
                  <p className="text-slate-500 mb-4">Start scanning URLs to see your history here.</p>
                  <Link
                    to="/scanner"
                    className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-green-600"
                  >
                    Scan a URL
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentScans.map((scan, idx) => {
                    const Icon = getRiskIcon(scan.prediction);
                    return (
                      <motion.div
                        key={scan.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scan.prediction === 'Safe' ? 'bg-green-100' : 'bg-red-100'}`}>
                            <Icon className={`w-5 h-5 ${scan.prediction === 'Safe' ? 'text-green-600' : 'text-red-600'}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate max-w-xs">{scan.url}</div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              {new Date(scan.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${getRiskColor(scan.risk_score)}`}>{scan.risk_score}</div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Security Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Security Tips</h2>
              <div className="space-y-4">
                {[
                  { tip: "Always verify URLs carefully before entering any credentials.", icon: Shield },
                  { tip: "Check for typos in domain names — phishers often use similar-looking domains.", icon: Search },
                  { tip: "Only visit sites with valid SSL certificates and HTTPS.", icon: CheckCircle },
                  { tip: "Avoid clicking on shortened URLs from unknown senders.", icon: AlertTriangle }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-slate-700 text-sm">{item.tip}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
