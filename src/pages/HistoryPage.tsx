import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, History, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoryItem {
  id: string;
  date: string;
  changePercent: number;
  changeType: string;
  isThreat: boolean;
  explanation: string;
  tamilExplanation: string;
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('sentinel_history') || '[]'));
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('sentinel_history');
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <History className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">Analysis History</span>
          </div>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearHistory}>
              <Trash2 className="w-4 h-4 mr-1" /> Clear
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {history.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No analysis history yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {item.isThreat ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <CheckCircle className="w-4 h-4 text-success" />}
                    <span className={`text-sm font-semibold ${item.isThreat ? 'text-destructive' : 'text-success'}`}>
                      {item.isThreat ? 'SUSPICIOUS' : 'NORMAL'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-foreground mb-1">
                  <span className="text-primary font-bold">{item.changePercent}%</span> change — {item.changeType}
                </p>
                <p className="text-xs text-muted-foreground">{item.tamilExplanation}</p>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
