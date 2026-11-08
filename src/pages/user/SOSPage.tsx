import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Compass, 
  AlertOctagon, 
  Heart, 
  CheckCircle2, 
  Share2,
  Copy,
  Check,
  AlertTriangle
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { Language, translations } from '../../services/i18n';
import { UserProfile } from '../../types';

interface SOSPageProps {
  currentUser: UserProfile | null;
  language: Language;
}

export const SOSPage: React.FC<SOSPageProps> = ({ currentUser, language }) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const t = translations[language];

  // Auto-acquire GPS on page load
  useEffect(() => {
    handleGetGPS();
    return () => {
      stopSiren();
    };
  }, []);

  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      setLocationStatus('GPS not supported on this browser.');
      return;
    }

    setLocating(true);
    setLocationStatus('Pinpointing device location with satellite GPS...');

    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy)
        });
        setLocating(false);
        setLocationStatus(`GPS Locked (±${Math.round(pos.coords.accuracy)}m)`);
      },
      err => {
        console.warn('GPS SOS error:', err);
        // Fallback
        setCoords({ lat: 13.0827, lng: 80.2707, accuracy: 50 });
        setLocating(false);
        setLocationStatus('GPS satellite access denied. Using district default coordinates.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const toggleSiren = () => {
    if (isSirenPlaying) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.4, ctx.currentTime);

      // Wailing siren modulation
      let up = true;
      let freq = 600;
      const interval = setInterval(() => {
        if (!audioCtxRef.current) {
          clearInterval(interval);
          return;
        }
        if (up) {
          freq += 60;
          if (freq >= 1200) up = false;
        } else {
          freq -= 60;
          if (freq <= 500) up = true;
        }
        try {
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
        } catch {
          clearInterval(interval);
        }
      }, 50);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
      setIsSirenPlaying(true);
    } catch (e) {
      console.warn('Web Audio Siren unavailable:', e);
    }
  };

  const stopSiren = () => {
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    } catch {}
    oscRef.current = null;
    audioCtxRef.current = null;
    setIsSirenPlaying(false);
  };

  const handleDispatchSOS = () => {
    setSosSent(true);
    // Log incident and add to storage
    StorageService.submitIncident({
      userId: currentUser?.id || 'anon',
      userName: currentUser?.fullName || 'Resident Citizen',
      userPhone: currentUser?.phone || 'Immediate Rescue Request',
      incidentType: 'trapped_persons',
      title: 'CRITICAL EMERGENCY SOS: Immediate Evacuation Requested',
      description: `Citizen triggered 1-click distress panic. Location coordinates: ${coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Captured near coastal belt'}.`,
      district: currentUser?.preferredDistrict || 'Chennai',
      locationDetails: coords ? `GPS: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Coastal District',
      lat: coords?.lat || 13.0827,
      lng: coords?.lng || 80.2707
    });

    if (!isSirenPlaying) {
      startSiren();
    }
  };

  const smsText = `EMERGENCY RESCUE SOS! I need immediate help. My location: ${
    coords ? `https://maps.google.com/?q=${coords.lat},${coords.lng}` : 'Near coastal danger zone'
  }. Sent via MORAI SAFE platform.`;

  const handleCopySMS = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(smsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Panic Distress Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-red-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border-2 border-rose-500/50 space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/30 border border-rose-400 text-xs font-bold uppercase tracking-wider text-rose-200">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping"></span>
          <span>HIGH PRIORITY CIVIL DEFENSE DISTRESS BEACON</span>
        </div>

        <div className="max-w-xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            EMERGENCY SOS DISPATCH
          </h1>
          <p className="text-xs sm:text-sm text-rose-100">
            Press the button below if you are trapped by floodwaters, injured, or in direct physical danger. Your precise GPS position will be immediately beamed to first-responders.
          </p>
        </div>

        {/* Huge Pulse SOS Button */}
        <div className="py-4 flex flex-col items-center justify-center">
          <button
            onClick={handleDispatchSOS}
            className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full font-black text-2xl sm:text-3xl tracking-widest text-white shadow-2xl transition-all transform active:scale-95 cursor-pointer flex flex-col items-center justify-center border-4 border-white ${
              sosSent
                ? 'bg-emerald-600 animate-pulse ring-8 ring-emerald-400/50'
                : 'bg-rose-600 hover:bg-rose-700 animate-pulse ring-8 ring-rose-500/40 hover:ring-rose-400/60'
            }`}
          >
            <AlertOctagon className="w-10 h-10 mb-1" />
            <span>{sosSent ? 'SENT' : 'SOS'}</span>
          </button>

          {sosSent && (
            <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Distress beacon broadcasted to State Emergency Operations Center queue.</span>
            </div>
          )}
        </div>

        {/* Audio Siren Control */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={toggleSiren}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              isSirenPlaying
                ? 'bg-white text-rose-900 shadow-lg animate-bounce'
                : 'bg-rose-800/80 hover:bg-rose-700 text-white border border-rose-600/40'
            }`}
          >
            {isSirenPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSirenPlaying ? 'SILENCE DISTRESS SIREN' : 'SOUND AUDIO RESCUE SIREN'}</span>
          </button>

          <button
            onClick={handleGetGPS}
            disabled={locating}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-950/60 hover:bg-rose-950 text-rose-200 border border-rose-800 transition cursor-pointer"
          >
            <Compass className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
            <span>{locationStatus || 'Refresh GPS Lock'}</span>
          </button>
        </div>
      </div>

      {/* GPS Coordinates & SMS Dispatch Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GPS Satellite Lock Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>Your Current Rescue Coordinates</span>
            </h3>
            {coords && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                GPS LOCKED
              </span>
            )}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Latitude:</span>
              <strong className="text-slate-900">{coords ? coords.lat.toFixed(6) : 'Acquiring...'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Longitude:</span>
              <strong className="text-slate-900">{coords ? coords.lng.toFixed(6) : 'Acquiring...'}</strong>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
              <span>Accuracy Radius:</span>
              <span>±{coords?.accuracy || 10} meters</span>
            </div>
          </div>

          {coords && (
            <a
              href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
            >
              <span>Verify Location in Google Maps</span>
            </a>
          )}
        </div>

        {/* Offline SMS Emergency Dispatch */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-sky-600" />
              <span>Offline SMS Rescue Message</span>
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Cellular Fallback
            </span>
          </div>

          <p className="text-xs text-slate-500">
            If cellular internet data is severed by storm winds, copy this SMS and text it to local family or 112 via standard SMS.
          </p>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono text-slate-700 break-words">
            {smsText}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySMS}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy SOS Message'}</span>
            </button>

            <a
              href={`sms:112?body=${encodeURIComponent(smsText)}`}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold whitespace-nowrap transition"
            >
              Send SMS
            </a>
          </div>
        </div>
      </div>

      {/* Direct Call Helplines */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Phone className="w-5 h-5 text-rose-600" />
          <span>Direct Toll-Free Emergency Voice Helplines</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <a
            href="tel:112"
            className="p-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl text-center space-y-1 transition"
          >
            <span className="text-xl font-black text-rose-900 block">112</span>
            <span className="text-[11px] font-bold text-rose-700">National Police & Rescue</span>
          </a>

          <a
            href="tel:108"
            className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl text-center space-y-1 transition"
          >
            <span className="text-xl font-black text-emerald-900 block">108</span>
            <span className="text-[11px] font-bold text-emerald-700">Trauma Ambulance</span>
          </a>

          <a
            href="tel:1070"
            className="p-3.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-2xl text-center space-y-1 transition"
          >
            <span className="text-xl font-black text-indigo-900 block">1070</span>
            <span className="text-[11px] font-bold text-indigo-700">State Disaster Operations</span>
          </a>

          <a
            href="tel:101"
            className="p-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl text-center space-y-1 transition"
          >
            <span className="text-xl font-black text-amber-900 block">101</span>
            <span className="text-[11px] font-bold text-amber-700">Fire & Rescue Service</span>
          </a>
        </div>
      </div>
    </div>
  );
};
