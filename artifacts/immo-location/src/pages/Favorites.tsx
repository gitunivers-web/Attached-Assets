import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ApartmentCard from '@/components/shared/ApartmentCard';
import { useAppContext } from '@/context/AppContext';
import { getApartmentById } from '@/data/mock-data';
import { Heart, Search } from 'lucide-react';
import { Link } from 'wouter';

export default function Favorites() {
  const { favorites } = useAppContext();
  
  const favoriteApartments = favorites
    .map(id => getApartmentById(id))
    .filter(Boolean); // remove nulls if any

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary">Vos Favoris</h1>
          </div>

          {favoriteApartments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteApartments.map((apt, idx) => (
                // @ts-ignore
                <ApartmentCard key={apt.id} apartment={apt} index={idx} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-border p-16 text-center max-w-2xl mx-auto shadow-sm mt-12">
              <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="text-2xl font-serif font-bold mb-4">Aucun favori pour le moment</h2>
              <p className="text-muted-foreground mb-8">
                Parcourez notre collection d'appartements de prestige et sauvegardez ceux qui vous font rêver pour organiser votre prochain séjour.
              </p>
              <Link href="/appartements" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-colors">
                <Search className="w-5 h-5" />
                Explorer le catalogue
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
