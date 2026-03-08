import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Sparkles } from 'lucide-react';
import cozyBg from '@/assets/cozy-study-bg.jpg';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email'); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
    toast.success('Check your email for a reset link!');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="fixed inset-0 z-0">
        <img src={cozyBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[hsl(220,25%,6%)]/80" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </Link>

        <div className="rounded-2xl border p-7 backdrop-blur-xl" style={{
          background: 'linear-gradient(145deg, hsla(220,20%,10%,0.85), hsla(220,20%,7%,0.85))',
          borderColor: 'hsla(38,50%,40%,0.15)',
          boxShadow: '0 8px 40px hsla(0,0%,0%,0.5)',
        }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">Reset Password</span>
          </div>

          {sent ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              We sent a password reset link to <strong className="text-foreground">{email}</strong>. Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-muted-foreground">Enter your email and we'll send you a reset link.</p>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 bg-secondary/50 border-border" />
              </div>
              <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
