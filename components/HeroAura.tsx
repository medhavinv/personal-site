/**
 * Decorative aurora wash behind the top of the page. CSS-only (see globals.css),
 * palette-aware, and reduced-motion-safe. To disable, remove <HeroAura /> from
 * app/page.tsx — nothing else depends on it.
 */
export function HeroAura() {
  return (
    <div className="hero-aura" aria-hidden="true">
      <div className="hero-aura__blob hero-aura__blob--a" />
      <div className="hero-aura__blob hero-aura__blob--b" />
    </div>
  );
}
