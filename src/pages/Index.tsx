import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Satellite, Upload, Camera, Radio, Leaf, Building2, Move, ShieldAlert,
  Eye, BarChart3, FileText, Zap, ArrowRight, Menu, X, ChevronRight,
  Brain, Cpu, ScanLine, AlertTriangle, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const },
  }),
};

const productDetails: Record<string, string> = {
  'Camera Detection':
    'The system uses your device camera to capture live video frames and applies AI-based detection in real time. The model analyzes movement, object appearance, and environmental changes as they happen. This method is ideal for quick monitoring, temporary surveillance, and instant visual detection without the need for pre-recorded imagery.',
  'Upload Detection':
    'Users can upload before-and-after images or satellite imagery for comprehensive analysis. The AI compares both images and generates a detailed change detection map highlighting differences. This approach helps identify vegetation change, infrastructure development, land clearing, and object movement with high precision.',
  'Real-time Monitoring':
    'The system continuously monitors incoming image streams or satellite feeds over extended periods. AI automatically detects changes over time, generates alerts, and flags anomalies. This capability is well-suited for border surveillance, environmental monitoring, and long-term infrastructure tracking.',
};

const Index = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const features = [
    { icon: Leaf, title: 'Vegetation Detection', desc: 'Detect green cover changes using NDVI neural analysis across temporal datasets.' },
    { icon: Building2, title: 'Infrastructure Change', desc: 'Identify new buildings, roads, and construction with sub-meter accuracy.' },
    { icon: Move, title: 'Movement Analysis', desc: 'Track object displacement, vehicle patterns, and human activity zones.' },
  ];

  const products = [
    { icon: Camera, title: 'Camera Detection', desc: 'Real-time analysis through device camera with instant AI processing.', color: 'from-purple-500 to-violet-600' },
    { icon: Upload, title: 'Upload Detection', desc: 'Upload satellite or aerial images for comprehensive change analysis.', color: 'from-cyan-500 to-blue-600' },
    { icon: Radio, title: 'Real-time Monitoring', desc: 'Continuous satellite feed monitoring with automated alert system.', color: 'from-pink-500 to-rose-600' },
  ];

  const aiModules = [
    { icon: Leaf, name: 'Vegetation AI', status: 'Active', accuracy: '97.3%' },
    { icon: Building2, name: 'Infrastructure AI', status: 'Active', accuracy: '95.8%' },
    { icon: Move, name: 'Movement AI', status: 'Active', accuracy: '94.1%' },
    { icon: ShieldAlert, name: 'Risk AI', status: 'Active', accuracy: '96.5%' },
  ];

  const toggleProduct = (title: string) => {
    setExpandedProduct(prev => (prev === title ? null : title));
  };

  return (
    <div className="min-h-screen grid-bg">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center glow-purple">
              <Satellite className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-wide">AI Detection</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#solutions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Solutions</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            <Button size="sm" onClick={() => navigate('/login')} className="glow-purple">
              Login
            </Button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:hidden glass-strong border-t border-border px-6 py-4 space-y-3">
            <a href="#home" className="block text-sm text-muted-foreground hover:text-foreground">Home</a>
            <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground">Features</a>
            <a href="#solutions" className="block text-sm text-muted-foreground hover:text-foreground">Solutions</a>
            <a href="#contact" className="block text-sm text-muted-foreground hover:text-foreground">Contact</a>
            <Button size="sm" className="w-full" onClick={() => navigate('/login')}>Login</Button>
          </motion.div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/30 text-xs text-primary mb-6">
              <Zap className="w-3 h-3" /> Powered by Neural Networks
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground mb-6">
              AI Border Change{' '}
              <span className="text-gradient-purple">Detection System</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mb-8">
              Multi-Temporal Neural Network for Satellite Monitoring — detect vegetation loss, infrastructure expansion, and suspicious movements with military-grade precision.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="glow-purple gap-2" onClick={() => navigate('/analyze')}>
                <Upload className="w-4 h-4" /> Upload Image
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
                <Eye className="w-4 h-4" /> Start Detection <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="relative">
            <div className="glass rounded-2xl p-4 glow-mixed relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
                alt="AI Satellite Preview"
                className="rounded-xl w-full h-80 object-cover"
              />
              <div className="absolute inset-0 rounded-2xl scan-line pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 glass rounded-lg px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">Live Analysis Ready</span>
                </div>
                <span className="text-xs font-mono text-accent">98.7% Accuracy</span>
              </div>
            </div>
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-accent/10 blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Core Detection Features</h2>
            <p className="text-muted-foreground max-w-md mx-auto">AI-powered modules designed for comprehensive satellite image analysis.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
                className="glass rounded-2xl p-6 hover-lift group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4 group-hover:glow-purple transition-shadow">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI EXPLANATION */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="glass rounded-2xl p-8 glow-mixed">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">AI Intelligence Report</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-accent mb-2">English Explanation</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The system detected noticeable vegetation change between the two temporal satellite images. The change appears distributed across the central region indicating land cover variation possibly due to seasonal patterns or human intervention.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-accent mb-2">Detailed Analysis</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  NDVI differential analysis shows a 24% reduction in green cover. Spectral signatures indicate deforestation activity with secondary indicators of soil disturbance consistent with land clearing operations.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-accent mb-2">Risk Level</h4>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-warning to-destructive" />
                  </div>
                  <span className="text-sm font-mono text-warning">Moderate-High</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-accent mb-2">Extra Information</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Recommended: Deploy ground-truth verification within 72 hours. Historical pattern suggests accelerating change rate. Next satellite pass scheduled in 48 hours.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS / SOLUTIONS */}
      <section id="solutions" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Detection Solutions</h2>
            <p className="text-muted-foreground">Choose your preferred analysis method.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <motion.div key={p.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}>
                <div className="glass rounded-2xl p-6 hover-lift group cursor-pointer relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${p.color}`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-5`}>
                    <p.icon className="w-7 h-7 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
                  <button
                    onClick={() => toggleProduct(p.title)}
                    className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    {expandedProduct === p.title ? 'Show Less' : 'Learn More'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedProduct === p.title ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                <AnimatePresence>
                  {expandedProduct === p.title && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="glass rounded-2xl p-5 mt-3 border border-primary/20">
                        <p className="text-sm text-muted-foreground leading-relaxed">{productDetails[p.title]}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI MODULES */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">AI Modules</h2>
            <p className="text-muted-foreground">Specialized neural networks working in parallel.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {aiModules.map((m, i) => (
              <motion.div key={m.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
                className="glass rounded-2xl p-6 text-center hover-lift group cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-4 group-hover:glow-purple transition-shadow">
                  <m.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">{m.name}</h4>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-success">{m.status}</span>
                </div>
                <span className="text-xs font-mono text-accent">{m.accuracy}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Satellite className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">AI Detection</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 AI Border Change Detection System. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
