import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ApartmentCard from '@/components/shared/ApartmentCard';
import { ALL_APARTMENTS } from '@/data/mock-data';
import { SlidersHorizontal, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Listings() {
  const [location] = useLocation();
  
  // Parse query params
  const searchParams = new URLSearchParams(window.location.search);
  const initialCity = searchParams.get('city') || '';
  const initialType = searchParams.get('type') === 'premium' ? true : false;

  const [cityFilter, setCityFilter] = useState(initialCity);
  const [showPremiumOnly, setShowPremiumOnly] = useState(initialType);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredApartments = useMemo(() => {
    return ALL_APARTMENTS.filter(apt => {
      if (cityFilter && !apt.location.city.toLowerCase().includes(cityFilter.toLowerCase())) return false;
      if (showPremiumOnly && !apt.isPremium) return false;
      if (apt.pricing.perNight && (apt.pricing.perNight < priceRange[0] || apt.pricing.perNight > priceRange[1])) return false;
      if (apt.bedrooms < minBedrooms) return false;
      return true;
    });
  }, [cityFilter, showPremiumOnly, priceRange, minBedrooms]);

  const cities = Array.from(new Set(ALL_APARTMENTS.map(a => a.location.city)));

  const FiltersContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Destination</h3>
        <select 
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary/50 transition-shadow"
        >
          <option value="">Toutes les villes</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Prix par nuit (€)</h3>
          <span className="text-sm font-medium">{priceRange[0]}€ - {priceRange[1]}€{priceRange[1] === 1000 ? '+' : ''}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="1000" 
          step="50"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          className="w-full accent-secondary"
        />
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Chambres (Min)</h3>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map(num => (
            <button
              key={num}
              onClick={() => setMinBedrooms(num)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${minBedrooms === num ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
            >
              {num}{num === 4 ? '+' : ''}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={showPremiumOnly}
            onChange={(e) => setShowPremiumOnly(e.target.checked)}
            className="w-5 h-5 rounded border-border text-secondary focus:ring-secondary"
          />
          <span className="font-medium">Collection Prestige uniquement</span>
        </label>
      </div>

      <button 
        onClick={() => {
          setCityFilter('');
          setShowPremiumOnly(false);
          setPriceRange([0, 1000]);
          setMinBedrooms(0);
        }}
        className="w-full text-muted-foreground text-sm font-medium hover:text-primary transition-colors py-2"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Navbar />
      
      <div className="pt-24 pb-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary mb-2">
                {cityFilter ? `Appartements à ${cityFilter}` : 'Tous nos appartements'}
              </h1>
              <p className="text-muted-foreground">
                {filteredApartments.length} bien{filteredApartments.length !== 1 ? 's' : ''} trouvé{filteredApartments.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button 
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-border px-4 py-2 rounded-lg shadow-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 sticky top-28">
                <div className="flex items-center gap-2 mb-8 border-b pb-4">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  <h2 className="font-serif font-bold text-lg">Affiner la recherche</h2>
                </div>
                <FiltersContent />
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1">
              {filteredApartments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredApartments.map((apt, idx) => (
                    <ApartmentCard key={apt.id} apartment={apt} index={idx} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-border/50 shadow-sm flex flex-col items-center">
                  <MapPin className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-xl font-serif font-bold mb-2">Aucun résultat trouvé</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Nous n'avons pas trouvé de biens correspondant à vos critères. Essayez de modifier vos filtres.
                  </p>
                  <button 
                    onClick={() => { setCityFilter(''); setShowPremiumOnly(false); }}
                    className="bg-primary text-white px-6 py-3 rounded-full font-medium"
                  >
                    Voir tous les biens
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="font-serif font-bold text-xl">Filtres</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 bg-muted rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <FiltersContent />
            </div>
            <div className="p-6 border-t bg-white">
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-primary text-white py-4 rounded-xl font-medium"
              >
                Afficher {filteredApartments.length} résultat(s)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
