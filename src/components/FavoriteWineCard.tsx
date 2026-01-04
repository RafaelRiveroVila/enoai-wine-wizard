import { X, Wine } from "lucide-react";
import { WineRecommendation } from "@/components/WineCard";
import { Badge } from "@/components/ui/badge";

interface FavoriteWineCardProps {
  wine: WineRecommendation;
  onRemove: () => void;
}

interface WineGlassProps {
  fill: 'full' | 'half' | 'empty';
}

const WineGlass = ({ fill }: WineGlassProps) => {
  return (
    <svg
      viewBox="0 0 24 32"
      className="w-4 h-5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 2C6 2 4 8 4 12C4 16 7 19 11 19.8V28H7V30H17V28H13V19.8C17 19 20 16 20 12C20 8 18 2 18 2H6Z"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {fill === 'full' && (
        <path
          d="M6.5 8C6.5 8 5 11 5 12.5C5 15.5 7.5 18 11 18.5C11.5 18.55 12 18.55 12.5 18.5C16 18 18.5 15.5 18.5 12.5C18.5 11 17 8 17 8H6.5Z"
          fill="hsl(var(--primary))"
        />
      )}
      {fill === 'half' && (
        <path
          d="M7 11C7 11 6 12.5 6 13.5C6 15.5 8 17.5 11 18C11.5 18.05 12 18.05 12.5 18C15.5 17.5 17.5 15.5 17.5 13.5C17.5 12.5 16.5 11 16.5 11H7Z"
          fill="hsl(var(--primary))"
        />
      )}
    </svg>
  );
};

const FavoriteWineCard = ({ wine, onRemove }: FavoriteWineCardProps) => {
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
    <div className="p-4 bg-muted/30 rounded-lg relative">
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 p-1 hover:bg-muted rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>

      <div className="flex gap-3">
        {/* Wine thumbnail */}
        <div className="flex-shrink-0 w-16 h-20 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center">
          {wine.imageUrl ? (
            <img
              src={wine.imageUrl}
              alt={wine.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Wine className="w-8 h-8 text-primary" />
          )}
        </div>

        {/* Wine info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground text-sm leading-tight">
            {wine.name}{wine.year && wine.year !== "N/A" ? ` ${wine.year}` : ""}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">{wine.region}</p>
          {wine.grape && wine.grape !== "N/A" && (
            <p className="text-xs text-primary font-medium">{wine.grape}</p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
              {wine.category}
            </Badge>
            {renderBodyStrength(wine.bodyStrength)}
          </div>

          <div className="mt-2">
            <p className="text-xs text-muted-foreground">Style</p>
            <p className="text-xs text-foreground">{wine.style.join(" · ")}</p>
          </div>

          <div className="mt-1">
            <p className="text-xs text-muted-foreground">Aromas</p>
            <p className="text-xs text-foreground">{wine.aromas.join(" · ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteWineCard;
