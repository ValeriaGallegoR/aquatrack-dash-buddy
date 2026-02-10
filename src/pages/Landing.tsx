import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Droplets, TrendingDown, BarChart3, Leaf, ExternalLink } from 'lucide-react';
import WaterBackground from '@/components/WaterBackground';

export default function Landing() {
  return (
    <div className="min-h-screen relative">
      <WaterBackground />
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full water-gradient hover-lift">
            <Droplets className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">AquaTrack</span>
        </div>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hover-lift">
            <Link to="/about">About</Link>
          </Button>
          <Button asChild className="hover-lift">
            <Link to="/login">Login</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* SDG Badges */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <a
              href="https://www.canada.ca/en/employment-social-development/programs/agenda-2030/clean-water.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-secondary-foreground hover-lift cursor-pointer border border-transparent hover:border-primary/30 transition-all duration-300 group"
            >
              <Droplets className="h-4 w-4 group-hover:text-primary transition-colors" />
              <span>SDG 6</span>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="https://www.canada.ca/en/employment-social-development/programs/agenda-2030/consumption-production.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-secondary-foreground hover-lift cursor-pointer border border-transparent hover:border-accent/30 transition-all duration-300 group"
            >
              <Leaf className="h-4 w-4 group-hover:text-accent transition-colors" />
              <span>SDG 12</span>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Understand Your Water.{' '}
            <span className="text-primary">Save Our Future.</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            AquaTrack helps households monitor and understand their water consumption, 
            promoting awareness and sustainable usage for a better tomorrow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="water-gradient border-0 hover-lift">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover-lift">
              <Link to="/explore">Explore Features</Link>
            </Button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          <div className="bg-card rounded-lg p-6 text-center shadow-sm border hover-lift transition-all duration-300 hover:border-primary/20">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Track Usage</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your daily, weekly, and monthly water consumption at a glance.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 text-center shadow-sm border hover-lift transition-all duration-300 hover:border-primary/20">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary mb-4">
              <TrendingDown className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Reduce Waste</h3>
            <p className="text-sm text-muted-foreground">
              Identify patterns and opportunities to use water more efficiently.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 text-center shadow-sm border hover-lift transition-all duration-300 hover:border-primary/20">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary mb-4">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Stay Sustainable</h3>
            <p className="text-sm text-muted-foreground">
              Contribute to global sustainability goals with every drop saved.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-4 mb-3">
          <Link to="/about" className="hover:text-foreground transition-colors hover-lift">About</Link>
          <span>·</span>
          <Link to="/explore" className="hover:text-foreground transition-colors hover-lift">Explore</Link>
        </div>
        <p>© 2026 AquaTrack · Promoting water awareness for a sustainable future</p>
      </footer>
    </div>
  );
}
