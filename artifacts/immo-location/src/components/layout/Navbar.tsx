import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Heart, Menu, Search, X, User, ShoppingBag } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [location] = useLocation();
  const { favorites, cart } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = cn(
    'fixed top-0 w-full z-50 transition-all duration-300 ease-in-out border-b',
    {
      'bg-transparent border-transparent text-white': isHome && !isScrolled,
      'bg-white/90 backdrop-blur-md border-border text-foreground shadow-sm': !isHome || isScrolled
    }
  );

  const linkClasses = cn(
    'text-sm font-medium transition-colors hover:text-secondary',
    {
      'text-white/90 hover:text-white': isHome && !isScrolled,
      'text-foreground/80 hover:text-primary': !isHome || isScrolled
    }
  );

  return (
    <>
      <nav className={navClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-secondary-foreground font-serif font-bold text-xl group-hover:scale-105 transition-transform">
                I
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight">ImmoLoc</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/appartements" className={linkClasses}>Découvrir</Link>
              <Link href="/appartements?type=premium" className={linkClasses}>Prestige</Link>
              <Link href="#" className={linkClasses}>Services</Link>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-6">
              <button className={cn("p-2 rounded-full hover:bg-black/5 transition-colors", {
                "hover:bg-white/10 text-white": isHome && !isScrolled
              })}>
                <Search className="w-5 h-5" />
              </button>
              
              <Link href="/favoris" className="relative p-2 rounded-full hover:bg-black/5 transition-colors group">
                <Heart className={cn("w-5 h-5", { "text-white": isHome && !isScrolled })} />
                {favorites.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {favorites.length}
                  </span>
                )}
              </Link>
              
              {cart && (
                <Link href="/panier" className="relative p-2 rounded-full hover:bg-black/5 transition-colors group">
                  <ShoppingBag className={cn("w-5 h-5", { "text-white": isHome && !isScrolled })} />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    1
                  </span>
                </Link>
              )}

              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-lg">
                <User className="w-4 h-4" />
                Connexion
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <Link href="/favoris" className="relative">
                <Heart className={cn("w-6 h-6", { "text-white": isHome && !isScrolled })} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className={cn("p-2", { "text-white": isHome && !isScrolled })}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <span className="font-serif font-bold text-2xl">ImmoLoc</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-muted rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col p-6 space-y-6 flex-1">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium">Accueil</Link>
              <Link href="/appartements" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium">Découvrir</Link>
              <Link href="/favoris" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium flex items-center justify-between">
                Favoris
                {favorites.length > 0 && <span className="bg-secondary text-white px-2 py-1 rounded-full text-xs">{favorites.length}</span>}
              </Link>
              {cart && (
                <Link href="/panier" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium">Mon Panier (1)</Link>
              )}
              <div className="mt-auto pt-6 border-t">
                <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium flex justify-center items-center gap-2">
                  <User className="w-5 h-5" />
                  Se connecter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
