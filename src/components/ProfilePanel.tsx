import { useState } from "react";
import { X, Mail, MapPin, Plus, Wine, Heart, Globe } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import FavoriteWineCard from "@/components/FavoriteWineCard";

interface ProfilePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfilePanel = ({ open, onOpenChange }: ProfilePanelProps) => {
  const { profile, preferences, favorites, addPreference, removePreference, removeFavorite } = useUser();
  const { language, setLanguage, t } = useLanguage();
  const [newPreference, setNewPreference] = useState("");

  const handleAddPreference = () => {
    if (newPreference.trim()) {
      addPreference(newPreference);
      setNewPreference("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddPreference();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="sr-only">Profile</SheetTitle>
        </SheetHeader>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
            {profile.initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
              <Mail className="w-4 h-4" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
              <MapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground">{t.language}</h3>
          </div>
          <Select value={language} onValueChange={(value: "en" | "es") => setLanguage(value)}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="en">{t.english}</SelectItem>
              <SelectItem value="es">{t.spanish}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Wine Preferences */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{t.winePreferences}</h3>
          <div className="flex gap-2">
            <Input
              placeholder={t.preferencePlaceholder}
              value={newPreference}
              onChange={(e) => setNewPreference(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button size="icon" onClick={handleAddPreference} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 italic">
            {t.preferenceHint}
          </p>

          {preferences.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {preferences.map((pref) => (
                <Badge
                  key={pref}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => removePreference(pref)}
                >
                  {pref} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Favorite Wines */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-destructive fill-destructive" />
              <h3 className="text-lg font-semibold text-foreground">{t.favoriteWines}</h3>
            </div>
            <span className="text-sm text-muted-foreground">
              {favorites.length} {favorites.length === 1 ? t.wine : t.wines}
            </span>
          </div>

          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Wine className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <p className="font-medium text-foreground">{t.noFavoritesYet}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t.noFavoritesHint}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((wine) => (
                <FavoriteWineCard
                  key={`${wine.name}-${wine.year}`}
                  wine={wine}
                  onRemove={() => removeFavorite(wine.name)}
                />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfilePanel;
