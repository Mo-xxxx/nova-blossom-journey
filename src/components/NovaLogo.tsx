export function NovaLogo({ size = 48 }: { size?: number }) {
  return (
    <div
      className="relative grid place-items-center rounded-full bg-gradient-rose shadow-glow animate-float"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-1 rounded-full bg-gradient-aurora opacity-80" />
      <svg viewBox="0 0 24 24" className="relative" width={size * 0.5} height={size * 0.5}>
        <path
          d="M12 2 L13.6 9.4 L21 11 L13.6 12.6 L12 20 L10.4 12.6 L3 11 L10.4 9.4 Z"
          fill="oklch(0.99 0.01 60)"
        />
      </svg>
    </div>
  );
}
