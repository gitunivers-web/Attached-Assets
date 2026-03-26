import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Apartment } from '@/data/mock-data';

interface AppContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  cart: BookingData | null;
  setCart: (data: BookingData | null) => void;
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

  return (
    <AppContext.Provider value={{ favorites, toggleFavorite, cart, setCart }}>
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
