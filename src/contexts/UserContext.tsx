import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { WineRecommendation } from "@/components/WineCard";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  name: string;
  email: string;
  location: string;
  initials: string;
}

interface CellarPriceEntry {
  price: string | null;
  source: string | null;
  loading: boolean;
}

interface UserContextType {
  profile: UserProfile;
  preferences: string[];
  favorites: WineRecommendation[];
  clientMode: boolean;
  setClientMode: (v: boolean) => void;
  cellarPrices: Record<string, CellarPriceEntry>;
  lookupCellarPrice: (wine: WineRecommendation) => void;
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

const CLIENT_MODE_KEY = "enoai.clientMode";

const wineKey = (wine: { name: string; year?: string }) =>
  `${wine.name}|${wine.year ?? ""}`.toLowerCase();

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile] = useState<UserProfile>(defaultProfile);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<WineRecommendation[]>([]);
  const [clientMode, setClientModeState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(CLIENT_MODE_KEY) === "true";
  });
  const [cellarPrices, setCellarPrices] = useState<Record<string, CellarPriceEntry>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CLIENT_MODE_KEY, String(clientMode));
    }
  }, [clientMode]);

  const setClientMode = (v: boolean) => setClientModeState(v);

  const lookupCellarPrice = useCallback((wine: WineRecommendation) => {
    const key = wineKey(wine);
    setCellarPrices((prev) => {
      if (prev[key]) return prev; // already fetched or in-flight
      return { ...prev, [key]: { price: null, source: null, loading: true } };
    });

    supabase.functions
      .invoke("wine-cellar-price", {
        body: { name: wine.name, year: wine.year, region: wine.region },
      })
      .then(({ data, error }) => {
        if (error) {
          console.error("cellar price error", error);
          setCellarPrices((prev) => ({
            ...prev,
            [key]: { price: null, source: null, loading: false },
          }));
          return;
        }
        setCellarPrices((prev) => ({
          ...prev,
          [key]: {
            price: (data as any)?.cellarPrice ?? null,
            source: (data as any)?.source ?? null,
            loading: false,
          },
        }));
      })
      .catch((err) => {
        console.error("cellar price exception", err);
        setCellarPrices((prev) => ({
          ...prev,
          [key]: { price: null, source: null, loading: false },
        }));
      });
  }, []);

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
        clientMode,
        setClientMode,
        cellarPrices,
        lookupCellarPrice,
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

export const getWineKey = wineKey;
