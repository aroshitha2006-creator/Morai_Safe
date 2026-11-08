import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  MapPin, 
  Mail, 
  Bell, 
  ShieldCheck, 
  CheckCircle2, 
  Radio, 
  Compass,
  AlertTriangle
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { DistrictSubscription } from '../../types';
import { Language, translations } from '../../services/i18n';

interface LocationSubscriptionsPageProps {
  language: Language;
}

const DISTRICT_ROSTER = [
  { id: 'Chennai', name: 'Chennai Coastal Sector', state: 'Tamil Nadu', hazardRisk: 'High Flood & Storm Surge' },
  { id: 'Cuddalore', name: 'Cuddalore District Coast', state: 'Tamil Nadu', hazardRisk: 'Severe Cyclone Landfall Zone' },
  { id: 'Nagapattinam', name: 'Nagapattinam Delta Coast', state: 'Tamil Nadu', hazardRisk: 'Coastal Storm Surge & Tsunami Watch' },
  { id: 'Kanyakumari', name: 'Kanyakumari Southern Tip', state: 'Tamil Nadu', hazardRisk: 'Gale Wind & High Wave Hazards' },
  { id: 'Chengalpattu', name: 'Chengalpattu Coastal Belt', state: 'Tamil Nadu', hazardRisk: 'Inundation & Estuary Overflow' },
  { id: 'Thiruvarur', name: 'Thiruvarur Delta Basin', state: 'Tamil Nadu', hazardRisk: 'Agricultural Flood Inundation' },
  { id: 'Puducherry', name: 'Puducherry Coastal Union Territory', state: 'Puducherry', hazardRisk: 'Tropical Storm & Sea Wall Risk' }
];

export const LocationSubscriptionsPage: React.FC<LocationSubscriptionsPageProps> = ({ language }) => {
  const [subscriptions, setSubscriptions] = useState<DistrictSubscription[]>([]);
  const t = translations[language];

  const loadData = () => {
    setSubscriptions(StorageService.getSubscriptions());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('morai_storage_updated', loadData);
    return () => window.removeEventListener('morai_storage_updated', loadData);
  }, []);

  const handleToggle = (district: string, type: 'email' | 'push') => {
    StorageService.toggleDistrictSubscription(district, type);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[11px] font-semibold mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
            <span>CUSTOM DISASTER MONITORING RADAR</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-sky-600" />
            <span>District Alert Subscriptions</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Subscribe to specific coastal districts to receive automated emergency warning emails via Resend and push notifications.
          </p>
        </div>
      </div>

      {/* District Subscription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DISTRICT_ROSTER.map(dist => {
          const sub = subscriptions.find(s => s.district.toLowerCase() === dist.id.toLowerCase());
          const hasEmail = Boolean(sub?.emailAlerts);
          const hasPush = Boolean(sub?.pushAlerts);

          return (
            <div
              key={dist.id}
              className={`p-5 rounded-3xl border transition space-y-4 flex flex-col justify-between ${
                hasEmail || hasPush
                  ? 'bg-white border-sky-300 shadow-xs'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {dist.state}
                  </span>
                  {(hasEmail || hasPush) && (
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Subscribed</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{dist.name}</h3>
                  <p className="text-[11px] text-amber-700 font-medium flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{dist.hazardRisk}</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                {/* Email toggle */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="flex items-center gap-2 text-slate-700 font-medium">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Resend Email Alerts</span>
                  </span>
                  <button
                    onClick={() => handleToggle(dist.id, 'email')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      hasEmail
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {hasEmail ? 'Active' : 'Enable'}
                  </button>
                </div>

                {/* Push toggle */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="flex items-center gap-2 text-slate-700 font-medium">
                    <Bell className="w-3.5 h-3.5 text-slate-400" />
                    <span>Browser Push Alerts</span>
                  </span>
                  <button
                    onClick={() => handleToggle(dist.id, 'push')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      hasPush
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {hasPush ? 'Active' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
