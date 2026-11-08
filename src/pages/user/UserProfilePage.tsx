import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Save, 
  Bell, 
  Check, 
  AlertCircle,
  LogIn
} from 'lucide-react';
import { UserProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { Language, translations } from '../../services/i18n';

interface UserProfilePageProps {
  currentUser: UserProfile | null;
  onUpdateUser: (user: UserProfile) => void;
  language: Language;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  currentUser,
  onUpdateUser,
  language
}) => {
  const [fullName, setFullName] = useState(currentUser?.fullName || 'Resident Citizen');
  const [email, setEmail] = useState(currentUser?.email || 'citizen@moraisafe.org');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98400 12345');
  const [preferredDistrict, setPreferredDistrict] = useState(currentUser?.preferredDistrict || 'Chennai');
  const [address, setAddress] = useState(currentUser?.address || 'Mylapore Coastal Area, Chennai');
  const [isSaved, setIsSaved] = useState(false);

  const [notificationPreferences, setNotificationPreferences] = useState({
    criticalAlerts: currentUser?.notificationPreferences?.criticalAlerts ?? true,
    weatherWarnings: currentUser?.notificationPreferences?.weatherWarnings ?? true,
    shelterUpdates: currentUser?.notificationPreferences?.shelterUpdates ?? true,
    emailBroadcasts: currentUser?.notificationPreferences?.emailBroadcasts ?? true,
    browserPush: currentUser?.notificationPreferences?.browserPush ?? true
  });

  const t = translations[language];

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
      setPreferredDistrict(currentUser.preferredDistrict);
      if (currentUser.address) setAddress(currentUser.address);
      if (currentUser.notificationPreferences) {
        setNotificationPreferences(currentUser.notificationPreferences);
      }
    }
  }, [currentUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: UserProfile = {
      id: currentUser ? currentUser.id : `usr-${Date.now()}`,
      fullName,
      email,
      phone,
      preferredDistrict,
      address,
      isEmailVerified: true,
      role: 'user',
      notificationPreferences,
      createdAt: currentUser?.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    StorageService.saveUserProfile(updated);
    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[11px] font-semibold mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
          <span>RESIDENT CITIZEN PROFILE</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <User className="w-6 h-6 text-sky-600" />
          <span>Profile & Emergency Preferences</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Maintain your emergency contact details to receive accurate evacuation and district safety dispatches.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">Profile and emergency contact settings updated successfully.</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {fullName[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{fullName}</h3>
              <p className="text-xs text-slate-400 font-mono">{email}</p>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Identity Verified</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Verified Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Primary Emergency Phone</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Preferred Coastal District</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <select
                value={preferredDistrict}
                onChange={e => setPreferredDistrict(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
              >
                {['Chennai', 'Chengalpattu', 'Cuddalore', 'Nagapattinam', 'Kanyakumari', 'Thiruvarur', 'Puducherry'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Residential Street Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
              placeholder="Door No, Street Name, Landmark"
            />
          </div>
        </div>

        {/* Emergency Alert Preferences */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-sky-600" />
            <span>AUTOMATED ALERT BROADCAST SUBSCRIPTIONS</span>
          </h4>

          <div className="space-y-2 text-xs">
            {[
              { key: 'criticalAlerts', label: 'Critical Life-Safety Alerts', desc: 'Immediate siren and SMS for evacuations, tsunamis, and dam breaches.' },
              { key: 'weatherWarnings', label: 'Severe Weather & Gale Advisories', desc: 'IMD cyclone landfalls, storm surges, and coastal warnings.' },
              { key: 'shelterUpdates', label: 'Shelter Availability & Supply Updates', desc: 'Real-time notifications when nearby relief camps open or reach capacity.' },
              { key: 'emailBroadcasts', label: 'State Operations Center Email Bulletins', desc: 'Full broadcast notices dispatched via Resend official email network.' }
            ].map(item => (
              <label key={item.key} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={notificationPreferences[item.key as keyof typeof notificationPreferences]}
                  onChange={e => setNotificationPreferences(prev => ({
                    ...prev,
                    [item.key]: e.target.checked
                  }))}
                  className="rounded text-sky-600 focus:ring-sky-500 mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-800 block">{item.label}</span>
                  <span className="text-[11px] text-slate-500">{item.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
