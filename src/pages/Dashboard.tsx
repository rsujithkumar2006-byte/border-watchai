import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Satellite, Upload, History, CreditCard, LogOut, Shield, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const history = JSON.parse(localStorage.getItem('sentinel_history') || '[]');
    const total = history.length;
    const threats = history.filter((h: any) => h.isThreat).length;
    const safe = total - threats;
    return [
      { label: 'Analyses Done', value: String(total), icon: Activity, color: 'text-primary' },
      { label: 'Threats Detected', value: String(threats), icon: AlertTriangle, color: 'text-warning' },
      { label: 'Safe Zones', value: String(safe), icon: CheckCircle, color: 'text-success' },
    ];
  }, []);

  const navItems = [
    { label: 'New Analysis', icon: Upload, path: '/analyze', desc: 'Upload satellite images for change detection' },
    { label: 'History', icon: History, path: '/history', desc: 'View past analysis results' },
    { label: 'Subscription', icon: CreditCard, path: '/subscription', desc: 'Manage your plan & payments' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Satellite className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-foreground tracking-wide">SENTINEL</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">Welcome, {user?.name}</span>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Command Center
          </h1>
          <p className="text-muted-foreground">Multi-Temporal Neural Network Change Detection System</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-2xl font-bold text-foreground">{s.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Nav Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {navItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              onClick={() => navigate(item.path)}
              className="glass rounded-xl p-6 text-left hover:border-primary/50 transition-all group"
            >
              <item.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-1">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
