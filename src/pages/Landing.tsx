import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Droplets, TrendingDown, BarChart3, Leaf } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary/50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full water-gradient">
            <Droplets className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">AquaTrack</span>
        </div>
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-secondary-foreground mb-6">
            <Leaf className="h-4 w-4" />
            <span>Supporting SDG 6 & SDG 12</span>
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
            <Button asChild size="lg" className="water-gradient border-0">
              <Link to="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Track Usage</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your daily, weekly, and monthly water consumption at a glance.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary mb-4">
              <TrendingDown className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Reduce Waste</h3>
            <p className="text-sm text-muted-foreground">
              Identify patterns and opportunities to use water more efficiently.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 text-center shadow-sm border">
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
        <p>© 2026 AquaTrack · Promoting water awareness for a sustainable future</p>
      </footer>
    </div>
  );
}
