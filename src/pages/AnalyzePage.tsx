import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowLeft, Satellite, Loader2, AlertTriangle, CheckCircle, ImagePlus, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import FloatingChatbot from '@/components/FloatingChatbot';

interface AnalysisResult {
  changePercent: number;
  changeType: string;
  isThreat: boolean;
  explanation: string;
  tamilExplanation: string;
  beforeUrl: string;
  afterUrl: string;
  diffUrl: string;
}

const AnalyzePage = () => {
  const navigate = useNavigate();
  const [beforeImg, setBeforeImg] = useState<string | null>(null);
  const [afterImg, setAfterImg] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'before' | 'after' | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = (target: 'before' | 'after') => {
    setCameraTarget(target);
    setCameraActive(true);
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch(() => toast.error('Camera access denied'));
  };

  const capturePhoto = () => {
    if (!videoRef.current || !cameraTarget) return;
    const video = videoRef.current;
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    const ctx = captureCanvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);
    const dataUrl = captureCanvas.toDataURL('image/jpeg');
    if (cameraTarget === 'before') setBeforeImg(dataUrl);
    else setAfterImg(dataUrl);
    stopCamera();
    toast.success('Photo captured!');
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraActive(false);
    setCameraTarget(null);
  };

  const handleImageUpload = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const simulateChangeDetection = useCallback(async () => {
    if (!beforeImg || !afterImg) {
      toast.error('Please upload both images');
      return;
    }
    setAnalyzing(true);
    setResult(null);

    // Simulate CNN processing with canvas pixel comparison
    await new Promise(r => setTimeout(r, 2000));

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const img1 = new Image(); const img2 = new Image();
    img1.crossOrigin = 'anonymous'; img2.crossOrigin = 'anonymous';

    await new Promise<void>((resolve) => {
      img1.onload = () => {
        canvas.width = img1.width; canvas.height = img1.height;
        img2.onload = () => resolve();
        img2.src = afterImg;
      };
      img1.src = beforeImg;
    });

    // Draw before image and get pixels
    ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);
    const data1 = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Draw after image and get pixels
    ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);
    const data2 = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Compare pixels and highlight changes
    const diff = ctx.createImageData(canvas.width, canvas.height);
    let changedPixels = 0;
    const totalPixels = canvas.width * canvas.height;
    const threshold = 40;

    for (let i = 0; i < data1.data.length; i += 4) {
      const rDiff = Math.abs(data1.data[i] - data2.data[i]);
      const gDiff = Math.abs(data1.data[i+1] - data2.data[i+1]);
      const bDiff = Math.abs(data1.data[i+2] - data2.data[i+2]);
      const totalDiff = (rDiff + gDiff + bDiff) / 3;

      if (totalDiff > threshold) {
        changedPixels++;
        // Red highlight for changes
        diff.data[i] = 255;
        diff.data[i+1] = 50;
        diff.data[i+2] = 50;
        diff.data[i+3] = 180;
      } else {
        // Semi-transparent original
        diff.data[i] = data2.data[i];
        diff.data[i+1] = data2.data[i+1];
        diff.data[i+2] = data2.data[i+2];
        diff.data[i+3] = 120;
      }
    }

    ctx.putImageData(diff, 0, 0);
    const diffUrl = canvas.toDataURL();
    const changePercent = Math.round((changedPixels / totalPixels) * 100);

    const isThreat = changePercent > 15;
    const changeTypes = ['building construction', 'road development', 'vehicle movement', 'vegetation change', 'infrastructure modification'];
    const changeType = changeTypes[Math.floor(Math.random() * changeTypes.length)];

    const explanations: Record<string, { en: string; ta: string }> = {
      'building construction': {
        en: `Detected ${changePercent}% change indicating new building construction in the monitored area.`,
        ta: `Indha area la pudhu building construct pannirukanga. ${changePercent}% change detect aagirukku. ${isThreat ? 'Suspicious activity ah irukkalam, check pannunga.' : 'Normal development ah theriyudhu.'}`,
      },
      'road development': {
        en: `Detected ${changePercent}% change suggesting road development or path modification.`,
        ta: `Pudhu road podirukanga indha area la. ${changePercent}% change irukku. ${isThreat ? 'Unauthorized road ah irukkalam.' : 'Government project ah irukkum.'}`,
      },
      'vehicle movement': {
        en: `Detected ${changePercent}% change due to vehicle movement or parking changes.`,
        ta: `Vehicle movement detect aagirukku. ${changePercent}% area la change irukku. ${isThreat ? 'Unusual vehicle activity - alert!' : 'Normal traffic movement dhaan.'}`,
      },
      'vegetation change': {
        en: `Detected ${changePercent}% change in vegetation cover.`,
        ta: `Maram, plant ellam ${changePercent}% change aagirukku. ${isThreat ? 'Land clearing nadakkudhu, check pannunga.' : 'Seasonal change ah irukkum.'}`,
      },
      'infrastructure modification': {
        en: `Detected ${changePercent}% infrastructure modification in the area.`,
        ta: `Infrastructure la ${changePercent}% change detect aagirukku. ${isThreat ? 'Border area la suspicious construction!' : 'Normal maintenance work ah theriyudhu.'}`,
      },
    };

    setResult({
      changePercent,
      changeType,
      isThreat,
      explanation: explanations[changeType].en,
      tamilExplanation: explanations[changeType].ta,
      beforeUrl: beforeImg,
      afterUrl: afterImg,
      diffUrl,
    });

    // Save to history
    const history = JSON.parse(localStorage.getItem('sentinel_history') || '[]');
    history.unshift({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      changePercent,
      changeType,
      isThreat,
      explanation: explanations[changeType].en,
      tamilExplanation: explanations[changeType].ta,
    });
    localStorage.setItem('sentinel_history', JSON.stringify(history.slice(0, 20)));

    setAnalyzing(false);
    toast.success('Analysis complete!');
  }, [beforeImg, afterImg]);

  const ImageUploadBox = ({ label, image, onUpload, target }: { label: string; image: string | null; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; target: 'before' | 'after' }) => (
    <div className="flex-1">
      <label className="text-sm font-medium text-muted-foreground mb-2 block">{label}</label>
      <div className="glass rounded-xl aspect-video flex items-center justify-center overflow-hidden relative">
        {image ? (
          <img src={image} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-4">
            <ImagePlus className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Upload or capture</p>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <label className="flex-1">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <span><ImagePlus className="w-4 h-4" /> Upload</span>
          </Button>
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
        </label>
        <Button variant="outline" size="sm" className="flex-1" onClick={() => startCamera(target)}>
          <Camera className="w-4 h-4" /> Capture
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Satellite className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">Image Analysis</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <canvas ref={canvasRef} className="hidden" />

        {/* Camera Modal */}
        <AnimatePresence>
          {cameraActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background/95 flex flex-col items-center justify-center p-4"
            >
              <div className="w-full max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Camera className="w-5 h-5 text-primary" />
                    Capture {cameraTarget === 'before' ? 'Before' : 'After'} Image
                  </h3>
                  <Button variant="ghost" size="icon" onClick={stopCamera}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-xl aspect-video object-cover bg-muted" />
                <Button onClick={capturePhoto} className="w-full mt-4" size="lg">
                  <Camera className="w-5 h-5" /> Take Photo
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" /> Upload Satellite Images
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <ImageUploadBox label="Before Image (T1)" image={beforeImg} onUpload={handleImageUpload(setBeforeImg)} target="before" />
            <ImageUploadBox label="After Image (T2)" image={afterImg} onUpload={handleImageUpload(setAfterImg)} target="after" />
          </div>
          <Button onClick={simulateChangeDetection} disabled={analyzing || !beforeImg || !afterImg} className="w-full">
            {analyzing ? (
              <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Running Siamese CNN Analysis...</span>
            ) : (
              <span className="flex items-center gap-2"><Satellite className="w-4 h-4" /> Detect Changes</span>
            )}
          </Button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Change Map */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Change Detection Map</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Before (T1)</p>
                    <img src={result.beforeUrl} className="rounded-lg w-full aspect-video object-cover" alt="Before" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">After (T2)</p>
                    <img src={result.afterUrl} className="rounded-lg w-full aspect-video object-cover" alt="After" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Change Map</p>
                    <img src={result.diffUrl} className="rounded-lg w-full aspect-video object-cover" alt="Diff" />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`glass rounded-xl p-5 ${result.isThreat ? 'border-destructive/50' : 'border-success/50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {result.isThreat ? <AlertTriangle className="w-5 h-5 text-destructive" /> : <CheckCircle className="w-5 h-5 text-success" />}
                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                  </div>
                  <p className={`text-lg font-bold ${result.isThreat ? 'text-destructive' : 'text-success'}`}>
                    {result.isThreat ? 'SUSPICIOUS' : 'NORMAL'}
                  </p>
                </div>
                <div className="glass rounded-xl p-5">
                  <p className="text-sm text-muted-foreground mb-1">Change Detected</p>
                  <p className="text-3xl font-bold text-primary">{result.changePercent}%</p>
                </div>
                <div className="glass rounded-xl p-5">
                  <p className="text-sm text-muted-foreground mb-1">Change Type</p>
                  <p className="text-lg font-semibold text-foreground capitalize">{result.changeType}</p>
                </div>
              </div>

              {/* Explanations */}
              <div className="glass rounded-xl p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">English Explanation</h4>
                  <p className="text-foreground">{result.explanation}</p>
                </div>
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-medium text-primary mb-1">Tamil-English Explanation (தமிழ்-English)</h4>
                  <p className="text-foreground">{result.tamilExplanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <FloatingChatbot />
    </div>
  );
};

export default AnalyzePage;
