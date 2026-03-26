// Data Generator for 160+ Apartments
export type RentType = 'daily' | 'monthly' | 'annual';

export interface Location {
  city: string;
  arrondissement?: string;
  address: string;
  coordinates: { lat: number; lng: number };
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Apartment {
  id: string;
  title: string;
  description: string;
  location: Location;
  type: string;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  pricing: {
    perNight?: number;
    perMonth?: number;
  };
  amenities: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  available: boolean;
  rentTypes: RentType[];
  isPremium: boolean;
  isNew: boolean;
}

const CITIES = [
  { name: 'Paris', weights: 40, basePrice: 200, lats: [48.8566, 48.88], lngs: [2.3522, 2.30] },
  { name: 'Lyon', weights: 15, basePrice: 120, lats: [45.7640, 45.78], lngs: [4.8357, 4.80] },
  { name: 'Marseille', weights: 10, basePrice: 90, lats: [43.2965, 43.32], lngs: [5.3698, 5.40] },
  { name: 'Bordeaux', weights: 10, basePrice: 130, lats: [44.8378, 44.85], lngs: [-0.5792, -0.60] },
  { name: 'Cannes', weights: 10, basePrice: 250, lats: [43.5528, 43.56], lngs: [7.0174, 7.03] },
  { name: 'Nice', weights: 10, basePrice: 160, lats: [43.7102, 43.72], lngs: [7.2620, 7.28] },
  { name: 'Strasbourg', weights: 5, basePrice: 110, lats: [48.5734, 48.59], lngs: [7.7521, 7.78] },
];

const TYPES = ['Studio', 'T2', 'T3', 'T4', 'T5', 'Penthouse', 'Loft', 'Duplex'];
const AMENITIES = [
  'Wi-Fi Haut Débit', 'Climatisation', 'Parking privé', 'Piscine', 'Salle de sport',
  'Vue dégagée', 'Balcon', 'Terrasse', 'Conciergerie 24/7', 'Ascenseur', 
  'Cuisine équipée', 'Machine à laver', 'Domotique', 'Cheminée', 'Jardin'
];

const ADJECTIVES = ['Magnifique', 'Superbe', 'Luxueux', 'Élégant', 'Prestigieux', 'Charmant', 'Moderne', 'Authentique', 'Spacieux', 'Exceptionnel'];
const NOUNS = ['Appartement', 'Écrin', 'Cocon', 'Havre de paix', 'Pied-à-terre', 'Joyau', 'Résidence'];
const PLACES = ['au cœur de', 'avec vue sur', 'proche des commerces à', 'dans le quartier prisé de', 'à deux pas du centre de'];

// High-quality unsplash IDs for realistic luxury feel
const IMAGE_SETS = {
  living: ['1554995207-c18c203602cb', '1600210492486-724fe5c67fb0', '1600596542815-ffad4c1539a9', '1564013799919-ab600027ffc6', '1600585154340-be6161a56a0c', '1512917774080-9991f1c4c750', '1522708323590-d24dbb6b0267', '1560448204-e02f11c3d0e2', '1493809842364-4bfce7dd0885'],
  bedroom: ['1540518614846-7eded433c457', '1505691938895-1758d7bef511', '1522771739844-6a9f6d5f14af', '1536846671033-ce120614f5e9', '1595526114035-0d45ed16cfbf', '1616594039964-ae69c4affcb0'],
  kitchen: ['1556909114-f6e7ad7d3136', '1556910103-1c02745a872f', '1565538810-64f43ee2041e', '1505693225-24dbec2e7ac1', '1484154218962-a197022b58be'],
  bathroom: ['1552321554-5fefe8c9ef14', '1620626011761-996317b8d141', '1507089947368-19c1da9775ae', '1584622650111-993a426fbf0a'],
  exterior: ['1486325212027-8081e485255e', '1515263487990-61b07816bd15', '1460317515339-3221b2b8c2c8', '1449844908441-8829872d2607']
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomCity() {
  const totalWeight = CITIES.reduce((sum, c) => sum + c.weights, 0);
  let r = randomInt(1, totalWeight);
  for (const city of CITIES) {
    if (r <= city.weights) return city;
    r -= city.weights;
  }
  return CITIES[0];
}

const generateApartments = (): Apartment[] => {
  const apartments: Apartment[] = [];
  
  for (let i = 1; i <= 165; i++) {
    const city = randomCity();
    const type = randomItem(TYPES);
    const surface = type === 'Studio' ? randomInt(20, 35) : 
                    type === 'T2' ? randomInt(35, 55) : 
                    type === 'Penthouse' ? randomInt(120, 350) : randomInt(55, 150);
                    
    const bedrooms = type === 'Studio' ? 0 : 
                     type === 'T2' ? 1 :
                     type === 'Penthouse' ? randomInt(3, 5) : randomInt(2, 4);
                     
    const isPremium = surface > 100 || city.name === 'Cannes' || city.name === 'Paris' && Math.random() > 0.7;
    
    // Calculate pricing
    const baseMultiplier = (surface / 50) * (isPremium ? 2 : 1) * (city.basePrice / 100);
    const perNight = Math.round(100 * baseMultiplier);
    const perMonth = Math.round(perNight * 20); // Discount for monthly

    // Images
    const imgs = [
      `https://images.unsplash.com/photo-${randomItem(IMAGE_SETS.living)}?w=1200&q=80&fit=crop`,
      `https://images.unsplash.com/photo-${randomItem(IMAGE_SETS.bedroom)}?w=1200&q=80&fit=crop`,
      `https://images.unsplash.com/photo-${randomItem(IMAGE_SETS.kitchen)}?w=1200&q=80&fit=crop`,
      `https://images.unsplash.com/photo-${randomItem(IMAGE_SETS.bathroom)}?w=1200&q=80&fit=crop`,
      `https://images.unsplash.com/photo-${randomItem(IMAGE_SETS.exterior)}?w=1200&q=80&fit=crop`
    ];

    // Select random amenities
    const shuffledAmenities = [...AMENITIES].sort(() => 0.5 - Math.random());
    const aptAmenities = shuffledAmenities.slice(0, randomInt(5, 12));

    const totalFloors = randomInt(3, 8);
    const floor = type === 'Penthouse' ? totalFloors : randomInt(0, totalFloors);

    apartments.push({
      id: `apt-${i.toString().padStart(4, '0')}`,
      title: `${randomItem(ADJECTIVES)} ${randomItem(NOUNS)} ${randomItem(PLACES)} ${city.name}`,
      description: `Découvrez ce somptueux ${type.toLowerCase()} de ${surface}m², idéalement situé à ${city.name}. Offrant des prestations haut de gamme et des finitions soignées, ce bien saura vous séduire par ses volumes généreux et sa luminosité exceptionnelle. Profitez d'un cadre de vie privilégié alliant confort moderne et charme intemporel. Parfait pour les séjours de courte ou longue durée.`,
      location: {
        city: city.name,
        arrondissement: city.name === 'Paris' ? `${randomInt(1, 20)}e arr.` : undefined,
        address: `${randomInt(1, 150)} rue Fictive, ${city.name}`,
        coordinates: {
          lat: city.lats[0] + Math.random() * (city.lats[1] - city.lats[0]),
          lng: city.lngs[0] + Math.random() * (city.lngs[1] - city.lngs[0])
        }
      },
      type,
      surface,
      bedrooms,
      bathrooms: Math.max(1, Math.floor(bedrooms / 2) + (isPremium ? 1 : 0)),
      floor,
      totalFloors,
      pricing: {
        perNight,
        perMonth
      },
      amenities: aptAmenities,
      images: imgs,
      rating: +(Math.random() * 1.5 + 3.5).toFixed(2),
      reviewCount: randomInt(5, 340),
      reviews: Array.from({ length: randomInt(2, 5) }).map((_, rIdx) => ({
        id: `rev-${i}-${rIdx}`,
        author: randomItem(['Jean D.', 'Marie L.', 'Pierre S.', 'Sophie M.', 'Thomas B.', 'Camille R.']),
        rating: randomInt(4, 5),
        date: `2023-${randomInt(1,12).toString().padStart(2, '0')}-${randomInt(1,28).toString().padStart(2, '0')}`,
        comment: randomItem([
          'Séjour inoubliable ! L\'appartement est sublime et correspond parfaitement aux photos.',
          'Emplacement idéal, très propre et hôte très réactif. Je recommande vivement.',
          'Prestations luxueuses, on s\'y sent comme à la maison. Literie très confortable.',
          'Magnifique vue et décoration soignée. Un vrai bijou.',
          'Tout était parfait. Nous reviendrons avec grand plaisir.'
        ])
      })),
      available: Math.random() > 0.1,
      rentTypes: Math.random() > 0.5 ? ['daily', 'monthly'] : ['monthly', 'annual'],
      isPremium,
      isNew: Math.random() > 0.8
    });
  }
  return apartments;
};

// Singleton to persist across re-renders
export const ALL_APARTMENTS = generateApartments();

export const getFeaturedApartments = () => ALL_APARTMENTS.filter(a => a.isPremium && a.rating > 4.8).slice(0, 6);
export const getApartmentById = (id: string) => ALL_APARTMENTS.find(a => a.id === id);
