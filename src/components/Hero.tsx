import { Button } from "@/components/ui/button";
import wineHero from "@/assets/wine-hero.jpg";
import enoaiLogo from "@/assets/enoai-logo.png";

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
        {/* Logo */}
        <div className="inline-flex items-center justify-center mb-4">
          <img 
            src={enoaiLogo} 
            alt="enoAI - Wine Sommelier Logo" 
            className="w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl"
          />
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
