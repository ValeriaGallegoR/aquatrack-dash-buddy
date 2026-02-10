import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Droplets, Target, Users, Leaf, ArrowLeft, ExternalLink } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Droplets,
      title: 'What is AquaTrack',
      body: 'AquaTrack is a smart water monitoring platform designed to help users understand and manage their water consumption through clear insights and mindful usage practices.',
    },
    {
      icon: Target,
      title: 'Our Mission',
      body: 'To promote sustainable water consumption by making water usage data simple, visible, and actionable in everyday life.',
    },
    {
      icon: Users,
      title: 'Who It\'s For',
      body: 'Homeowners, landlords, and environmentally conscious businesses aiming to reduce water waste and improve sustainability.',
    },
  ];

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

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm hover-lift"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-3xl font-bold text-foreground">About AquaTrack</h1>
        </div>

        {/* Section Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {sections.map((s, i) => (
            <Card
              key={s.title}
              className="hover-lift border hover:border-primary/20 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{s.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sustainability Card */}
        <Card className="hover-lift border hover:border-accent/20 animate-fade-in mb-10" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
                <Leaf className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Sustainability Commitment</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AquaTrack supports responsible consumption and water conservation, aligned with UN Sustainable Development Goals.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
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
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button asChild size="lg" className="water-gradient border-0 hover-lift">
            <Link to="/register">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="hover-lift">
            <Link to="/explore">Explore Features</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
