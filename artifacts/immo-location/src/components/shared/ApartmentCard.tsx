import { Link } from 'wouter';
import { Heart, MapPin, Star, BedDouble, Bath, Maximize } from 'lucide-react';
import { Apartment } from '@/data/mock-data';
import { useAppContext } from '@/context/AppContext';
import { formatPrice, cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ApartmentCard({ apartment, index = 0 }: { apartment: Apartment, index?: number }) {
  const { favorites, toggleFavorite } = useAppContext();
  const isFav = favorites.includes(apartment.id);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-card rounded-2xl overflow-hidden border hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Link href={`/appartement/${apartment.id}`}>
          <img 
            src={apartment.images[0]} 
            alt={apartment.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {apartment.isPremium && (
            <span className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              Prestige
            </span>
          )}
          {apartment.isNew && (
            <span className="bg-white text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              Nouveau
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => { e.preventDefault(); toggleFavorite(apartment.id); }}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/30 backdrop-blur-md border border-white/40 hover:bg-white transition-all duration-200 z-10"
        >
          <Heart className={cn("w-5 h-5 transition-colors", isFav ? "fill-red-500 text-red-500" : "text-white group-hover:text-red-500")} />
        </button>

        {/* Price Overlay */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm font-semibold text-primary">
          {formatPrice(apartment.pricing.perNight || 0)} <span className="text-xs font-normal text-muted-foreground">/nuit</span>
        </div>
      </div>

      {/* Content Area */}
      <Link href={`/appartement/${apartment.id}`}>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif font-bold text-lg leading-tight line-clamp-1 group-hover:text-secondary transition-colors">
              {apartment.title}
            </h3>
            <div className="flex items-center gap-1 text-sm font-medium shrink-0 ml-2 bg-muted px-1.5 py-0.5 rounded">
              <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
              <span>{apartment.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <MapPin className="w-4 h-4 mr-1 shrink-0" />
            <span className="truncate">{apartment.location.address}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-foreground/80 pt-4 border-t">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-primary/60" />
              <span>{apartment.bedrooms} Ch.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-primary/60" />
              <span>{apartment.bathrooms} SdB</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4 text-primary/60" />
              <span>{apartment.surface} m²</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
