import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timer, Brain, Music, BarChart3, Sparkles, MessageSquare, FileText, ChevronDown } from 'lucide-react';
import cozyBg from '@/assets/cozy-study-bg.jpg';

/* ───── floating particles ───── */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; vx: number; vy: number; o: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        o: Math.random() * 0.5 + 0.15,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(38, 90%, 65%, ${p.o})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-10 pointer-events-none" />;
}

/* ───── rain overlay ───── */
function RainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const drops: { x: number; y: number; len: number; speed: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 100; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        len: Math.random() * 18 + 8,
        speed: Math.random() * 4 + 3,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'hsla(210, 40%, 70%, 0.12)';
      ctx.lineWidth = 1;
      drops.forEach((d) => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 0.5, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        if (d.y > canvas.height) { d.y = -d.len; d.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-10 pointer-events-none" />;
}

/* ───── feature cards ───── */
const FEATURES = [
  {
    icon: Timer,
    title: 'Focus Timer',
    desc: 'Multiple study styles including Pomodoro, Deep Focus, Flow Mode, and Exam Sprint.',
    rotate: '-2deg',
  },
  {
    icon: Brain,
    title: 'AI Study Assistant',
    desc: 'Ask questions, understand difficult topics, and generate practice questions.',
    rotate: '1.5deg',
  },
  {
    icon: Music,
    title: 'Focus Music',
    desc: 'Listen to lo-fi, piano, jazz, classical, or ambient music while studying.',
    rotate: '-1deg',
  },
  {
    icon: BarChart3,
    title: 'Study Progress',
    desc: 'Track your study time and stay motivated with streaks and progress stats.',
    rotate: '2deg',
  },
];

/* ───── page ───── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-foreground">
      {/* ── background layers ── */}
      <div className="fixed inset-0 z-0">
        <img src={cozyBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,25%,6%)]/70 via-[hsl(220,25%,6%)]/50 to-[hsl(220,25%,6%)]/90" />
      </div>
      <RainOverlay />
      <Particles />

      {/* ── warm vignette ── */}
      <div className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 80%, hsla(38,80%,50%,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, hsla(220,60%,30%,0.08) 0%, transparent 50%)',
        }}
      />

      {/* ══════════ HERO ══════════ */}
      <section className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto"
        >
          {/* lamp glow */}
          <motion.div
            className="mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsla(38,90%,55%,0.25), hsla(25,85%,45%,0.15))',
              boxShadow: '0 0 60px hsla(38,90%,55%,0.25), 0 0 120px hsla(38,80%,50%,0.1)',
            }}
            variants={fadeUp}
            custom={0}
          >
            <Sparkles className="w-7 h-7" style={{ color: 'hsl(38,90%,65%)' }} />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display text-5xl sm:text-7xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, hsl(38,90%,70%), hsl(30,80%,60%), hsl(210,30%,85%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            StudyOS
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-lg sm:text-xl font-display"
            style={{ color: 'hsl(38,60%,75%)' }}
          >
            A calm space to focus, learn, and prepare for exams.
          </motion.p>

          <motion.p
            variants={fadeUp}
            custom={3}
            className="mt-4 max-w-lg mx-auto text-sm sm:text-base leading-relaxed"
            style={{ color: 'hsl(215,15%,60%)' }}
          >
            A cozy study environment with focus timers, AI learning tools, calming music, and progress tracking — designed to help students stay consistent and stress-free.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={4}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: 'linear-gradient(135deg, hsla(38,90%,55%,0.9), hsla(25,80%,50%,0.9))',
                color: 'hsl(220,25%,8%)',
                boxShadow: '0 0 30px hsla(38,90%,55%,0.3), 0 4px 20px hsla(0,0%,0%,0.3)',
              }}
            >
              ☁ Start Studying
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all"
              style={{
                borderColor: 'hsla(215,20%,50%,0.3)',
                color: 'hsl(215,20%,75%)',
                background: 'hsla(220,20%,12%,0.5)',
                backdropFilter: 'blur(8px)',
              }}
            >
              🌙 Sign In
            </Link>
          </motion.div>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8"
        >
          <ChevronDown className="w-5 h-5 animate-bounce" style={{ color: 'hsl(38,60%,60%)' }} />
        </motion.div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="relative z-20 py-24 px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center font-display text-2xl sm:text-3xl font-bold mb-14"
          style={{ color: 'hsl(38,60%,75%)' }}
        >
          Everything you need to study better
        </motion.h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: f.rotate }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.03, rotate: '0deg' }}
              className="rounded-2xl p-6 border backdrop-blur-md"
              style={{
                background: 'linear-gradient(145deg, hsla(220,20%,12%,0.7), hsla(220,20%,8%,0.6))',
                borderColor: 'hsla(38,60%,50%,0.12)',
                boxShadow: '0 4px 30px hsla(0,0%,0%,0.3), inset 0 1px 0 hsla(38,60%,60%,0.06)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{
                  background: 'hsla(38,80%,55%,0.12)',
                  boxShadow: '0 0 20px hsla(38,80%,55%,0.08)',
                }}
              >
                <f.icon className="w-5 h-5" style={{ color: 'hsl(38,80%,65%)' }} />
              </div>
              <h3 className="font-display font-semibold text-base mb-1" style={{ color: 'hsl(210,20%,90%)' }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'hsl(215,15%,55%)' }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ AI COMPANION ══════════ */}
      <section className="relative z-20 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{
                background: 'hsla(170,80%,45%,0.1)',
                color: 'hsl(170,70%,55%)',
                border: '1px solid hsla(170,80%,45%,0.15)',
              }}
            >
              <Brain className="w-3.5 h-3.5" /> AI-Powered
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'hsl(38,60%,75%)' }}>
              Your Personal Study Companion
            </h2>
            <p className="mt-3 text-sm" style={{ color: 'hsl(215,15%,55%)' }}>
              Ask anything. Understand everything. Learn faster.
            </p>
          </motion.div>

          {/* chat mockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border overflow-hidden backdrop-blur-md"
            style={{
              background: 'linear-gradient(145deg, hsla(220,20%,10%,0.8), hsla(220,20%,7%,0.7))',
              borderColor: 'hsla(215,20%,30%,0.2)',
              boxShadow: '0 8px 40px hsla(0,0%,0%,0.4)',
            }}
          >
            {/* header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: 'hsla(215,20%,30%,0.15)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: 'hsl(170,70%,50%)' }} />
              <span className="text-xs font-display font-semibold" style={{ color: 'hsl(215,15%,60%)' }}>
                AI Study Assistant
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* user message */}
              <div className="flex justify-end">
                <div
                  className="max-w-xs rounded-2xl rounded-br-md px-4 py-3 text-sm"
                  style={{
                    background: 'hsla(38,80%,55%,0.12)',
                    color: 'hsl(38,60%,80%)',
                    border: '1px solid hsla(38,60%,50%,0.1)',
                  }}
                >
                  <MessageSquare className="w-3 h-3 inline mr-1.5 opacity-50" />
                  Explain oxidation and reduction simply.
                </div>
              </div>

              {/* AI response */}
              <div className="flex justify-start">
                <div
                  className="max-w-sm rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background: 'hsla(220,20%,15%,0.6)',
                    color: 'hsl(210,20%,80%)',
                    border: '1px solid hsla(215,20%,30%,0.15)',
                  }}
                >
                  <p className="mb-2">
                    <strong style={{ color: 'hsl(170,70%,60%)' }}>Oxidation</strong> = loss of electrons 🔴
                  </p>
                  <p className="mb-2">
                    <strong style={{ color: 'hsl(170,70%,60%)' }}>Reduction</strong> = gain of electrons 🟢
                  </p>
                  <p style={{ color: 'hsl(215,15%,55%)' }} className="text-xs mt-2">
                    💡 Think: "OIL RIG" — Oxidation Is Loss, Reduction Is Gain
                  </p>
                </div>
              </div>

              {/* second example */}
              <div className="flex justify-end">
                <div
                  className="max-w-xs rounded-2xl rounded-br-md px-4 py-3 text-sm"
                  style={{
                    background: 'hsla(38,80%,55%,0.12)',
                    color: 'hsl(38,60%,80%)',
                    border: '1px solid hsla(38,60%,50%,0.1)',
                  }}
                >
                  <FileText className="w-3 h-3 inline mr-1.5 opacity-50" />
                  Summarize my biology notes
                </div>
              </div>

              <div className="flex justify-start">
                <div
                  className="max-w-sm rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background: 'hsla(220,20%,15%,0.6)',
                    color: 'hsl(210,20%,80%)',
                    border: '1px solid hsla(215,20%,30%,0.15)',
                  }}
                >
                  <p className="text-xs mb-1.5" style={{ color: 'hsl(170,60%,55%)' }}>Generated for you:</p>
                  <p>• Key concepts extracted</p>
                  <p>• 5 flashcards created</p>
                  <p>• Quick revision summary ready</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="relative z-20 py-28 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl sm:text-4xl font-bold" style={{ color: 'hsl(38,60%,75%)' }}>
            Ready to begin your study session?
          </h2>
          <p className="mt-3 text-sm" style={{ color: 'hsl(215,15%,55%)' }}>
            Join thousands of students studying smarter, not harder.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: 'linear-gradient(135deg, hsla(38,90%,55%,0.9), hsla(25,80%,50%,0.9))',
                color: 'hsl(220,25%,8%)',
                boxShadow: '0 0 30px hsla(38,90%,55%,0.3), 0 4px 20px hsla(0,0%,0%,0.3)',
              }}
            >
              ☕ Create Account
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all"
              style={{
                borderColor: 'hsla(215,20%,50%,0.3)',
                color: 'hsl(215,20%,75%)',
                background: 'hsla(220,20%,12%,0.5)',
                backdropFilter: 'blur(8px)',
              }}
            >
              🌙 Sign In
            </Link>
          </div>
        </motion.div>

        {/* footer */}
        <p className="mt-20 text-xs" style={{ color: 'hsl(215,15%,35%)' }}>
          Made with ☕ for students who study late at night.
        </p>
      </section>
    </div>
  );
}
