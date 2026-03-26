import { Link } from 'wouter';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-white font-serif font-bold text-xl">
                I
              </div>
              <span className="font-serif font-bold text-2xl text-white">ImmoLoc</span>
            </div>
            <p className="text-sm leading-relaxed mt-4">
              L'excellence de l'immobilier résidentiel. Découvrez notre collection exclusive d'appartements de prestige pour vos séjours à travers la France.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors text-white">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Découvrir</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/appartements?city=Paris" className="hover:text-secondary transition-colors">Paris</Link></li>
              <li><Link href="/appartements?city=Lyon" className="hover:text-secondary transition-colors">Lyon</Link></li>
              <li><Link href="/appartements?city=Cannes" className="hover:text-secondary transition-colors">Cannes & Riviera</Link></li>
              <li><Link href="/appartements?type=premium" className="hover:text-secondary transition-colors">Collection Prestige</Link></li>
              <li><Link href="/appartements" className="hover:text-secondary transition-colors">Tous nos biens</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-6">Nos Services</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-secondary transition-colors">Conciergerie Privée</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Chauffeur</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Chef à domicile</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Devenir Propriétaire</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Assurance Séjour</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <span>45 Avenue Montaigne<br/>75008 Paris, France</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <span>+33 (0)1 42 68 53 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <span>contact@immoloc.fr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} ImmoLoc Prestige. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-white transition-colors">Politique de Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">CGV</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
