import { Button } from "@/components/ui/button";
import { Wine } from "lucide-react";
import wineHero from "@/assets/wine-hero.jpg";

interface HeroProps {
  onStartChat: () => void;
}

const Hero = ({ onStartChat }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={wineHero}
          alt="Elegant wine tasting with multiple glasses of red wine"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-4">
          <Wine className="w-10 h-10 text-primary" />
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            enoAI
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your personal wine sommelier powered by AI. Discover the perfect wine for any occasion, meal, or moment.
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-4 justify-center text-sm md:text-base text-muted-foreground">
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Personalized Recommendations</span>
          </div>
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Food Pairing Expert</span>
          </div>
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Budget-Friendly Options</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Button
            size="lg"
            variant="hero"
            onClick={onStartChat}
            className="text-lg px-8 py-6 h-auto"
          >
            Start Your Wine Journey
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
