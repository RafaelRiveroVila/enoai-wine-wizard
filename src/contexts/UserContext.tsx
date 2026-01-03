import React, { createContext, useContext, useState, ReactNode } from "react";
import { WineRecommendation } from "@/components/WineCard";

interface UserProfile {
  name: string;
  email: string;
  location: string;
  initials: string;
}

interface UserContextType {
  profile: UserProfile;
  preferences: string[];
  favorites: WineRecommendation[];
  addPreference: (preference: string) => void;
  removePreference: (preference: string) => void;
  addFavorite: (wine: WineRecommendation) => void;
  removeFavorite: (wineName: string) => void;
  isFavorite: (wineName: string) => boolean;
}

const defaultProfile: UserProfile = {
  name: "Wine Enthusiast",
  email: "user@example.com",
  location: "San Francisco, CA",
  initials: "WE",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile] = useState<UserProfile>(defaultProfile);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<WineRecommendation[]>([]);

  const addPreference = (preference: string) => {
    if (preference.trim() && !preferences.includes(preference.trim())) {
      setPreferences((prev) => [...prev, preference.trim()]);
    }
  };

  const removePreference = (preference: string) => {
    setPreferences((prev) => prev.filter((p) => p !== preference));
  };

  const addFavorite = (wine: WineRecommendation) => {
    if (!favorites.some((f) => f.name === wine.name && f.year === wine.year)) {
      setFavorites((prev) => [...prev, wine]);
    }
  };

  const removeFavorite = (wineName: string) => {
    setFavorites((prev) => prev.filter((f) => f.name !== wineName));
  };

  const isFavorite = (wineName: string) => {
    return favorites.some((f) => f.name === wineName);
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        preferences,
        favorites,
        addPreference,
        removePreference,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
