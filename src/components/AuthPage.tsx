import React, { useState, useEffect } from 'react';
import { PageMode } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Satellite,
  Shield,
  Mail,
  User,
  ArrowRight,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  KeyRound,
  FileCheck,
  Moon,
  Sun
} from 'lucide-react';

interface AuthPageProps {
  initialMode: 'login' | 'signup';
  onSuccess: (user: { name: string; role: string; email: string }) => void;
  onNavigate: (page: PageMode) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode,
  onSuccess,
  onNavigate
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  // Navigation mode ('login' | 'signup')
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // ==========================================
  // SIGNUP STATE
  const [signupStep, setSignupStep] = useState<'form' | 'success'>('form');

  // Signup form fields (stored strictly in component memory - never persisted)
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Signup validation errors
  const [signupErrors, setSignupErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // ==========================================
  // LOGIN STATE
  // ==========================================
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});
  const [loginLoading, setLoginLoading] = useState(false);

  // ==========================================
  // FORGOT PASSWORD MODAL STATE
  // ==========================================
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [recoverySubmitted, setRecoverySubmitted] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');

  // ==========================================
  // PASSWORD CRITERIA HELPERS
  // ==========================================
  const passwordCriteria = {
    length: signupPassword.length >= 8,
    uppercase: /[A-Z]/.test(signupPassword),
    lowercase: /[a-z]/.test(signupPassword),
    number: /[0-9]/.test(signupPassword),
    special: /[^A-Za-z0-9]/.test(signupPassword)
  };
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof signupErrors = {};

    if (fullName.trim().length < 2) {
      errors.fullName = 'Enter your full name (at least 2 characters).';
    }

    if (!signupEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!isPasswordValid) {
      errors.password = 'Password does not satisfy all security criteria.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm your password.';
    } else if (signupPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setSignupErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setFullName(fullName.trim());
    setSignupEmail(signupEmail.trim());
    setSignupStep('success');
  };

  // ==========================================
  // LOGIN SUBMIT HANDLER
  // ==========================================
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof loginErrors = {};

    if (loginMethod === 'email') {
      if (!loginEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
        errors.identifier = 'Please enter a valid email address.';
      }
    } else {
      if (!/^[6-9]\d{9}$/.test(loginPhone)) {
        errors.identifier = 'Please enter a valid 10-digit mobile number.';
      }
    }

    if (!loginPassword) {
      errors.password = 'Password is required.';
    }

    setLoginErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoginLoading(true);

    setTimeout(() => {
      setLoginLoading(false);
      const displayName =
        loginMethod === 'email'
          ? loginEmail.split('@')[0].replace(/[._-]/g, ' ') || 'SatQuery Analyst'
          : `Analyst (${loginPhone.slice(-4)})`;

      onSuccess({
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        role: 'Remote Sensing Analyst',
        email: loginMethod === 'email' ? loginEmail : `analyst.${loginPhone.slice(-4)}@satquery.internal`
      });
      onNavigate('dashboard');
    }, 500);
  };

  // ==========================================
  // FORGOT PASSWORD SUBMIT
  // ==========================================
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryIdentifier.trim()) {
      setRecoveryError('Please enter your registered email or phone number.');
      return;
    }
    setRecoveryError('');
    setRecoverySubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-transparent relative overflow-x-hidden font-sans">
      {/* Centered Glass Form Card with subtle depth */}
      <div
        className={`relative z-20 w-full max-w-lg rounded-2xl p-6 sm:p-8 backdrop-blur-xl transition-all border ${
          isDarkMode
            ? 'bg-[#081223]/65 border-slate-700/40 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)]'
            : 'bg-white/80 border-slate-200/80 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)]'
        }`}
      >
        {/* Top Card Utilities: Return & Theme Toggle */}
        <div
          className={`flex items-center justify-between mb-4 pb-3 border-b text-xs font-mono ${
            isDarkMode ? 'border-slate-800/60' : 'border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDarkMode ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
            }`}
          >
            ← Back to Home
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className={`w-11 h-6 rounded-full border p-0.5 flex items-center transition-colors relative cursor-pointer ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'
            }`}
            title="Toggle Theme"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${
                isDarkMode
                  ? 'translate-x-5 text-cyan-400 bg-slate-900 border border-slate-600'
                  : 'translate-x-0 text-amber-500 bg-white border border-slate-300 shadow-xs'
              }`}
            >
              {isDarkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
            </div>
          </button>
        </div>

        {/* SatQuery Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-2 text-slate-950 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.35)]">
            <Satellite className="w-6 h-6" />
          </div>
          <h1
            className={`text-xl sm:text-2xl font-extrabold font-mono tracking-wide ${
              isDarkMode ? 'text-white' : 'text-slate-950'
            }`}
          >
            {mode === 'login'
              ? 'SatQuery AI Access'
              : signupStep === 'success'
              ? 'Account Created Successfully'
              : 'Create Your SatQuery AI Account'}
          </h1>
          <p
            className={`text-xs font-mono mt-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {mode === 'login'
              ? 'Earth Observation Intelligence Platform'
              : signupStep === 'success'
              ? 'Your SatQuery AI analyst profile is ready.'
              : 'Register your analyst profile to access the Earth Observation Intelligence Platform.'}
          </p>
        </div>

        {/* Global Tab Switcher (Sign In vs Create Account) */}
        {signupStep === 'form' && (
          <div
            className={`flex rounded-lg p-1 border mb-6 font-mono text-xs transition-colors ${
              isDarkMode
                ? 'bg-slate-950/70 border-slate-800/80'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              type="button"
              id="auth-tab-login"
              onClick={() => {
                setMode('login');
                setLoginErrors({});
              }}
              className={`flex-1 py-2 rounded-md font-semibold transition-all cursor-pointer text-center ${
                mode === 'login'
                  ? isDarkMode
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                    : 'bg-slate-900 text-white shadow-sm font-bold'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="auth-tab-signup"
              onClick={() => {
                setMode('signup');
                setSignupErrors({});
              }}
              className={`flex-1 py-2 rounded-md font-semibold transition-all cursor-pointer text-center ${
                mode === 'signup'
                  ? isDarkMode
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                    : 'bg-slate-900 text-white shadow-sm font-bold'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 1: SIGN IN MODE (Email or Phone + Password)                     */}
        {/* ==================================================================== */}
        {mode === 'login' && (
          <div>
            {/* Method Toggle: [ Email ] [ Phone ] */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Sign in with:
              </span>
              <div
                className={`flex rounded-md p-0.5 border text-[11px] font-mono ${
                  isDarkMode
                    ? 'bg-slate-950/80 border-slate-800'
                    : 'bg-slate-100 border-slate-200'
                }`}
              >
                <button
                  type="button"
                  id="login-toggle-email"
                  onClick={() => {
                    setLoginMethod('email');
                    setLoginErrors({});
                  }}
                  className={`px-3 py-1 rounded transition-all cursor-pointer ${
                    loginMethod === 'email'
                      ? isDarkMode
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'bg-white text-slate-950 shadow-xs border border-slate-300 font-semibold'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  id="login-toggle-phone"
                  onClick={() => {
                    setLoginMethod('phone');
                    setLoginErrors({});
                  }}
                  className={`px-3 py-1 rounded transition-all cursor-pointer ${
                    loginMethod === 'phone'
                      ? isDarkMode
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'bg-white text-slate-950 shadow-xs border border-slate-300 font-semibold'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  Phone
                </button>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Field: Email Address OR Phone Number */}
              {loginMethod === 'email' ? (
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-mono mb-1 text-[var(--text-secondary)]"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`w-4 h-4 absolute left-3 top-2.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (loginErrors.identifier) {
                          setLoginErrors((prev) => ({ ...prev, identifier: undefined }));
                        }
                      }}
                      placeholder="name@example.com"
                      className={`w-full satquery-input border rounded-lg pl-9 pr-3 py-2 text-xs font-mono transition-colors ${
                        loginErrors.identifier ? '!border-red-500' : ''
                      }`}
                    />
                  </div>
                  {loginErrors.identifier && (
                    <p className="mt-1 text-[11px] font-mono text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {loginErrors.identifier}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="login-phone"
                    className="block text-xs font-mono mb-1 text-[var(--text-secondary)]"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-2 text-xs font-mono text-slate-500 select-none">
                      +91
                    </div>
                    <input
                      id="login-phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={loginPhone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setLoginPhone(digits);
                        if (loginErrors.identifier) {
                          setLoginErrors((prev) => ({ ...prev, identifier: undefined }));
                        }
                      }}
                      placeholder="Enter 10-digit mobile number"
                      className={`w-full satquery-input border rounded-lg pl-12 pr-3 py-2 text-xs font-mono transition-colors ${
                        loginErrors.identifier ? '!border-red-500' : ''
                      }`}
                    />
                  </div>
                  {loginErrors.identifier && (
                    <p className="mt-1 text-[11px] font-mono text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {loginErrors.identifier}
                    </p>
                  )}
                </div>
              )}

              {/* Field: Password with show/hide */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-mono text-[var(--text-secondary)]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className={`text-[11px] font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
                    }`}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3 top-2.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginErrors.password) {
                        setLoginErrors((prev) => ({ ...prev, password: undefined }));
                      }
                    }}
                    placeholder="Enter your password"
                    className={`w-full satquery-input border rounded-lg pl-9 pr-10 py-2 text-xs font-mono transition-colors ${
                      loginErrors.password ? '!border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    className={`absolute right-3 top-2.5 cursor-pointer ${
                      isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="mt-1 text-[11px] font-mono text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {loginErrors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="login-submit-btn"
                disabled={loginLoading}
                className={`w-full py-2.5 mt-2 rounded-lg font-bold font-mono text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_4px_16px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 hover:bg-black text-white shadow-md'
                }`}
              >
                {loginLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Quick footer switch */}
            <div
              className={`mt-5 text-center text-xs font-mono ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Don't have an analyst account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setSignupStep('form');
                }}
                className={`font-semibold hover:underline cursor-pointer ${
                  isDarkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
                }`}
              >
                Create account
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 2: SIGNUP - STEP 1 (Basic Information Form)                     */}
        {/* ==================================================================== */}
        {mode === 'signup' && signupStep === 'form' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-left">
            {/* 1. Full Name */}
            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs font-mono mb-1 text-[var(--text-secondary)]"
              >
                Full Name <span className="text-cyan-500">*</span>
              </label>
              <div className="relative">
                <User className={`w-4 h-4 absolute left-3 top-2.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  id="signup-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (signupErrors.fullName) {
                      setSignupErrors((prev) => ({ ...prev, fullName: undefined }));
                    }
                  }}
                  placeholder="Enter your full name"
                  className={`w-full satquery-input border rounded-lg pl-9 pr-3 py-2 text-xs font-mono transition-colors ${
                    signupErrors.fullName ? '!border-red-500' : ''
                  }`}
                />
              </div>
              {signupErrors.fullName && (
                <p className="mt-1 text-[11px] font-mono text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {signupErrors.fullName}
                </p>
              )}
            </div>

            {/* 2. Email Address */}
            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs font-mono mb-1 text-[var(--text-secondary)]"
              >
                Email Address <span className="text-cyan-500">*</span>
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3 top-2.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  id="signup-email"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => {
                    setSignupEmail(e.target.value);
                    if (signupErrors.email) {
                      setSignupErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  placeholder="name@example.com"
                  className={`w-full satquery-input border rounded-lg pl-9 pr-3 py-2 text-xs font-mono transition-colors ${
                    signupErrors.email ? '!border-red-500' : ''
                  }`}
                />
              </div>
              {signupErrors.email && (
                <p className="mt-1 text-[11px] font-mono text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {signupErrors.email}
                </p>
              )}
            </div>

            {/* 3. Create Password */}
            <div>
              <label
                htmlFor="signup-password"
                className="block text-xs font-mono mb-1 text-[var(--text-secondary)]"
              >
                Create Password <span className="text-cyan-500">*</span>
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-3 top-2.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  id="signup-password"
                  type={showSignupPassword ? 'text' : 'password'}
                  value={signupPassword}
                  onChange={(e) => {
                    setSignupPassword(e.target.value);
                    if (signupErrors.password) {
                      setSignupErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  placeholder="Create a strong password"
                  className={`w-full satquery-input border rounded-lg pl-9 pr-10 py-2 text-xs font-mono transition-colors ${
                    signupErrors.password ? '!border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword((prev) => !prev)}
                  aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                  className={`absolute right-3 top-2.5 cursor-pointer ${
                    isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {showSignupPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Live Password Requirements Checklist */}
              <div
                className={`mt-2 p-2.5 rounded-lg border text-[11px] font-mono space-y-1 ${
                  isDarkMode
                    ? 'bg-slate-950/70 border-slate-800/80'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div
                  className={`text-[10px] uppercase tracking-wider font-bold mb-1 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Password must contain:
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordCriteria.length
                        ? 'text-emerald-500 font-medium'
                        : isDarkMode
                        ? 'text-slate-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {passwordCriteria.length ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <div className={`w-1.5 h-1.5 rounded-full ml-0.5 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`} />
                    )}
                    <span>Min 8 characters</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordCriteria.uppercase
                        ? 'text-emerald-500 font-medium'
                        : isDarkMode
                        ? 'text-slate-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {passwordCriteria.uppercase ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <div className={`w-1.5 h-1.5 rounded-full ml-0.5 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`} />
                    )}
                    <span>Uppercase letter</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordCriteria.lowercase
                        ? 'text-emerald-500 font-medium'
                        : isDarkMode
                        ? 'text-slate-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {passwordCriteria.lowercase ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <div className={`w-1.5 h-1.5 rounded-full ml-0.5 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`} />
                    )}
                    <span>Lowercase letter</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordCriteria.number
                        ? 'text-emerald-500 font-medium'
                        : isDarkMode
                        ? 'text-slate-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {passwordCriteria.number ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <div className={`w-1.5 h-1.5 rounded-full ml-0.5 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`} />
                    )}
                    <span>Number</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 col-span-2 ${
                      passwordCriteria.special
                        ? 'text-emerald-500 font-medium'
                        : isDarkMode
                        ? 'text-slate-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {passwordCriteria.special ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <div className={`w-1.5 h-1.5 rounded-full ml-0.5 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`} />
                    )}
                    <span>Special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Confirm Password */}
            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block text-xs font-mono mb-1 text-[var(--text-secondary)]"
              >
                Confirm Password <span className="text-cyan-500">*</span>
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-3 top-2.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (signupErrors.confirmPassword) {
                      setSignupErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  placeholder="Confirm your password"
                  className={`w-full satquery-input border rounded-lg pl-9 pr-10 py-2 text-xs font-mono transition-colors ${
                    signupErrors.confirmPassword ? '!border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className={`absolute right-3 top-2.5 cursor-pointer ${
                    isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {signupErrors.confirmPassword && (
                <p className="mt-1 text-[11px] font-mono text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {signupErrors.confirmPassword}
                </p>
              )}
              {confirmPassword && signupPassword === confirmPassword && (
                <p className="mt-1 text-[11px] font-mono text-emerald-500 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="signup-create-account-btn"
              disabled={
                fullName.trim().length < 2 ||
                !signupEmail ||
                !isPasswordValid ||
                signupPassword !== confirmPassword
              }
              className={`w-full py-2.5 mt-2 rounded-lg font-bold font-mono text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isDarkMode
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_4px_16px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900 hover:bg-black text-white shadow-md'
              }`}
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Quick footer switch to Login */}
            <div
              className={`mt-4 text-center text-xs font-mono ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                }}
                className={`font-semibold hover:underline cursor-pointer ${
                  isDarkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
                }`}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* VIEW 4: SIGNUP - STEP 3 (Signup Success Screen)                      */}
        {/* ==================================================================== */}
        {mode === 'signup' && signupStep === 'success' && (
          <div className="text-center space-y-5 py-2">
            <div
              className={`inline-flex items-center justify-center w-14 h-14 rounded-full border text-emerald-500 ${
                isDarkMode
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
                  : 'bg-emerald-50 border-emerald-300 shadow-xs'
              }`}
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className={`text-lg sm:text-xl font-bold font-mono tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                Account Created Successfully
              </h2>
              <p className={`text-xs font-mono mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Your SatQuery AI analyst profile is ready.
              </p>
            </div>

            {/* Prototype notice */}
            <div className={`text-[10px] font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Demo session initialized in-memory &bull; Zero sensitive data stored
            </div>

            {/* Continue to Sign In */}
            <button
              type="button"
              id="btn-continue-sign-in"
              onClick={() => {
                setMode('login');
                setSignupStep('form');
                setSignupPassword('');
                setConfirmPassword('');
                setSignupErrors({});
              }}
              className={`w-full py-2.5 rounded-lg font-bold font-mono text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isDarkMode
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_4px_16px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900 hover:bg-black text-white shadow-md'
              }`}
            >
              <span>Continue to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Security & Privacy Notice Footer */}
        <div
          className={`mt-6 pt-4 border-t flex items-center justify-center gap-1.5 text-[10px] font-mono ${
            isDarkMode ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-500'
          }`}
        >
          <Shield className="w-3 h-3 text-emerald-500 flex-shrink-0" />
          <span>Client-Side Prototype Session &bull; No Persistent Identity Data</span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODAL: FORGOT PASSWORD (Simple Frontend Placeholder Flow)            */}
      {/* ==================================================================== */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div
            className={`w-full max-w-md border rounded-2xl p-6 backdrop-blur-xl shadow-2xl font-mono text-left ${
              isDarkMode
                ? 'bg-slate-900/95 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className={`w-5 h-5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                  Password Recovery
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setRecoverySubmitted(false);
                  setRecoveryIdentifier('');
                  setRecoveryError('');
                }}
                className={`text-sm cursor-pointer p-1 transition-colors ${
                  isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                ✕
              </button>
            </div>

            {!recoverySubmitted ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Enter your registered institutional email or phone number to initiate recovery.
                </p>

                <div>
                  <label className="block text-xs mb-1 text-[var(--text-secondary)]">
                    Email or Phone Number
                  </label>
                  <input
                    type="text"
                    value={recoveryIdentifier}
                    onChange={(e) => {
                      setRecoveryIdentifier(e.target.value);
                      if (recoveryError) setRecoveryError('');
                    }}
                    placeholder="name@example.com or 10-digit mobile"
                    className={`w-full satquery-input border rounded-lg px-3 py-2 text-xs font-mono ${
                      recoveryError ? '!border-red-500' : ''
                    }`}
                  />
                  {recoveryError && (
                    <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {recoveryError}
                    </p>
                  )}
                </div>

                <div
                  className={`p-3 rounded-lg border text-[11px] ${
                    isDarkMode
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                >
                  Password recovery will be available when the authentication service is connected.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setRecoverySubmitted(false);
                      setRecoveryIdentifier('');
                      setRecoveryError('');
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isDarkMode
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-1.5 rounded-lg font-bold text-xs cursor-pointer shadow transition-colors ${
                      isDarkMode
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                        : 'bg-slate-900 hover:bg-black text-white'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center py-2">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full border mb-1 ${
                    isDarkMode
                      ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400'
                      : 'bg-cyan-50 border-cyan-300 text-cyan-600'
                  }`}
                >
                  <FileCheck className="w-6 h-6" />
                </div>
                <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                  Recovery Request Logged
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Password recovery will be available when the authentication service is connected.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setRecoverySubmitted(false);
                    setRecoveryIdentifier('');
                  }}
                  className={`w-full py-2 rounded-lg font-bold text-xs cursor-pointer ${
                    isDarkMode
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                      : 'bg-slate-900 hover:bg-black text-white'
                  }`}
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
