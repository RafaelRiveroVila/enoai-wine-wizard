import { Wine, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";

export interface WineRecommendation {
  name: string;
  year: string;
  region: string;
  category: string;
  style: string[];
  aromas: string[];
  flavourProfile: string[];
  bodyStrength: number; // 0-5, increments of 0.5
  imageUrl?: string;
  price?: string;
  grape?: string;
}

interface WineCardProps {
  wine: WineRecommendation;
}

interface WineGlassProps {
  fill: 'full' | 'half' | 'empty';
}

const WineGlass = ({ fill }: WineGlassProps) => {
  return (
    <svg
      viewBox="0 0 24 32"
      className="w-5 h-6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Glass outline */}
      <path
        d="M6 2C6 2 4 8 4 12C4 16 7 19 11 19.8V28H7V30H17V28H13V19.8C17 19 20 16 20 12C20 8 18 2 18 2H6Z"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Wine fill - full */}
      {fill === 'full' && (
        <path
          d="M6.5 8C6.5 8 5 11 5 12.5C5 15.5 7.5 18 11 18.5C11.5 18.55 12 18.55 12.5 18.5C16 18 18.5 15.5 18.5 12.5C18.5 11 17 8 17 8H6.5Z"
          fill="hsl(var(--primary))"
        />
      )}
      {/* Wine fill - half */}
      {fill === 'half' && (
        <path
          d="M7 11C7 11 6 12.5 6 13.5C6 15.5 8 17.5 11 18C11.5 18.05 12 18.05 12.5 18C15.5 17.5 17.5 15.5 17.5 13.5C17.5 12.5 16.5 11 16.5 11H7Z"
          fill="hsl(var(--primary))"
        />
      )}
    </svg>
  );
};

const WineCard = ({ wine }: WineCardProps) => {
  const { addFavorite, removeFavorite, isFavorite } = useUser();
  const { t, translateCategory } = useLanguage();
  const favorited = isFavorite(wine.name);

  const handleToggleFavorite = () => {
    if (favorited) {
      removeFavorite(wine.name);
    } else {
      addFavorite(wine);
    }
  };

  const renderBodyStrength = (strength: number) => {
    const glasses = [];
    for (let i = 1; i <= 5; i++) {
      if (strength >= i) {
        glasses.push(<WineGlass key={i} fill="full" />);
      } else if (strength >= i - 0.5) {
        glasses.push(<WineGlass key={i} fill="half" />);
      } else {
        glasses.push(<WineGlass key={i} fill="empty" />);
      }
    }
    return <div className="flex gap-0.5">{glasses}</div>;
  };

  return (
    <Card className="p-5 bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Wine Image/Placeholder */}
        <div className="flex-shrink-0 w-24 h-28 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center overflow-hidden">
          {wine.imageUrl ? (
            <img 
              src={wine.imageUrl} 
              alt={wine.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Wine className="w-10 h-10 text-primary" />
          )}
        </div>

        {/* Wine Details */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h4 className="font-semibold text-foreground text-lg leading-tight">
                {wine.name}{wine.year && wine.year !== "N/A" ? ` ${wine.year}` : ""}
              </h4>
              <p className="text-sm text-muted-foreground">{wine.region}</p>
              {wine.grape && wine.grape !== "N/A" && (
                <p className="text-sm text-primary font-medium">{wine.grape}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              {wine.price && wine.price !== "N/A" && (
                <span className="text-sm font-semibold text-foreground">{wine.price}</span>
              )}
              <button 
                onClick={handleToggleFavorite}
                className="flex-shrink-0 p-1.5 hover:bg-muted rounded-full transition-colors"
              >
                <Heart 
                  className={`w-4 h-4 transition-colors ${
                    favorited 
                      ? "text-destructive fill-destructive" 
                      : "text-muted-foreground"
                  }`} 
                />
              </button>
            </div>
          </div>

          {/* Grid of Details */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
            {/* Category */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t.category}</p>
              <p className="text-sm font-medium text-foreground">{translateCategory(wine.category)}</p>
            </div>

            {/* Aromas */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t.aromas}</p>
              <p className="text-sm text-foreground">
                {wine.aromas.join(" · ")}
              </p>
            </div>

            {/* Style */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t.style}</p>
              <p className="text-sm text-foreground">
                {wine.style.join(" · ")}
              </p>
            </div>

            {/* Flavour Profile */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t.flavourProfile}</p>
              <p className="text-sm text-foreground">
                {wine.flavourProfile.join(" · ")}
              </p>
            </div>

            {/* Body / Strength */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t.bodyStrength}</p>
              {renderBodyStrength(wine.bodyStrength)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WineCard;
