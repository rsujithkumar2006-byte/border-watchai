import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Camera, Video, VideoOff, Loader2, Shield, AlertTriangle,
  CheckCircle, Eye, X, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import FloatingChatbot from '@/components/FloatingChatbot';

interface Detection {
  id: string;
  timestamp: string;
  result: string;
  frameUrl: string;
  alertLevel: string;
}

const LiveDetectionPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [autoMode, setAutoMode] = useState(false);
  const autoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraOn(true);
      toast.success('Camera started');
    } catch {
      toast.error('Camera access denied. Please allow camera permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
    setAutoMode(false);
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
    }
  }, []);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return null;
    const canvas = canvasRef.current;
    // Resize to max 640px wide to keep payload small
    const scale = Math.min(1, 640 / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
    // Validate it's not empty
    if (!dataUrl || dataUrl === 'data:,' || dataUrl.length < 100) return null;
    return dataUrl;
  }, []);

  const analyzeFrame = useCallback(async () => {
    if (analyzing) return;
    const frame = captureFrame();
    if (!frame) {
      toast.error('No camera frame available');
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('vision-detect', {
        body: { image: frame },
      });

      if (error) {
        toast.error('Analysis failed: ' + error.message);
        setAnalyzing(false);
        return;
      }

      const result = data?.result || 'No result';
      const alertLevel = result.includes('Critical')
        ? 'Critical'
        : result.includes('High')
        ? 'High'
        : result.includes('Medium')
        ? 'Medium'
        : result.includes('Low')
        ? 'Low'
        : 'None';

      const detection: Detection = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        result,
        frameUrl: frame,
        alertLevel,
      };

      setDetections((prev) => [detection, ...prev].slice(0, 10));
      setCurrentResult(result);

      // Save to history
      const history = JSON.parse(localStorage.getItem('sentinel_history') || '[]');
      history.unshift({
        id: detection.id,
        date: detection.timestamp,
        changePercent: 0,
        changeType: 'live detection',
        isThreat: alertLevel === 'High' || alertLevel === 'Critical',
        explanation: result.slice(0, 200),
        tamilExplanation: '',
      });
      localStorage.setItem('sentinel_history', JSON.stringify(history.slice(0, 50)));

      if (alertLevel === 'High' || alertLevel === 'Critical') {
        toast.warning('⚠️ High alert detection!');
      } else {
        toast.success('Frame analyzed');
      }
    } catch (e) {
      toast.error('Analysis error');
      console.error(e);
    }
    setAnalyzing(false);
  }, [analyzing, captureFrame]);

  const toggleAutoMode = useCallback(() => {
    if (autoMode) {
      setAutoMode(false);
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
        autoIntervalRef.current = null;
      }
    } else {
      setAutoMode(true);
      analyzeFrame();
      autoIntervalRef.current = setInterval(() => {
        analyzeFrame();
      }, 10000);
    }
  }, [autoMode, analyzeFrame]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'Low': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Eye className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">Live Detection</span>
          {autoMode && (
            <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full animate-pulse">
              AUTO SCANNING
            </span>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        <canvas ref={canvasRef} className="hidden" />

        {/* Camera Feed */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass rounded-xl overflow-hidden">
            <div className="relative aspect-video bg-muted flex items-center justify-center">
              {cameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">Camera is off</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Start camera to begin live detection
                  </p>
                </div>
              )}

              {analyzing && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <div className="flex items-center gap-3 bg-background/90 px-4 py-3 rounded-xl">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm font-medium text-foreground">Analyzing frame...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-4 flex flex-wrap gap-2">
              {!cameraOn ? (
                <Button onClick={startCamera} className="flex-1">
                  <Video className="w-4 h-4" /> Start Camera
                </Button>
              ) : (
                <>
                  <Button variant="destructive" onClick={stopCamera} size="sm">
                    <VideoOff className="w-4 h-4" /> Stop
                  </Button>
                  <Button
                    onClick={analyzeFrame}
                    disabled={analyzing}
                    size="sm"
                    className="flex-1"
                  >
                    <Camera className="w-4 h-4" /> Capture & Detect
                  </Button>
                  <Button
                    variant={autoMode ? 'destructive' : 'outline'}
                    onClick={toggleAutoMode}
                    size="sm"
                  >
                    <RefreshCw className={`w-4 h-4 ${autoMode ? 'animate-spin' : ''}`} />
                    {autoMode ? 'Stop Auto' : 'Auto (10s)'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Current Detection Result */}
        <AnimatePresence>
          {currentResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" /> Latest Detection
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setCurrentResult(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="prose prose-sm prose-invert max-w-none text-foreground">
                <ReactMarkdown>{currentResult}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detection History */}
        {detections.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-primary" />
              Detection Log ({detections.length})
            </h3>
            <div className="space-y-3">
              {detections.map((d) => (
                <div
                  key={d.id}
                  className={`glass rounded-xl p-4 border ${getAlertColor(d.alertLevel)} cursor-pointer`}
                  onClick={() => setCurrentResult(d.result)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={d.frameUrl}
                      alt="Frame"
                      className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {d.alertLevel === 'High' || d.alertLevel === 'Critical' ? (
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium">Alert: {d.alertLevel}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {d.result.slice(0, 80)}...
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(d.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
      <FloatingChatbot />
    </div>
  );
};

export default LiveDetectionPage;
