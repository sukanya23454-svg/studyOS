import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Search } from 'lucide-react';
import { ENVIRONMENTS, useEnvironment } from '@/contexts/EnvironmentContext';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function VirtualStudyRoomPage() {
  const { activeEnvironment, setEnvironment } = useEnvironment();
  const [search, setSearch] = useState('');

  const filtered = ENVIRONMENTS.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-primary" />
          Virtual Study Room
        </h1>
        <p className="text-muted-foreground mt-1">Choose your immersive animated study environment</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search environments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-card/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary backdrop-blur-md"
        />
      </div>

      {/* Environment Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filtered.map((env, i) => {
          const isActive = activeEnvironment?.id === env.id;
          return (
            <motion.button
              key={env.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => setEnvironment(isActive ? null : env)}
              className={`group relative rounded-xl overflow-hidden border transition-all text-left ${
                isActive
                  ? 'border-primary glow-primary ring-1 ring-primary/30'
                  : 'border-border/50 hover:border-primary/40'
              }`}
            >
              {/* Gradient background with mini animation preview */}
              <div className="aspect-[4/3] relative" style={{ background: env.gradient }}>
                {/* Mini animation preview */}
                <div className="absolute inset-0 opacity-60">
                  <AnimatedBackground type={env.animation} />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Active check */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full gradient-primary flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </motion.div>
                )}

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{env.emoji}</span>
                    <h3 className="text-xs font-display font-semibold text-white leading-tight">{env.name}</h3>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No environments found</p>
      )}
    </div>
  );
}
