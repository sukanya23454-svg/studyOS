import { motion } from 'framer-motion';
import { Volume2, Check, Sparkles } from 'lucide-react';
import { ENVIRONMENTS, useEnvironment } from '@/contexts/EnvironmentContext';
import { Slider } from '@/components/ui/slider';

export default function VirtualStudyRoomPage() {
  const { activeEnvironment, setEnvironment, ambientVolume, setAmbientVolume } = useEnvironment();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-primary" />
          Virtual Study Room
        </h1>
        <p className="text-muted-foreground mt-1">Choose your immersive study environment</p>
      </div>

      {/* Environment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ENVIRONMENTS.map((env, i) => {
          const isActive = activeEnvironment?.id === env.id;
          return (
            <motion.button
              key={env.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setEnvironment(isActive ? null : env)}
              className={`group relative rounded-2xl overflow-hidden border-2 transition-all text-left ${
                isActive
                  ? 'border-primary glow-primary'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              {/* Background image */}
              <div className="aspect-video relative">
                <img
                  src={env.image}
                  alt={env.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full gradient-primary flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </motion.div>
                )}

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{env.emoji}</span>
                    <h3 className="text-lg font-display font-semibold text-white">{env.name}</h3>
                  </div>
                  <p className="text-xs text-white/70">{env.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Ambient volume control */}
      {activeEnvironment && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-card rounded-xl border border-border p-5 shadow-card"
        >
          <div className="flex items-center gap-3 mb-3">
            <Volume2 className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold">Ambient Volume</h3>
            <span className="text-xs text-muted-foreground ml-auto font-mono">{ambientVolume}%</span>
          </div>
          <Slider
            value={[ambientVolume]}
            onValueChange={([v]) => setAmbientVolume(v)}
            max={100}
            step={1}
          />
          <p className="text-xs text-muted-foreground mt-3">
            🎧 Now immersed in <span className="text-primary font-medium">{activeEnvironment.name}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
