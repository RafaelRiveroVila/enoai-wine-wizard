import { Wine, Star, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface WineRecommendation {
  name: string;
  year: string;
  region: string;
  category: string;
  style: string[];
  aromas: string[];
  flavourProfile: string[];
  bodyStrength: number; // 1-5
  imageUrl?: string;
}

interface WineCardProps {
  wine: WineRecommendation;
}

const WineCard = ({ wine }: WineCardProps) => {
  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= count
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
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
                {wine.name} {wine.year}
              </h4>
              <p className="text-sm text-muted-foreground">{wine.region}</p>
            </div>
            <button className="flex-shrink-0 p-1.5 hover:bg-muted rounded-full transition-colors">
              <Heart className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Grid of Details */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
            {/* Category */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Category</p>
              <p className="text-sm font-medium text-foreground">{wine.category}</p>
            </div>

            {/* Aromas */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Aromas</p>
              <p className="text-sm text-foreground">
                {wine.aromas.join(" · ")}
              </p>
            </div>

            {/* Style */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Style</p>
              <p className="text-sm text-foreground">
                {wine.style.join(" · ")}
              </p>
            </div>

            {/* Flavour Profile */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Flavour Profile</p>
              <p className="text-sm text-foreground">
                {wine.flavourProfile.join(" · ")}
              </p>
            </div>

            {/* Body / Strength */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Body / Strength</p>
              {renderStars(wine.bodyStrength)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WineCard;
