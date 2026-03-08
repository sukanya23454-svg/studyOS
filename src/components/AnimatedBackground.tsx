import { memo, useMemo } from 'react';

export type AnimationType =
  | 'rain' | 'snow' | 'dust' | 'leaves' | 'fireflies'
  | 'stars' | 'flicker' | 'clouds' | 'waves' | 'bubbles'
  | 'aurora' | 'neon-pulse' | 'campfire-sparks';

interface Props {
  type: AnimationType;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function generateItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 2 + Math.random() * 6,
    size: 1 + Math.random() * 3,
    opacity: 0.15 + Math.random() * 0.5,
  }));
}

/* ══════════ RAIN ══════════ */
const Rain = memo(() => {
  const drops = useMemo(() => generateItems(100), []);
  const splashes = useMemo(() => generateItems(20), []);
  const mist = useMemo(() => generateItems(6), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((d) => (
        <div key={d.id} className="absolute bg-info/25 rounded-full" style={{
          left: `${d.left}%`, top: '-5%',
          width: `${d.size * 0.3}px`, height: `${8 + d.size * 8}px`,
          opacity: d.opacity * 0.5,
          animation: `anim-rain ${0.8 + d.duration * 0.2}s linear ${d.delay}s infinite`,
        }} />
      ))}
      {splashes.map((s) => (
        <div key={`s-${s.id}`} className="absolute rounded-full border border-info/15" style={{
          left: `${s.left}%`, bottom: `${rand(0, 8)}%`,
          width: '0px', height: '0px',
          animation: `anim-splash ${1.5 + s.duration * 0.3}s ease-out ${s.delay}s infinite`,
        }} />
      ))}
      {mist.map((m) => (
        <div key={`m-${m.id}`} className="absolute bg-info/5 rounded-full" style={{
          left: `${-20 + m.left}%`, bottom: `${m.id * 5}%`,
          width: `${200 + m.size * 80}px`, height: `${60 + m.size * 20}px`,
          filter: 'blur(30px)',
          animation: `anim-mist ${20 + m.duration * 5}s ease-in-out ${m.delay * 2}s infinite alternate`,
        }} />
      ))}
    </div>
  );
});

/* ══════════ SNOW ══════════ */
const Snow = memo(() => {
  const flakes = useMemo(() => generateItems(60), []);
  const groundGlow = useMemo(() => generateItems(8), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((f) => (
        <div key={f.id} className="absolute rounded-full bg-foreground/30" style={{
          left: `${f.left}%`, top: '-3%',
          width: `${f.size * 1.5}px`, height: `${f.size * 1.5}px`,
          opacity: f.opacity * 0.8,
          animation: `anim-snow ${5 + f.duration}s linear ${f.delay}s infinite`,
        }} />
      ))}
      {groundGlow.map((g) => (
        <div key={`g-${g.id}`} className="absolute rounded-full bg-foreground/5" style={{
          left: `${g.left}%`, bottom: '0%',
          width: `${80 + g.size * 40}px`, height: `${20 + g.size * 8}px`,
          filter: 'blur(20px)',
          animation: `anim-twinkle ${4 + g.duration}s ease-in-out ${g.delay}s infinite`,
        }} />
      ))}
    </div>
  );
});

/* ══════════ DUST ══════════ */
const Dust = memo(() => {
  const particles = useMemo(() => generateItems(35), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2].map((i) => (
        <div key={`beam-${i}`} className="absolute bg-accent/5" style={{
          left: `${20 + i * 25}%`, top: '-10%',
          width: `${60 + i * 20}px`, height: '120%',
          transform: `rotate(${15 + i * 5}deg)`, filter: 'blur(30px)',
          animation: `anim-beam ${12 + i * 4}s ease-in-out ${i * 2}s infinite alternate`,
        }} />
      ))}
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full bg-accent/30" style={{
          left: `${p.left}%`, top: `${p.top}%`,
          width: `${p.size}px`, height: `${p.size}px`,
          opacity: p.opacity * 0.5,
          animation: `anim-dust ${8 + p.duration * 2}s ease-in-out ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  );
});

/* ══════════ LEAVES ══════════ */
const Leaves = memo(() => {
  const items = useMemo(() => generateItems(18), []);
  const leafChars = ['🍂', '🍃', '🍁'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2].map((i) => (
        <div key={`wind-${i}`} className="absolute bg-success/3 rounded-full" style={{
          left: '-10%', top: `${20 + i * 25}%`,
          width: '120%', height: `${2 + i}px`, filter: 'blur(4px)',
          animation: `anim-wind ${8 + i * 3}s ease-in-out ${i * 2}s infinite`,
        }} />
      ))}
      {items.map((l) => (
        <div key={l.id} className="absolute" style={{
          left: `${l.left}%`, top: '-5%',
          fontSize: `${10 + l.size * 4}px`,
          animation: `anim-leaves ${6 + l.duration * 2}s ease-in-out ${l.delay}s infinite`,
        }}>
          {leafChars[l.id % leafChars.length]}
        </div>
      ))}
    </div>
  );
});

/* ══════════ FIREFLIES ══════════ */
const Fireflies = memo(() => {
  const items = useMemo(() => generateItems(25), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2, 3].map((i) => (
        <div key={`glow-${i}`} className="absolute rounded-full" style={{
          left: `${10 + i * 22}%`, top: `${30 + (i % 2) * 30}%`,
          width: '120px', height: '120px',
          background: 'hsl(var(--accent) / 0.04)', filter: 'blur(40px)',
          animation: `anim-twinkle ${6 + i * 2}s ease-in-out ${i}s infinite`,
        }} />
      ))}
      {items.map((f) => (
        <div key={f.id} className="absolute rounded-full" style={{
          left: `${f.left}%`, top: `${20 + f.top * 0.6}%`,
          width: `${f.size * 1.2}px`, height: `${f.size * 1.2}px`,
          background: 'hsl(var(--accent))',
          boxShadow: '0 0 8px 3px hsl(var(--accent) / 0.5)',
          opacity: 0,
          animation: `anim-firefly ${3 + f.duration}s ease-in-out ${f.delay}s infinite`,
        }} />
      ))}
    </div>
  );
});

/* ══════════ STARS ══════════ */
const Stars = memo(() => {
  const items = useMemo(() => generateItems(80), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1].map((i) => (
        <div key={`neb-${i}`} className="absolute rounded-full" style={{
          left: `${20 + i * 40}%`, top: `${10 + i * 30}%`,
          width: '300px', height: '200px',
          background: `radial-gradient(ellipse, hsl(var(--primary) / 0.04), transparent)`,
          filter: 'blur(40px)',
          animation: `anim-twinkle ${10 + i * 5}s ease-in-out ${i * 3}s infinite`,
        }} />
      ))}
      {items.map((s) => (
        <div key={s.id} className="absolute rounded-full bg-foreground/70" style={{
          left: `${s.left}%`, top: `${s.top * 0.8}%`,
          width: `${s.size * 0.6}px`, height: `${s.size * 0.6}px`,
          animation: `anim-twinkle ${2 + s.duration}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
      {[0, 1, 2].map((i) => (
        <div key={`shoot-${i}`} className="absolute bg-foreground/60 rounded-full" style={{
          left: `${10 + i * 30}%`, top: `${5 + i * 15}%`,
          width: '2px', height: '2px',
          boxShadow: '0 0 4px 1px hsl(var(--foreground) / 0.4)',
          animation: `anim-shooting-star ${3 + i * 2}s linear ${5 + i * 8}s infinite`,
        }} />
      ))}
    </div>
  );
});

/* ══════════ FLICKER ══════════ */
const Flicker = memo(() => {
  const items = useMemo(() => generateItems(16), []);
  const cityLights = useMemo(() => generateItems(30), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((f) => (
        <div key={f.id} className="absolute rounded-full" style={{
          left: `${10 + f.left * 0.8}%`, top: `${30 + f.top * 0.5}%`,
          width: `${f.size * 3}px`, height: `${f.size * 3}px`,
          background: 'hsl(var(--accent) / 0.3)',
          boxShadow: '0 0 16px 6px hsl(var(--accent) / 0.15)',
          animation: `anim-flicker ${1 + f.duration * 0.5}s ease-in-out ${f.delay}s infinite`,
        }} />
      ))}
      {cityLights.map((c) => (
        <div key={`cl-${c.id}`} className="absolute rounded-sm" style={{
          left: `${c.left}%`, top: `${30 + c.top * 0.6}%`,
          width: `${1 + c.size * 0.5}px`, height: `${1 + c.size * 0.5}px`,
          background: 'hsl(var(--accent) / 0.5)',
          animation: `anim-flicker ${0.5 + c.duration * 0.3}s ease-in-out ${c.delay}s infinite`,
        }} />
      ))}
    </div>
  );
});

/* ══════════ CLOUDS ══════════ */
const Clouds = memo(() => {
  const items = useMemo(() => generateItems(8), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-foreground/3" style={{ filter: 'blur(60px)', animation: 'anim-twinkle 15s ease-in-out infinite' }} />
      {items.map((c) => (
        <div key={c.id} className="absolute rounded-full bg-foreground/6" style={{
          left: '-25%', top: `${5 + c.id * 10}%`,
          width: `${180 + c.size * 80}px`, height: `${50 + c.size * 20}px`,
          filter: 'blur(25px)',
          animation: `anim-cloud ${25 + c.duration * 8}s linear ${c.delay * 3}s infinite`,
        }} />
      ))}
    </div>
  );
});

/* ══════════ WAVES ══════════ */
const Waves = memo(() => {
  const sparkles = useMemo(() => generateItems(15), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="absolute left-0 right-0" style={{
          bottom: `${i * 3}%`, height: '80px',
          background: `linear-gradient(transparent, hsl(var(--info) / ${0.03 + i * 0.015}))`,
          borderRadius: '50% 50% 0 0',
          animation: `anim-wave ${5 + i * 1.5}s ease-in-out ${i * 0.6}s infinite`,
        }} />
      ))}
      {sparkles.map((s) => (
        <div key={`sp-${s.id}`} className="absolute rounded-full bg-info/20" style={{
          left: `${s.left}%`, bottom: `${s.top * 0.15}%`,
          width: `${s.size * 0.5}px`, height: `${s.size * 0.5}px`,
          animation: `anim-twinkle ${1.5 + s.duration}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
});

/* ══════════ BUBBLES ══════════ */
const Bubbles = memo(() => {
  const items = useMemo(() => generateItems(20), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1].map((i) => (
        <div key={`dg-${i}`} className="absolute rounded-full" style={{
          left: `${20 + i * 40}%`, bottom: `${10 + i * 20}%`,
          width: '200px', height: '200px',
          background: `radial-gradient(ellipse, hsl(var(--info) / 0.06), transparent)`,
          filter: 'blur(40px)',
          animation: `anim-twinkle ${8 + i * 4}s ease-in-out ${i * 2}s infinite`,
        }} />
      ))}
      {items.map((b) => (
        <div key={b.id} className="absolute rounded-full border border-info/20" style={{
          left: `${b.left}%`, bottom: '-5%',
          width: `${b.size * 4}px`, height: `${b.size * 4}px`,
          opacity: b.opacity * 0.4,
          animation: `anim-bubble ${6 + b.duration * 2}s ease-in ${b.delay}s infinite`,
        }} />
      ))}
    </div>
  );
});

/* ══════════ AURORA BOREALIS ══════════ */
const Aurora = memo(() => {
  const bands = useMemo(() => [0, 1, 2, 3, 4], []);
  const particles = useMemo(() => generateItems(20), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Aurora curtain bands */}
      {bands.map((i) => (
        <div key={`ab-${i}`} className="absolute" style={{
          left: `${-10 + i * 20}%`,
          top: '5%',
          width: `${120 + i * 30}px`,
          height: '60%',
          background: `linear-gradient(180deg,
            hsl(${140 + i * 20} 70% 50% / 0.08) 0%,
            hsl(${160 + i * 25} 80% 45% / 0.12) 30%,
            hsl(${180 + i * 15} 75% 55% / 0.06) 60%,
            transparent 100%)`,
          filter: 'blur(20px)',
          borderRadius: '50%',
          transformOrigin: 'top center',
          animation: `anim-aurora ${8 + i * 3}s ease-in-out ${i * 1.5}s infinite alternate`,
        }} />
      ))}
      {/* Shimmer particles within aurora */}
      {particles.map((p) => (
        <div key={`ap-${p.id}`} className="absolute rounded-full" style={{
          left: `${p.left}%`,
          top: `${5 + p.top * 0.4}%`,
          width: `${p.size * 0.8}px`,
          height: `${p.size * 0.8}px`,
          background: `hsl(${150 + p.id * 10} 70% 60% / 0.4)`,
          animation: `anim-twinkle ${3 + p.duration}s ease-in-out ${p.delay}s infinite`,
        }} />
      ))}
      {/* Large glow at top */}
      <div className="absolute top-0 left-1/4 right-1/4 h-1/3 rounded-full" style={{
        background: 'radial-gradient(ellipse at center, hsl(160 80% 50% / 0.06), hsl(200 70% 50% / 0.03), transparent)',
        filter: 'blur(50px)',
        animation: 'anim-aurora 12s ease-in-out infinite alternate',
      }} />
    </div>
  );
});

/* ══════════ NEON PULSE ══════════ */
const NeonPulse = memo(() => {
  const lines = useMemo(() => generateItems(12), []);
  const glows = useMemo(() => generateItems(20), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Neon glow strips */}
      {lines.map((l) => {
        const hue = [280, 320, 200, 180][l.id % 4];
        const isHorizontal = l.id % 2 === 0;
        return (
          <div key={`nl-${l.id}`} className="absolute" style={{
            left: isHorizontal ? '0' : `${l.left}%`,
            top: isHorizontal ? `${l.top}%` : '0',
            width: isHorizontal ? '100%' : `${1 + l.size * 0.3}px`,
            height: isHorizontal ? `${1 + l.size * 0.3}px` : '100%',
            background: `hsl(${hue} 80% 55% / 0.15)`,
            boxShadow: `0 0 ${8 + l.size * 4}px ${2 + l.size}px hsl(${hue} 80% 55% / 0.1)`,
            animation: `anim-neon-pulse ${2 + l.duration * 0.5}s ease-in-out ${l.delay}s infinite`,
          }} />
        );
      })}
      {/* Floating neon dots */}
      {glows.map((g) => {
        const hue = [280, 320, 200, 350][g.id % 4];
        return (
          <div key={`ng-${g.id}`} className="absolute rounded-full" style={{
            left: `${g.left}%`,
            top: `${g.top}%`,
            width: `${g.size * 2}px`,
            height: `${g.size * 2}px`,
            background: `hsl(${hue} 80% 55% / 0.4)`,
            boxShadow: `0 0 ${6 + g.size * 3}px hsl(${hue} 80% 55% / 0.3)`,
            animation: `anim-neon-pulse ${1.5 + g.duration * 0.4}s ease-in-out ${g.delay}s infinite`,
          }} />
        );
      })}
      {/* Ambient neon glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
        background: 'linear-gradient(transparent, hsl(280 80% 50% / 0.04), hsl(320 80% 50% / 0.03))',
        filter: 'blur(30px)',
        animation: 'anim-neon-pulse 4s ease-in-out infinite',
      }} />
    </div>
  );
});

/* ══════════ CAMPFIRE SPARKS ══════════ */
const CampfireSparks = memo(() => {
  const sparks = useMemo(() => generateItems(30), []);
  const embers = useMemo(() => generateItems(15), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Central fire glow */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2" style={{
        width: '300px', height: '200px',
        background: 'radial-gradient(ellipse at bottom, hsl(25 90% 50% / 0.12), hsl(15 85% 45% / 0.06), transparent)',
        filter: 'blur(30px)',
        animation: 'anim-flicker 2s ease-in-out infinite',
      }} />
      {/* Rising sparks */}
      {sparks.map((s) => (
        <div key={`sp-${s.id}`} className="absolute rounded-full" style={{
          left: `${40 + s.left * 0.2}%`,
          bottom: '10%',
          width: `${s.size * 0.8}px`,
          height: `${s.size * 0.8}px`,
          background: `hsl(${20 + s.id * 3} 90% ${55 + s.id}% / 0.8)`,
          boxShadow: `0 0 3px 1px hsl(25 90% 50% / 0.4)`,
          animation: `anim-spark ${2 + s.duration}s ease-out ${s.delay}s infinite`,
        }} />
      ))}
      {/* Floating embers */}
      {embers.map((e) => (
        <div key={`em-${e.id}`} className="absolute rounded-full" style={{
          left: `${30 + e.left * 0.4}%`,
          bottom: '15%',
          width: `${e.size * 0.5}px`,
          height: `${e.size * 0.5}px`,
          background: 'hsl(15 85% 55% / 0.6)',
          animation: `anim-ember ${4 + e.duration * 2}s ease-in-out ${e.delay}s infinite`,
        }} />
      ))}
      {/* Warm ambient glow */}
      <div className="absolute bottom-0 left-0 right-0 h-2/5" style={{
        background: 'linear-gradient(transparent, hsl(25 80% 50% / 0.04))',
        animation: 'anim-flicker 3s ease-in-out infinite',
      }} />
    </div>
  );
});

const EFFECTS: Record<AnimationType, React.ComponentType> = {
  rain: Rain,
  snow: Snow,
  dust: Dust,
  leaves: Leaves,
  fireflies: Fireflies,
  stars: Stars,
  flicker: Flicker,
  clouds: Clouds,
  waves: Waves,
  bubbles: Bubbles,
  aurora: Aurora,
  'neon-pulse': NeonPulse,
  'campfire-sparks': CampfireSparks,
};

function AnimatedBackground({ type }: Props) {
  const Effect = EFFECTS[type];
  return Effect ? <Effect /> : null;
}

export default memo(AnimatedBackground);
