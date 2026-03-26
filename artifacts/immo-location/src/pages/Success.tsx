import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAppContext } from '@/context/AppContext';
import { CheckCircle, Home, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Success() {
  const [, setLocation] = useLocation();
  const { cart, setCart } = useAppContext();

  useEffect(() => {
    if (!cart) {
      setLocation('/');
    } else {
      // Clear cart on unmount
      return () => setCart(null);
    }
  }, [cart, setLocation, setCart]);

  if (!cart) return null;

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="w-12 h-12" />
        </motion.div>
        
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
          Réservation Confirmée !
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Votre séjour d'exception est enregistré. Un email de confirmation vient de vous être envoyé.
        </p>

        <div className="bg-muted/30 border border-border rounded-2xl p-6 text-left mb-10 max-w-md mx-auto">
          <h3 className="font-bold text-lg border-b pb-4 mb-4">{cart.apartment.title}</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-secondary" />
              <span>Du <strong>{new Date(cart.checkIn).toLocaleDateString('fr-FR')}</strong> au <strong>{new Date(cart.checkOut).toLocaleDateString('fr-FR')}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-secondary" />
              <span>{cart.apartment.location.address}, {cart.apartment.location.city}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/appartements" className="px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors">
            Continuer la visite
          </Link>
          <Link href="/" className="px-8 py-4 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
