import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Apartment } from '@/data/mock-data';

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  tier: 'Standard' | 'Prestige' | 'Gold';
}

const MOCK_USER: MockUser = {
  id: 'usr-001',
  firstName: 'Sophie',
  lastName: 'Martin',
  email: 'sophie.martin@gmail.com',
  phone: '+33 6 12 34 56 78',
  avatar: 'SM',
  memberSince: 'Janvier 2022',
  tier: 'Prestige',
};

export interface PastBooking {
  id: string;
  apartmentTitle: string;
  city: string;
  checkIn: string;
  checkOut: string;
  total: number;
  status: 'Terminé' | 'En cours' | 'À venir';
  image: string;
}

export const MOCK_PAST_BOOKINGS: PastBooking[] = [
  {
    id: 'BK-2024-001',
    apartmentTitle: 'Suite Haussmannienne vue Tour Eiffel',
    city: 'Paris',
    checkIn: '2024-08-10',
    checkOut: '2024-08-17',
    total: 3290,
    status: 'Terminé',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
  },
  {
    id: 'BK-2024-002',
    apartmentTitle: 'Villa Azur front de mer',
    city: 'Nice',
    checkIn: '2024-06-01',
    checkOut: '2024-06-08',
    total: 2100,
    status: 'Terminé',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80',
  },
  {
    id: 'BK-2025-001',
    apartmentTitle: 'Penthouse Cannes Festival',
    city: 'Cannes',
    checkIn: '2025-05-15',
    checkOut: '2025-05-22',
    total: 4900,
    status: 'À venir',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
  },
];

interface AppContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  cart: BookingData | null;
  setCart: (data: BookingData | null) => void;
  user: MockUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (v: boolean) => void;
}

export interface BookingData {
  apartment: Apartment;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<BookingData | null>(null);
  const [user, setUser] = useState<MockUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedFavs = localStorage.getItem('immo_favorites');
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) {}
    }
    const savedCart = localStorage.getItem('immo_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }
    const savedUser = localStorage.getItem('immo_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('immo_favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      if (cart) {
        localStorage.setItem('immo_cart', JSON.stringify(cart));
      } else {
        localStorage.removeItem('immo_cart');
      }
    }
  }, [cart, isLoaded]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const login = async (email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 900));
    const loggedUser = { ...MOCK_USER, email: email || MOCK_USER.email };
    setUser(loggedUser);
    localStorage.setItem('immo_user', JSON.stringify(loggedUser));
    setShowLoginModal(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('immo_user');
  };

  return (
    <AppContext.Provider value={{
      favorites, toggleFavorite,
      cart, setCart,
      user, login, logout,
      showLoginModal, setShowLoginModal,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
