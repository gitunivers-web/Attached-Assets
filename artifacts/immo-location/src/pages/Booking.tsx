import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppContext } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';
import { Shield, CreditCard, User, Mail, Phone, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Booking() {
  const [, setLocation] = useLocation();
  const { cart } = useAppContext();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  useEffect(() => {
    if (!cart) {
      setLocation('/appartements');
    }
  }, [cart, setLocation]);

  if (!cart) return null;

  const days = Math.max(1, Math.ceil((new Date(cart.checkOut).getTime() - new Date(cart.checkIn).getTime()) / (1000 * 3600 * 24)));
  const total = cart.totalPrice + 150; // incl concierge

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstName && formData.lastName && formData.email) {
      setLocation('/paiement');
    } else {
      alert("Veuillez remplir les champs obligatoires.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-10 text-primary">Demande de réservation</h1>
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Form */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm mb-8">
                <h2 className="text-xl font-bold mb-6 border-b pb-4">Vos informations</h2>
                <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-muted-foreground mb-2">Prénom *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                        <input 
                          type="text" 
                          required
                          value={formData.firstName}
                          onChange={e => setFormData({...formData, firstName: e.target.value})}
                          className="w-full bg-background border border-border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                          placeholder="Jean"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-muted-foreground mb-2">Nom *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                        placeholder="Dupont"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-muted-foreground mb-2">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-background border border-border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                          placeholder="jean.dupont@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-muted-foreground mb-2">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-background border border-border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-muted-foreground mb-2">Demandes spéciales (Optionnel)</label>
                    <textarea 
                      rows={4}
                      value={formData.specialRequests}
                      onChange={e => setFormData({...formData, specialRequests: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary resize-none"
                      placeholder="Heure d'arrivée prévue, besoin d'un transfert aéroport..."
                    ></textarea>
                  </div>
                </form>
              </div>

              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex items-start gap-4">
                <Shield className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold text-primary mb-1">Garantie ImmoLoc Prestige</h3>
                  <p className="text-sm text-foreground/70">Votre réservation est protégée. En cas de non-conformité majeure du bien, nous vous relogeons dans un appartement de standing équivalent ou supérieur.</p>
                </div>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="bg-white rounded-2xl border border-border shadow-lg p-6 sticky top-28">
                <div className="flex gap-4 mb-6 pb-6 border-b border-border">
                  <img src={cart.apartment.images[0]} className="w-24 h-24 rounded-lg object-cover" alt="Apartment" />
                  <div>
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Appartement</p>
                    <h3 className="font-serif font-bold leading-tight">{cart.apartment.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{cart.apartment.location.city}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h4 className="font-bold">Détails du séjour</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Arrivée</span>
                    <span className="font-medium">{new Date(cart.checkIn).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Départ</span>
                    <span className="font-medium">{new Date(cart.checkOut).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Voyageurs</span>
                    <span className="font-medium">{cart.guests} personne(s)</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8 pt-6 border-t border-border">
                  <h4 className="font-bold">Détail du prix</h4>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatPrice(cart.apartment.pricing.perNight || 0)} x {days} nuits</span>
                    <span>{formatPrice(cart.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Frais de conciergerie</span>
                    <span>{formatPrice(150)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl pt-4 border-t border-border">
                    <span>Total (TTC)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  form="booking-form"
                  className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-secondary/40"
                >
                  <CreditCard className="w-5 h-5" />
                  Procéder au paiement
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span>Paiement 100% sécurisé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
