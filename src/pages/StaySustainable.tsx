import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Droplets, Waves, Recycle } from 'lucide-react';
import WaterBackground from '@/components/WaterBackground';

const sdg6Sections = [
  {
    heading: 'What it is',
    text: 'SDG 6 focuses on ensuring the availability and sustainable management of clean water and sanitation for all. It aims to provide universal access to safe and affordable drinking water, improve water quality, and promote efficient water use across all sectors.',
  },
  {
    heading: 'Importance',
    text: 'Access to clean water is essential for human health, economic development, and environmental sustainability. Without reliable water sources, communities face health risks, reduced productivity, and poor living conditions. Achieving SDG 6 supports overall well-being and sustainable development.',
  },
  {
    heading: 'Challenges',
    text: 'Major challenges include water scarcity, pollution, climate change, and uneven distribution of water resources. Rapid urbanization and industrial growth have increased pressure on existing water systems, making it difficult to ensure clean and safe water for everyone.',
  },
  {
    heading: 'Role of IoT Sensors',
    text: 'IoT-based water sensors help monitor water usage in real time, detect leaks, and identify inefficiencies. These technologies provide valuable data that allows users and organizations to make informed decisions, reduce waste, and improve water management systems.',
  },
  {
    heading: 'User Contribution',
    text: 'Individuals can contribute by reducing water waste, fixing leaks, using efficient fixtures, and adopting smart monitoring tools. Small daily actions collectively make a significant impact in conserving water resources.',
  },
];

const sdg12Sections = [
  {
    heading: 'What it is',
    text: 'SDG 12 focuses on promoting sustainable consumption and production patterns. It encourages efficient use of natural resources and aims to reduce waste generation through better practices and awareness.',
  },
  {
    heading: 'Importance',
    text: 'Responsible consumption ensures that resources like water are used efficiently and preserved for future generations. It helps reduce environmental impact, supports sustainability, and promotes a balanced ecosystem.',
  },
  {
    heading: 'Reducing Waste',
    text: 'Reducing water waste is a key aspect of SDG 12. Avoiding unnecessary usage, reusing water, and adopting efficient systems help minimize resource wastage and improve sustainability outcomes.',
  },
  {
    heading: 'Smart Monitoring Benefits',
    text: 'Smart monitoring systems provide insights into usage patterns and help identify areas of waste. By using data-driven tools, users can optimize consumption, reduce inefficiencies, and make better decisions.',
  },
  {
    heading: 'User Responsibility',
    text: 'Users play a crucial role by adopting sustainable habits such as conserving water, using efficient appliances, and being mindful of daily consumption. Responsible behavior contributes directly to achieving global sustainability goals.',
  },
];

export default function StaySustainable() {
  return (
    <div className="min-h-screen relative">
      <WaterBackground />
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full water-gradient hover-lift">
            <Droplets className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">AquaTrack</span>
        </div>
        <Button variant="ghost" size="sm" asChild className="hover-lift gap-2">
          <Link to="/"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl space-y-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            🌍 Building a Sustainable Future Through Smart Water Management
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sustainability is essential for ensuring that natural resources are preserved for future generations. Water, being one of the most critical resources, plays a key role in global sustainability efforts. The United Nations Sustainable Development Goals (SDGs) provide a framework to address global challenges, including water conservation and responsible consumption.
          </p>
        </div>

        {/* SDG 6 */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Waves className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">🌊 SDG 6: Clean Water and Sanitation</h2>
            </div>
          </div>
          <div className="space-y-4">
            {sdg6Sections.map((s) => (
              <Card key={s.heading} className="border border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-foreground">{s.heading}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SDG 12 */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Recycle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">♻️ SDG 12: Responsible Consumption and Production</h2>
            </div>
          </div>
          <div className="space-y-4">
            {sdg12Sections.map((s) => (
              <Card key={s.heading} className="border border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-foreground">{s.heading}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 AquaTrack · Promoting water awareness for a sustainable future</p>
      </footer>
    </div>
  );
}
