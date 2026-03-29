import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, X } from 'lucide-react';
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
  'is this intrusion': 'Intrusion nu confirm panna, change percentage, location, and type of change ellam check pannanum. 15% ku mela change irundha suspicious ah irukkalam.',
  'safe': 'Change percentage 15% ku keezha irundha, mostly safe dhaan. Normal development, seasonal vegetation changes elaam safe category la varum.',
  'safe ah illa': 'Adhu change percentage and type of change poruththu maarum. Building construction border area la irundha — suspicious. Urban area la irundha — normal.',
  'hello': 'Vanakkam! 👋 Naan SENTINEL AI Assistant. Satellite image change detection pathhri enna doubt irundhalum kekuinga!',
  'hi': 'Hello! 🛰️ Welcome to SENTINEL. Enna help venum? Image analysis, change detection — ellathukum help pannuven!',
  'help': 'Naan ivanga help panna mudiyum:\n\n🔍 "Enna change?" - Change details\n🚨 "Is this intrusion?" - Threat assessment\n✅ "Safe ah?" - Safety check\n📊 "How to analyze?" - Analysis guide',
  'how to analyze': 'Simple dhaan! 1) Before image upload pannunga, 2) After image upload pannunga, 3) "Detect Changes" click pannunga. CNN model compare pannidhu change map create pannum!',
  'thank': 'Welcome! 😊 Vera enna doubt irundhalum kekuinga!',
  'what is detection': 'Detection nu oru image la enna maarudhal irukku nu kandupidikka. Example: oru place la building illama irundhudhu, ippo irukku — adhu dhaan change detection!',
  'what is cnn': 'CNN (Convolutional Neural Network) — oru AI model, images la patterns kandupidikkum. Example: face recognition, satellite image analysis ellam CNN dhaan use pannudhu.',
  'what is satellite': 'Satellite nu space la irundhudhu earth ah photograph edukkiradhu. Google Maps maadiri — but more detailed ah military/research ku use pannuvanga.',
  'subscription': 'Subscription ₹50/month dhaan. Dashboard la progress paakalam, unlimited analysis pannalam!',
  'gym': 'Simple workout plan:\n💪 Monday: Chest + Triceps\n🏋️ Tuesday: Back + Biceps\n🦵 Wednesday: Legs\n🏃 Thursday: Cardio\n💪 Friday: Shoulders + Abs\nRest on weekends!',
  'login': 'Login panna: 1) Main page la email enter pannunga, 2) Password kudunga, 3) "Login" click pannunga. Account illana "Sign Up" use pannunga!',
};

const getResponse = (input: string): string => {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(botResponses)) {
    if (lower.includes(key)) return response;
  }
  return 'Naan unoda question purinjukitten, but exact answer dhara mudiyala. Try pannunga: "Enna change?", "Is this safe?", "How to analyze?" nu kekuinga! 🛰️';
};

const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: 'Vanakkam! 🛰️ Naan SENTINEL AI. Enna doubt irundhalum kekuinga!\n\nTry: "Enna change?", "Safe ah?", "Help"' },
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
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'bot', text: getResponse(input) }]);
    }, 500);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[28rem] glass rounded-2xl border border-border flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm text-foreground">SENTINEL AI</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'bot' && (
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs whitespace-pre-line ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3 h-3 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-3 border-t border-border flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask in Tamil or English..."
                className="text-xs h-9 bg-background/50"
              />
              <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot;
