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
  'enna change': 'Satellite image la recent changes detect aagirukku. Mainly building construction and road development area la changes theriyudhu. Detailed analysis ku "New Analysis" section use pannunga!',
  'change': 'Image comparison la pudhu structures or modifications detect aagirukku. Change percentage romba high na, suspicious ah irukkalam. Low percentage na normal development dhaan.',
  'intrusion': 'Border area la unauthorized construction or vehicle movement irundha, adhu intrusion ah consider pannalam. High change percentage (>15%) with building/vehicle type changes na alert pannanum.',
  'is this intrusion': 'Intrusion nu confirm panna, change percentage, location, and type of change ellam check pannanum. 15% ku mela change irundha suspicious ah irukkalam. Oru analysis run pannunga, result paathu solren!',
  'safe': 'Change percentage 15% ku keezha irundha, mostly safe dhaan. Normal development, seasonal vegetation changes elaam safe category la varum. But border area na extra careful ah irukkanum.',
  'safe ah illa': 'Adhu change percentage and type of change poruththu maarum. Building construction border area la irundha — suspicious. Urban area la irundha — normal. Analyze pannunga, result la clear ah kaattum!',
  'hello': 'Vanakkam! 👋 Naan SENTINEL AI Assistant. Satellite image change detection pathhri enna doubt irundhalum kekuinga. Tamil-la or English-la answer pannuven!',
  'hi': 'Hello! 🛰️ Welcome to SENTINEL. Enna help venum? Image analysis, change detection, intrusion checking — ellathukum help pannuven!',
  'help': 'Naan ivanga help panna mudiyum:\n\n🔍 "Enna change aachu?" - Change details\n🚨 "Is this intrusion?" - Threat assessment\n✅ "Safe ah?" - Safety check\n📊 "How to analyze?" - Analysis guide\n\nTamil or English la kekuinga!',
  'how to analyze': 'Simple dhaan! 1) "New Analysis" page ku ponga, 2) Before image upload pannunga, 3) After image upload pannunga, 4) "Detect Changes" button click pannunga. CNN model compare pannidhu change map create pannum!',
  'thank': 'Welcome! 😊 Vera enna doubt irundhalum kekuinga. SENTINEL always ready to help!',
};

const getResponse = (input: string): string => {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(botResponses)) {
    if (lower.includes(key)) return response;
  }
  return 'Naan unoda question purinjukitten, but exact answer dhara mudiyala. Try pannunga: "Enna change?", "Is this safe?", "How to analyze?" nu kekuinga. Naan best ah help pannuven! 🛰️';
};

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: 'Vanakkam! 🛰️ Naan SENTINEL AI Assistant. Satellite image change detection pathhri enna doubt irundhalum kekuinga!\n\nTry: "Enna change aachu?", "Is this safe?", "Help"' },
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
          <span className="font-bold text-foreground">AI Assistant (Tamil-English)</span>
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
            placeholder="Ask in Tamil or English... (e.g., 'Enna change aachu?')"
            className="bg-background/50"
          />
          <Button type="submit" size="icon"><Send className="w-4 h-4" /></Button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPage;
