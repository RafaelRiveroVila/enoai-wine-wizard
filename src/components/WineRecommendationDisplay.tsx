import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import WineCard, { WineRecommendation } from "./WineCard";

export interface WineRecommendationResponse {
  explanation: string;
  wines: WineRecommendation[];
}

interface WineRecommendationDisplayProps {
  data: WineRecommendationResponse;
}

const WineRecommendationDisplay = ({ data }: WineRecommendationDisplayProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 w-full max-w-full">
      {/* Explanation Card */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-border">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">{t.whyTheseWines}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.explanation}
            </p>
          </div>
        </div>
      </Card>

      {/* Wine Cards */}
      <div className="space-y-3">
        {data.wines.map((wine, index) => (
          <WineCard key={index} wine={wine} />
        ))}
      </div>
    </div>
  );
};

export default WineRecommendationDisplay;

// Helper function to parse AI response for wine recommendations
export function parseWineRecommendation(content: string): WineRecommendationResponse | null {
  try {
    // Look for JSON block in the response
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed.explanation && Array.isArray(parsed.wines)) {
        return parsed as WineRecommendationResponse;
      }
    }

    // Try parsing the entire content as JSON
    const parsed = JSON.parse(content);
    if (parsed.explanation && Array.isArray(parsed.wines)) {
      return parsed as WineRecommendationResponse;
    }

    return null;
  } catch {
    return null;
  }
}
