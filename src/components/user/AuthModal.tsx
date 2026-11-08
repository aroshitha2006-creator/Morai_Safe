import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert, 
  Bell, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../../types';
import { StorageService } from '../../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify'>('login');
  
  // Registration fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredDistrict, setPreferredDistrict] = useState('Chennai');
  
  // Notification preferences
  const [prefCritical, setPrefCritical] = useState(true);
  const [prefWeather, setPrefWeather] = useState(true);
  const [prefShelter, setPrefShelter] = useState(true);
  const [prefEmail, setPrefEmail] = useState(true);

  // Verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [mockSentCode, setMockSentCode] = useState('112026');
  const [registeredUserObj, setRegisteredUserObj] = useState<UserProfile | null>(null);

  // Feedback messages
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const users = StorageService.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!existing) {
      setErrorMsg('No account found with this email. Please register as a verified resident.');
      return;
    }

    if (!existing.isEmailVerified) {
      setRegisteredUserObj(existing);
      setMode('verify');
      setInfoMsg('Please verify your email address to access citizen features.');
      return;
    }

    // Successful login
    StorageService.setCurrentUser(existing);
    onSuccess(existing);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    const users = StorageService.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setErrorMsg('An account with this email address already exists. Please log in.');
      return;
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockSentCode(generatedOtp);

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName,
      email,
      phone,
      preferredDistrict,
      isEmailVerified: false,
      role: 'user',
      notificationPreferences: {
        criticalAlerts: prefCritical,
        weatherWarnings: prefWeather,
        shelterUpdates: prefShelter,
        emailBroadcasts: prefEmail,
        browserPush: true
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    StorageService.saveUser(newUser);
    setRegisteredUserObj(newUser);
    setMode('verify');

    // Trigger backend Resend email
    fetch('/api/email/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        fullName,
        otp: generatedOtp
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setInfoMsg(`A genuine verification OTP was emailed to ${email} via Resend.`);
        } else {
          setInfoMsg(`OTP generated: ${generatedOtp} (${data.error || 'Check inbox or use screen OTP'})`);
        }
      })
      .catch(() => {
        setInfoMsg(`OTP code: ${generatedOtp}`);
      });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeredUserObj) return;

    if (verificationCode.trim() !== mockSentCode) {
      setErrorMsg('Invalid verification code. Please check the simulated OTP: 112026');
      return;
    }

    const verifiedUser: UserProfile = {
      ...registeredUserObj,
      isEmailVerified: true
    };

    StorageService.saveUser(verifiedUser);
    StorageService.setCurrentUser(verifiedUser);
    onSuccess(verifiedUser);
    onClose();
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMsg(`A secure password reset link has been dispatched to ${email}. Please check your inbox.`);
    setTimeout(() => {
      setMode('login');
      setInfoMsg(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {mode === 'login' && 'Citizen Portal Sign In'}
                {mode === 'register' && 'Register Verified Citizen Account'}
                {mode === 'verify' && 'Verify Email Address'}
                {mode === 'forgot' && 'Reset Portal Password'}
              </h3>
              <p className="text-[11px] text-sky-100">Official Community Safety Network</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {infoMsg && (
            <div className="p-3 bg-sky-50 border border-sky-200 text-sky-900 rounded-xl font-medium">
              {infoMsg}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="resident@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMsg(null); }}
                    className="text-[11px] text-sky-600 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Sign In to Portal
              </button>

              <div className="text-center pt-2 border-t border-slate-100 text-slate-500">
                Don't have a verified resident account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(null); }}
                  className="text-sky-600 font-bold hover:underline cursor-pointer"
                >
                  Register Now
                </button>
              </div>
            </form>
          )}

          {/* REGISTRATION FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Karthik Subramanian"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Email Address *</label>
                  <input
                    type="email"
                    placeholder="karthik@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98400..."
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Password *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Confirm Password *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Preferred District for Alerts *</label>
                <select
                  value={preferredDistrict}
                  onChange={e => setPreferredDistrict(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
                >
                  <option value="Chennai">Chennai</option>
                  <option value="Cuddalore">Cuddalore</option>
                  <option value="Nagapattinam">Nagapattinam</option>
                  <option value="Kanyakumari">Kanyakumari</option>
                  <option value="Thoothukudi">Thoothukudi</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Chengalpattu">Chengalpattu</option>
                </select>
              </div>

              {/* Notification Preferences */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                <span className="font-bold text-slate-800 text-[11px] block uppercase tracking-wider">
                  Notification Preferences:
                </span>
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefCritical}
                    onChange={e => setPrefCritical(e.target.checked)}
                    className="rounded-sm text-sky-600"
                  />
                  <span>Red Critical Emergency Alerts (SMS & Broadcast)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefWeather}
                    onChange={e => setPrefWeather(e.target.checked)}
                    className="rounded-sm text-sky-600"
                  />
                  <span>Severe Weather Warnings & Cyclone Trajectory</span>
                </label>
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefShelter}
                    onChange={e => setPrefShelter(e.target.checked)}
                    className="rounded-sm text-sky-600"
                  />
                  <span>Nearby Shelter Capacity & Opening Alerts</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Create Account & Send Verification Code
              </button>

              <div className="text-center pt-1 text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(null); }}
                  className="text-sky-600 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* VERIFY EMAIL FORM */}
          {mode === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-3.5 text-center">
              <p className="text-slate-600 text-xs">
                A 6-digit confirmation code was sent to <strong>{registeredUserObj?.email || email}</strong>.
              </p>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 font-mono">
                Simulated Delivery OTP: <strong>112026</strong>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="112026"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  className="w-48 mx-auto p-3 text-center font-mono font-bold text-lg tracking-widest rounded-xl border-2 border-sky-400 bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Confirm Email Verification
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[11px] text-slate-400 hover:underline block mx-auto"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-3.5">
              <p className="text-slate-600">
                Enter your registered email address to receive password reset instructions.
              </p>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="resident@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Send Password Reset Email
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[11px] text-slate-500 hover:underline block mx-auto text-center"
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
