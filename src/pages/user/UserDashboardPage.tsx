import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Radio, 
  FileText, 
  CheckCircle2, 
  RefreshCw,
  BellRing,
  LifeBuoy,
  Compass,
  AlertOctagon,
  Building2
} from 'lucide-react';
import { EmergencyAlert, Facility, WeatherData, UserProfile, IncidentReport } from '../../types';
import { StorageService } from '../../services/storage';
import { WeatherService } from '../../services/weatherService';
import { Language, translations } from '../../services/i18n';

interface UserDashboardPageProps {
  currentUser: UserProfile | null;
  language: Language;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  currentUser,
  language
}) => {
  const navigate = useNavigate();
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
      navigate('/user/profile');
      return;
    }
    StorageService.acknowledgeAlert(alertId, currentUser);
    setAcknowledgedAlertIds(prev => [...prev, alertId]);
  };

  const activeCriticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
  const nearbyShelters = facilities.filter(f => f.type === 'emergency_shelter' || f.type === 'safe_zone').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome & Situation Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none"></div>

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-[11px] font-semibold text-sky-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CIVIL DEFENSE READINESS: REGIONAL ALERT LEVEL ADVISORY</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentUser 
              ? `${t.welcome}, ${currentUser.fullName}!` 
              : `${t.welcome} to Morai Safe Portal`}
          </h1>

          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-2xl">
            {t.situationSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/user/maps"
              className="flex items-center gap-2 px-4 py-2 bg-white text-sky-900 rounded-xl text-xs font-bold shadow-sm hover:bg-sky-50 transition"
            >
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>Explore Live GIS Map</span>
            </Link>

            <Link
              to="/user/sos"
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              <AlertOctagon className="w-4 h-4 animate-pulse" />
              <span>Emergency SOS</span>
            </Link>

            <Link
              to="/user/report-disaster"
              className="flex items-center gap-2 px-4 py-2 bg-sky-800/80 hover:bg-sky-700 text-sky-100 rounded-xl text-xs font-semibold border border-sky-600/40 transition"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Report Local Hazard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner (If Any) */}
      {activeCriticalAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Immediate Public Safety Advisories ({activeCriticalAlerts.length})</span>
            </h2>
            <Link to="/user/alerts" className="text-xs text-sky-600 font-semibold hover:underline flex items-center gap-1">
              <span>View All Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCriticalAlerts.slice(0, 2).map(alert => {
              const isAcked = acknowledgedAlertIds.includes(alert.id);
              return (
                <div 
                  key={alert.id}
                  className="bg-white rounded-2xl p-5 border-l-4 border-l-rose-500 border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      {alert.severity} · {alert.category.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(alert.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {language === 'ta' && alert.titleTamil ? alert.titleTamil : alert.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {language === 'ta' && alert.descriptionTamil ? alert.descriptionTamil : alert.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Sector: {alert.affectedArea}
                    </span>

                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      disabled={isAcked}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        isAcked
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isAcked ? 'Marked Safe' : 'I am Safe'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3-Column Surveillance Grid: Weather, Shelters, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weather Telemetry Widget */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-sky-600" />
              <h2 className="text-sm font-bold text-slate-900">Live Weather Telemetry</h2>
            </div>
            <button
              onClick={fetchWeather}
              disabled={weatherLoading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Refresh Meteorological Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${weatherLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-1">
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full text-xs font-semibold py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-sky-500"
            >
              {['Chennai', 'Chengalpattu', 'Cuddalore', 'Nagapattinam', 'Kanyakumari', 'Thiruvarur', 'Puducherry'].map(d => (
                <option key={d} value={d}>{d} Coastal Sector</option>
              ))}
            </select>
          </div>

          {weatherLoading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading satellite telemetry...</div>
          ) : weather ? (
            <div className="space-y-3">
              <div className="flex items-baseline justify-between bg-sky-50/70 p-4 rounded-2xl border border-sky-100">
                <div>
                  <span className="text-3xl font-extrabold text-slate-900">{weather.temperature}°C</span>
                  <p className="text-xs font-semibold text-sky-700 mt-0.5">{weather.condition}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    weather.warningLevel === 'red' ? 'bg-rose-500 text-white' :
                    weather.warningLevel === 'orange' ? 'bg-amber-500 text-white' :
                    weather.warningLevel === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {weather.warningLevel === 'none' ? 'Normal Sea' : `${weather.warningLevel?.toUpperCase()} ALERT`}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Open-Meteo Satellite</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <Wind className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <span className="font-bold text-slate-800">{weather.windSpeed} km/h</span>
                  <p className="text-[10px] text-slate-400">Wind Gusts</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <Droplets className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <span className="font-bold text-slate-800">{weather.humidity}%</span>
                  <p className="text-[10px] text-slate-400">Humidity</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <CloudRain className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <span className="font-bold text-slate-800">{weather.rainfall} mm</span>
                  <p className="text-[10px] text-slate-400">Precipitation</p>
                </div>
              </div>

              <Link
                to="/user/weather"
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                <span>Full Coastal Weather Station</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : null}
        </div>

        {/* Nearby Shelters & Safe Zones */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Nearby Safe Zones & Shelters</h2>
            </div>
            <Link to="/user/safe-zones" className="text-xs text-sky-600 font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {nearbyShelters.map(shelter => (
              <div 
                key={shelter.id}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    shelter.type === 'safe_zone' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {shelter.type === 'safe_zone' ? 'Safe Zone' : 'Relief Shelter'}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                    {language === 'ta' && shelter.nameTamil ? shelter.nameTamil : shelter.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{shelter.address}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-500">
                    Occupancy: <strong className="text-slate-800">{shelter.currentOccupancy || 0}/{shelter.capacity || 'N/A'}</strong>
                  </span>
                  <Link
                    to="/user/maps"
                    className="text-sky-600 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>View Map</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/user/evacuation"
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-emerald-600" />
            <span>Evacuation Route Instructions</span>
          </Link>
        </div>

        {/* Readiness Checklist & Helplines */}
        <div className="lg:col-span-3 space-y-4">
          {/* Emergency Kit Checklist Widget */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-sky-600" />
                <span>Emergency Go-Bag</span>
              </h3>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                {checklistProgress.completed} / {checklistProgress.total}
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-sky-600 h-full rounded-full transition-all"
                style={{ width: `${Math.round((checklistProgress.completed / checklistProgress.total) * 100)}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500">
              Ensure basic survival rations, water purification tablets, and sealed family identity documents are pre-packed.
            </p>

            <Link
              to="/user/resources"
              className="w-full flex items-center justify-center gap-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition"
            >
              <span>NDMA Safety SOPs</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Quick Click-to-Call Shortcuts */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-rose-600" />
              <span>National Helplines</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="tel:112"
                className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-center border border-rose-200 transition"
              >
                112 <span className="block text-[9px] font-normal text-rose-600">Unified Help</span>
              </a>
              <a
                href="tel:1070"
                className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-center border border-sky-200 transition"
              >
                1070 <span className="block text-[9px] font-normal text-sky-600">Disaster Cell</span>
              </a>
              <a
                href="tel:101"
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-center border border-amber-200 transition"
              >
                101 <span className="block text-[9px] font-normal text-amber-600">Fire & Rescue</span>
              </a>
              <a
                href="tel:108"
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-center border border-emerald-200 transition"
              >
                108 <span className="block text-[9px] font-normal text-emerald-600">Ambulance</span>
              </a>
            </div>

            <Link
              to="/user/emergency-contacts"
              className="text-[11px] text-sky-600 hover:underline block text-center pt-1 font-semibold"
            >
              Full Directory (Police, Coast Guard, Collectors) →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
