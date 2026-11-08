import React, { useState, useEffect } from 'react';
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
  Cross
} from 'lucide-react';
import { Facility, FacilityType } from '../../types';
import { StorageService } from '../../services/storage';
import { Language, translations } from '../../services/i18n';

interface SafeZonesPageProps {
  language: Language;
}

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
      {/* Title & Stats */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-600" />
            <span>Safe Zones & Emergency Shelters Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified official evacuation centers, disaster relief camps, and elevated emergency hubs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold">
            {facilities.filter(f => f.isVerified).length} Officially Verified
          </div>
          <div className="px-3.5 py-1.5 bg-sky-50 text-sky-800 rounded-xl border border-sky-200 text-xs font-semibold">
            {facilities.length} Total Registered Facilities
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by facility name, address or district..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
            >
              <option value="all">All Districts</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
            >
              <option value="all">All Facility Types</option>
              <option value="safe_zone">Safe Zones</option>
              <option value="emergency_shelter">Relief Shelters</option>
              <option value="hospital">Hospitals</option>
              <option value="fire_station">Fire & Rescue</option>
              <option value="police_station">Police Posts</option>
              <option value="evacuation_center">Evacuation Centers</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={accessibilityOnly}
                onChange={e => setAccessibilityOnly(e.target.checked)}
                className="rounded-sm text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <span>Wheelchair Accessible</span>
            </label>
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(facility => (
          <div
            key={facility.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                  {facility.type.replace('_', ' ')}
                </span>

                {facility.isVerified && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Official</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {language === 'ta' && facility.nameTamil ? facility.nameTamil : facility.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{facility.address}</span>
                </p>
              </div>

              {/* Coordinates and Phone */}
              <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1 font-mono text-slate-600 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">COORDINATES:</span>
                  <span className="font-semibold text-slate-800">{facility.lat}° N, {facility.lng}° E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PHONE:</span>
                  <a href={`tel:${facility.phone}`} className="font-semibold text-sky-600 hover:underline">
                    {facility.phone}
                  </a>
                </div>
              </div>

              {/* Capacity Status */}
              {facility.capacity && (
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Occupancy:</span>
                    <span className="text-slate-800 font-bold">
                      {facility.currentOccupancy || 0} / {facility.capacity} Persons
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        (facility.currentOccupancy || 0) >= facility.capacity * 0.9 
                          ? 'bg-red-500' 
                          : 'bg-emerald-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, Math.round(((facility.currentOccupancy || 0) / facility.capacity) * 100))}%` 
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Amenities */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AVAILABLE AMENITIES</span>
                <div className="flex flex-wrap gap-1">
                  {facility.facilities.map((f, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Accessibility */}
              {facility.accessibility && facility.accessibility.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ACCESSIBILITY</span>
                  <div className="flex flex-wrap gap-1">
                    {facility.accessibility.map((a, i) => (
                      <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100 flex items-center gap-1">
                        <Accessibility className="w-3 h-3" />
                        <span>{a}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* OpenStreetMap Directions Action */}
            <div className="pt-3 border-t border-slate-100">
              <a
                href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=;${facility.lat}%2C${facility.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions (OpenStreetMap)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-800">No facilities match your search criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the district or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
