import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Send, 
  Compass, 
  Upload, 
  ShieldCheck, 
  Info,
  Clock
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { Language, translations } from '../../services/i18n';
import { UserProfile } from '../../types';

interface DisasterReportingPageProps {
  currentUser: UserProfile | null;
  language: Language;
}

export const DisasterReportingPage: React.FC<DisasterReportingPageProps> = ({
  currentUser,
  language
}) => {
  const [incidentType, setIncidentType] = useState<'flooding' | 'tree_fall' | 'structural_damage' | 'trapped_persons' | 'power_hazard' | 'other'>('flooding');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState(currentUser?.preferredDistrict || 'Chennai');
  const [locationDetails, setLocationDetails] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [photoSelected, setPhotoSelected] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = translations[language];

  const handleAcquireLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
        setLocationDetails(`GPS Verified: ${pos.coords.latitude.toFixed(5)}° N, ${pos.coords.longitude.toFixed(5)}° E`);
      },
      err => {
        console.warn('Geolocation incident lookup notice:', err);
        setCoords({ lat: 13.0827, lng: 80.2707 });
        setIsLocating(false);
        setLocationDetails('District Coordinates: 13.0827° N, 80.2707° E');
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    StorageService.submitIncident({
      userId: currentUser?.id || 'citizen-anon',
      userName: currentUser?.fullName || 'Anonymous Citizen Resident',
      userPhone: currentUser?.phone || 'Field Report',
      incidentType,
      title,
      description,
      district,
      locationDetails: locationDetails || `${district} Sector`,
      lat: coords?.lat || 13.0827,
      lng: coords?.lng || 80.2707,
      imageUrl: photoSelected ? 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80' : undefined
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Incident Transmitted to SEOC Command</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your disaster field report has been registered in the State Emergency Operations Center queue. Once verified by on-duty crisis controllers, it will appear as an active hazard pin on the Live Community Map.
        </p>

        <div className="pt-3">
          <button
            onClick={() => {
              setTitle('');
              setDescription('');
              setLocationDetails('');
              setSubmitted(false);
            }}
            className="px-5 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition cursor-pointer"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span>CITIZEN EMERGENCY REPORTING QUEUE</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <span>Report Local Disaster Incident</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Provide ground intelligence on localized flooding, road blockages, fallen electrical poles, or stranded residents to alert official rescue teams.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Incident Category</label>
            <select
              value={incidentType}
              onChange={e => setIncidentType(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
            >
              <option value="flooding">🌊 Severe Street Inundation / Flooding</option>
              <option value="tree_fall">🌳 Fallen Tree / Blocked Arterial Road</option>
              <option value="power_hazard">⚡ Broken High-Tension Electrical Cable</option>
              <option value="structural_damage">🏚️ Structural Crack / Wall Collapse</option>
              <option value="trapped_persons">🆘 Trapped Residents / Senior Citizens</option>
              <option value="other">⚠️ Other Public Safety Hazard</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Affected Coastal District</label>
            <select
              value={district}
              onChange={e => setDistrict(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
            >
              {['Chennai', 'Chengalpattu', 'Cuddalore', 'Nagapattinam', 'Kanyakumari', 'Thiruvarur', 'Puducherry'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Incident Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 3-foot waterlogging at Velachery Main Road junction"
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Detailed Situation Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe current water depth, number of stranded vehicles, presence of vulnerable persons, or special equipment needed..."
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
              required
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <label className="font-bold text-slate-700 block mb-1">Location Details & GPS Coordinates</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={locationDetails}
                onChange={e => setLocationDetails(e.target.value)}
                placeholder="Street name, landmark, building number..."
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
                required
              />
              <button
                type="button"
                onClick={handleAcquireLocation}
                disabled={isLocating}
                className="px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{coords ? 'GPS Added' : 'Capture GPS'}</span>
              </button>
            </div>
          </div>

          {/* Photo Attachment Simulator */}
          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-slate-700 block mb-1">Field Photo Verification (Optional)</label>
            <div
              onClick={() => setPhotoSelected(!photoSelected)}
              className={`p-4 rounded-2xl border-2 border-dashed text-center cursor-pointer transition ${
                photoSelected
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 hover:border-sky-400 bg-slate-50'
              }`}
            >
              <Camera className="w-6 h-6 mx-auto mb-1 text-slate-400" />
              <span className="font-semibold block">
                {photoSelected ? '✓ Ground Photo Attached (field_photo_01.jpg)' : 'Click to simulate camera photo upload'}
              </span>
              <span className="text-[10px] text-slate-400">JPG, PNG up to 10MB</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            False or malicious reports are punishable under Section 54 of Disaster Management Act, 2005.
          </p>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-sm transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit to Operations Center</span>
          </button>
        </div>
      </form>
    </div>
  );
};
