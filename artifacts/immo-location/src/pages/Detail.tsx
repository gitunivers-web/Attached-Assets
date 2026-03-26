import { useState, useEffect, useRef, useCallback } from 'react';
import { useRoute, useLocation } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getApartmentById } from '@/data/mock-data';
import { useAppContext } from '@/context/AppContext';
import { formatPrice, cn } from '@/lib/utils';
import { MapPin, Star, Heart, Share, Play, Pause, Check, ChevronLeft, ChevronRight, Calendar, BedDouble, Bath, Maximize, X, Volume2, VolumeX } from 'lucide-react';
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

  // Virtual tour state
  const [tourSlide, setTourSlide] = useState(0);
  const [tourPlaying, setTourPlaying] = useState(true);
  const [tourProgress, setTourProgress] = useState(0);
  const [tourMuted, setTourMuted] = useState(false);
  const tourIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tourProgressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const SLIDE_DURATION = 5000;
  const ROOM_LABELS = ['Salon Principal', 'Chambre Master', 'Cuisine Gastronomique', 'Salle de Bain', 'Vue Extérieure'];

  const stopTourTimers = useCallback(() => {
    if (tourIntervalRef.current) clearInterval(tourIntervalRef.current);
    if (tourProgressRef.current) clearInterval(tourProgressRef.current);
  }, []);

  const startTourTimers = useCallback((images: string[]) => {
    stopTourTimers();
    setTourProgress(0);
    const progressTick = 50;
    tourProgressRef.current = setInterval(() => {
      setTourProgress(p => {
        if (p >= 100) return 0;
        return p + (progressTick / SLIDE_DURATION) * 100;
      });
    }, progressTick);
    tourIntervalRef.current = setInterval(() => {
      setTourSlide(s => (s + 1) % images.length);
      setTourProgress(0);
    }, SLIDE_DURATION);
  }, [stopTourTimers]);

  useEffect(() => {
    if (showVirtualTour && apartment) {
      setTourSlide(0);
      setTourProgress(0);
      setTourPlaying(true);
      startTourTimers(apartment.images);
      // ambient audio
      if (!audioRef.current) {
        audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.18;
      }
      if (!tourMuted) audioRef.current.play().catch(() => {});
    } else {
      stopTourTimers();
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    }
    return () => stopTourTimers();
  }, [showVirtualTour]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (tourMuted) { audioRef.current.pause(); }
    else if (showVirtualTour && tourPlaying) { audioRef.current.play().catch(() => {}); }
  }, [tourMuted]);

  const handleTourPlayPause = (images: string[]) => {
    if (tourPlaying) {
      stopTourTimers();
      audioRef.current?.pause();
    } else {
      startTourTimers(images);
      if (!tourMuted) audioRef.current?.play().catch(() => {});
    }
    setTourPlaying(p => !p);
  };

  const handleTourNav = (dir: number, images: string[]) => {
    stopTourTimers();
    setTourSlide(s => (s + dir + images.length) % images.length);
    setTourProgress(0);
    if (tourPlaying) startTourTimers(images);
  };

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

        {/* Virtual Tour Modal — Immersive Slideshow */}
        {showVirtualTour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col select-none"
          >
            {/* Slide images with Ken Burns zoom effect */}
            <div className="absolute inset-0 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={tourSlide}
                  src={apartment.images[tourSlide % apartment.images.length]}
                  alt={ROOM_LABELS[tourSlide % ROOM_LABELS.length]}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: tourPlaying ? 1.0 : 1.03 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
              </AnimatePresence>
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            </div>

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-white/90 font-medium text-sm tracking-wide uppercase">Visite Virtuelle</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Mute button */}
                <button
                  onClick={() => setTourMuted(m => !m)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-all"
                  title={tourMuted ? 'Activer le son' : 'Couper le son'}
                >
                  {tourMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                {/* Close button */}
                <button
                  onClick={() => setShowVirtualTour(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slide dots / thumbnails */}
            <div className="relative z-10 flex justify-center gap-2 mt-2">
              {apartment.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { setTourSlide(idx); setTourProgress(0); if (tourPlaying) startTourTimers(apartment.images); }}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    idx === tourSlide
                      ? 'w-8 h-2 bg-secondary'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                  )}
                />
              ))}
            </div>

            {/* Centre area — room label */}
            <div className="flex-1 relative z-10 flex items-end justify-center pb-8 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tourSlide}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="text-center"
                >
                  <p className="text-white/50 text-xs uppercase tracking-[0.25em] mb-1">
                    Pièce {tourSlide + 1} / {apartment.images.length}
                  </p>
                  <h2 className="text-white text-3xl md:text-5xl font-serif font-bold drop-shadow-lg">
                    {ROOM_LABELS[tourSlide % ROOM_LABELS.length]}
                  </h2>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom controls bar */}
            <div className="relative z-10 px-6 pb-6 flex flex-col gap-3">
              {/* Progress bar */}
              <div className="w-full h-0.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-secondary rounded-full"
                  style={{ width: `${tourProgress}%` }}
                  transition={{ duration: 0.05, ease: 'linear' }}
                />
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between">
                <div className="text-white/60 text-sm hidden md:block">
                  {apartment.title}
                </div>
                <div className="flex items-center gap-4 mx-auto md:mx-0">
                  <button
                    onClick={() => handleTourNav(-1, apartment.images)}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleTourPlayPause(apartment.images)}
                    className="p-4 rounded-full bg-secondary hover:bg-secondary/80 text-white shadow-lg shadow-secondary/40 transition-all hover:scale-110"
                  >
                    {tourPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={() => handleTourNav(1, apartment.images)}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-white/40 text-xs hidden md:block">
                  {Math.ceil((100 - tourProgress) / 100 * SLIDE_DURATION / 1000)}s
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
