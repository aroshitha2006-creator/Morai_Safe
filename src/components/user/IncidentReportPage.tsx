import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  MapPin, 
  Send, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Camera,
  Compass
} from 'lucide-react';
import { IncidentReport, UserProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { Language, translations } from '../../services/i18n';

interface IncidentReportPageProps {
  currentUser: UserProfile | null;
  language: Language;
}

export const IncidentReportPage: React.FC<IncidentReportPageProps> = ({ currentUser, language }) => {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [incidentType, setIncidentType] = useState<IncidentReport['incidentType']>('flooding');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState(currentUser?.preferredDistrict || 'Chennai');
  const [locationDetails, setLocationDetails] = useState('');
  const [userName, setUserName] = useState(currentUser?.fullName || '');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const t = translations[language];

  const loadIncidents = () => {
    // Only approved incidents are displayed publicly
    const all = StorageService.getIncidents();
    setIncidents(all.filter(i => i.status === 'approved'));
  };

  useEffect(() => {
    loadIncidents();
    window.addEventListener('morai_storage_updated', loadIncidents);
    return () => window.removeEventListener('morai_storage_updated', loadIncidents);
  }, []);

  const handleGrabLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLat(Number(pos.coords.latitude.toFixed(5)));
          setLng(Number(pos.coords.longitude.toFixed(5)));
        },
        () => alert('Could not get GPS position. Please enter landmark details manually.')
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !locationDetails || !userName || !userPhone) {
      alert('Please complete all required fields.');
      return;
    }

    StorageService.submitIncident({
      userId: currentUser?.id || 'guest-citizen',
      userName,
      userPhone,
      incidentType,
      title,
      description,
      district,
      locationDetails,
      lat,
      lng
    });

    setSubmittedSuccess(true);
    setTitle('');
    setDescription('');
    setLocationDetails('');
    setTimeout(() => setSubmittedSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Radio className="w-6 h-6 text-amber-600" />
            <span>Community Field Incident Reporting</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Report local waterlogging, uprooted trees, power line hazards, and trapped individuals for official disaster cell verification
          </p>
        </div>

        <div className="text-xs bg-amber-50 text-amber-800 p-2.5 rounded-xl border border-amber-200 max-w-xs">
          <strong>Notice:</strong> For life-threatening emergencies requiring immediate rescue dispatch, call <strong>112</strong> directly.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Submission Form */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Submit New Field Hazard Report
          </h2>

          {submittedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Report Submitted Successfully!</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Your incident has been routed to the District Emergency Operations Center moderation queue. It will appear on the live community feed as soon as field officials verify it.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Incident Category *</label>
              <select
                value={incidentType}
                onChange={e => setIncidentType(e.target.value as IncidentReport['incidentType'])}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
              >
                <option value="flooding">Severe Waterlogging / Canal Breach</option>
                <option value="tree_fall">Fallen Tree / Road Blockade</option>
                <option value="trapped_persons">Stranded / Trapped Residents</option>
                <option value="power_hazard">Snapped Live Electric Wire</option>
                <option value="structural_damage">Building / Bridge Structural Crack</option>
                <option value="other">Other Community Hazard</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Headline / Short Title *</label>
              <input
                type="text"
                placeholder="e.g., 3-foot waterlogging on Velachery Main Road near AGS colony"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">District *</label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                >
                  <option value="Chennai">Chennai</option>
                  <option value="Cuddalore">Cuddalore</option>
                  <option value="Nagapattinam">Nagapattinam</option>
                  <option value="Kanyakumari">Kanyakumari</option>
                  <option value="Thoothukudi">Thoothukudi</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Chengalpattu">Chengalpattu</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">GPS Coordinates</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    readOnly
                    placeholder={lat ? `${lat}, ${lng}` : 'Auto-detect GPS'}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={handleGrabLocation}
                    className="p-2.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl hover:bg-sky-100 transition cursor-pointer"
                    title="Grab GPS Position"
                  >
                    <Compass className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Exact Street / Landmark Address *</label>
              <input
                type="text"
                placeholder="e.g., Near Old Bus Stand, behind Pillayar Kovil"
                value={locationDetails}
                onChange={e => setLocationDetails(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Detailed Situation Description *</label>
              <textarea
                rows={3}
                placeholder="Describe water depth, number of trapped people, access obstacles, or special medical needs..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reporter Name *</label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={e => setUserPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Report for Disaster Cell Verification</span>
            </button>
          </form>
        </div>

        {/* Public Verified Feed */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Moderated Public Incident Feed ({incidents.length})
            </h2>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Verified by SEOC
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {incidents.map(inc => (
              <div
                key={inc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                    {inc.incidentType.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{inc.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{inc.description}</p>

                <div className="p-2 bg-slate-50 rounded-xl text-[11px] text-slate-600 flex items-center gap-1.5 border border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{inc.locationDetails} ({inc.district})</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Reported by {inc.userName}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified by Field Team</span>
                  </span>
                </div>
              </div>
            ))}

            {incidents.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No active verified incidents reported in your sector.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
