import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Smartphone, ArrowLeft, CheckCircle, Share, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPage = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) setIsInstalled(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Smartphone className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">Install App</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-24 h-24 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center">
            <Smartphone className="w-12 h-12 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Install SENTINEL</h1>
            <p className="text-muted-foreground">
              Add SENTINEL to your home screen for instant access, offline support, and a native app experience.
            </p>
          </div>

          {isInstalled ? (
            <div className="glass rounded-xl p-6 space-y-3">
              <CheckCircle className="w-12 h-12 text-primary mx-auto" />
              <p className="text-foreground font-semibold">Already Installed!</p>
              <p className="text-sm text-muted-foreground">SENTINEL is on your home screen. Open it from there for the best experience.</p>
            </div>
          ) : isIOS ? (
            <div className="glass rounded-xl p-6 space-y-4 text-left">
              <p className="text-sm font-medium text-foreground">To install on iPhone/iPad:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">1</div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Tap the <Share className="w-4 h-4 inline text-primary" /> Share button in Safari
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">2</div>
                  <p className="text-sm text-muted-foreground">Scroll down and tap "Add to Home Screen"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">3</div>
                  <p className="text-sm text-muted-foreground">Tap "Add" to confirm</p>
                </div>
              </div>
            </div>
          ) : deferredPrompt ? (
            <Button onClick={handleInstall} size="lg" className="w-full text-lg py-6">
              <Download className="w-5 h-5" /> Install SENTINEL
            </Button>
          ) : (
            <div className="glass rounded-xl p-6 space-y-4 text-left">
              <p className="text-sm font-medium text-foreground">To install on Android:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">1</div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Tap <MoreVertical className="w-4 h-4 inline text-primary" /> menu in Chrome
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">2</div>
                  <p className="text-sm text-muted-foreground">Tap "Add to Home screen" or "Install app"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">3</div>
                  <p className="text-sm text-muted-foreground">Tap "Install" to confirm</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✓ Works offline</p>
            <p>✓ Camera access for live capture</p>
            <p>✓ Fast & lightweight</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default InstallPage;
