export default function WaterAnalyticsBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Soft gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, hsl(180 60% 98%), hsl(180 50% 96%), hsl(180 30% 99%))',
        }}
      />
      {/* Wave shape 1 */}
      <div
        className="absolute -top-1/4 -left-1/4 h-[80%] w-[80%] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(181 100% 41% / 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Wave shape 2 */}
      <div
        className="absolute -bottom-1/4 -right-1/4 h-[70%] w-[70%] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(181 100% 41% / 0.08) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      {/* Wave shape 3 */}
      <div
        className="absolute top-1/3 left-1/2 h-[50%] w-[60%] -translate-x-1/2 rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(174 72% 40% / 0.05) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />
    </div>
  );
}
