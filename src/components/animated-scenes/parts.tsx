import { memo, ReactNode, useMemo } from 'react';

/* ═══════════════════════════════════════════
   SCENE WRAPPER
   ═══════════════════════════════════════════ */
export const Scene = memo(({ children }: { children: ReactNode }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
    {children}
  </div>
));

/* ═══════════════════════════════════════════
   LAYOUT: WINDOW DESK SCENE
   Desk at bottom, window showing view above
   ═══════════════════════════════════════════ */
export const WindowDeskScene = memo(({
  wallColor = '#1a1510',
  deskColor = '#3d2b1f',
  deskHighlight = '#5a4030',
  frameColor = '#5a4a3a',
  divider = false,
  roundWindow = false,
  windowView,
  children,
}: {
  wallColor?: string;
  deskColor?: string;
  deskHighlight?: string;
  frameColor?: string;
  divider?: boolean;
  roundWindow?: boolean;
  windowView: ReactNode;
  children?: ReactNode;
}) => (
  <Scene>
    <div className="absolute inset-0" style={{ background: wallColor }} />
    <div
      className={`absolute overflow-hidden ${roundWindow ? 'rounded-[50%] top-[8%] left-[18%] right-[18%] bottom-[34%]' : 'rounded-md top-[6%] left-[12%] right-[12%] bottom-[32%]'}`}
      style={{
        border: `5px solid ${frameColor}`,
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      {windowView}
      {divider && (
        <>
          <div className="absolute top-0 bottom-0 left-1/2 w-[3px] -translate-x-1/2" style={{ background: frameColor }} />
          <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2" style={{ background: frameColor }} />
        </>
      )}
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-[28%]" style={{
      background: `linear-gradient(0deg, ${deskColor}, ${deskHighlight})`,
    }}>
      {[20, 40, 60, 80].map(p => (
        <div key={p} className="absolute h-px w-full" style={{ top: `${p}%`, background: `${deskColor}66` }} />
      ))}
    </div>
    <div className="absolute bottom-[27.5%] left-0 right-0 h-[1.5%]" style={{
      background: `linear-gradient(0deg, ${deskHighlight}cc, ${deskHighlight}40)`,
    }} />
    {children}
  </Scene>
));

/* ═══════════════════════════════════════════
   LAYOUT: INTERIOR SCENE
   No prominent window — indoor atmosphere
   ═══════════════════════════════════════════ */
export const InteriorScene = memo(({
  wallColor = '#1a1510',
  deskColor = '#3d2b1f',
  deskHighlight = '#5a4030',
  ambientContent,
  children,
}: {
  wallColor?: string;
  deskColor?: string;
  deskHighlight?: string;
  ambientContent?: ReactNode;
  children?: ReactNode;
}) => (
  <Scene>
    <div className="absolute inset-0" style={{ background: wallColor }} />
    {ambientContent}
    <div className="absolute bottom-0 left-0 right-0 h-[28%]" style={{
      background: `linear-gradient(0deg, ${deskColor}, ${deskHighlight})`,
    }}>
      {[20, 40, 60, 80].map(p => (
        <div key={p} className="absolute h-px w-full" style={{ top: `${p}%`, background: `${deskColor}66` }} />
      ))}
    </div>
    <div className="absolute bottom-[27.5%] left-0 right-0 h-[1.5%]" style={{
      background: `linear-gradient(0deg, ${deskHighlight}cc, ${deskHighlight}40)`,
    }} />
    {children}
  </Scene>
));

/* ═══════════════════════════════════════════
   LAYOUT: OPEN VIEW SCENE
   Open-air desk / balcony / cliff
   ═══════════════════════════════════════════ */
export const OpenViewScene = memo(({
  surfaceColor = '#3d2b1f',
  surfaceHighlight = '#5a4030',
  railingColor,
  viewContent,
  children,
}: {
  surfaceColor?: string;
  surfaceHighlight?: string;
  railingColor?: string;
  viewContent?: ReactNode;
  children?: ReactNode;
}) => (
  <Scene>
    {viewContent}
    {railingColor && (
      <div className="absolute bottom-[24%] left-[5%] right-[5%] h-[2px]" style={{ background: railingColor }} />
    )}
    <div className="absolute bottom-0 left-0 right-0 h-[22%]" style={{
      background: `linear-gradient(0deg, ${surfaceColor}, ${surfaceHighlight})`,
    }} />
    {children}
  </Scene>
));

/* ═══════════════════════════════════════════
   DESK ITEMS
   ═══════════════════════════════════════════ */

export const DeskLamp = memo(({ x = 78, glowColor = '#ffd98e' }: { x?: number; glowColor?: string }) => (
  <div className="absolute bottom-[28%]" style={{ left: `${x}%` }}>
    <div className="absolute -top-16 -left-12 w-24 h-20 rounded-full" style={{
      background: `radial-gradient(ellipse, ${glowColor}20, transparent)`,
      animation: 'scene-glow 3s ease-in-out infinite',
    }} />
    <div className="w-10 h-5 rounded-t-full" style={{ background: 'linear-gradient(180deg, #4a4a3a, #3a3a2a)' }} />
    <div className="w-1 h-8 mx-auto" style={{ background: '#555' }} />
    <div className="w-6 h-1 mx-auto rounded-full" style={{ background: '#555' }} />
  </div>
));

export const CoffeeCup = memo(({ x = 60 }: { x?: number }) => (
  <div className="absolute bottom-[28%]" style={{ left: `${x}%` }}>
    <div className="absolute -top-6 left-1 w-4 h-6">
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute w-[2px] rounded-full" style={{
          left: `${i * 6}px`, height: `${8 + i * 2}px`, bottom: 0,
          background: 'rgba(255,255,255,0.12)',
          animation: `scene-steam ${2 + i * 0.5}s ease-in-out ${i * 0.4}s infinite`,
        }} />
      ))}
    </div>
    <div className="w-5 h-4 rounded-b-md" style={{ background: '#e8e0d0' }} />
    <div className="absolute right-[-3px] top-[2px] w-2 h-2 rounded-full border border-[#e8e0d0]" />
  </div>
));

export const BookStack = memo(({ x = 20, colors = ['#8b4513', '#2e4a2e', '#4a2e2e'] }: { x?: number; colors?: string[] }) => (
  <div className="absolute bottom-[28%] flex flex-col-reverse gap-px" style={{ left: `${x}%` }}>
    {colors.map((c, i) => (
      <div key={i} className="rounded-sm" style={{
        width: `${24 + i * 3}px`, height: '5px', background: c, marginLeft: `${i}px`,
      }} />
    ))}
  </div>
));

export const CandleItem = memo(({ x = 70 }: { x?: number }) => (
  <div className="absolute bottom-[28%]" style={{ left: `${x}%` }}>
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-3 rounded-full" style={{
      background: 'linear-gradient(0deg, #ff6600, #ffcc00, #fff8e0)',
      animation: 'scene-flame 0.8s ease-in-out infinite alternate',
    }} />
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full" style={{
      background: 'radial-gradient(circle, rgba(255,180,50,0.08), transparent)',
      animation: 'scene-flame 1.2s ease-in-out infinite alternate',
    }} />
    <div className="w-2 h-5 mx-auto rounded-sm" style={{ background: '#e8dcc8' }} />
    <div className="w-4 h-1 mx-auto rounded-full" style={{ background: '#8b7355' }} />
  </div>
));

export const PlantPot = memo(({ x = 25 }: { x?: number }) => (
  <div className="absolute bottom-[28%]" style={{ left: `${x}%` }}>
    <div className="absolute -top-4 left-0 w-3 h-4 rounded-full -rotate-[20deg]" style={{ background: '#2d5a2d' }} />
    <div className="absolute -top-5 left-2 w-3 h-5 rounded-full rotate-[10deg]" style={{ background: '#3a6a3a' }} />
    <div className="absolute -top-3 left-4 w-2 h-3 rounded-full rotate-[30deg]" style={{ background: '#2d5a2d' }} />
    <div className="w-6 h-4 rounded-b-md" style={{ background: '#8b5e3c' }} />
  </div>
));

export const Monitor = memo(({ x = 40, screenColor = '#0a1020' }: { x?: number; screenColor?: string }) => (
  <div className="absolute bottom-[28%]" style={{ left: `${x}%` }}>
    <div className="w-16 h-10 rounded-sm" style={{ background: '#111', border: '2px solid #333' }}>
      <div className="w-full h-full rounded-sm" style={{
        background: `linear-gradient(135deg, ${screenColor}, #0a0a18)`,
        animation: 'scene-screen 4s ease-in-out infinite',
      }} />
    </div>
    <div className="w-3 h-3 mx-auto" style={{ background: '#333' }} />
    <div className="w-8 h-1 mx-auto rounded-full" style={{ background: '#333' }} />
  </div>
));

export const Bookshelf = memo(({ x = 5, w = 22, rows = 4, shelfColor = '#5a4030' }: { x?: number; w?: number; rows?: number; shelfColor?: string }) => {
  const bookColors = ['#8b4513', '#2e4a2e', '#4a2e2e', '#2e2e4a', '#4a3a2e', '#3a2e4a', '#5a3a1a'];
  const shelves = useMemo(() => Array.from({ length: rows }, (_, r) =>
    Array.from({ length: 4 + Math.floor(Math.random() * 3) }, (_, b) => ({
      color: bookColors[(r * 3 + b) % bookColors.length],
      w: 3 + Math.random() * 4,
      h: 70 + Math.random() * 30,
    }))
  ), [rows]);
  return (
    <div className="absolute top-[5%]" style={{ left: `${x}%`, width: `${w}%`, height: '55%' }}>
      {shelves.map((books, r) => (
        <div key={r} className="relative" style={{ height: `${100 / rows}%` }}>
          <div className="absolute bottom-0 left-0 right-0 flex items-end gap-[1px] px-[2px]" style={{ height: '85%' }}>
            {books.map((b, i) => (
              <div key={i} className="rounded-t-sm" style={{
                width: `${b.w}px`, height: `${b.h}%`, background: b.color,
              }} />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: shelfColor }} />
        </div>
      ))}
    </div>
  );
});

/* ═══════════════════════════════════════════
   VIEW EFFECTS (inside window or scene)
   ═══════════════════════════════════════════ */

export const RainOnGlass = memo(({ skyColor = '#1a2535' }: { skyColor?: string }) => {
  const drops = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    id: i, x: Math.random() * 100, delay: Math.random() * 3,
    speed: 0.6 + Math.random() * 0.8, size: 1 + Math.random() * 2,
  })), []);
  const drips = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: 20 + Math.random() * 60,
    delay: Math.random() * 5, speed: 3 + Math.random() * 4,
  })), []);
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${skyColor}, ${skyColor}dd)` }} />
      {drops.map(d => (
        <div key={d.id} className="absolute" style={{
          left: `${d.x}%`, top: '-5%', width: '1px', height: `${8 + d.size * 4}px`,
          background: 'rgba(150,180,220,0.3)',
          animation: `scene-rain ${d.speed}s linear ${d.delay}s infinite`,
        }} />
      ))}
      {drips.map(d => (
        <div key={`drip-${d.id}`} className="absolute rounded-full" style={{
          left: `${d.x}%`, top: `${d.y}%`, width: '3px', height: '4px',
          background: 'rgba(150,180,220,0.15)',
          animation: `scene-drip ${d.speed}s ease-in ${d.delay}s infinite`,
        }} />
      ))}
      <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[15%] rounded-full" style={{
        background: 'radial-gradient(ellipse, rgba(255,200,100,0.08), transparent)',
      }} />
    </>
  );
});

export const CityLightsView = memo(({ neon = false }: { neon?: boolean }) => {
  const buildings = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    x: i * 8 + Math.random() * 4,
    w: 5 + Math.random() * 6,
    h: 20 + Math.random() * 55,
    windows: Array.from({ length: 3 + Math.floor(Math.random() * 5) }, (_, j) => ({
      x: 15 + Math.random() * 60, y: 10 + j * 18,
      lit: Math.random() > 0.3, flicker: Math.random() > 0.7,
    })),
  })), []);
  const cars = useMemo(() => Array.from({ length: 3 }, (_, i) => ({
    id: i, y: 85 + i * 4, delay: i * 3, speed: 4 + Math.random() * 3,
    color: i % 2 === 0 ? '#ffcc44' : '#ff4444',
  })), []);
  return (
    <>
      <div className="absolute inset-0" style={{
        background: neon ? 'linear-gradient(180deg, #0a0a20, #150a25)' : 'linear-gradient(180deg, #0d1025, #1a1a30)',
      }} />
      {buildings.map((b, i) => (
        <div key={i} className="absolute bottom-0" style={{
          left: `${b.x}%`, width: `${b.w}%`, height: `${b.h}%`,
          background: neon ? '#0a0a18' : '#12121e',
        }}>
          {b.windows.map((w, j) => (
            <div key={j} className="absolute" style={{
              left: `${w.x}%`, top: `${w.y}%`, width: '2px', height: '2px',
              background: w.lit ? (neon ? `hsl(${280 + j * 30} 80% 60%)` : '#ffd98e') : '#1a1a28',
              animation: w.flicker ? `scene-flicker 3s ease-in-out ${Math.random() * 3}s infinite` : 'none',
            }} />
          ))}
        </div>
      ))}
      {cars.map(c => (
        <div key={c.id} className="absolute rounded-full" style={{
          top: `${c.y}%`, left: '-5%', width: '4px', height: '2px',
          background: c.color, boxShadow: `0 0 4px ${c.color}`,
          animation: `scene-car ${c.speed}s linear ${c.delay}s infinite`,
        }} />
      ))}
      {neon && (
        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{
          background: 'linear-gradient(transparent, rgba(120,0,180,0.06))',
          animation: 'scene-neon 4s ease-in-out infinite',
        }} />
      )}
    </>
  );
});

export const ForestView = memo(({ autumn = false }: { autumn?: boolean }) => {
  const treeColors = autumn ? ['#5a3510', '#6a4015', '#4a2a08'] : ['#0d350d', '#1a4a1a', '#0a300a'];
  return (
    <>
      <div className="absolute inset-0" style={{
        background: autumn ? 'linear-gradient(180deg, #2a2018, #1a1508)' : 'linear-gradient(180deg, #1a3020, #0a1a0a)',
      }} />
      {[0, 1].map(i => (
        <div key={`ray-${i}`} className="absolute" style={{
          left: `${30 + i * 25}%`, top: 0, width: `${40 + i * 20}px`, height: '100%',
          background: `rgba(255,255,200,${autumn ? 0.04 : 0.03})`,
          transform: `rotate(${10 + i * 8}deg)`, filter: 'blur(15px)',
          animation: `scene-ray ${10 + i * 3}s ease-in-out infinite alternate`,
        }} />
      ))}
      {[0, 1, 2].map(layer => (
        <div key={`tl-${layer}`} className="absolute bottom-0 left-0 right-0" style={{
          height: `${50 + layer * 15}%`,
          animation: `scene-sway ${6 + layer * 2}s ease-in-out ${layer}s infinite`,
        }}>
          {Array.from({ length: 5 + layer * 2 }, (_, i) => (
            <div key={i} className="absolute bottom-0 rounded-t-full" style={{
              left: `${i * (100 / (5 + layer * 2))}%`, width: `${15 + layer * 5}%`,
              height: `${60 + (i * 13) % 40}%`,
              background: treeColors[layer % 3], opacity: 0.8 - layer * 0.15,
            }} />
          ))}
        </div>
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-[15%]" style={{
        background: autumn ? '#3a2a10' : '#0a2a0a',
      }} />
    </>
  );
});

export const SnowFallView = memo(() => {
  const flakes = useMemo(() => Array.from({ length: 25 }, (_, i) => ({
    id: i, x: Math.random() * 100, delay: Math.random() * 4,
    speed: 3 + Math.random() * 4, size: 2 + Math.random() * 3,
  })), []);
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #2a3545, #1a2535)' }} />
      {flakes.map(f => (
        <div key={f.id} className="absolute rounded-full" style={{
          left: `${f.x}%`, top: '-3%', width: `${f.size}px`, height: `${f.size}px`,
          background: 'rgba(220,230,245,0.6)',
          animation: `scene-snow ${f.speed}s linear ${f.delay}s infinite`,
        }} />
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-[20%]" style={{
        background: 'linear-gradient(0deg, rgba(200,210,230,0.15), transparent)',
      }} />
      {[0, 1, 2].map(i => (
        <div key={`tree-${i}`} className="absolute bottom-[15%]" style={{
          left: `${15 + i * 30}%`, width: '12%', height: '45%',
        }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[3px] h-[40%]" style={{ background: '#3a2a1a' }} />
          <div className="absolute bottom-[35%] left-0 right-0 h-[65%] rounded-t-full" style={{
            background: '#1a3020', opacity: 0.6,
          }} />
        </div>
      ))}
    </>
  );
});

export const OceanWaveView = memo(({ deep = false }: { deep?: boolean }) => {
  const sparkles = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: 30 + Math.random() * 40,
    delay: Math.random() * 3, speed: 2 + Math.random() * 3,
  })), []);
  return (
    <>
      <div className="absolute inset-0" style={{
        background: deep
          ? 'linear-gradient(180deg, #020a1a, #0a1a30, #041020)'
          : 'linear-gradient(180deg, #1a3050, #0a2040, #0a1a30)',
      }} />
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="absolute left-0 right-0" style={{
          bottom: `${i * 8}%`, height: '40px',
          background: `linear-gradient(transparent, rgba(${deep ? '20,60,120' : '40,100,160'}, ${0.06 + i * 0.02}))`,
          borderRadius: '50% 50% 0 0',
          animation: `scene-wave ${4 + i * 1.2}s ease-in-out ${i * 0.5}s infinite`,
        }} />
      ))}
      {!deep && sparkles.map(s => (
        <div key={`sp-${s.id}`} className="absolute rounded-full" style={{
          left: `${s.x}%`, top: `${s.y}%`, width: '2px', height: '2px',
          background: 'rgba(200,220,255,0.3)',
          animation: `scene-twinkle ${s.speed}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </>
  );
});

export const StarFieldView = memo(({ shootingStars = false }: { shootingStars?: boolean }) => {
  const stars = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 80,
    delay: Math.random() * 5, speed: 2 + Math.random() * 4,
    size: 0.5 + Math.random() * 1.5,
  })), []);
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #020208, #0a0a1a, #050510)' }} />
      {stars.map(s => (
        <div key={s.id} className="absolute rounded-full" style={{
          left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`,
          background: 'rgba(220,230,255,0.7)',
          animation: `scene-twinkle ${s.speed}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
      {shootingStars && [0, 1].map(i => (
        <div key={`ss-${i}`} className="absolute rounded-full" style={{
          left: `${10 + i * 40}%`, top: `${10 + i * 15}%`,
          width: '2px', height: '2px', background: 'rgba(220,230,255,0.6)',
          animation: `scene-shoot ${4 + i * 3}s linear ${5 + i * 8}s infinite`,
        }} />
      ))}
    </>
  );
});

export const CloudDriftView = memo(({ sunset = false }: { sunset?: boolean }) => {
  const clouds = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    id: i, y: 10 + i * 12, delay: i * 4, speed: 20 + Math.random() * 15,
    w: 80 + Math.random() * 60, h: 20 + Math.random() * 15,
  })), []);
  return (
    <>
      <div className="absolute inset-0" style={{
        background: sunset
          ? 'linear-gradient(180deg, #2a1a30, #4a2a20, #3a2010)'
          : 'linear-gradient(180deg, #1a2a40, #2a3a55, #1a2540)',
      }} />
      {clouds.map(c => (
        <div key={c.id} className="absolute rounded-full" style={{
          left: '-25%', top: `${c.y}%`,
          width: `${c.w}px`, height: `${c.h}px`,
          background: sunset ? 'rgba(255,180,120,0.08)' : 'rgba(200,210,230,0.06)',
          filter: 'blur(10px)',
          animation: `scene-cloud ${c.speed}s linear ${c.delay}s infinite`,
        }} />
      ))}
      {sunset && (
        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{
          background: 'linear-gradient(transparent, rgba(200,100,20,0.1))',
        }} />
      )}
    </>
  );
});

export const AuroraBandsView = memo(() => (
  <>
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a1020, #081828)' }} />
    {[0, 1, 2, 3, 4].map(i => (
      <div key={i} className="absolute rounded-full" style={{
        left: `${-10 + i * 20}%`, top: '5%',
        width: `${100 + i * 25}px`, height: '55%',
        background: `linear-gradient(180deg,
          hsl(${140 + i * 20} 70% 50% / 0.08) 0%,
          hsl(${160 + i * 25} 80% 45% / 0.12) 30%,
          hsl(${180 + i * 15} 75% 55% / 0.06) 60%,
          transparent 100%)`,
        filter: 'blur(20px)', transformOrigin: 'top center',
        animation: `scene-aurora ${8 + i * 3}s ease-in-out ${i * 1.5}s infinite alternate`,
      }} />
    ))}
    <div className="absolute top-0 left-[20%] right-[20%] h-[30%] rounded-full" style={{
      background: 'radial-gradient(ellipse, rgba(80,200,120,0.06), rgba(80,150,200,0.03), transparent)',
      filter: 'blur(30px)',
      animation: 'scene-aurora 12s ease-in-out infinite alternate',
    }} />
    {/* Snowy landscape below */}
    {[0, 1, 2].map(i => (
      <div key={`mt-${i}`} className="absolute bottom-0" style={{
        left: `${i * 30}%`, width: '40%', height: `${25 + i * 10}%`,
        background: '#0d1520',
        clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
        opacity: 0.8 - i * 0.15,
      }} />
    ))}
  </>
));

export const DustMotesView = memo(({ warm = true }: { warm?: boolean }) => {
  const motes = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i, x: 20 + Math.random() * 60, y: 10 + Math.random() * 70,
    delay: Math.random() * 6, speed: 6 + Math.random() * 8, size: 1 + Math.random() * 2,
  })), []);
  return (
    <>
      {[0, 1].map(i => (
        <div key={`beam-${i}`} className="absolute" style={{
          left: `${25 + i * 25}%`, top: 0, width: `${50 + i * 15}px`, height: '100%',
          background: warm ? 'rgba(255,220,150,0.04)' : 'rgba(200,210,230,0.03)',
          transform: `rotate(${12 + i * 6}deg)`, filter: 'blur(20px)',
          animation: `scene-ray ${12 + i * 4}s ease-in-out infinite alternate`,
        }} />
      ))}
      {motes.map(m => (
        <div key={m.id} className="absolute rounded-full" style={{
          left: `${m.x}%`, top: `${m.y}%`,
          width: `${m.size}px`, height: `${m.size}px`,
          background: warm ? 'rgba(255,220,150,0.3)' : 'rgba(200,210,230,0.25)',
          animation: `scene-dust ${m.speed}s ease-in-out ${m.delay}s infinite`,
        }} />
      ))}
    </>
  );
});

export const CampfireGlowView = memo(() => {
  const sparks = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i, x: 40 + Math.random() * 20, delay: Math.random() * 3,
    speed: 2 + Math.random() * 3,
  })), []);
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a0808, #1a1510, #0a0a18)' }} />
      {/* Stars above */}
      {Array.from({ length: 20 }, (_, i) => (
        <div key={`s-${i}`} className="absolute rounded-full" style={{
          left: `${Math.random() * 100}%`, top: `${Math.random() * 50}%`,
          width: '1px', height: '1px', background: 'rgba(220,230,255,0.5)',
          animation: `scene-twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 5}s infinite`,
        }} />
      ))}
      {/* Fire glow */}
      <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[30%] h-[20%] rounded-full" style={{
        background: 'radial-gradient(ellipse at bottom, rgba(255,120,20,0.15), rgba(255,80,0,0.06), transparent)',
        animation: 'scene-flame 2s ease-in-out infinite alternate',
      }} />
      {/* Sparks */}
      {sparks.map(s => (
        <div key={s.id} className="absolute rounded-full" style={{
          left: `${s.x}%`, bottom: '20%', width: '2px', height: '2px',
          background: 'rgba(255,160,40,0.7)',
          animation: `scene-spark ${s.speed}s ease-out ${s.delay}s infinite`,
        }} />
      ))}
      {/* Sand dunes */}
      <div className="absolute bottom-0 left-0 right-0 h-[25%]" style={{
        background: 'linear-gradient(0deg, #2a2010, #1a1508)',
        borderRadius: '60% 40% 0 0',
      }} />
    </>
  );
});

export const BubbleRiseView = memo(() => {
  const bubbles = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i, x: Math.random() * 100, delay: Math.random() * 5,
    speed: 5 + Math.random() * 6, size: 3 + Math.random() * 5,
  })), []);
  const fish = useMemo(() => Array.from({ length: 3 }, (_, i) => ({
    id: i, y: 30 + i * 20, delay: i * 4, speed: 6 + Math.random() * 4,
    color: ['#ff8844', '#44aaff', '#88ff44'][i],
  })), []);
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #020a1a, #0a1a30, #041020)' }} />
      {/* Bioluminescent glow */}
      {[0, 1].map(i => (
        <div key={`glow-${i}`} className="absolute rounded-full" style={{
          left: `${20 + i * 40}%`, top: `${30 + i * 20}%`,
          width: '100px', height: '80px',
          background: `radial-gradient(ellipse, rgba(${i === 0 ? '40,200,180' : '100,60,200'}, 0.06), transparent)`,
          animation: `scene-glow ${6 + i * 3}s ease-in-out ${i * 2}s infinite`,
        }} />
      ))}
      {bubbles.map(b => (
        <div key={b.id} className="absolute rounded-full" style={{
          left: `${b.x}%`, bottom: '-5%',
          width: `${b.size}px`, height: `${b.size}px`,
          border: '1px solid rgba(100,180,220,0.2)',
          animation: `scene-bubble ${b.speed}s ease-in ${b.delay}s infinite`,
        }} />
      ))}
      {fish.map(f => (
        <div key={`f-${f.id}`} className="absolute" style={{
          top: `${f.y}%`, left: '-3%', width: '6px', height: '3px',
          background: f.color, borderRadius: '50% 0 50% 50%',
          animation: `scene-fish ${f.speed}s linear ${f.delay}s infinite`,
        }} />
      ))}
    </>
  );
});

export const MountainView = memo(() => (
  <>
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #1a2535, #2a3545)' }} />
    {/* Mountains */}
    {[0, 1, 2].map(i => (
      <div key={i} className="absolute bottom-0" style={{
        left: `${-5 + i * 30}%`, width: '50%', height: `${40 + i * 12}%`,
        background: `hsl(${210 + i * 10} ${15 + i * 5}% ${10 + i * 3}%)`,
        clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
        opacity: 0.9 - i * 0.15,
      }} />
    ))}
    {/* Clouds */}
    {[0, 1, 2].map(i => (
      <div key={`c-${i}`} className="absolute rounded-full" style={{
        left: '-20%', top: `${15 + i * 15}%`,
        width: `${80 + i * 30}px`, height: `${15 + i * 5}px`,
        background: 'rgba(200,210,230,0.06)', filter: 'blur(8px)',
        animation: `scene-cloud ${25 + i * 8}s linear ${i * 5}s infinite`,
      }} />
    ))}
    {/* Snow on peaks */}
    <div className="absolute bottom-[48%] left-[18%] w-[14%] h-[5%]" style={{
      background: 'rgba(220,230,245,0.15)',
      clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
    }} />
  </>
));

export const BambooGardenView = memo(() => (
  <>
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a1a0f, #1a3025)' }} />
    {/* Bamboo stalks */}
    {Array.from({ length: 8 }, (_, i) => (
      <div key={i} className="absolute bottom-0" style={{
        left: `${5 + i * 12}%`, width: '3px', height: `${50 + Math.random() * 40}%`,
        background: '#2a4a2a',
        animation: `scene-sway ${5 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
        transformOrigin: 'bottom center',
      }}>
        {/* Nodes */}
        {[30, 55, 80].map(n => (
          <div key={n} className="absolute w-full h-[2px]" style={{ top: `${n}%`, background: '#1a3a1a' }} />
        ))}
        {/* Leaves */}
        <div className="absolute -top-1 -left-3 w-6 h-2 rounded-full" style={{ background: '#2a5a2a' }} />
        <div className="absolute top-[20%] -right-4 w-7 h-2 rounded-full rotate-[10deg]" style={{ background: '#1a4a1a' }} />
      </div>
    ))}
    {/* Water */}
    <div className="absolute bottom-0 left-0 right-0 h-[20%]" style={{
      background: 'linear-gradient(0deg, rgba(20,60,40,0.3), transparent)',
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute left-0 right-0" style={{
          top: `${20 + i * 25}%`, height: '1px',
          background: 'rgba(100,180,140,0.15)',
          animation: `scene-wave ${3 + i}s ease-in-out ${i * 0.5}s infinite`,
        }} />
      ))}
    </div>
  </>
));

export const GreenCanopyView = memo(() => (
  <>
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a1a10, #142e1a)' }} />
    {/* Hanging plants */}
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="absolute" style={{
        left: `${5 + i * 16}%`, top: 0, width: '2px',
        height: `${20 + Math.random() * 30}%`, background: '#1a3a1a',
      }}>
        {Array.from({ length: 3 }, (_, j) => (
          <div key={j} className="absolute rounded-full" style={{
            bottom: `${j * 30}%`, left: j % 2 === 0 ? '-6px' : '2px',
            width: '8px', height: '6px', background: `hsl(${120 + j * 15} ${40 + j * 10}% ${25 + j * 5}%)`,
            animation: `scene-sway ${4 + j}s ease-in-out ${i * 0.5 + j * 0.3}s infinite`,
          }} />
        ))}
      </div>
    ))}
    {/* Light rays through glass */}
    {[0, 1].map(i => (
      <div key={`ray-${i}`} className="absolute" style={{
        left: `${20 + i * 35}%`, top: 0, width: '60px', height: '100%',
        background: 'rgba(200,255,200,0.03)', transform: `rotate(${8 + i * 5}deg)`,
        filter: 'blur(15px)',
        animation: `scene-ray ${10 + i * 4}s ease-in-out infinite alternate`,
      }} />
    ))}
  </>
));

export const CloudScapeView = memo(() => {
  const clouds = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    id: i, y: 20 + Math.random() * 50, delay: i * 3,
    speed: 18 + Math.random() * 12, w: 100 + Math.random() * 80,
    h: 25 + Math.random() * 20,
  })), []);
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #2a3558, #3a4568, #2a3050)' }} />
      {clouds.map(c => (
        <div key={c.id} className="absolute rounded-full" style={{
          left: '-25%', top: `${c.y}%`,
          width: `${c.w}px`, height: `${c.h}px`,
          background: 'rgba(220,230,245,0.08)', filter: 'blur(12px)',
          animation: `scene-cloud ${c.speed}s linear ${c.delay}s infinite`,
        }} />
      ))}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 70% 30%, rgba(255,200,100,0.06), transparent)',
      }} />
    </>
  );
});
