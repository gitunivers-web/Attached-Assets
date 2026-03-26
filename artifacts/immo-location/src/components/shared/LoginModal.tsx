import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Lock, Mail, User, ArrowRight, CheckCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useAppContext();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('sophie.martin@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Veuillez saisir votre email.'); return; }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) setError('Identifiants incorrects. Réessayez.');
  };

  const handleClose = () => {
    setShowLoginModal(false);
    setError('');
  };

  return (
    <AnimatePresence>
      {showLoginModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[301] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="relative bg-primary px-8 pt-10 pb-8">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <span className="font-serif font-bold text-2xl text-secondary-foreground">I</span>
                </div>
                <h2 className="text-white text-2xl font-serif font-bold mb-1">
                  {mode === 'login' ? 'Bon retour chez vous' : 'Rejoindre ImmoLoc'}
                </h2>
                <p className="text-white/60 text-sm">
                  {mode === 'login'
                    ? 'Connectez-vous pour accéder à votre espace'
                    : 'Créez votre compte en quelques secondes'}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => { setMode('login'); setError(''); }}
                  className={cn(
                    'flex-1 py-3 text-sm font-medium transition-colors',
                    mode === 'login'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Se connecter
                </button>
                <button
                  onClick={() => { setMode('register'); setError(''); }}
                  className={cn(
                    'flex-1 py-3 text-sm font-medium transition-colors',
                    mode === 'register'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Créer un compte
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Prénom</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          placeholder="Sophie"
                          className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Nom</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          placeholder="Martin"
                          className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Adresse e-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'login' && (
                  <div className="text-right">
                    <button type="button" className="text-xs text-secondary hover:underline">
                      Mot de passe oublié ?
                    </button>
                  </div>
                )}

                {error && (
                  <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">ou</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Social login mock */}
                <button
                  type="button"
                  onClick={handleSubmit as any}
                  className="w-full border border-border rounded-xl py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuer avec Google
                </button>
              </form>

              {/* Trust badges */}
              <div className="px-8 pb-6">
                <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    Données sécurisées
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    Sans engagement
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    RGPD conforme
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
