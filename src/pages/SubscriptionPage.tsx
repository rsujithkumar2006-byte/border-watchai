import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Check, QrCode, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

const plans = [
  { name: 'Monthly', price: 50, period: '1 Month', features: ['10 Analyses/month', 'Basic Change Detection', 'Email Support'] },
  { name: '6 Months', price: 300, period: '6 Months', features: ['50 Analyses/month', 'Advanced CNN Model', 'Priority Support', 'History Export'], popular: true },
  { name: 'Yearly', price: 600, period: '12 Months', features: ['Unlimited Analyses', 'Premium CNN Model', '24/7 Support', 'API Access', 'Custom Reports'] },
];

const UPI_ID = 'r.sujithkumar2006-2@oksbi';
const UPI_NAME = 'Sujith Kumar';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const getUPILink = (plan: typeof plans[0]) =>
    `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${plan.price}&cu=INR&tn=${encodeURIComponent(plan.name + ' Subscription')}`;

  const handlePay = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    // Try opening UPI app
    window.location.href = getUPILink(plan);
    // Show QR fallback after delay
    setTimeout(() => setShowQR(true), 1500);
  };

  const confirmPayment = () => {
    setPaymentDone(true);
    toast.success('Payment verified! Subscription activated.');
    localStorage.setItem('sentinel_subscription', JSON.stringify({
      plan: selectedPlan?.name,
      startDate: new Date().toISOString(),
      status: 'active',
    }));
  };

  if (paymentDone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center glass rounded-2xl p-10 max-w-md mx-4">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Subscription Active!</h2>
          <p className="text-muted-foreground mb-6">{selectedPlan?.name} plan — ₹{selectedPlan?.price}</p>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CreditCard className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">Subscription Plans</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass rounded-xl p-6 relative ${plan.popular ? 'border-primary/50 glow-primary' : ''}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  POPULAR
                </span>
              )}
              <h3 className="text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
              <p className="text-3xl font-bold text-primary mb-1">₹{plan.price}</p>
              <p className="text-sm text-muted-foreground mb-4">{plan.period}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button onClick={() => handlePay(plan)} className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                Pay ₹{plan.price}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* QR Fallback */}
        {showQR && selectedPlan && !paymentDone && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-8 max-w-md mx-auto text-center">
            <QrCode className="w-6 h-6 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Scan QR to Pay</h3>
            <p className="text-sm text-muted-foreground mb-4">₹{selectedPlan.price} — {selectedPlan.name} Plan</p>
            <div className="bg-foreground rounded-xl p-4 inline-block mb-4">
              <QRCodeSVG value={getUPILink(selectedPlan)} size={200} />
            </div>
            <p className="text-xs text-muted-foreground mb-4">UPI ID: {UPI_ID}</p>
            <div className="space-y-2">
              <Button onClick={confirmPayment} className="w-full">
                <Upload className="w-4 h-4 mr-2" /> I've Completed Payment
              </Button>
              <p className="text-xs text-muted-foreground">For demo: click above to simulate payment verification</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default SubscriptionPage;
