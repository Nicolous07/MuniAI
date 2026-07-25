import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserPlus,
  Key,
  Building2,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialTab = 'login',
}) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleTabChange = (newTab: 'login' | 'signup' | 'forgot') => {
    resetForm();
    setTab(newTab);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (tab === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Full name is required for account creation.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('You must accept the Terms of Service and Privacy Policy.');
        return;
      }
    } else if (tab === 'login') {
      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }
    } else if (tab === 'forgot') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMessage(`Password reset link sent to ${email}`);
      }, 1200);
      return;
    }

    setIsLoading(true);

    // Simulate authentication call
    setTimeout(() => {
      setIsLoading(false);
      const nameParts = fullName.trim() || email.split('@')[0];
      const formattedName = nameParts
        .split('.')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

      const loggedInUser: UserProfile = {
        name: tab === 'signup' ? fullName : formattedName || 'Enterprise User',
        email: email,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250`,
        plan: tab === 'signup' ? 'Individual Ultra' : 'Enterprise Pro',
        creditsUsed: 120,
        creditsMax: 10000,
        tokensThisMonth: '1.2M',
        connectedApps: ['Google Workspace', 'GitHub Enterprise', 'Slack AI'],
      };

      onLoginSuccess(loggedInUser);
      onClose();
    }, 1200);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      const socialUser: UserProfile = {
        name: `${provider} Authenticated User`,
        email: `user@${provider.toLowerCase().replace(/\s+/g, '')}.io`,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250`,
        plan: 'Enterprise Pro',
        creditsUsed: 4800,
        creditsMax: 10000,
        tokensThisMonth: '4.8M',
        connectedApps: [`${provider} SSO`, 'Google Cloud', 'MuniAI Vault'],
      };
      onLoginSuccess(socialUser);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-md rounded-3xl bg-[#0c0c0c]/90 backdrop-blur-3xl border border-white/10 p-6 sm:p-8 shadow-2xl shadow-cyan-500/10 overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header Brand */}
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 text-white shadow-lg shadow-cyan-500/20 mb-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {tab === 'login' && 'Welcome Back'}
              {tab === 'signup' && 'Create Your Account'}
              {tab === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {tab === 'login' && 'Sign in to access MuniAI Omega neural models'}
              {tab === 'signup' && 'Start building with MuniAI Enterprise Studio'}
              {tab === 'forgot' && 'Enter your email to receive recovery instructions'}
            </p>
          </div>

          {/* Tab Switcher (Sign In vs Sign Up) */}
          {tab !== 'forgot' && (
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-white/5 p-1 border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  tab === 'login'
                    ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('signup')}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  tab === 'signup'
                    ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                Sign Up
              </button>
            </div>
          )}

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g. Nicolous Munisi"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>
            </div>

            {tab !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-medium text-slate-300">
                    Password
                  </label>
                  {tab === 'login' && (
                    <button
                      type="button"
                      onClick={() => handleTabChange('forgot')}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                  />
                </div>
              </div>
            )}

            {/* Remember Me & Terms Controls */}
            {tab === 'login' && (
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-0"
                  />
                  <span>Remember session</span>
                </label>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <Shield className="h-3 w-3" /> 256-bit Encrypted
                </span>
              </div>
            )}

            {tab === 'signup' && (
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400 select-none pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-0"
                />
                <span>
                  I agree to the{' '}
                  <a href="#terms" className="text-cyan-400 underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" className="text-cyan-400 underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-500 shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center justify-center gap-2 rounded-[15px] bg-[#0c0c0c] px-4 py-3 text-xs font-bold text-white transition-colors group-hover:bg-opacity-80">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>
                      {tab === 'login' && 'Sign In to Workspace'}
                      {tab === 'signup' && 'Create Account'}
                      {tab === 'forgot' && 'Send Reset Link'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Social Sign In Options */}
          {tab !== 'forgot' && (
            <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
              <div className="text-center">
                <span className="px-2 text-[11px] font-mono uppercase text-slate-500 bg-[#0c0c0c]">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 py-2.5 px-3 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.39 7.37 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.61 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('GitHub')}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 py-2.5 px-3 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleSocialLogin('Enterprise SSO')}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 py-2.5 px-3 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors"
              >
                <Building2 className="h-4 w-4 text-cyan-400" />
                Sign in with Enterprise SSO
              </button>
            </div>
          )}

          {tab === 'forgot' && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                className="text-xs text-cyan-400 hover:underline"
              >
                ← Back to Sign In
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
