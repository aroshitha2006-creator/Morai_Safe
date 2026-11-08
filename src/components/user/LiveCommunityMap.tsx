import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle, 
  ZoomControl, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Search, 
  MapPin, 
  Phone, 
  Navigation, 
  ShieldCheck, 
  Compass, 
  Building2, 
  Cross, 
  Flame, 
  Shield, 
  AlertTriangle, 
  Radio, 
  ExternalLink,
  Layers,
  RotateCcw,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Facility, FacilityType, EmergencyAlert, IncidentReport } from '../../types';
import { StorageService } from '../../services/storage';
import { Language, translations } from '../../services/i18n';

interface LiveCommunityMapProps {
  language: Language;
  initialFilter?: 'all' | 'safe_zone' | 'emergency_shelter';
}

const FACILITY_CONFIG: Record<FacilityType, { bg: string; text: string; pinHex: string; label: string }> = {
  safe_zone: { bg: 'bg-emerald-500', text: 'text-emerald-700', pinHex: '#10b981', label: 'Safe Zone' },
  emergency_shelter: { bg: 'bg-sky-500', text: 'text-sky-700', pinHex: '#0284c7', label: 'Relief Shelter' },
  hospital: { bg: 'bg-rose-500', text: 'text-rose-700', pinHex: '#e11d48', label: 'Trauma Hospital' },
  fire_station: { bg: 'bg-amber-500', text: 'text-amber-700', pinHex: '#f59e0b', label: 'Fire & Rescue' },
  police_station: { bg: 'bg-indigo-500', text: 'text-indigo-700', pinHex: '#6366f1', label: 'Police Post' },
  evacuation_center: { bg: 'bg-purple-500', text: 'text-purple-700', pinHex: '#a855f7', label: 'Evacuation Center' }
};

// Center of coastal Tamil Nadu / South India overview
const DEFAULT_CENTER: [number, number] = [11.9000, 79.8000];
const DEFAULT_ZOOM = 8;

// Component to programmatically control Leaflet map view
function MapController({ 
  targetCoords, 
  zoomLevel 
}: { 
  targetCoords: [number, number] | null; 
  zoomLevel?: number;
}) {
  const map = useMap();

  useEffect(() => {
    // Invalidate map size so Leaflet fills full responsive container without gray tiles
    map.invalidateSize();
  }, [map]);

  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, zoomLevel || 13, { duration: 1.2 });
    }
  }, [targetCoords, zoomLevel, map]);

  return null;
}

export const LiveCommunityMap: React.FC<LiveCommunityMapProps> = ({ 
  language, 
  initialFilter = 'all' 
}) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [flyZoom, setFlyZoom] = useState<number>(DEFAULT_ZOOM);

  const t = translations[language];

  // Load facilities, alerts and moderated incidents from persistent storage
  const loadData = () => {
    setFacilities(StorageService.getFacilities());
    setAlerts(StorageService.getAlerts().filter(a => a.status === 'active'));
    setIncidents(StorageService.getIncidents().filter(i => i.status === 'approved' && i.lat && i.lng));
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('morai_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('morai_storage_updated', handleStorageUpdate);
  }, []);

  // Request high accuracy browser geolocation
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Locating device via GPS satellites...');

    navigator.geolocation.getCurrentPosition(
      pos => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        const uAcc = Math.round(pos.coords.accuracy);

        setUserLocation({ lat: uLat, lng: uLng, accuracy: uAcc });
        setFlyTarget([uLat, uLng]);
        setFlyZoom(14);
        setIsLocating(false);
        setLocationStatus(`Located within ~${uAcc}m accuracy.`);
        setTimeout(() => setLocationStatus(null), 4000);
      },
      err => {
        console.warn('Geolocation lookup notice:', err);
        // Fallback gracefully to central district coordinates
        const fallbackLat = 13.0827;
        const fallbackLng = 80.2707;
        setUserLocation({ lat: fallbackLat, lng: fallbackLng, accuracy: 25 });
        setFlyTarget([fallbackLat, fallbackLng]);
        setFlyZoom(12);
        setIsLocating(false);
        setLocationStatus('Location permission denied or unavailable. Centered on district HQ.');
        setTimeout(() => setLocationStatus(null), 5000);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleResetMap = () => {
    setFlyTarget(DEFAULT_CENTER);
    setFlyZoom(DEFAULT_ZOOM);
    setSelectedFacility(null);
  };

  // Create custom marker icons
  const createFacilityIcon = (type: FacilityType) => {
    const config = FACILITY_CONFIG[type] || FACILITY_CONFIG.safe_zone;
    return L.divIcon({
      className: 'custom-facility-marker',
      html: `
        <div style="background-color: ${config.pinHex};" class="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white transform hover:scale-125 transition-transform duration-150 cursor-pointer">
          <div class="w-2.5 h-2.5 bg-white rounded-full"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -14]
    });
  };

  // User position pulsing icon
  const userPinIcon = useMemo(() => {
    return L.divIcon({
      className: 'user-location-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 bg-sky-400 rounded-full animate-ping opacity-75"></div>
          <div class="w-4 h-4 bg-sky-600 border-2 border-white rounded-full shadow-lg z-10"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -10]
    });
  }, []);

  // Incident marker icon
  const incidentIcon = useMemo(() => {
    return L.divIcon({
      className: 'incident-marker-pin',
      html: `
        <div class="w-7 h-7 rounded-full bg-amber-500 border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">
          !
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -12]
    });
  }, []);

  // Filter facilities
  const filteredFacilities = useMemo(() => {
    return facilities.filter(fac => {
      const matchesType = activeTypeFilter === 'all' || fac.type === activeTypeFilter;
      const matchesDistrict = selectedDistrict === 'all' || fac.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchesSearch = 
        fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fac.nameTamil && fac.nameTamil.includes(searchQuery)) ||
        fac.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesDistrict && matchesSearch;
    });
  }, [facilities, activeTypeFilter, selectedDistrict, searchQuery]);

  const districts = useMemo(() => {
    return Array.from(new Set(facilities.map(f => f.district)));
  }, [facilities]);

  const handleSelectFacility = (fac: Facility) => {
    setSelectedFacility(fac);
    setFlyTarget([fac.lat, fac.lng]);
    setFlyZoom(14);
  };

  // OpenStreetMap Route Navigation generator
  const getOpenStreetMapRouteUrl = (destLat: number, destLng: number) => {
    if (userLocation) {
      return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation.lat}%2C${userLocation.lng}%3B${destLat}%2C${destLng}`;
    }
    return `https://www.openstreetmap.org/?mlat=${destLat}&mlon=${destLng}#map=16/${destLat}/${destLng}`;
  };

  return (
    <div className="space-y-4">
      {/* Header and Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>OPENSTREETMAP TILE SERVICE (NO API KEY REQUIRED)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-sky-600" />
              <span>{t.liveMap}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Interactive community map displaying verified safe zones, emergency shelters, trauma centers, and live field hazards
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleLocateUser}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold rounded-xl border border-sky-200 transition cursor-pointer"
            >
              <Compass className={`w-4 h-4 text-sky-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Acquiring GPS...' : 'Find My Location'}</span>
            </button>

            <button
              onClick={handleResetMap}
              className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition cursor-pointer"
              title="Reset to Regional Overview"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset View</span>
            </button>

            <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              {filteredFacilities.length} Points
            </span>
          </div>
        </div>

        {locationStatus && (
          <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 flex items-center gap-2 animate-in fade-in">
            <Info className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{locationStatus}</span>
          </div>
        )}

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-slate-100">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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

          <div className="sm:col-span-4 flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'safe_zone', label: 'Safe Zones' },
              { id: 'emergency_shelter', label: 'Shelters' },
              { id: 'hospital', label: 'Hospitals' },
              { id: 'fire_station', label: 'Fire' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTypeFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
                  activeTypeFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Leaflet OpenStreetMap Container */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden relative min-h-[480px] h-[550px]">
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            zoomControl={false}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
          >
            {/* OpenStreetMap Tile Layer - 100% Free, No API Key Required */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | MORAI SAFE'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            <ZoomControl position="bottomright" />

            {/* Programmatic view controller */}
            <MapController targetCoords={flyTarget} zoomLevel={flyZoom} />

            {/* User GPS Location Marker */}
            {userLocation && (
              <>
                <Circle
                  center={[userLocation.lat, userLocation.lng]}
                  radius={userLocation.accuracy || 100}
                  pathOptions={{
                    fillColor: '#0284c7',
                    fillOpacity: 0.15,
                    color: '#0284c7',
                    weight: 1.5
                  }}
                />
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userPinIcon}>
                  <Popup>
                    <div className="text-xs space-y-1">
                      <strong className="text-sky-700 block">Your Current GPS Location</strong>
                      <p className="text-[11px] text-slate-600 font-mono">
                        {userLocation.lat.toFixed(5)}° N, {userLocation.lng.toFixed(5)}° E
                      </p>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        Accuracy: ±{userLocation.accuracy} meters
                      </span>
                    </div>
                  </Popup>
                </Marker>
              </>
            )}

            {/* Emergency Facility Markers */}
            {filteredFacilities.map(fac => (
              <Marker
                key={fac.id}
                position={[fac.lat, fac.lng]}
                icon={createFacilityIcon(fac.type)}
                eventHandlers={{
                  click: () => setSelectedFacility(fac)
                }}
              >
                <Popup>
                  <div className="min-w-[220px] max-w-[280px] text-xs font-sans space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                        {FACILITY_CONFIG[fac.type]?.label || fac.type}
                      </span>
                      {fac.isVerified && (
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">
                        {language === 'ta' && fac.nameTamil ? fac.nameTamil : fac.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{fac.address}</p>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg text-[11px] space-y-0.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Phone:</span>
                        <a href={`tel:${fac.phone}`} className="text-sky-600 font-semibold hover:underline">
                          {fac.phone}
                        </a>
                      </div>
                      {fac.capacity && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Occupancy:</span>
                          <span className="font-semibold text-slate-800">
                            {fac.currentOccupancy || 0} / {fac.capacity}
                          </span>
                        </div>
                      )}
                    </div>

                    <a
                      href={getOpenStreetMapRouteUrl(fac.lat, fac.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{t.getDirections} (OpenStreetMap)</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Approved Community Incident Markers */}
            {incidents.map(inc => (
              <Marker
                key={inc.id}
                position={[inc.lat!, inc.lng!]}
                icon={incidentIcon}
              >
                <Popup>
                  <div className="min-w-[200px] text-xs space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Citizen Hazard Report ({inc.incidentType.replace('_', ' ')})
                    </span>
                    <h4 className="font-bold text-slate-900">{inc.title}</h4>
                    <p className="text-[11px] text-slate-600">{inc.description}</p>
                    <p className="text-[10px] text-slate-400">Reported at {inc.locationDetails}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Legend Floating Widget */}
          <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-md text-[11px] space-y-1.5">
            <span className="font-bold text-slate-800 block text-[10px] uppercase tracking-wider mb-1">
              FACILITY & HAZARD MARKERS
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700">Safe Zones</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span className="text-slate-700">Relief Shelters</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-700">Trauma Hospitals</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-700">Fire & Rescue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span className="text-slate-700">Police Posts</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              <span className="text-slate-700">Reported Field Hazards</span>
            </div>
          </div>
        </div>

        {/* Sidebar / Facility Inspector */}
        <div className="lg:col-span-4 space-y-3">
          {selectedFacility ? (
            <div className="bg-white p-5 rounded-3xl border border-sky-300 shadow-xs space-y-3.5 animate-in fade-in duration-150">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    FACILITY_CONFIG[selectedFacility.type]?.bg || 'bg-slate-500'
                  } text-white`}>
                    {FACILITY_CONFIG[selectedFacility.type]?.label || selectedFacility.type.replace('_', ' ')}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {language === 'ta' && selectedFacility.nameTamil ? selectedFacility.nameTamil : selectedFacility.name}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedFacility.district} District</p>
                </div>

                {selectedFacility.isVerified && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{selectedFacility.address}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`tel:${selectedFacility.phone}`} className="text-sky-600 font-semibold hover:underline">
                    {selectedFacility.phone}
                  </a>
                </p>
              </div>

              {/* Occupancy Progress */}
              {selectedFacility.capacity && (
                <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1.5 border border-slate-100">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-500">Shelter Occupancy:</span>
                    <span className="text-slate-800 font-bold">
                      {selectedFacility.currentOccupancy || 0} / {selectedFacility.capacity} Persons
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-sky-500 h-full rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(100, Math.round(((selectedFacility.currentOccupancy || 0) / selectedFacility.capacity) * 100))}%` 
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Verified Amenities */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  OFFICIAL AMENITIES:
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedFacility.facilities.map((f, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* OpenStreetMap Turn-by-Turn Route Action */}
              <div className="pt-2 border-t border-slate-100">
                <a
                  href={getOpenStreetMapRouteUrl(selectedFacility.lat, selectedFacility.lng)}
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
          ) : (
            <div className="p-5 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-800">Select any point on the map</p>
              <p className="text-[11px] text-slate-400">
                Click any safe zone, shelter or trauma hospital marker to inspect facilities and calculate turn-by-turn routes via OpenStreetMap.
              </p>
            </div>
          )}

          {/* Quick Facility List */}
          <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-xs max-h-[320px] overflow-y-auto space-y-2">
            <h4 className="text-xs font-bold text-slate-800 px-2 pt-1">
              Verified Facilities ({filteredFacilities.length})
            </h4>
            {filteredFacilities.map(fac => {
              const isSelected = selectedFacility?.id === fac.id;
              const config = FACILITY_CONFIG[fac.type] || FACILITY_CONFIG.safe_zone;
              return (
                <div
                  key={fac.id}
                  onClick={() => handleSelectFacility(fac)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                    isSelected 
                      ? 'bg-sky-50 border-sky-400 shadow-xs' 
                      : 'bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-sm ${config.bg} text-white`}>
                      {config.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{fac.district}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-1 line-clamp-1">
                    {language === 'ta' && fac.nameTamil ? fac.nameTamil : fac.name}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{fac.address}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
