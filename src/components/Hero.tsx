import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import wineHero from "@/assets/wine-hero.jpg";
import enoaiLogo from "@/assets/enoai-logo.png";

interface HeroProps {
  onStartChat: () => void;
}

const Hero = ({ onStartChat }: HeroProps) => {
  const { t } = useLanguage();

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
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Logo */}
        <div className="inline-flex items-center justify-center mb-2">
          <img 
            src={enoaiLogo} 
            alt="enoAI - Wine Sommelier Logo" 
            className="w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl"
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
          {t.heroSubheading}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-4 justify-center text-sm md:text-base text-muted-foreground">
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>{t.heroFeature1}</span>
          </div>
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>{t.heroFeature2}</span>
          </div>
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>{t.heroFeature3}</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4 pb-8">
          <Button
            size="lg"
            variant="hero"
            onClick={onStartChat}
            className="text-lg px-8 py-6 h-auto"
          >
            {t.heroCta}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
