"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UserContextType {
  favorites: Set<string>;
  toggleFavorite: (userId: string) => void;
  isFavorite: (userId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function getInitialFavorites(): Set<string> {
  if (typeof window === "undefined") {
    return new Set<string>();
  }
  try {
    const stored = localStorage.getItem("favs");
    if (stored) {
      const favoriteIds = JSON.parse(stored) as string[];
      return new Set(favoriteIds);
    }
  } catch (error) {
    console.error("Error loading favorites from localStorage:", error);
  }
  return new Set<string>();
}

export function ContextProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(getInitialFavorites);

  useEffect(() => {
      try {
        localStorage.setItem("favs", JSON.stringify(Array.from(favorites)));
      } catch (error) {
        console.error(error);
      }
    
  }, [favorites]);

  const toggleFavorite = (userId: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const isFavorite = (userId: string) => {
    return favorites.has(userId);
  };

  return (
    <UserContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </UserContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("no can find the favorites out of the context");
  }
  return context;
}
