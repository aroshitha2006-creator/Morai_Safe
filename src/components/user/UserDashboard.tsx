import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  ShieldCheck, 
  MapPin, 
  CheckSquare, 
  ArrowRight, 
  Navigation, 
  Phone, 
  AlertOctagon, 
  Radio, 
  FileText, 
  CheckCircle2, 
  RefreshCw,
  BellRing
} from 'lucide-react';
import { EmergencyAlert, Facility, WeatherData, UserProfile, IncidentReport } from '../../types';
import { StorageService } from '../../services/storage';
import { WeatherService } from '../../services/weatherService';
import { Language, translations } from '../../services/i18n';

interface UserDashboardProps {
  currentUser: UserProfile | null;
  language: Language;
  onNavigate: (page: string) => void;
  onOpenSOS: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  language,
  onNavigate,
  onOpenSOS
}) => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [checklistProgress, setChecklistProgress] = useState({ total: 10, completed: 4 });
  const [acknowledgedAlertIds, setAcknowledgedAlertIds] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState(currentUser?.preferredDistrict || 'Chennai');

  const t = translations[language];

  const loadData = () => {
    const allAlerts = StorageService.getAlerts().filter(a => a.status === 'active');
    setAlerts(allAlerts);
    setFacilities(StorageService.getFacilities());
    setIncidents(StorageService.getIncidents().filter(i => i.status === 'approved'));

    const checklist = StorageService.getChecklist();
    const completed = checklist.filter(c => c.checked).length;
    setChecklistProgress({ total: checklist.length, completed });

    if (currentUser) {
      const acks = StorageService.getAcknowledgements()
        .filter(a => a.userId === currentUser.id)
        .map(a => a.alertId);
      setAcknowledgedAlertIds(acks);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('morai_storage_updated', handleUpdate);
    return () => window.removeEventListener('morai_storage_updated', handleUpdate);
  }, [currentUser]);

  // Load real meteorological data from Open-Meteo
  const fetchWeather = async () => {
    setWeatherLoading(true);
    const data = await WeatherService.fetchLiveWeather(selectedDistrict);
    setWeather(data);
    setWeatherLoading(false);
  };

  useEffect(() => {
    fetchWeather();
  }, [selectedDistrict]);

  const handleAcknowledge = (alertId: string) => {
    if (!currentUser) {
      alert('Please sign in to acknowledge alerts and register your safe status with disaster authorities.');
      return;
    }
    StorageService.acknowledgeAlert(alertId, currentUser);
    setAcknowledgedAlertIds(prev => [...prev, alertId]);
  };

  const activeCriticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
  const nearbyShelters = facilities.filter(f => f.type === 'emergency_shelter' || f.type === 'safe_zone').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-sky-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>COMMUNITY RELIEF NETWORK ACTIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'ta' 
              ? `வணக்கம், ${currentUser?.fullName || 'பொதுமக்கள்'}!` 
              : `Welcome to Morai Safe, ${currentUser?.fullName || 'Resident'}!`}
          </h1>
          <p className="text-sm text-sky-100 leading-relaxed">
            {language === 'ta'
              ? 'உங்கள் பகுதிக்குரிய பேரிடர் எச்சரிக்கைகள், அங்கீகரிக்கப்பட்ட நிவாரண முகாம்கள் மற்றும் அவசர பாதுகாப்பு வழிகாட்டல்கள் தயார்நிலையில் உள்ளன.'
              : 'Real-time multi-hazard warnings, verified cyclone relief shelters, and live meteorological telemetry for your community.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigate('map')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-sky-900 font-bold text-xs rounded-xl shadow-md hover:bg-sky-50 transition cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>{t.liveMap}</span>
            </button>
            <button
              onClick={onOpenSOS}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer animate-pulse"
            >
              <Phone className="w-4 h-4" />
              <span>{t.sosButton}</span>
            </button>
            <button
              onClick={() => onNavigate('resources')}
              className="flex items-center gap-2 px-4 py-2 bg-sky-800/60 hover:bg-sky-800 text-white font-medium text-xs rounded-xl border border-white/20 transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-sky-200" />
              <span>{t.resources} (12 PDFs)</span>
            </button>
          </div>
        </div>

        {/* Decorative graphic elements */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
          <AlertOctagon className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Critical Alerts Banner (If active) */}
      {activeCriticalAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                {t.currentAlerts} ({activeCriticalAlerts.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCriticalAlerts.map(alert => {
              const isAcknowledged = acknowledgedAlertIds.includes(alert.id);
              return (
                <div
                  key={alert.id}
                  className="bg-white p-5 rounded-2xl border-2 border-red-300 shadow-sm relative overflow-hidden space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
                          {alert.severity}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {alert.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {language === 'ta' && alert.titleTamil ? alert.titleTamil : alert.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {language === 'ta' && alert.descriptionTamil ? alert.descriptionTamil : alert.description}
                  </p>

                  <div className="p-2.5 bg-red-50/70 rounded-xl border border-red-100 text-xs text-red-900 space-y-1">
                    <p className="font-semibold text-[11px] uppercase tracking-wider text-red-800">
                      Affected Territory:
                    </p>
                    <p className="font-medium">{alert.affectedArea}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {alert.acknowledgedCount || 0} residents confirmed safety receipt
                    </span>

                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      disabled={isAcknowledged}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isAcknowledged
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                      }`}
                    >
                      {isAcknowledged ? <CheckCircle2 className="w-3.5 h-3.5" /> : <BellRing className="w-3.5 h-3.5" />}
                      <span>{isAcknowledged ? t.acknowledged : t.acknowledgeAlert}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Weather Telemetry + Preparedness Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real Live Weather Telemetry */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                <CloudRain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t.weatherConditions}</h3>
                <p className="text-[11px] text-slate-500">Live Observations & Automated Cyclone Warnings</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700"
              >
                <option value="Chennai">Chennai</option>
                <option value="Cuddalore">Cuddalore</option>
                <option value="Nagapattinam">Nagapattinam</option>
                <option value="Kanyakumari">Kanyakumari</option>
                <option value="Thoothukudi">Thoothukudi</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Madurai">Madurai</option>
                <option value="Mumbai">Mumbai</option>
              </select>

              <button
                onClick={fetchWeather}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                title="Refresh Weather"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${weatherLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {weather ? (
            <div className="space-y-3">
              {/* Main Weather Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
                    {weather.temperature}°C
                  </span>
                  <p className="text-xs font-semibold text-slate-700 mt-1">{weather.condition}</p>
                  <p className="text-[11px] text-slate-400">
                    Location: {weather.city} · Updated {weather.updatedAt}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <Droplets className="w-4 h-4 text-sky-500 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-400 block">HUMIDITY</span>
                    <span className="text-xs font-bold text-slate-800">{weather.humidity}%</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <Wind className="w-4 h-4 text-teal-500 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-400 block">WIND</span>
                    <span className="text-xs font-bold text-slate-800">{weather.windSpeed} km/h</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <CloudRain className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-400 block">PRECIP</span>
                    <span className="text-xs font-bold text-slate-800">{weather.rainfall} mm</span>
                  </div>
                </div>
              </div>

              {/* Weather Disaster Warning Box */}
              {weather.warning ? (
                <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  weather.warningLevel === 'red' 
                    ? 'bg-red-50 border-red-200 text-red-900' 
                    : weather.warningLevel === 'orange'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-yellow-50 border-yellow-200 text-yellow-900'
                }`}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[10px] block">
                      METEOROLOGICAL WARNING:
                    </span>
                    <span>{weather.warning}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No severe storm gusts or extreme precipitation currently detected in this sector.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-xs text-slate-400">
              Loading real-time weather observations...
            </div>
          )}
        </div>

        {/* Emergency Preparedness Checklist Widget */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t.checklist}</h3>
                  <p className="text-[11px] text-slate-500">72-Hour Survival Kit Readiness</p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {Math.round((checklistProgress.completed / checklistProgress.total) * 100)}% Ready
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(checklistProgress.completed / checklistProgress.total) * 100}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 mb-3">
              {checklistProgress.completed} of {checklistProgress.total} emergency provisions packed. Make sure your drinking water (12L) and prescription medicine pouch are prepared.
            </p>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="text-slate-700 font-medium">Drinking water storage (3L/day per person)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="text-slate-700 font-medium">High capacity charged power bank</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                <span className="text-amber-500 font-bold">○</span>
                <span className="text-slate-500">Waterproof pouch for Aadhaar & land deeds (Pending)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('checklist')}
            className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>Review Full Preparedness Checklist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Nearby Shelters & Safe Zones Quick Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">{t.nearbyShelters}</h3>
            <p className="text-xs text-slate-500">Officially verified government cyclone & flood shelters</p>
          </div>
          <button
            onClick={() => onNavigate('shelters')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Shelters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nearbyShelters.map(shelter => (
            <div
              key={shelter.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                    {shelter.type.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {language === 'ta' && shelter.nameTamil ? shelter.nameTamil : shelter.name}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{shelter.address}</p>

                <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <a href={`tel:${shelter.phone}`} className="hover:underline font-medium">
                    {shelter.phone}
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Capacity: {shelter.currentOccupancy || 0} / {shelter.capacity || 'Open'}
                </span>
                <a
                  href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=;${shelter.lat}%2C${shelter.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
                  title="Turn-by-turn directions via OpenStreetMap"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Directions (OSM)</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Incident Feed (Approved Citizen Reports) */}
      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Verified Citizen Field Reports ({incidents.length})</h3>
          </div>
          <button
            onClick={() => onNavigate('report')}
            className="text-xs font-semibold text-sky-700 hover:underline cursor-pointer"
          >
            + Report New Incident
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {incidents.slice(0, 2).map(inc => (
            <div key={inc.id} className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{inc.title}</span>
                <span className="text-[10px] text-slate-400">{inc.district}</span>
              </div>
              <p className="text-slate-600 text-[11px] line-clamp-2">{inc.description}</p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span>Reported by {inc.userName}</span>
                <span className="text-emerald-700 font-semibold">✓ Moderated by Disaster Cell</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
