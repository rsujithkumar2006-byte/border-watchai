import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Satellite, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = isLogin ? await login(email, password) : await signup(name, email, password);
      if (success) {
        toast.success(isLogin ? 'Welcome back!' : 'Account created!');
        navigate('/dashboard');
      }
    } catch {
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(174 72% 46%) 1px, transparent 1px), linear-gradient(90deg, hsl(174 72% 46%) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-primary">
              <Satellite className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SENTINEL</h1>
              <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase">Change Detection AI</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-8">
          <div className="flex gap-2 mb-6">
            {['Login', 'Sign Up'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setIsLogin(i === 0)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  (i === 0 ? isLogin : !isLogin)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required={!isLogin}
                className="bg-background/50 border-border"
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="bg-background/50 border-border"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="bg-background/50 border-border"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2"><Eye className="w-4 h-4 animate-pulse" /> Processing...</span>
              ) : (
                <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> {isLogin ? 'Login' : 'Create Account'}</span>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Multi-Temporal Neural Network Model for Border Intrusion & Infrastructure Change Detection
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
