import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Heart, Menu, Search, X, User, ShoppingBag, LogOut, Settings, Calendar, ChevronDown } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [location] = useLocation();
  const { favorites, cart, user, logout, setShowLoginModal } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isHome = location === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
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

  const iconClasses = cn({ "text-white": isHome && !isScrolled });

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
            <div className="hidden md:flex items-center space-x-4">
              <button className={cn("p-2 rounded-full hover:bg-black/5 transition-colors", { "hover:bg-white/10": isHome && !isScrolled })}>
                <Search className={cn("w-5 h-5", iconClasses)} />
              </button>

              <Link href="/favoris" className="relative p-2 rounded-full hover:bg-black/5 transition-colors">
                <Heart className={cn("w-5 h-5", iconClasses)} />
                {favorites.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {cart && (
                <Link href="/panier" className="relative p-2 rounded-full hover:bg-black/5 transition-colors">
                  <ShoppingBag className={cn("w-5 h-5", iconClasses)} />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    1
                  </span>
                </Link>
              )}

              {/* Auth button / User menu */}
              {user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border/40 hover:shadow-md transition-all bg-white/10 backdrop-blur-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-sm">
                      {user.avatar}
                    </div>
                    <span className={cn("text-sm font-medium hidden lg:block", isHome && !isScrolled ? "text-white" : "text-foreground")}>
                      {user.firstName}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", iconClasses, userMenuOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-border overflow-hidden z-50"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-border bg-muted/30">
                          <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                          <Link
                            href="/profil"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                          >
                            <User className="w-4 h-4 text-muted-foreground" />
                            Mon profil
                          </Link>
                          <Link
                            href="/profil"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                          >
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            Mes réservations
                          </Link>
                          <Link
                            href="/favoris"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                          >
                            <Heart className="w-4 h-4 text-muted-foreground" />
                            Mes favoris
                            {favorites.length > 0 && (
                              <span className="ml-auto text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-semibold">
                                {favorites.length}
                              </span>
                            )}
                          </Link>
                          <Link
                            href="/profil"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                          >
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            Paramètres
                          </Link>
                        </div>

                        <div className="border-t border-border py-1">
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Déconnexion
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-lg"
                >
                  <User className="w-4 h-4" />
                  Connexion
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <Link href="/favoris" className="relative">
                <Heart className={cn("w-6 h-6", iconClasses)} />
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
              {user && (
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                    {user.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              )}
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium">Accueil</Link>
              <Link href="/appartements" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium">Découvrir</Link>
              <Link href="/favoris" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium flex items-center justify-between">
                Favoris
                {favorites.length > 0 && <span className="bg-secondary text-white px-2 py-1 rounded-full text-xs">{favorites.length}</span>}
              </Link>
              {user && (
                <Link href="/profil" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium">Mon profil</Link>
              )}
              {cart && (
                <Link href="/panier" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium">Mon Panier (1)</Link>
              )}
              <div className="mt-auto pt-6 border-t">
                {user ? (
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full border border-red-200 text-red-600 py-4 rounded-xl font-medium flex justify-center items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                ) : (
                  <button
                    onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium flex justify-center items-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    Se connecter
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
