import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

const botResponses: Record<string, string> = {
  'what changed': 'Recent satellite imagery shows detectable changes in the monitored area. Primarily, building construction and road development have been identified. For a detailed breakdown, please use the "New Analysis" section.',
  'change': 'Image comparison has revealed new structures or surface modifications. A high change percentage may indicate suspicious activity, while a low percentage typically reflects normal development.',
  'intrusion': 'Unauthorized construction or vehicle movement in a border area may be classified as intrusion. If the change percentage exceeds 15% and involves building or vehicle-type changes, an alert should be raised.',
  'is this intrusion': 'To confirm an intrusion, you should review the change percentage, location, and type of change. A change above 15% is potentially suspicious. Please run an analysis for a definitive assessment.',
  'safe': 'If the change percentage is below 15%, it is generally considered safe — typically reflecting normal development or seasonal vegetation shifts. However, border areas require additional caution.',
  'is it safe': 'Safety depends on the change percentage and type. Construction in a border zone is suspicious, while the same in an urban area is normal. Run an analysis for a clear determination.',
  'hello': 'Hello! 👋 I am the SENTINEL AI Assistant. Feel free to ask any questions about satellite image change detection. I am here to help!',
  'hi': 'Hello! 🛰️ Welcome to SENTINEL. How can I assist you? I can help with image analysis, change detection, and intrusion assessment.',
  'help': 'I can help with the following:\n\n🔍 "What changed?" — Change details\n🚨 "Is this intrusion?" — Threat assessment\n✅ "Is it safe?" — Safety check\n📊 "How to analyze?" — Analysis guide\n\nFeel free to ask!',
  'how to analyze': 'It is straightforward: 1) Navigate to the "New Analysis" page, 2) Upload the before image, 3) Upload the after image, 4) Click "Detect Changes." The CNN model will compare both images and generate a change map.',
  'thank': 'You are welcome! 😊 If you have any further questions, do not hesitate to ask. SENTINEL is always ready to assist!',
};

const getResponse = (input: string): string => {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(botResponses)) {
    if (lower.includes(key)) return response;
  }
  return 'I understand your question, but I am unable to provide an exact answer at this time. Please try asking: "What changed?", "Is this safe?", or "How to analyze?" for best results. 🛰️';
};

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: 'Hello! 🛰️ I am the SENTINEL AI Assistant. Ask me anything about satellite image change detection.\n\nTry: "What changed?", "Is this safe?", "Help"' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botMsg: Message = { id: crypto.randomUUID(), role: 'bot', text: getResponse(input) };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <MessageSquare className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">AI Assistant</span>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-4 max-w-2xl overflow-y-auto">
        <div className="space-y-3 pb-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'bot' && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'glass'
              }`}>
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
          <div ref={endRef} />
        </div>
      </main>

      <div className="glass border-t border-border p-4">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="container mx-auto max-w-2xl flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question... (e.g., 'What changed?')"
            className="bg-background/50"
          />
          <Button type="submit" size="icon"><Send className="w-4 h-4" /></Button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPage;
