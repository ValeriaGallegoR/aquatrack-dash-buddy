export default function WaterBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary/50" />
      
      {/* Animated blobs */}
      <div className="absolute -top-1/4 -left-1/4 w-[80vw] h-[80vw] rounded-full bg-primary/[0.04] blur-3xl animate-water-blob-1" />
      <div className="absolute -bottom-1/4 -right-1/4 w-[70vw] h-[70vw] rounded-full bg-accent/[0.05] blur-3xl animate-water-blob-2" />
      <div className="absolute top-1/3 left-1/2 w-[60vw] h-[60vw] rounded-full bg-primary/[0.03] blur-3xl animate-water-blob-3" />
      
      {/* Wave SVG overlay */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-[0.04]"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          className="animate-wave-1"
          fill="hsl(var(--primary))"
          d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,234.7C672,245,768,235,864,208C960,181,1056,139,1152,138.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L0,320Z"
        />
        <path
          className="animate-wave-2"
          fill="hsl(var(--accent))"
          d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,245.3C672,256,768,256,864,234.7C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L0,320Z"
        />
      </svg>
    </div>
  );
}
