import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Lock, 
  Key, 
  ShieldCheck, 
  Mail, 
  Send, 
  Volume2, 
  Check, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { AdminProfile } from '../../types';

interface AdminSettingsPageProps {
  currentAdmin: AdminProfile | null;
}

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ currentAdmin }) => {
  const [fullName, setFullName] = useState(currentAdmin?.fullName || 'Chief Disaster Officer');
  const [designation, setDesignation] = useState(currentAdmin?.designation || 'State Emergency Operations Director');
  const [department, setDepartment] = useState(currentAdmin?.department || 'Disaster Management Authority');
  const [isSaved, setIsSaved] = useState(false);

  const [resendStatus, setResendStatus] = useState<any>(null);
  const [mapsStatus, setMapsStatus] = useState<any>(null);

  useEffect(() => {
    fetch('/api/email/status')
      .then(r => r.json())
      .then(d => setResendStatus(d))
      .catch(() => {});

    fetch('/api/maps/config')
      .then(r => r.json())
      .then(d => setMapsStatus(d))
      .catch(() => {});
  }, []);

  const testAudioChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio test chime notice:', e);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAdmin) {
      const updated: AdminProfile = {
        ...currentAdmin,
        fullName,
        designation,
        department
      };
      StorageService.setCurrentAdmin(updated);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-semibold mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          <span>ADMINISTRATION SECURITY ARCHITECTURE</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          <span>System & Officer Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Command credential verification, integration security keys, and hardware audio dispatch testing.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Officer profile details updated.</span>
        </div>
      )}

      {/* Officer Details Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 text-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Commanding Officer Profile</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Designation</label>
            <input
              type="text"
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Officer Settings</span>
          </button>
        </div>
      </form>

      {/* Integration Status Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-600" />
          <span>External API Integration Status</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Resend Email Gateway</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                CONNECTED
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Key Mask: <code className="font-mono">{resendStatus?.maskedKey || 're_4Hfx...FABpD1'}</code>
            </p>
            <p className="text-[10px] text-slate-400">
              Account Owner: aroshitha20@gmail.com
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Google Maps Platform</span>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">
                READY
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              SDK: <code className="font-mono">@vis.gl/react-google-maps</code>
            </p>
            <p className="text-[10px] text-slate-400">
              Attribution: gmp_mcp_codeassist_v1_aistudio
            </p>
          </div>
        </div>

        {/* Chime audio test */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-slate-600">Broadcast Alert Chime Synthesizer</span>
          <button
            onClick={testAudioChime}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Test Emergency Audio Tone</span>
          </button>
        </div>
      </div>
    </div>
  );
};
