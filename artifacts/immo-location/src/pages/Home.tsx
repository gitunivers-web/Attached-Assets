import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ApartmentCard from '@/components/shared/ApartmentCard';
import { getFeaturedApartments } from '@/data/mock-data';
import { Search, MapPin, Calendar, Users, ArrowRight, ShieldCheck, Gem, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchCity, setSearchCity] = useState('');
  const featured = getFeaturedApartments();

  {/* landing page hero scenic luxury apartment */}
  const heroImage = `${import.meta.env.BASE_URL}images/hero-luxury.png`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity) {
      setLocation(`/appartements?city=${encodeURIComponent(searchCity)}`);
    } else {
      setLocation('/appartements');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-10"></div>
          <img 
            src={heroImage} 
            alt="Luxury Parisian Penthouse" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-bold leading-tight mb-6"
          >
            L'Art de Vivre <br/>
            <span className="gold-gradient-text">à la Française</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-light"
          >
            Découvrez notre collection exclusive d'appartements de prestige pour des séjours inoubliables.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-full p-2 max-w-4xl mx-auto shadow-2xl flex flex-col md:flex-row items-center gap-2"
          >
            <form onSubmit={handleSearch} className="flex-1 w-full flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="w-full flex items-center px-6 py-3 md:py-2">
                <MapPin className="w-5 h-5 text-primary/50 mr-3" />
                <div className="flex-1 text-left">
                  <label className="block text-[11px] font-bold text-primary uppercase tracking-wider">Destination</label>
                  <input 
                    type="text" 
                    placeholder="Où allez-vous ?" 
                    className="w-full outline-none text-sm placeholder:text-muted-foreground bg-transparent"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full flex items-center px-6 py-3 md:py-2">
                <Calendar className="w-5 h-5 text-primary/50 mr-3" />
                <div className="flex-1 text-left">
                  <label className="block text-[11px] font-bold text-primary uppercase tracking-wider">Dates</label>
                  <input 
                    type="text" 
                    placeholder="Arrivée - Départ" 
                    className="w-full outline-none text-sm placeholder:text-muted-foreground bg-transparent"
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full flex items-center px-6 py-3 md:py-2">
                <Users className="w-5 h-5 text-primary/50 mr-3" />
                <div className="flex-1 text-left">
                  <label className="block text-[11px] font-bold text-primary uppercase tracking-wider">Voyageurs</label>
                  <input 
                    type="text" 
                    placeholder="Ajouter des voyageurs" 
                    className="w-full outline-none text-sm placeholder:text-muted-foreground bg-transparent"
                    readOnly
                  />
                </div>
              </div>
              <button type="submit" className="w-full md:w-auto mt-2 md:mt-0 bg-primary hover:bg-primary/90 text-white p-4 rounded-full flex items-center justify-center transition-colors">
                <Search className="w-5 h-5 md:mr-0" />
                <span className="md:hidden ml-2 font-medium">Rechercher</span>
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-12 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Gem className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-serif font-bold text-lg mb-2">Sélection Rigoureuse</h3>
              <p className="text-muted-foreground text-sm max-w-xs">Chaque propriété est inspectée et validée selon 150 critères de qualité.</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-serif font-bold text-lg mb-2">Paiement Sécurisé</h3>
              <p className="text-muted-foreground text-sm max-w-xs">Transactions chiffrées et garantie de réservation pour votre tranquillité.</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-serif font-bold text-lg mb-2">Conciergerie 24/7</h3>
              <p className="text-muted-foreground text-sm max-w-xs">Une équipe dédiée à votre service tout au long de votre séjour.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Collection Prestige</h2>
              <p className="text-muted-foreground max-w-2xl text-lg">Découvrez nos propriétés les plus exceptionnelles, triées sur le volet pour des clients exigeants.</p>
            </div>
            <Link href="/appartements?type=premium" className="hidden md:flex items-center gap-2 text-primary font-medium hover:text-secondary transition-colors group">
              Voir la collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((apt, idx) => (
              <ApartmentCard key={apt.id} apartment={apt} index={idx} />
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <button onClick={() => setLocation('/appartements')} className="px-8 py-3 border border-primary text-primary font-medium rounded-full w-full hover:bg-primary hover:text-white transition-colors">
              Voir tous les biens
            </button>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="relative py-32 bg-primary overflow-hidden">
        {/* landing page scenic lifestyle */}
        <div className="absolute inset-0 opacity-20">
           <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=80" alt="Lifestyle" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Confiez-nous votre bien d'exception</h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Vous possédez un appartement de prestige ? Rejoignez notre collection exclusive et bénéficiez d'un service de gestion sur mesure.
          </p>
          <button className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-full font-semibold transition-all hover:shadow-xl hover:-translate-y-1 inline-flex items-center gap-2">
            Proposer mon bien <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
