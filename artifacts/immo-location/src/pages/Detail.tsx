import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getApartmentById } from '@/data/mock-data';
import { useAppContext } from '@/context/AppContext';
import { formatPrice, cn } from '@/lib/utils';
import { MapPin, Star, Heart, Share, Play, Check, ChevronLeft, Calendar, BedDouble, Bath, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Detail() {
  const [, params] = useRoute('/appartement/:id');
  const [, setLocation] = useLocation();
  const { toggleFavorite, favorites, setCart } = useAppContext();
  
  const apartment = params?.id ? getApartmentById(params.id) : null;
  const isFav = apartment ? favorites.includes(apartment.id) : false;

  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [apartment?.id]);

  if (!apartment) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center pt-20">
          <h1 className="text-2xl font-serif font-bold">Appartement introuvable</h1>
          <button onClick={() => setLocation('/appartements')} className="mt-4 text-primary hover:underline">
            Retour au catalogue
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleReserve = () => {
    if (!checkIn || !checkOut) {
      alert("Veuillez sélectionner vos dates de séjour.");
      return;
    }
    const days = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)));
    const totalPrice = (apartment.pricing.perNight || 0) * days;
    
    setCart({
      apartment,
      checkIn,
      checkOut,
      guests,
      totalPrice
    });
    setLocation(`/reserver/${apartment.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-6">
            <button onClick={() => window.history.back()} className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" /> Retour
            </button>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {apartment.isPremium && <span className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Prestige</span>}
                  <div className="flex items-center text-sm font-medium">
                    <Star className="w-4 h-4 fill-secondary text-secondary mr-1" />
                    {apartment.rating} ({apartment.reviewCount} avis)
                  </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary leading-tight mb-2">
                  {apartment.title}
                </h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1 shrink-0" />
                  {apartment.location.address}
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors font-medium">
                  <Share className="w-4 h-4" /> Partager
                </button>
                <button 
                  onClick={() => toggleFavorite(apartment.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors font-medium"
                >
                  <Heart className={cn("w-4 h-4", isFav ? "fill-red-500 text-red-500" : "")} /> 
                  {isFav ? "Sauvegardé" : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>

          {/* Photo Gallery (Airbnb style) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 relative group">
            <div className="md:col-span-2 row-span-2 relative cursor-pointer" onClick={() => setActiveImage(0)}>
              <img src={apartment.images[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Main" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
            {apartment.images.slice(1, 5).map((img, idx) => (
              <div key={idx} className="hidden md:block relative cursor-pointer" onClick={() => setActiveImage(idx + 1)}>
                <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt={`Gallery ${idx + 1}`} />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
            ))}
            <button 
              onClick={() => setShowVirtualTour(true)}
              className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg font-medium shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Play className="w-4 h-4 text-primary" /> Visite Virtuelle
            </button>
            <button 
              onClick={() => setActiveImage(0)}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg font-medium shadow-lg hover:scale-105 transition-transform"
            >
              Voir toutes les photos
            </button>
          </div>

          {/* Main Content Split */}
          <div className="flex flex-col lg:flex-row gap-12 relative">
            <div className="flex-1">
              
              {/* Key Features */}
              <div className="flex flex-wrap gap-6 py-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-xl"><BedDouble className="w-6 h-6 text-primary" /></div>
                  <div><p className="font-medium">{apartment.bedrooms} Chambres</p><p className="text-sm text-muted-foreground">Lits King Size</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-xl"><Bath className="w-6 h-6 text-primary" /></div>
                  <div><p className="font-medium">{apartment.bathrooms} Salles de bain</p><p className="text-sm text-muted-foreground">Équipées</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-xl"><Maximize className="w-6 h-6 text-primary" /></div>
                  <div><p className="font-medium">{apartment.surface} m²</p><p className="text-sm text-muted-foreground">Surface</p></div>
                </div>
              </div>

              {/* Description */}
              <div className="py-8 border-b border-border">
                <h2 className="text-2xl font-serif font-bold mb-4">À propos de ce logement</h2>
                <p className="text-foreground/80 leading-relaxed text-lg font-light">
                  {apartment.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="py-8 border-b border-border">
                <h2 className="text-2xl font-serif font-bold mb-6">Équipements de prestige</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {apartment.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-secondary" />
                      <span className="text-foreground/80">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="py-8">
                <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 fill-secondary text-secondary" /> 
                  {apartment.rating} · {apartment.reviewCount} avis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {apartment.reviews.map((rev) => (
                    <div key={rev.id} className="bg-muted/30 p-6 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                            {rev.author.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold">{rev.author}</p>
                            <p className="text-xs text-muted-foreground">{rev.date}</p>
                          </div>
                        </div>
                        <div className="flex text-secondary">
                          {Array.from({length: rev.rating}).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                        </div>
                      </div>
                      <p className="text-foreground/80 italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Booking Sidebar */}
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="bg-white border border-border shadow-xl rounded-2xl p-6 lg:sticky lg:top-28">
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-3xl font-bold">{formatPrice(apartment.pricing.perNight || 0)}</span>
                    <span className="text-muted-foreground pb-1">/ nuit</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-border rounded-xl p-3">
                      <label className="block text-[10px] font-bold uppercase text-muted-foreground">Arrivée</label>
                      <input 
                        type="date" 
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full outline-none text-sm mt-1 bg-transparent cursor-pointer"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="border border-border rounded-xl p-3">
                      <label className="block text-[10px] font-bold uppercase text-muted-foreground">Départ</label>
                      <input 
                        type="date" 
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full outline-none text-sm mt-1 bg-transparent cursor-pointer"
                        min={checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="border border-border rounded-xl p-3">
                    <label className="block text-[10px] font-bold uppercase text-muted-foreground">Voyageurs</label>
                    <select 
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full outline-none text-sm mt-1 bg-transparent cursor-pointer"
                    >
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} voyageur{n>1?'s':''}</option>)}
                    </select>
                  </div>
                </div>

                {checkIn && checkOut && (
                  <div className="mb-6 space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{formatPrice(apartment.pricing.perNight || 0)} x {Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)))} nuits</span>
                      <span>{formatPrice((apartment.pricing.perNight || 0) * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24))))}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Frais de conciergerie</span>
                      <span>{formatPrice(150)}</span>
                    </div>
                    <div className="pt-4 border-t border-border flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(((apartment.pricing.perNight || 0) * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)))) + 150)}</span>
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleReserve}
                  className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-secondary/30 hover:shadow-secondary/40 hover:-translate-y-0.5"
                >
                  Réserver ce bien
                </button>
                <p className="text-center text-xs text-muted-foreground mt-4">Aucun montant ne vous sera débité pour le moment.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {activeImage !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex flex-col"
          >
            <div className="p-4 flex justify-between items-center text-white">
              <span className="font-medium">{activeImage + 1} / {apartment.images.length}</span>
              <button onClick={() => setActiveImage(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <img src={apartment.images[activeImage]} className="max-w-full max-h-full object-contain" alt="Enlarged view" />
            </div>
            <div className="p-4 flex justify-center gap-4">
              <button 
                onClick={() => setActiveImage(prev => prev! > 0 ? prev! - 1 : apartment.images.length - 1)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                Précédent
              </button>
              <button 
                onClick={() => setActiveImage(prev => prev! < apartment.images.length - 1 ? prev! + 1 : 0)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                Suivant
              </button>
            </div>
          </motion.div>
        )}

        {/* Virtual Tour Modal */}
        {showVirtualTour && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col"
          >
            <div className="absolute top-4 right-4 z-10">
              <button onClick={() => setShowVirtualTour(false)} className="p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0">
                <img src={apartment.images[0]} className="w-full h-full object-cover opacity-50 blur-sm" alt="Tour bg" />
              </div>
              <div className="relative z-10 text-center text-white p-8 max-w-2xl bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                <Play className="w-16 h-16 mx-auto mb-6 text-secondary opacity-80" />
                <h2 className="text-3xl font-serif mb-4">Visite Virtuelle Interactive</h2>
                <p className="text-white/70 mb-8">
                  Découvrez l'intégralité de cet espace prestigieux comme si vous y étiez. Déplacez-vous de pièce en pièce.
                </p>
                <div className="inline-block bg-white/10 px-6 py-3 rounded-lg text-sm border border-white/20">
                  Simulation de player 3D Matterport™
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
