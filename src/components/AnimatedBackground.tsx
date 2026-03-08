import { memo, useMemo } from 'react';

export type AnimationType =
  | 'rain' | 'snow' | 'dust' | 'leaves' | 'fireflies'
  | 'stars' | 'flicker' | 'clouds' | 'waves' | 'bubbles';

interface Props {
  type: AnimationType;
}

function generateItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 2 + Math.random() * 6,
    size: 1 + Math.random() * 3,
    opacity: 0.15 + Math.random() * 0.5,
  }));
}

const Rain = memo(() => {
  const drops = useMemo(() => generateItems(80), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute bg-info/30 rounded-full"
          style={{
            left: `${d.left}%`,
            top: '-5%',
            width: `${d.size * 0.4}px`,
            height: `${d.size * 6}px`,
            opacity: d.opacity * 0.6,
            animation: `anim-rain ${1 + d.duration * 0.3}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
});

const Snow = memo(() => {
  const flakes = useMemo(() => generateItems(50), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full bg-foreground/40"
          style={{
            left: `${f.left}%`,
            top: '-3%',
            width: `${f.size * 1.5}px`,
            height: `${f.size * 1.5}px`,
            opacity: f.opacity,
            animation: `anim-snow ${4 + f.duration}s linear ${f.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
});

const Dust = memo(() => {
  const particles = useMemo(() => generateItems(30), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-accent/30"
          style={{
            left: `${p.left}%`,
            top: `${Math.random() * 100}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity * 0.5,
            animation: `anim-dust ${8 + p.duration * 2}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
});

const Leaves = memo(() => {
  const items = useMemo(() => generateItems(15), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((l) => (
        <div
          key={l.id}
          className="absolute text-success/40"
          style={{
            left: `${l.left}%`,
            top: '-5%',
            fontSize: `${8 + l.size * 3}px`,
            animation: `anim-leaves ${6 + l.duration * 2}s ease-in-out ${l.delay}s infinite`,
          }}
        >
          🍂
        </div>
      ))}
    </div>
  );
});

const Fireflies = memo(() => {
  const items = useMemo(() => generateItems(20), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full"
          style={{
            left: `${f.left}%`,
            top: `${20 + Math.random() * 60}%`,
            width: `${f.size * 1.2}px`,
            height: `${f.size * 1.2}px`,
            background: 'hsl(var(--accent))',
            boxShadow: '0 0 6px 2px hsl(var(--accent) / 0.5)',
            opacity: 0,
            animation: `anim-firefly ${3 + f.duration}s ease-in-out ${f.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
});

const Stars = memo(() => {
  const items = useMemo(() => generateItems(60), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-foreground/60"
          style={{
            left: `${s.left}%`,
            top: `${Math.random() * 70}%`,
            width: `${s.size * 0.7}px`,
            height: `${s.size * 0.7}px`,
            animation: `anim-twinkle ${2 + s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
});

const Flicker = memo(() => {
  const items = useMemo(() => generateItems(12), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full"
          style={{
            left: `${10 + f.left * 0.8}%`,
            top: `${30 + Math.random() * 50}%`,
            width: `${f.size * 2}px`,
            height: `${f.size * 2}px`,
            background: 'hsl(var(--accent) / 0.4)',
            boxShadow: '0 0 12px 4px hsl(var(--accent) / 0.2)',
            animation: `anim-flicker ${1 + f.duration * 0.5}s ease-in-out ${f.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
});

const Clouds = memo(() => {
  const items = useMemo(() => generateItems(6), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((c) => (
        <div
          key={c.id}
          className="absolute rounded-full bg-foreground/5"
          style={{
            left: '-20%',
            top: `${5 + c.id * 12}%`,
            width: `${150 + c.size * 60}px`,
            height: `${40 + c.size * 15}px`,
            filter: 'blur(20px)',
            animation: `anim-cloud ${30 + c.duration * 10}s linear ${c.delay * 3}s infinite`,
          }}
        />
      ))}
    </div>
  );
});

const Waves = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute left-0 right-0"
          style={{
            bottom: `${i * 3}%`,
            height: '60px',
            background: `linear-gradient(transparent, hsl(var(--info) / ${0.04 + i * 0.02}))`,
            borderRadius: '50% 50% 0 0',
            animation: `anim-wave ${6 + i * 2}s ease-in-out ${i * 0.8}s infinite`,
          }}
        />
      ))}
    </div>
  );
});

const Bubbles = memo(() => {
  const items = useMemo(() => generateItems(15), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full border border-info/20"
          style={{
            left: `${b.left}%`,
            bottom: '-5%',
            width: `${b.size * 4}px`,
            height: `${b.size * 4}px`,
            opacity: b.opacity * 0.4,
            animation: `anim-bubble ${6 + b.duration * 2}s ease-in ${b.delay}s infinite`,
          }}
        />
      ))}
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
};

function AnimatedBackground({ type }: Props) {
  const Effect = EFFECTS[type];
  return Effect ? <Effect /> : null;
}

export default memo(AnimatedBackground);
