import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Info, 
  Share2,
  Calendar,
  Layers,
  ChevronDown,
  Check
} from 'lucide-react';
import { EmergencyAlert, AlertSeverity, DisasterCategory, UserProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { Language, translations } from '../../services/i18n';

interface AlertsPageProps {
  currentUser: UserProfile | null;
  language: Language;
}

const SEVERITY_BADGES: Record<AlertSeverity, { bg: string; text: string; border: string }> = {
  critical: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300' },
  high: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
  medium: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-300' },
  low: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-300' }
};

export const AlertsPage: React.FC<AlertsPageProps> = ({ currentUser, language }) => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null);
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const t = translations[language];

  const loadAlerts = () => {
    const list = StorageService.getAlerts();
    setAlerts(list);

    if (currentUser) {
      const acks = StorageService.getAcknowledgements()
        .filter(a => a.userId === currentUser.id)
        .map(a => a.alertId);
      setAcknowledgedIds(acks);
    }
  };

  useEffect(() => {
    loadAlerts();
    window.addEventListener('morai_storage_updated', loadAlerts);
    return () => window.removeEventListener('morai_storage_updated', loadAlerts);
  }, [currentUser]);

  const handleAcknowledge = (alertId: string) => {
    if (!currentUser) {
      alert('Please sign in or configure your resident profile to mark your safe status with emergency responders.');
      return;
    }
    StorageService.acknowledgeAlert(alertId, currentUser);
    setAcknowledgedIds(prev => [...prev, alertId]);
  };

  const handleShare = (alertItem: EmergencyAlert) => {
    const shareText = `[MORAI SAFE ALERT] ${alertItem.title} - ${alertItem.affectedArea}. Severity: ${alertItem.severity.toUpperCase()}. Stay safe!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedId(alertItem.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    const matchesTab = activeTab === 'active' ? a.status === 'active' : a.status !== 'active';
    const matchesSeverity = severityFilter === 'all' || a.severity === severityFilter;
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.affectedArea.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSeverity && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Page Title & Status */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span>LIVE CIVIL DEFENSE ALERTS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Radio className="w-6 h-6 text-rose-600" />
              <span>{t.emergencyAlerts}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified disaster warnings issued by State Emergency Operations Center (SEOC) & NDMA.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Active Warnings ({alerts.filter(a => a.status === 'active').length})
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'archived'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Resolved & Past
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-slate-100">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search alert by keyword, sector or district..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-sky-500 transition"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical (Immediate Evacuation)</option>
              <option value="high">High (High Risk)</option>
              <option value="medium">Medium (Advisory)</option>
              <option value="low">Low (Watch)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-sky-500 transition"
            >
              <option value="all">All Categories</option>
              <option value="flood">Flooding & Inundation</option>
              <option value="cyclone">Severe Cyclone</option>
              <option value="heavy_rainfall">Heavy Coastal Rain</option>
              <option value="tsunami">Tsunami Warning</option>
              <option value="fire">Fire Emergency</option>
              <option value="industrial_hazard">Chemical / Industrial Hazard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Stream */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Radio className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No alerts match your current criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are currently no active civil warnings reported for the selected filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlerts.map(alert => {
            const isAcked = acknowledgedIds.includes(alert.id);
            const severityStyle = SEVERITY_BADGES[alert.severity] || SEVERITY_BADGES.medium;

            return (
              <div
                key={alert.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition p-5 space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${severityStyle.bg} ${severityStyle.text} ${severityStyle.border}`}>
                      {alert.severity} · {alert.category.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(alert.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {language === 'ta' && alert.titleTamil ? alert.titleTamil : alert.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-3">
                      {language === 'ta' && alert.descriptionTamil ? alert.descriptionTamil : alert.description}
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="font-medium">Zone: <strong>{alert.affectedArea}</strong></span>
                    </div>
                    {alert.safetyInstructions && alert.safetyInstructions.length > 0 && (
                      <div className="text-[11px] text-slate-600 pt-1">
                        <span className="font-semibold text-slate-700">First Action:</span> {alert.safetyInstructions[0]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs gap-2">
                  <button
                    onClick={() => handleShare(alert)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                    title="Copy alert notice to share"
                  >
                    {copiedId === alert.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAlert(alert)}
                      className="px-3 py-1.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      Instructions ({alert.safetyInstructions?.length || 0})
                    </button>

                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      disabled={isAcked}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        isAcked
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isAcked ? 'Marked Safe' : 'I am Safe'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alert Details & Instructions Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                SEVERITY_BADGES[selectedAlert.severity]?.bg || 'bg-slate-50'
              } ${SEVERITY_BADGES[selectedAlert.severity]?.text || 'text-slate-700'}`}>
                {selectedAlert.severity} PRIORITY ADVISORY
              </span>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">{selectedAlert.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Affected Sector: {selectedAlert.affectedArea}</p>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {selectedAlert.description}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                MANDATORY SAFETY PROTOCOLS:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedAlert.safetyInstructions?.map((ins, i) => (
                  <li key={i} className="flex items-start gap-2 bg-amber-50/60 p-2 rounded-xl border border-amber-100">
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{ins}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
