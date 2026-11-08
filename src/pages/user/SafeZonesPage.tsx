import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Navigation, 
  ShieldCheck, 
  Search, 
  SlidersHorizontal, 
  Users, 
  Accessibility, 
  ExternalLink,
  Flame,
  Shield,
  Cross,
  Compass
} from 'lucide-react';
import { Facility, FacilityType } from '../../types';
import { StorageService } from '../../services/storage';
import { Language, translations } from '../../services/i18n';

interface SafeZonesPageProps {
  language: Language;
}

const TYPE_CONFIG: Record<FacilityType, { bg: string; text: string; label: string }> = {
  safe_zone: { bg: 'bg-emerald-500', text: 'text-emerald-700', label: 'Safe Zone' },
  emergency_shelter: { bg: 'bg-sky-500', text: 'text-sky-700', label: 'Relief Shelter' },
  hospital: { bg: 'bg-rose-500', text: 'text-rose-700', label: 'Trauma Hospital' },
  fire_station: { bg: 'bg-amber-500', text: 'text-amber-700', label: 'Fire & Rescue' },
  police_station: { bg: 'bg-indigo-500', text: 'text-indigo-700', label: 'Police Post' },
  evacuation_center: { bg: 'bg-purple-500', text: 'text-purple-700', label: 'Evacuation Center' }
};

export const SafeZonesPage: React.FC<SafeZonesPageProps> = ({ language }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [accessibilityOnly, setAccessibilityOnly] = useState(false);

  const t = translations[language];

  const loadData = () => {
    setFacilities(StorageService.getFacilities());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('morai_storage_updated', loadData);
    return () => window.removeEventListener('morai_storage_updated', loadData);
  }, []);

  const filtered = facilities.filter(fac => {
    const matchesDistrict = selectedDistrict === 'all' || fac.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesType = selectedType === 'all' || fac.type === selectedType;
    const matchesSearch = 
      fac.name.toLowerCase().includes(search.toLowerCase()) ||
      (fac.nameTamil && fac.nameTamil.includes(search)) ||
      fac.address.toLowerCase().includes(search.toLowerCase()) ||
      fac.district.toLowerCase().includes(search.toLowerCase());
    const matchesAccess = !accessibilityOnly || (fac.accessibility && fac.accessibility.length > 0);
    return matchesDistrict && matchesType && matchesSearch && matchesAccess;
  });

  const districts = Array.from(new Set(facilities.map(f => f.district)));

  return (
    <div className="space-y-6">
      {/* Title & Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>VERIFIED REFUGE & RELIEF HUBS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-600" />
              <span>{t.safeZones}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified multi-hazard safe shelters, elevated cyclone camps, trauma centers, and medical facilities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/user/maps"
              className="flex items-center gap-2 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Compass className="w-4 h-4" />
              <span>View On Live Map</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-slate-100">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-sky-500 transition"
            >
              <option value="all">{t.allDistricts}</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-sky-500 transition"
            >
              <option value="all">All Types</option>
              <option value="emergency_shelter">Relief Shelters</option>
              <option value="safe_zone">Safe Zones</option>
              <option value="hospital">Hospitals</option>
              <option value="fire_station">Fire Stations</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={accessibilityOnly}
                onChange={e => setAccessibilityOnly(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Wheelchair Access</span>
            </label>
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(fac => {
          const config = TYPE_CONFIG[fac.type] || TYPE_CONFIG.safe_zone;
          const occupancyRate = fac.capacity ? Math.round(((fac.currentOccupancy || 0) / fac.capacity) * 100) : 0;

          return (
            <div
              key={fac.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${config.bg} text-white`}>
                    {config.label}
                  </span>
                  {fac.isVerified && (
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {language === 'ta' && fac.nameTamil ? fac.nameTamil : fac.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{fac.address}</span>
                  </p>
                </div>

                {fac.capacity && (
                  <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1.5 border border-slate-100">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500">Live Shelter Occupancy:</span>
                      <span className="font-bold text-slate-800">
                        {fac.currentOccupancy || 0} / {fac.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          occupancyRate > 85 ? 'bg-rose-500' : occupancyRate > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, occupancyRate)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Amenities */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    FACILITIES ON-SITE:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {fac.facilities.slice(0, 4).map((f, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${fac.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-1.5 text-xs text-sky-600 font-bold hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{fac.phone}</span>
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
