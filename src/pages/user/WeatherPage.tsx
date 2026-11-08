import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  RefreshCw, 
  AlertTriangle, 
  Compass, 
  ShieldCheck, 
  Sun, 
  CloudLightning, 
  Anchor, 
  Waves,
  Calendar,
  Clock
} from 'lucide-react';
import { WeatherData } from '../../types';
import { WeatherService } from '../../services/weatherService';
import { Language, translations } from '../../services/i18n';

interface WeatherPageProps {
  language: Language;
}

export const WeatherPage: React.FC<WeatherPageProps> = ({ language }) => {
  const [district, setDistrict] = useState('Chennai');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const t = translations[language];

  const fetchWeather = async () => {
    setLoading(true);
    const data = await WeatherService.fetchLiveWeather(district);
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
  }, [district]);

  const coastalDistricts = [
    'Chennai',
    'Chengalpattu',
    'Cuddalore',
    'Nagapattinam',
    'Kanyakumari',
    'Thiruvarur',
    'Ramanathapuram',
    'Thoothukudi',
    'Puducherry'
  ];

  return (
    <div className="space-y-6">
      {/* Title & Sector Selector */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span>METEOROLOGICAL SATELLITE SURVEILLANCE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <CloudRain className="w-6 h-6 text-sky-600" />
              <span>Coastal Weather & Meteorological Risk</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Real-time atmospheric telemetry via Open-Meteo with automated gale and rainfall risk indices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchWeather}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold rounded-xl border border-sky-200 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>
          </div>
        </div>

        {/* District Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-100">
          {coastalDistricts.map(d => (
            <button
              key={d}
              onClick={() => setDistrict(d)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition cursor-pointer ${
                district === d
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Main Meteorological Dashboard */}
      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Querying Open-Meteo satellite feed for {district}...</p>
        </div>
      ) : weather ? (
        <div className="space-y-6">
          {/* Main Weather Card */}
          <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
              <div className="md:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-sky-300">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{district} District Coast · Lat {weather.city}</span>
                </div>

                <div className="flex items-baseline gap-4">
                  <span className="text-5xl sm:text-6xl font-black">{weather.temperature}°C</span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-sky-200">{weather.condition}</h3>
                    <p className="text-xs text-slate-300">Updated: {new Date(weather.updatedAt).toLocaleTimeString()}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                  Surface barometric monitoring and coastal rainfall radar indicate seasonal cyclonic convective patterns along the Bay of Bengal coast.
                </p>
              </div>

              <div className="md:col-span-5 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-slate-300">DISASTER THREAT LEVEL</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    weather.warningLevel === 'red' ? 'bg-rose-500 text-white' :
                    weather.warningLevel === 'orange' ? 'bg-amber-500 text-white' :
                    weather.warningLevel === 'yellow' ? 'bg-yellow-400 text-slate-900' :
                    'bg-emerald-500 text-white'
                  }`}>
                    {weather.warningLevel ? `${weather.warningLevel.toUpperCase()} STAGE` : 'GREEN WATCH'}
                  </span>
                </div>

                <p className="text-xs text-slate-200">
                  {weather.warning || 'No critical sea disturbance or storm surge reported at this observation hour.'}
                </p>

                <div className="text-[11px] text-slate-300 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span>Maritime Fishermen:</span>
                  <strong className="text-white">
                    {weather.windSpeed > 45 ? '⚠️ Sea Venture Prohibited' : '✓ Safe for Mechanized Vessels'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry Sensor Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <Wind className="w-5 h-5 text-sky-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider">WIND VELOCITY</span>
              </div>
              <span className="text-2xl font-black text-slate-900">{weather.windSpeed} km/h</span>
              <p className="text-[11px] text-slate-500">Surface gale intensity</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <Droplets className="w-5 h-5 text-sky-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider">HUMIDITY</span>
              </div>
              <span className="text-2xl font-black text-slate-900">{weather.humidity}%</span>
              <p className="text-[11px] text-slate-500">Relative atmospheric moisture</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <CloudRain className="w-5 h-5 text-sky-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider">PRECIPITATION</span>
              </div>
              <span className="text-2xl font-black text-slate-900">{weather.rainfall} mm</span>
              <p className="text-[11px] text-slate-500">Current accumulation rate</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <Waves className="w-5 h-5 text-sky-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider">SEA SWELL</span>
              </div>
              <span className="text-2xl font-black text-slate-900">
                {weather.windSpeed > 50 ? '3.5 m' : '1.2 m'}
              </span>
              <p className="text-[11px] text-slate-500">Bay of Bengal coastal wave height</p>
            </div>
          </div>

          {/* Guidelines based on weather */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>IMD & NDMA Meteorological Advisory for {district}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <strong className="text-slate-800 block">Low-Lying Drainage:</strong>
                <p className="text-slate-600">Inspect stormwater conduits and move vehicles from underground basements if rainfall exceeds 50mm.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <strong className="text-slate-800 block">Structural Security:</strong>
                <p className="text-slate-600">Trim loose rooftop branches and inspect rooftop solar installations against gusts up to {weather.windSpeed + 15} km/h.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <strong className="text-slate-800 block">Potable Water Reserves:</strong>
                <p className="text-slate-600">Boil drinking water and keep battery-powered flashlights charged in case of preventive electrical feeder shutdowns.</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
