import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "es";

interface Translations {
  // Hero
  heroSubheading: string;
  heroFeature1: string;
  heroFeature2: string;
  heroFeature3: string;
  heroCta: string;

  // Chat
  chatTitle: string;
  chatSubtitle: string;
  newChat: string;
  chatPlaceholder: string;
  findingWines: string;
  welcomeMessage: string;
  analyzePrompt: string;
  onlyImagesAndPdfs: string;
  errorSending: string;

  // Profile Panel
  winePreferences: string;
  preferencePlaceholder: string;
  preferenceHint: string;
  favoriteWines: string;
  wine: string;
  wines: string;
  noFavoritesYet: string;
  noFavoritesHint: string;

  // Wine Card
  category: string;
  aromas: string;
  style: string;
  flavourProfile: string;
  bodyStrength: string;

  // Wine Recommendation
  whyTheseWines: string;

  // Wine Categories (for translation)
  categoryRedWine: string;
  categoryWhiteWine: string;
  categoryRose: string;
  categorySparkling: string;
  categoryDessertWine: string;
  categoryFortifiedWine: string;
  categoryOrangeWine: string;

  // Language
  language: string;
  english: string;
  spanish: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Hero
    heroSubheading: "Your personal wine sommelier powered by AI. Discover the perfect wine for any occasion, meal, or moment.",
    heroFeature1: "Personalized Recommendations",
    heroFeature2: "Food Pairing Expert",
    heroFeature3: "Budget-Friendly Options",
    heroCta: "Start Your Wine Journey",

    // Chat
    chatTitle: "Chat with enoAI",
    chatSubtitle: "Ask me anything about wine selection, pairings, or recommendations",
    newChat: "New Chat",
    chatPlaceholder: "Ask about wine pairings, recommendations, or upload images/PDFs... (Ctrl+Enter to send)",
    findingWines: "Finding the perfect wines...",
    welcomeMessage: "Hello! I'm enoAI, your wine sommelier assistant. I can help you choose the perfect wine for any occasion. You can also upload images of wine labels or PDF wine lists for recommendations. What would you like to know about wine today?",
    analyzePrompt: "Please analyze this wine list and provide recommendations.",
    onlyImagesAndPdfs: "Only images and PDF files are supported",
    errorSending: "Failed to send message. Please try again.",

    // Profile Panel
    winePreferences: "Wine Preferences",
    preferencePlaceholder: "e.g., Full-bodied reds, Italian wines...",
    preferenceHint: "Add your wine preferences to get better recommendations",
    favoriteWines: "Favorite Wines",
    wine: "wine",
    wines: "wines",
    noFavoritesYet: "No favorites yet",
    noFavoritesHint: "Click the heart icon on any wine to save it here",

    // Wine Card
    category: "Category",
    aromas: "Aromas",
    style: "Style",
    flavourProfile: "Flavour Profile",
    bodyStrength: "Body / Strength",

    // Wine Recommendation
    whyTheseWines: "Why These Wines?",

    // Wine Categories
    categoryRedWine: "Red Wine",
    categoryWhiteWine: "White Wine",
    categoryRose: "Rosé",
    categorySparkling: "Sparkling",
    categoryDessertWine: "Dessert Wine",
    categoryFortifiedWine: "Fortified Wine",
    categoryOrangeWine: "Orange Wine",

    // Language
    language: "Language",
    english: "English",
    spanish: "Spanish",
  },
  es: {
    // Hero
    heroSubheading: "Tu sommelier personal impulsado por IA. Descubre el vino perfecto para cualquier ocasión, comida o momento.",
    heroFeature1: "Recomendaciones Personalizadas",
    heroFeature2: "Experto en Maridaje",
    heroFeature3: "Opciones Económicas",
    heroCta: "Comienza tu Viaje del Vino",

    // Chat
    chatTitle: "Chatea con enoAI",
    chatSubtitle: "Pregúntame sobre selección de vinos, maridajes o recomendaciones",
    newChat: "Nuevo Chat",
    chatPlaceholder: "Pregunta sobre maridajes, recomendaciones o sube imágenes/PDFs... (Ctrl+Enter para enviar)",
    findingWines: "Buscando los vinos perfectos...",
    welcomeMessage: "¡Hola! Soy enoAI, tu asistente sommelier. Puedo ayudarte a elegir el vino perfecto para cualquier ocasión. También puedes subir imágenes de etiquetas de vino o cartas de vinos en PDF para recomendaciones. ¿Qué te gustaría saber sobre vinos hoy?",
    analyzePrompt: "Por favor analiza esta carta de vinos y proporciona recomendaciones.",
    onlyImagesAndPdfs: "Solo se admiten imágenes y archivos PDF",
    errorSending: "Error al enviar el mensaje. Por favor, inténtalo de nuevo.",

    // Profile Panel
    winePreferences: "Preferencias de Vino",
    preferencePlaceholder: "Ej: Tintos con cuerpo, vinos italianos...",
    preferenceHint: "Añade tus preferencias para obtener mejores recomendaciones",
    favoriteWines: "Vinos Favoritos",
    wine: "vino",
    wines: "vinos",
    noFavoritesYet: "Sin favoritos aún",
    noFavoritesHint: "Haz clic en el corazón de cualquier vino para guardarlo aquí",

    // Wine Card
    category: "Categoría",
    aromas: "Aromas",
    style: "Estilo",
    flavourProfile: "Perfil de Sabor",
    bodyStrength: "Cuerpo / Intensidad",

    // Wine Recommendation
    whyTheseWines: "¿Por Qué Estos Vinos?",

    // Wine Categories
    categoryRedWine: "Vino Tinto",
    categoryWhiteWine: "Vino Blanco",
    categoryRose: "Rosado",
    categorySparkling: "Espumoso",
    categoryDessertWine: "Vino de Postre",
    categoryFortifiedWine: "Vino Fortificado",
    categoryOrangeWine: "Vino Naranja",

    // Language
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  translateCategory: (category: string) => string;
}

const categoryMap: Record<string, keyof Translations> = {
  "red wine": "categoryRedWine",
  "white wine": "categoryWhiteWine",
  "rosé": "categoryRose",
  "rose": "categoryRose",
  "sparkling": "categorySparkling",
  "sparkling wine": "categorySparkling",
  "dessert wine": "categoryDessertWine",
  "fortified wine": "categoryFortifiedWine",
  "orange wine": "categoryOrangeWine",
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const translateCategory = (category: string): string => {
    const key = categoryMap[category.toLowerCase()];
    if (key) {
      return translations[language][key];
    }
    return category;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        translateCategory,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
