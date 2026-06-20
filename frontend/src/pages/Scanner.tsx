import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Lock,
  Globe,
  Clock,
  AlertCircle,
  Check,
  ShieldCheck
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../lib/api';

interface ScanResult {
  id: number;
  url: string;
  risk_score: number;
  prediction: string;
  status: string;
  details?: any;
}

const Scanner: React.FC = () => {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);

  const scanSteps = [
    { name: "Validating URL", icon: Check },
    { name: "Checking SSL Certificate", icon: Lock },
    { name: "Analyzing Domain", icon: Globe },
    { name: "Checking URL Structure", icon: Search },
    { name: "Scanning for suspicious keywords", icon: AlertCircle },
    { name: "Running AI Detection", icon: ShieldCheck },
    { name: "Generating Threat Report", icon: CheckCircle },
  ];

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setScanning(true);
    setScanStep(0);
    setResult(null);

    for (let i = 0; i < scanSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setScanStep(i);
    }

    try {
      const response = await api.post('/scans/', { url });
      setResult(response.data);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setScanning(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 20) return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', stroke: '#22c55e' };
    if (score <= 50) return { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200', stroke: '#f59e0b' };
    if (score <= 80) return { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', stroke: '#f97316' };
    return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', stroke: '#ef4444' };
  };

  // const getRiskIcon = (score: number) => {
  //   if (score <= 20) return CheckCircle;
  //   if (score <= 50) return AlertTriangle;
  //   return XCircle;
  // };

  const calculateStrokeDashoffset = (score: number) => {
    const circumference = 2 * Math.PI * 45;
    return circumference - (score / 100) * circumference;
  };

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
            <h1 className="text-3xl font-bold text-slate-900">URL Scanner</h1>
            <p className="text-slate-600 mt-2">Scan any URL to check if it's safe to visit.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
            <form onSubmit={handleScan} className="mb-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-lg transition-all"
                    disabled={scanning}
                  />
                </div>
                <button
                  type="submit"
                  disabled={scanning || !url.trim()}
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-semibold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {scanning ? <Search className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  {scanning ? 'Scanning...' : 'Scan URL'}
                </button>
              </div>
            </form>

            <AnimatePresence>
              {scanning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <p className="text-slate-700 font-medium mb-4">Analyzing URL...</p>
                  {scanSteps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: idx <= scanStep ? 1 : 0, x: idx <= scanStep ? 0 : -20 }}
                      className={`flex items-center gap-3 ${idx <= scanStep ? 'opacity-100' : 'opacity-30'}`}
                    >
                      {idx < scanStep ? (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      ) : idx === scanStep ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Search className="w-5 h-5 text-primary" />
                        </motion.div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-slate-200 rounded-full" />
                      )}
                      <span className={`text-sm ${idx <= scanStep ? 'text-slate-700' : 'text-slate-500'}`}>{step.name}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <div className="text-center mb-8">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-48 h-48 transform -rotate-90">
                        <circle
                          cx="96"
                          cy="96"
                          r="45"
                          stroke="#e2e8f0"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="45"
                          stroke={getRiskColor(result.risk_score).stroke}
                          strokeWidth="12"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 45}
                          strokeDashoffset={calculateStrokeDashoffset(result.risk_score)}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className={`text-5xl font-bold ${getRiskColor(result.risk_score).text}`}>
                          {result.risk_score}
                        </span>
                        <span className="text-sm text-slate-500">Risk Score</span>
                      </div>
                    </div>
                    <h2 className={`text-2xl font-bold mt-4 ${getRiskColor(result.risk_score).text}`}>{result.status}</h2>
                    <p className="text-slate-600 break-all mt-2">{result.url}</p>
                  </div>

                  {result.details && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-50 rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Lock className="w-5 h-5 text-slate-600" />
                            <span className="font-medium text-slate-700">SSL Status</span>
                          </div>
                          <p className="text-slate-600">
                            {result.details.ssl?.valid ? (
                              <span className="text-green-600">✅ Valid</span>
                            ) : (
                              <span className="text-red-600">❌ Invalid</span>
                            )}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-slate-600" />
                            <span className="font-medium text-slate-700">Domain Age</span>
                          </div>
                          <p className="text-slate-600">{result.details.domain?.age_days} days</p>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="w-5 h-5 text-slate-600" />
                            <span className="font-medium text-slate-700">Confidence</span>
                          </div>
                          <p className="text-slate-600">{result.details.confidence}%</p>
                        </div>
                      </div>

                      {result.details.reasons && result.details.reasons.length > 0 && (
                        <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            Detection Reasons
                          </h3>
                          <ul className="space-y-2">
                            {result.details.reasons.map((reason: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-700">
                                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.details.recommendations && (
                        <div className="bg-blue-50 rounded-2xl p-6">
                          <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            Recommendations
                          </h3>
                          <ul className="space-y-2">
                            {result.details.recommendations.map((rec: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-blue-800">
                                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Scanner;
