import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight, Copy, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ThankYouPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Try to parse state from history state object if available (wouter doesn't have native location state)
  // Since we can't cleanly pass state through wouter's setLocation without custom history manipulation,
  // we'll rely on the history state that was pushed
  const state = window.history.state;
  
  useEffect(() => {
    // If we land here directly without an order, redirect home
    if (!state || !state.confirmation) {
      setLocation('/');
    }
  }, [state, setLocation]);

  if (!state || !state.confirmation) return null;

  const { confirmation, paymentMethod, customerName } = state;
  const isEtransfer = paymentMethod === 'etransfer';
  const email = confirmation.etransferEmail || 'sherrys.dipz@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    toast({
      title: "Email copied to clipboard",
      description: "You can now paste it into your banking app."
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-card border rounded-2xl p-8 md:p-10 shadow-lg text-center animate-in zoom-in-95 duration-500">
        <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Thank you for your order, {customerName}. We've received it and will start preparing it soon.
        </p>

        <div className="bg-accent rounded-xl p-6 mb-8 text-left border">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-border/50">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono font-medium text-foreground">{confirmation.orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total</span>
            <span className="font-medium text-foreground font-serif text-xl">${confirmation.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {isEtransfer && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8 text-left">
            <div className="flex items-center gap-3 mb-3 text-primary">
              <Mail className="h-5 w-5" />
              <h3 className="font-serif font-bold text-lg">e-Transfer Instructions</h3>
            </div>
            <p className="text-sm text-foreground/80 mb-4">
              Please send your e-Transfer of <strong className="text-foreground">${confirmation.totalAmount.toFixed(2)}</strong> to the email below to complete your order:
            </p>
            
            <div className="flex items-center gap-2 bg-background border rounded-lg p-3">
              <code className="flex-1 font-mono text-sm sm:text-base truncate">{email}</code>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={copyEmail} data-testid="button-copy-email">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {paymentMethod === 'cash' && (
          <div className="bg-muted rounded-xl p-6 mb-8 text-left text-sm text-muted-foreground">
            Please have <strong className="text-foreground">${confirmation.totalAmount.toFixed(2)}</strong> in cash ready upon receipt of your order.
          </div>
        )}

        <Button 
          className="w-full h-12 font-serif text-lg gap-2 group" 
          onClick={() => setLocation('/')}
          data-testid="button-back-home"
        >
          Return Home
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
