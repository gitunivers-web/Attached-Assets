import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppContext } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';
import { CreditCard, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Payment() {
  const [, setLocation] = useLocation();
  const { cart } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (!cart) {
      setLocation('/appartements');
    }
  }, [cart, setLocation]);

  if (!cart) return null;

  const total = cart.totalPrice + 150;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate network request
    setTimeout(() => {
      setLocation('/confirmation');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <button onClick={() => window.history.back()} className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </button>
          
          <div className="bg-white rounded-2xl border border-border shadow-xl overflow-hidden">
            <div className="bg-primary p-8 text-white text-center">
              <Lock className="w-8 h-8 text-secondary mx-auto mb-4" />
              <h1 className="text-2xl font-serif font-bold mb-2">Paiement Sécurisé</h1>
              <p className="text-white/80">Montant à régler : <span className="font-bold text-xl ml-1">{formatPrice(total)}</span></p>
            </div>

            <div className="p-8">
              <div className="flex gap-4 items-center justify-center mb-10 text-muted-foreground border-b pb-8">
                <div className="h-8 w-12 bg-muted rounded border flex items-center justify-center text-[10px] font-bold">CB</div>
                <div className="h-8 w-12 bg-muted rounded border flex items-center justify-center text-[10px] font-bold">VISA</div>
                <div className="h-8 w-12 bg-muted rounded border flex items-center justify-center text-[10px] font-bold text-center leading-none">MASTER<br/>CARD</div>
                <div className="h-8 w-12 bg-muted rounded border flex items-center justify-center text-[10px] font-bold">AMEX</div>
              </div>

              <form onSubmit={handlePayment} className="space-y-6 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Nom sur la carte</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary uppercase"
                    placeholder="JEAN DUPONT"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Numéro de carte</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                    <input 
                      type="text" 
                      required
                      maxLength={19}
                      className="w-full bg-background border border-border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary font-mono tracking-widest"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">Date d'expiration</label>
                    <input 
                      type="text" 
                      required
                      maxLength={5}
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-center"
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">CVC</label>
                    <input 
                      type="text" 
                      required
                      maxLength={3}
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-center"
                      placeholder="123"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold py-4 rounded-xl mt-8 flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  {isProcessing ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Confirmer le paiement de {formatPrice(total)}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
