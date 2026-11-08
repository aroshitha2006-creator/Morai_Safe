import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Radio, 
  Send, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Check, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { BroadcastCampaign } from '../../types';
import { StorageService } from '../../services/storage';
import { Language, translations } from '../../services/i18n';

interface NotificationsPageProps {
  language: Language;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ language }) => {
  const [broadcasts, setBroadcasts] = useState<BroadcastCampaign[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  const t = translations[language];

  const loadData = () => {
    setBroadcasts(StorageService.getBroadcasts());
  };

  useEffect(() => {
    loadData();
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const requestBrowserNotification = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }
    const perm = await Notification.requestPermission();
    setPermissionStatus(perm);
    if (perm === 'granted') {
      new Notification('MORAI SAFE Notifications Enabled', {
        body: 'You will receive immediate audio and banner alerts for critical disaster warnings.'
      });
    }
  };

  const playTestChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio test chime notice:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span>CITIZEN EMERGENCY NOTIFICATION FEED</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-sky-600" />
              <span>Broadcasts & Alerts Inbox</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Review history of civil defense alerts dispatched via Resend email and emergency audio channels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playTestChime();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>{soundEnabled ? 'Alert Siren On' : 'Muted'}</span>
            </button>

            {permissionStatus !== 'granted' && (
              <button
                onClick={requestBrowserNotification}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Enable Desktop Push</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Broadcast Feed */}
      <div className="space-y-3">
        {broadcasts.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Your Emergency Inbox is Clean</h3>
            <p className="text-xs text-slate-500">No urgent civil defense broadcasts have been dispatched in your sector today.</p>
          </div>
        ) : (
          broadcasts.map(b => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    b.severity === 'critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    b.severity === 'high' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}>
                    {b.severity} PRIORITY · RESEND EMAIL DISPATCH
                  </span>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    Zone: {b.targetDistrict}
                  </span>
                </div>

                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(b.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{b.subject}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {b.body}
                </p>
              </div>

              {b.safetyPrecautions && b.safetyPrecautions.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    CIVIL DEFENSE PRECAUTIONS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {b.safetyPrecautions.map((p, i) => (
                      <span key={i} className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                        ⚠️ {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                <span>Dispatched by {b.sentBy}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Delivered to {b.deliveredCount} citizens</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
