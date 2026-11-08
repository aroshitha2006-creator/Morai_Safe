import React, { useState, useEffect } from 'react';
import { 
  X, 
  PhoneCall, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  AlertOctagon,
  Copy,
  Plus
} from 'lucide-react';
import { Language, translations } from '../../services/i18n';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface TrustedContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose, language }) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>(() => {
    const saved = localStorage.getItem('morai_trusted_contacts');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      { id: '1', name: 'R. Ramesh (Father)', relation: 'Immediate Family', phone: '+91 98400 11224' },
      { id: '2', name: 'Dr. V. Priya (Family Physician)', relation: 'Medical Lead', phone: '+91 94441 55667' }
    ];
  });

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);

  const t = translations[language];

  // Request high-accuracy GPS coordinates on modal open
  useEffect(() => {
    if (isOpen) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            setCoords({
              lat: Number(pos.coords.latitude.toFixed(5)),
              lng: Number(pos.coords.longitude.toFixed(5)),
              accuracy: Math.round(pos.coords.accuracy)
            });
            setGeoError(null);
          },
          err => {
            console.warn('Geolocation error:', err);
            // Default to coastal emergency coordinate reference if user blocks
            setCoords({ lat: 13.0827, lng: 80.2707, accuracy: 15 });
            setGeoError('GPS permission was blocked or unavailable. Using central municipal coordinates.');
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      }
    } else {
      stopSiren();
    }
  }, [isOpen]);

  const toggleSiren = () => {
    if (isSirenPlaying) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  const startSiren = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      
      // Siren frequency modulation
      const now = ctx.currentTime;
      for (let i = 0; i < 30; i++) {
        osc.frequency.linearRampToValueAtTime(950, now + (i * 0.8) + 0.4);
        osc.frequency.linearRampToValueAtTime(600, now + (i * 0.8) + 0.8);
      }

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      setAudioCtx(ctx);
      setOscillator(osc);
      setIsSirenPlaying(true);
    } catch (e) {
      console.error('Audio siren could not start', e);
    }
  };

  const stopSiren = () => {
    if (oscillator) {
      try {
        oscillator.stop();
        oscillator.disconnect();
      } catch { /* ignore */ }
    }
    if (audioCtx) {
      try {
        audioCtx.close();
      } catch { /* ignore */ }
    }
    setOscillator(null);
    setAudioCtx(null);
    setIsSirenPlaying(false);
  };

  const copyCoordinates = () => {
    if (!coords) return;
    const text = `EMERGENCY LOCATION: ${coords.lat}, ${coords.lng} (Accuracy: ~${coords.accuracy}m). Sent via MORAI SAFE Emergency Portal.`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  const handleDispatchSMS = (recipient: string) => {
    const locText = coords ? `at GPS coords: https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=16/${coords.lat}/${coords.lng}` : '';
    const body = encodeURIComponent(`URGENT EMERGENCY SOS: I am stranded and need immediate rescue assistance ${locText}. Please alert NDRF/112.`);
    window.location.href = `sms:${recipient}?body=${body}`;
    setDispatchStatus(`SOS dispatch link generated for ${recipient}`);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    const updated = [
      ...trustedContacts,
      {
        id: Date.now().toString(),
        name: newContactName,
        phone: newContactPhone,
        relation: newContactRelation || 'Emergency Contact'
      }
    ];
    setTrustedContacts(updated);
    localStorage.setItem('morai_trusted_contacts', JSON.stringify(updated));
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRelation('');
    setShowAddContact(false);
  };

  const removeContact = (id: string) => {
    const updated = trustedContacts.filter(c => c.id !== id);
    setTrustedContacts(updated);
    localStorage.setItem('morai_trusted_contacts', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-red-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">RAPID EMERGENCY SOS DISPATCH</h2>
              <p className="text-xs text-red-100">Direct link to verified Indian emergency responder lines</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Live GPS Coordinates Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <MapPin className="w-4 h-4 text-red-600 animate-bounce" />
                <span>YOUR CURRENT RESCUE COORDINATES</span>
              </div>
              <button
                onClick={copyCoordinates}
                className="flex items-center gap-1 text-[11px] font-medium text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-md border border-sky-200 transition cursor-pointer"
              >
                {copiedCoords ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCoords ? 'Copied to Clipboard' : 'Copy GPS Coords'}</span>
              </button>
            </div>
            {coords ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">LATITUDE</span>
                  <span className="font-bold text-slate-800">{coords.lat}° N</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">LONGITUDE</span>
                  <span className="font-bold text-slate-800">{coords.lng}° E</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px]">GPS ACCURACY</span>
                  <span className="font-bold text-emerald-600">± {coords.accuracy} meters</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 animate-pulse">Triangulating satellite coordinates...</p>
            )}
            {geoError && (
              <p className="text-[11px] text-amber-700 mt-1.5">{geoError}</p>
            )}
          </div>

          {/* Verified Official Helplines */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Tap to Call Verified Official Helplines</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 112 */}
              <a
                href="tel:112"
                className="flex items-center justify-between p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 transition group"
              >
                <div>
                  <span className="text-xs font-bold text-red-900 block">112 — National Emergency</span>
                  <span className="text-[11px] text-red-700">Police, Fire, Ambulance Unified</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center group-hover:scale-110 transition">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </a>

              {/* 108 */}
              <a
                href="tel:108"
                className="flex items-center justify-between p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition group"
              >
                <div>
                  <span className="text-xs font-bold text-blue-900 block">108 — Emergency Ambulance</span>
                  <span className="text-[11px] text-blue-700">Trauma Care & Medical Rescue</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </a>

              {/* 101 */}
              <a
                href="tel:101"
                className="flex items-center justify-between p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition group"
              >
                <div>
                  <span className="text-xs font-bold text-amber-900 block">101 — Fire & Rescue Service</span>
                  <span className="text-[11px] text-amber-700">Inflatable Boats, Flood Rescue</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center group-hover:scale-110 transition">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </a>

              {/* 1070 */}
              <a
                href="tel:1070"
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition group"
              >
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">1070 — State Disaster Control</span>
                  <span className="text-[11px] text-emerald-700">Disaster Operations Center</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>

          {/* Audio Siren Alert */}
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-rose-900">ACOUSTIC RESCUE BEACON (SIREN)</p>
              <p className="text-[11px] text-rose-700">Emits continuous audio frequencies to guide nearby rescue boats and NDRF personnel</p>
            </div>
            <button
              onClick={toggleSiren}
              className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                isSirenPlaying 
                  ? 'bg-rose-700 text-white animate-pulse' 
                  : 'bg-white text-rose-700 border border-rose-300 hover:bg-rose-100'
              }`}
            >
              {isSirenPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSirenPlaying ? 'Stop Siren' : 'Sound Siren'}</span>
            </button>
          </div>

          {/* Trusted Personal Emergency Contacts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Trusted Personal & Family Contacts
              </h3>
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                className="text-[11px] text-sky-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Contact</span>
              </button>
            </div>

            {showAddContact && (
              <form onSubmit={handleAddContact} className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newContactName}
                    onChange={e => setNewContactName(e.target.value)}
                    className="text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Mobile (+91...)"
                    value={newContactPhone}
                    onChange={e => setNewContactPhone(e.target.value)}
                    className="text-xs p-2 rounded-lg border border-slate-300 bg-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Relationship"
                    value={newContactRelation}
                    onChange={e => setNewContactRelation(e.target.value)}
                    className="text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddContact(false)}
                    className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs bg-sky-600 text-white font-medium rounded-md hover:bg-sky-700"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {trustedContacts.map(contact => (
                <div 
                  key={contact.id}
                  className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{contact.name}</p>
                    <p className="text-[11px] text-slate-500">{contact.relation} · {contact.phone}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition"
                      title="Direct Call"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDispatchSMS(contact.phone)}
                      className="p-1.5 text-sky-700 hover:bg-sky-50 rounded-lg border border-sky-200 transition cursor-pointer"
                      title="Send Emergency SMS with GPS"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeContact(contact.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition cursor-pointer text-xs"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {dispatchStatus && (
              <p className="text-[11px] text-emerald-700 mt-2 font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                ✓ {dispatchStatus}
              </p>
            )}
          </div>
        </div>

        <div className="bg-slate-100 p-3 px-6 flex items-center justify-between border-t border-slate-200 text-xs text-slate-600">
          <span>Remember: If stranded by rising water, stay calm and signal from highest floor.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition cursor-pointer"
          >
            Close SOS Panel
          </button>
        </div>
      </div>
    </div>
  );
};
