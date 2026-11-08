import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CloudRain, 
  Wind, 
  Droplets, 
  ShieldCheck, 
  RefreshCw, 
  Radio, 
  Send, 
  MapPin, 
  Server,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { WeatherService } from '../../services/weatherService';
import { WeatherData } from '../../types';

export const AdminMonitoringPage: React.FC = () => {
  const [districtData, setDistrictData] = useState<Record<string, WeatherData | null>>({});
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const [servicesStatus, setServicesStatus] = useState({
    maps: true,
    email: true,
    weather: true,
    telegram: false
  });

  const districts = ['Chennai', 'Cuddalore', 'Nagapattinam', 'Kanyakumari', 'Chengalpattu'];

  const fetchAllTelemetry = async () => {
    setLoading(true);
    const results: Record<string, WeatherData | null> = {};
    for (const d of districts) {
      results[d] = await WeatherService.fetchLiveWeather(d);
    }
    setDistrictData(results);
    setLastRefreshed(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => {
    fetchAllTelemetry();

    // Check email API health
    fetch('/api/email/status')
      .then(r => r.json())
      .then(d => {
        setServicesStatus(prev => ({ ...prev, email: Boolean(d.configured) }));
      })
      .catch(() => {});

    // Check telegram
    fetch('/api/telegram/status')
      .then(r => r.json())
      .then(d => {
        setServicesStatus(prev => ({ ...prev, telegram: Boolean(d.configured) }));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>STATE CRISIS SURVEILLANCE & SENSOR TELEMETRY</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-600" />
              <span>Multi-Sector Monitoring & Sensor Array</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Live meteorological sensors, automated storm surge alerts, and emergency dispatch integration status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAllTelemetry}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Polling Sensors...' : 'Poll Satellite Sensors'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Services Health Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">GOOGLE MAPS PLATFORM</span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5">Advanced Markers</span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
            OPERATIONAL
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">RESEND EMAIL API</span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5">Civil Broadcasts</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            servicesStatus.email ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {servicesStatus.email ? 'CONNECTED' : 'STANDBY'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">OPEN-METEO RADAR</span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5">Coastal Telemetry</span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
            ONLINE
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">TELEGRAM EMERGENCY BOT</span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5">Urgent Dispatch</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            servicesStatus.telegram ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
          }`}>
            {servicesStatus.telegram ? 'CONNECTED' : 'OPTIONAL'}
          </span>
        </div>
      </div>

      {/* Multi-District Coastal Sensors Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-sky-600" />
          <span>Coastal Sector Atmospheric Telemetry (Bay of Bengal / Indian Ocean)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {districts.map(d => {
            const data = districtData[d];
            return (
              <div
                key={d}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{d} Sector</h3>
                  {data && (
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      data.warningLevel === 'red' ? 'bg-rose-500 text-white' :
                      data.warningLevel === 'orange' ? 'bg-amber-500 text-white' :
                      data.warningLevel === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {data.warningLevel || 'Normal'} Watch
                    </span>
                  )}
                </div>

                {data ? (
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-2xl font-black text-slate-900">{data.temperature}°C</span>
                        <p className="text-xs text-sky-700 font-semibold">{data.condition}</p>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <div>Precip: <strong className="text-slate-800">{data.rainfall} mm</strong></div>
                        <div>Wind: <strong className="text-slate-800">{data.windSpeed} km/h</strong></div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {data.warning || 'Normal atmospheric pressure, safe coastal sea conditions.'}
                    </p>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">Loading satellite data...</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
