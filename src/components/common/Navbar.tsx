import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  FileText, 
  CheckSquare, 
  HelpCircle, 
  AlertTriangle, 
  PhoneCall, 
  User, 
  LogOut, 
  Globe, 
  Menu, 
  X,
  Compass,
  Radio,
  Building2,
  FileCheck2
} from 'lucide-react';
import { translations, Language } from '../../services/i18n';
import { UserProfile, AdminProfile } from '../../types';

interface NavbarProps {
  currentPortal: 'user' | 'admin';
  onSwitchPortal: (portal: 'user' | 'admin') => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  language: Language;
  onToggleLanguage: () => void;
  currentUser: UserProfile | null;
  currentAdmin: AdminProfile | null;
  onOpenAuth: () => void;
  onOpenSOS: () => void;
  onLogoutUser: () => void;
  onLogoutAdmin: () => void;
  criticalAlertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPortal,
  onSwitchPortal,
  currentPage,
  onNavigate,
  language,
  onToggleLanguage,
  currentUser,
  currentAdmin,
  onOpenAuth,
  onOpenSOS,
  onLogoutUser,
  onLogoutAdmin,
  criticalAlertCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const userNavItems = [
    { id: 'dashboard', label: t.dashboard, icon: Compass },
    { id: 'map', label: t.liveMap, icon: MapPin },
    { id: 'shelters', label: t.shelters, icon: Building2 },
    { id: 'alerts', label: t.emergencyAlerts, icon: AlertTriangle, badge: criticalAlertCount },
    { id: 'resources', label: t.resources, icon: FileText },
    { id: 'checklist', label: t.checklist, icon: CheckSquare },
    { id: 'quiz', label: t.quiz, icon: HelpCircle },
    { id: 'report', label: t.reportIncident, icon: Radio },
    { id: 'risk', label: t.disasterRisk, icon: FileCheck2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Emergency Ticker */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 font-mono flex items-center justify-between overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>NATIONAL TOLL-FREE HELPLINES:</span>
          </div>
          <span className="text-slate-300">
            Emergency <strong className="text-white hover:underline cursor-pointer">112</strong>
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300">
            Fire & Rescue <strong className="text-white">101</strong>
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300">
            Ambulance <strong className="text-white">108</strong>
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300">
            State Disaster Control <strong className="text-white">1070</strong>
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300">
            District Disaster Cell <strong className="text-white">1077</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <button 
            onClick={onToggleLanguage}
            className="flex items-center gap-1 text-sky-300 hover:text-white transition-colors cursor-pointer text-xs"
            title="Switch Language (English / தமிழ்)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-sans font-medium">{t.languageToggle}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('dashboard')} 
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-slate-900 font-sans">MORAI SAFE</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-sky-100 text-sky-800">
                    {currentPortal === 'admin' ? 'COMMAND CENTER' : 'COMMUNITY'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block leading-tight">
                  Disaster Management & Emergency Alert System
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation for User Portal */}
          {currentPortal === 'user' && (
            <nav className="hidden lg:flex items-center gap-1">
              {userNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer relative ${
                      isActive 
                        ? 'bg-sky-50 text-sky-700 font-semibold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-500 group-hover:text-sky-600" />
                    <span>{item.label}</span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-bold rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Action Buttons: SOS, Portal Switcher, User Profile */}
          <div className="flex items-center gap-2.5">
            {/* SOS Button */}
            <button
              onClick={onOpenSOS}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-500/25 active:scale-95 transition cursor-pointer animate-pulse"
              title="Instant Emergency SOS Dispatch"
            >
              <PhoneCall className="w-4 h-4" />
              <span className="tracking-wide">{t.sosButton}</span>
            </button>

            {/* Portal Switch Button */}
            <button
              onClick={() => onSwitchPortal(currentPortal === 'user' ? 'admin' : 'user')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                currentPortal === 'admin'
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
              <span>{currentPortal === 'admin' ? '← Citizen Portal' : 'Admin Command →'}</span>
            </button>

            {/* User / Admin Authentication State */}
            {currentPortal === 'user' ? (
              currentUser ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="hidden md:block text-right">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.fullName}</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Verified Resident ({currentUser.preferredDistrict})</p>
                  </div>
                  <button
                    onClick={onLogoutUser}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title={t.logout}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-lg shadow-xs transition cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t.login}</span>
                </button>
              )
            ) : (
              currentAdmin ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="hidden md:block text-right">
                    <p className="text-xs font-semibold text-indigo-900 leading-tight">{currentAdmin.fullName}</p>
                    <p className="text-[10px] text-indigo-600">{currentAdmin.designation}</p>
                  </div>
                  <button
                    onClick={onLogoutAdmin}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Sign Out Admin"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : null
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-150">
          <div className="p-2 bg-sky-50 rounded-lg mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-sky-900">Current Portal Mode:</span>
            <button
              onClick={() => {
                onSwitchPortal(currentPortal === 'user' ? 'admin' : 'user');
                setMobileMenuOpen(false);
              }}
              className="px-2.5 py-1 text-xs font-bold rounded-md bg-white text-indigo-700 border border-indigo-200 shadow-xs"
            >
              Switch to {currentPortal === 'user' ? 'Admin Portal' : 'User Portal'}
            </button>
          </div>

          {currentPortal === 'user' && (
            <div className="grid grid-cols-2 gap-1.5">
              {userNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 text-xs font-medium rounded-lg text-left transition ${
                      isActive 
                        ? 'bg-sky-500 text-white font-semibold' 
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
