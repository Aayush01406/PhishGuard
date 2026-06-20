import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  Lock,
  ArrowRight,
  Globe,
  Search,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms analyze URLs in real-time to detect phishing threats.'
    },
    {
      icon: Lock,
      title: 'SSL Certificate Check',
      description: 'Verify the security of websites by checking their SSL certificates and encryption status.'
    },
    {
      icon: Globe,
      title: 'Domain Analysis',
      description: 'Examine domain age, history, and reputation to identify potentially malicious websites.'
    },
    {
      icon: BarChart3,
      title: 'Risk Scoring',
      description: 'Comprehensive risk assessment with 0-100 scoring and detailed threat analysis reports.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-green-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">PhishGuard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="bg-primary text-white px-6 py-2.5 rounded-2xl font-medium hover:bg-green-600 transition-all hover:scale-105"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Real-time Phishing Detection
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Smart Protection Against
              <span className="text-primary block mt-2">Phishing Threats</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Detect malicious URLs in real time, block dangerous websites, and browse with confidence using our advanced phishing detection platform.
            </p>

            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-green-600 transition-all hover:scale-105 shadow-lg shadow-primary/20"
            >
              Start Scanning Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-purple-500/20 blur-3xl rounded-3xl"></div>
              <div className="relative bg-white p-12 rounded-3xl shadow-2xl border border-slate-100">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <Shield className="w-24 h-24 text-primary mx-auto mb-4" />
                    <p className="text-slate-600">Your URL will be scanned here</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Protection</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Powerful features to keep you safe from phishing attacks and malicious websites.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-3xl p-10 border border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-slate-900 mb-2">99%</div>
                <div className="text-slate-600">Detection Accuracy</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-slate-900 mb-2">10k+</div>
                <div className="text-slate-600">URLs Scanned Daily</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-slate-900 mb-2">24/7</div>
                <div className="text-slate-600">Protection</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-slate-900 mb-2">500ms</div>
                <div className="text-slate-600">Scan Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Protect Yourself?
            </h2>
            <p className="text-slate-600 mb-8">
              Start scanning URLs today and keep your online activity safe from phishing threats.
            </p>
            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-green-600 transition-all hover:scale-105 shadow-lg shadow-primary/20"
            >
              Scan Your First URL
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
