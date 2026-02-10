import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Droplets, Target, Users, Leaf, ArrowLeft, ExternalLink } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary/50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full water-gradient hover-lift">
              <Droplets className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">AquaTrack</span>
          </Link>
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

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate(-1)}
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm hover-lift transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="space-y-10 flex-1">
            {/* What is AquaTrack */}
            <section className="animate-fade-in">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-secondary p-2">
                  <Droplets className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">What is AquaTrack</h1>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                AquaTrack is a smart water monitoring platform designed to help users understand and manage their water consumption through clear insights and mindful usage practices.
              </p>
            </section>

            {/* Our Mission */}
            <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-secondary p-2">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To promote sustainable water consumption by making water usage data simple, visible, and actionable in everyday life.
              </p>
            </section>

            {/* Who It's For */}
            <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-secondary p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Who It's For</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Homeowners, landlords, and environmentally conscious businesses aiming to reduce water waste and improve sustainability.
              </p>
            </section>

            {/* Sustainability Commitment */}
            <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-secondary p-2">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Sustainability Commitment</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                AquaTrack supports responsible consumption and water conservation, aligned with UN Sustainable Development Goals.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.canada.ca/en/employment-social-development/programs/agenda-2030/clean-water.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground hover-lift border border-transparent hover:border-primary/30 transition-all duration-300 group"
                >
                  <Droplets className="h-4 w-4 group-hover:text-primary transition-colors" />
                  SDG 6 — Clean Water & Sanitation
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href="https://www.canada.ca/en/employment-social-development/programs/agenda-2030/consumption-production.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground hover-lift border border-transparent hover:border-accent/30 transition-all duration-300 group"
                >
                  <Leaf className="h-4 w-4 group-hover:text-accent transition-colors" />
                  SDG 12 — Responsible Consumption
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </section>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button asChild size="lg" className="water-gradient border-0 hover-lift">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover-lift">
                <Link to="/explore">Explore Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
