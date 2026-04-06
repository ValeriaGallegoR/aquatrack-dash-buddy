import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Droplets, Wrench, ShowerHead, MonitorSmartphone, WashingMachine, Recycle, Wifi, Flower2, Users, TreePine } from 'lucide-react';

const tips = [
  { icon: Wrench, title: '1. Fix Leaks Quickly', text: 'Even minor leaks in taps, pipes, or toilets can lead to significant water loss over time. A dripping tap may seem harmless, but it can waste hundreds of liters of water every month. Regular inspection of plumbing systems and immediate repair of leaks can prevent unnecessary wastage and reduce utility costs.' },
  { icon: ShowerHead, title: '2. Use Water-Efficient Fixtures', text: 'Modern water-efficient fixtures such as low-flow showerheads, aerated faucets, and dual-flush toilets are designed to minimize water usage without compromising performance. Installing these fixtures helps households conserve water effortlessly while maintaining comfort and efficiency.' },
  { icon: Droplets, title: '3. Turn Off Tap When Not in Use', text: 'Leaving taps running while brushing teeth, washing dishes, or cleaning leads to excessive water waste. Turning off the tap when not actively using water is a simple yet highly effective habit that can save a substantial amount of water daily.' },
  { icon: MonitorSmartphone, title: '4. Monitor Daily Usage', text: 'Understanding how much water is used daily allows individuals to identify patterns and areas of waste. Smart monitoring systems provide insights into consumption trends, enabling users to make informed decisions and adopt better water management practices.' },
  { icon: WashingMachine, title: '5. Use Full Loads in Appliances', text: 'Running washing machines or dishwashers with partial loads leads to inefficient use of water and energy. Waiting until appliances are fully loaded ensures optimal usage and reduces the number of cycles, saving both water and electricity.' },
  { icon: Recycle, title: '6. Reuse Water When Possible', text: 'Water used in household activities such as washing fruits and vegetables can often be reused for other purposes like watering plants or cleaning surfaces. Reusing water helps reduce overall consumption and encourages sustainable living practices.' },
  { icon: Wifi, title: '7. Install Smart Sensors', text: 'Smart water sensors play a crucial role in detecting leaks, monitoring usage, and providing real-time alerts. These systems help users identify unusual consumption patterns and take immediate corrective actions, preventing water loss.' },
  { icon: Flower2, title: '8. Water Plants Efficiently', text: 'Watering plants during early morning or late evening minimizes evaporation and ensures better absorption by the soil. Efficient watering practices help maintain plant health while conserving water resources.' },
  { icon: Users, title: '9. Educate Household Members', text: 'Water conservation is a collective effort. Educating family members about responsible water usage encourages everyone to contribute towards saving water. Small actions by individuals can collectively create a significant impact.' },
  { icon: TreePine, title: '10. Reduce Outdoor Water Waste', text: 'Outdoor activities such as lawn watering and car washing often consume large amounts of water. Using efficient irrigation systems like drip irrigation and avoiding overwatering can significantly reduce wastage.' },
];

function FadeInCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function FloatingDrops() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/5"
          style={{
            width: `${20 + i * 12}px`,
            height: `${20 + i * 12}px`,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float-drop ${6 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes float-drop {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-30px) scale(1.15); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default function ReduceWaste() {
  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(160deg, hsl(var(--background)), hsl(180 60% 92%), hsl(174 50% 90%))' }}>
      <FloatingDrops />

      <header className="container mx-auto px-4 py-6 flex items-center justify-between relative z-10">
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

      <main className="container mx-auto px-4 py-10 max-w-5xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-[fadeInDown_0.8s_ease-out]">
            💧 Smart Ways to Reduce Water Waste at Home
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Water is one of the most valuable natural resources, yet it is often wasted in everyday activities without realization. By making small changes in habits and using smart technologies, individuals can significantly reduce water consumption. The following strategies provide practical and effective ways to conserve water and promote sustainable living.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {tips.map((tip, i) => (
            <FadeInCard key={tip.title} delay={i * 80}>
              <Card
                className="group border border-border/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.05] backdrop-blur-md bg-card/60"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <tip.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInCard>
          ))}
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground relative z-10">
        <p>© 2026 AquaTrack · Promoting water awareness for a sustainable future</p>
      </footer>
      <style>{`
        @keyframes fadeInDown { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
