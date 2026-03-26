import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  User, MapPin, Phone, Mail, Calendar, Star, Heart,
  ShoppingBag, Settings, LogOut, ChevronRight, Award,
  Home, Clock, CheckCircle, ArrowUpRight, Edit
} from 'lucide-react';
import { useAppContext, MOCK_PAST_BOOKINGS } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn, formatPrice } from '@/lib/utils';

const TIER_COLORS = {
  Standard: 'bg-gray-100 text-gray-700',
  Prestige: 'bg-secondary/10 text-secondary',
  Gold: 'bg-yellow-50 text-yellow-700',
};

const STATUS_COLORS = {
  'Terminé': 'bg-gray-100 text-gray-600',
  'En cours': 'bg-green-50 text-green-700',
  'À venir': 'bg-blue-50 text-blue-700',
};

export default function Profile() {
  const { user, logout, favorites } = useAppContext();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'reservations' | 'favoris' | 'parametres'>('reservations');

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 pt-20">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-primary">Espace non disponible</h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Veuillez vous connecter pour accéder à votre espace personnel.
          </p>
          <button
            onClick={() => setLocation('/')}
            className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const totalSpent = MOCK_PAST_BOOKINGS.reduce((s, b) => s + b.total, 0);
  const completedTrips = MOCK_PAST_BOOKINGS.filter(b => b.status === 'Terminé').length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero band */}
      <div className="bg-primary pt-28 pb-12 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-2xl bg-secondary flex items-center justify-center shadow-lg shadow-black/30 flex-shrink-0"
          >
            <span className="text-3xl font-serif font-bold text-secondary-foreground">
              {user.avatar}
            </span>
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
              <h1 className="text-white text-3xl font-serif font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <span className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide', TIER_COLORS[user.tier])}>
                {user.tier}
              </span>
            </div>
            <p className="text-white/60 text-sm flex items-center gap-2 justify-center md:justify-start">
              <Calendar className="w-4 h-4" />
              Membre depuis {user.memberSince}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-3 divide-x divide-border">
          <div className="text-center px-4">
            <p className="text-2xl font-serif font-bold text-primary">{MOCK_PAST_BOOKINGS.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Séjours réservés</p>
          </div>
          <div className="text-center px-4">
            <p className="text-2xl font-serif font-bold text-primary">{completedTrips}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Séjours effectués</p>
          </div>
          <div className="text-center px-4">
            <p className="text-2xl font-serif font-bold text-primary">{formatPrice(totalSpent)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total dépensé</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 grid md:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-3">
          {/* User card */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Mon compte</h3>
            <ul className="space-y-1">
              {[
                { key: 'reservations', icon: Calendar, label: 'Mes réservations' },
                { key: 'favoris', icon: Heart, label: 'Mes favoris', badge: favorites.length },
                { key: 'parametres', icon: Settings, label: 'Paramètres' },
              ].map(item => (
                <li key={item.key}>
                  <button
                    onClick={() => setActiveTab(item.key as any)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      activeTab === item.key
                        ? 'bg-primary text-white'
                        : 'hover:bg-muted text-foreground'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge ? (
                      <span className={cn(
                        'text-xs font-bold px-2 py-0.5 rounded-full',
                        activeTab === item.key ? 'bg-white/20 text-white' : 'bg-secondary/10 text-secondary'
                      )}>
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info card */}
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Coordonnées</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-foreground/70">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </li>
              <li className="flex items-center gap-2.5 text-foreground/70">
                <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                {user.phone}
              </li>
              <li className="flex items-center gap-2.5 text-foreground/70">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                Paris, France
              </li>
            </ul>
          </div>

          {/* Prestige badge */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-white">
            <Award className="w-8 h-8 text-secondary mb-3" />
            <h4 className="font-serif font-bold text-lg mb-1">Membre {user.tier}</h4>
            <p className="text-white/60 text-xs mb-4">
              Accès prioritaire aux biens exclusifs et service conciergerie dédié.
            </p>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div className="bg-secondary h-1.5 rounded-full" style={{ width: '65%' }} />
            </div>
            <p className="text-white/40 text-xs mt-1.5">65% vers le statut Gold</p>
          </div>
        </aside>

        {/* Tab content */}
        <main>
          {activeTab === 'reservations' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-xl font-serif font-bold text-primary mb-6">Mes réservations</h2>
              {MOCK_PAST_BOOKINGS.map(booking => (
                <div key={booking.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-36 sm:h-auto flex-shrink-0 overflow-hidden">
                      <img src={booking.image} alt={booking.apartmentTitle} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-serif font-bold text-primary text-lg leading-tight">{booking.apartmentTitle}</h3>
                            <p className="text-muted-foreground text-sm flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5" /> {booking.city}
                            </p>
                          </div>
                          <span className={cn('px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0', STATUS_COLORS[booking.status])}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(booking.checkIn).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            {' → '}
                            {new Date(booking.checkOut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">Référence</p>
                          <p className="text-sm font-mono font-medium text-foreground">{booking.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Total séjour</p>
                          <p className="text-lg font-serif font-bold text-primary">{formatPrice(booking.total)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'favoris' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-serif font-bold text-primary mb-6">Mes favoris</h2>
              {favorites.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-sm">
                  <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-serif font-bold text-primary mb-2">Aucun favori pour l'instant</h3>
                  <p className="text-muted-foreground text-sm mb-6">Parcourez le catalogue et cœurez les biens qui vous plaisent.</p>
                  <Link href="/appartements" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
                    <Home className="w-4 h-4" />
                    Explorer le catalogue
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-border p-6 shadow-sm text-center">
                  <Heart className="w-8 h-8 text-secondary mx-auto mb-3" />
                  <p className="font-serif font-bold text-primary text-lg mb-1">{favorites.length} bien{favorites.length > 1 ? 's' : ''} sauvegardé{favorites.length > 1 ? 's' : ''}</p>
                  <Link href="/favoris" className="inline-flex items-center gap-2 text-secondary hover:underline text-sm font-medium mt-2">
                    Voir mes favoris <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'parametres' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-xl font-serif font-bold text-primary mb-6">Paramètres du compte</h2>

              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-primary">Informations personnelles</h3>
                  <button className="flex items-center gap-1.5 text-secondary text-sm hover:underline">
                    <Edit className="w-4 h-4" /> Modifier
                  </button>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Prénom', value: user.firstName },
                    { label: 'Nom', value: user.lastName },
                    { label: 'Email', value: user.email },
                    { label: 'Téléphone', value: user.phone },
                  ].map(field => (
                    <div key={field.label}>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{field.label}</p>
                      <p className="font-medium text-foreground">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-primary">Sécurité</h3>
                </div>
                <div className="p-6 space-y-3">
                  {[
                    { label: 'Changer le mot de passe', icon: Lock },
                    { label: 'Authentification à deux facteurs', icon: CheckCircle },
                    { label: 'Appareils connectés', icon: Settings },
                  ].map(item => (
                    <button key={item.label} className="w-full flex items-center justify-between py-3 border-b border-border/50 last:border-0 hover:text-primary group transition-colors">
                      <div className="flex items-center gap-3 text-sm font-medium">
                        <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        {item.label}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-xl font-medium transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </motion.div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

function Lock(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
