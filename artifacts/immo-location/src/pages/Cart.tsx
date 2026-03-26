import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppContext } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';
import { Trash2, ArrowRight } from 'lucide-react';

export default function Cart() {
  const [, setLocation] = useLocation();
  const { cart, setCart } = useAppContext();

  const handleClear = () => {
    setCart(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-8">Votre Panier</h1>

          {cart ? (
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/5 relative">
                  <img src={cart.apartment.images[0]} className="w-full h-full object-cover min-h-[200px]" alt="Apartment" />
                </div>
                <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-serif font-bold leading-tight pr-4">{cart.apartment.title}</h2>
                      <button onClick={handleClear} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors shrink-0">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-8">
                      <p><strong>Arrivée :</strong> {new Date(cart.checkIn).toLocaleDateString('fr-FR')}</p>
                      <p><strong>Départ :</strong> {new Date(cart.checkOut).toLocaleDateString('fr-FR')}</p>
                      <p><strong>Voyageurs :</strong> {cart.guests}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
                    <div className="text-xl font-bold text-primary">
                      {formatPrice(cart.totalPrice + 150)} <span className="text-sm font-normal text-muted-foreground">TTC</span>
                    </div>
                    <Link href={`/reserver/${cart.apartment.id}`} className="w-full sm:w-auto bg-secondary text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20">
                      Continuer <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-border p-12 text-center shadow-sm">
              <p className="text-lg text-muted-foreground mb-6">Votre panier est actuellement vide.</p>
              <Link href="/appartements" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
                Découvrir nos biens
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
