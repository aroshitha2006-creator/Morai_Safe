import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Search, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  BellRing, 
  MapPin, 
  Archive, 
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { EmergencyAlert, AlertSeverity, DisasterCategory, UserProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { Language, translations } from '../../services/i18n';

interface AlertsPageProps {
  currentUser: UserProfile | null;
  language: Language;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ currentUser, language }) => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('active');
  const [acknowledgedAlertIds, setAcknowledgedAlertIds] = useState<string[]>([]);
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  const t = translations[language];

  const loadData = () => {
    setAlerts(StorageService.getAlerts());
    if (currentUser) {
      const acks = StorageService.getAcknowledgements()
        .filter(a => a.userId === currentUser.id)
        .map(a => a.alertId);
      setAcknowledgedAlertIds(acks);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('morai_storage_updated', loadData);
    return () => window.removeEventListener('morai_storage_updated', loadData);
  }, [currentUser]);

  const handleAcknowledge = (alertId: string) => {
    if (!currentUser) {
      alert('Please sign in to register your acknowledgment with emergency disaster authorities.');
      return;
    }
    StorageService.acknowledgeAlert(alertId, currentUser);
    setAcknowledgedAlertIds(prev => [...prev, alertId]);
  };

  const filtered = alerts.filter(alert => {
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesCategory = selectedCategory === 'all' || alert.category === selectedCategory;
    const matchesSearch = 
      alert.title.toLowerCase().includes(search.toLowerCase()) ||
      (alert.titleTamil && alert.titleTamil.includes(search)) ||
      alert.description.toLowerCase().includes(search.toLowerCase()) ||
      alert.affectedArea.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSeverity && matchesCategory && matchesSearch;
  });

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-amber-600 text-white';
      case 'medium':
        return 'bg-yellow-500 text-slate-900';
      case 'low':
        return 'bg-blue-600 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <span>Community Emergency Alert System</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time disaster broadcasts, flood warnings, cyclone trajectory alerts, and safety mandates
          </p>
        </div>

        {/* Status segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Warnings ({alerts.filter(a => a.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('archived')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              statusFilter === 'archived'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Historical Archive
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Broadcasts
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts by title, description or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedSeverity}
            onChange={e => setSelectedSeverity(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical (Red)</option>
            <option value="high">High (Orange)</option>
            <option value="medium">Medium (Yellow)</option>
            <option value="low">Low (Advisory)</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
          >
            <option value="all">All Disaster Categories</option>
            <option value="flood">Flood</option>
            <option value="cyclone">Cyclone</option>
            <option value="heavy_rainfall">Heavy Rainfall</option>
            <option value="earthquake">Earthquake</option>
            <option value="landslide">Landslide</option>
            <option value="fire">Fire Accident</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filtered.map(alert => {
          const isAcknowledged = acknowledgedAlertIds.includes(alert.id);
          const isExpanded = expandedAlertId === alert.id;

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-3xl border-2 transition overflow-hidden shadow-xs ${
                alert.severity === 'critical'
                  ? 'border-red-300'
                  : alert.severity === 'high'
                  ? 'border-amber-300'
                  : 'border-slate-200'
              }`}
            >
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity} SEVERITY
                    </span>
                    <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                      {alert.category}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Published {new Date(alert.publishedAt).toLocaleString()}</span>
                    </span>
                  </div>

                  {alert.status === 'archived' && (
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-semibold flex items-center gap-1">
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archived</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {language === 'ta' && alert.titleTamil ? alert.titleTamil : alert.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {language === 'ta' && alert.descriptionTamil ? alert.descriptionTamil : alert.description}
                  </p>
                </div>

                {/* Affected Area Banner */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">Geographical Target Zone: </span>
                    <span>{alert.affectedArea}</span>
                  </div>
                </div>

                {/* Collapsible Safety Instructions */}
                <div>
                  <button
                    onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800 transition cursor-pointer"
                  >
                    <span>{t.safetyInstructions} ({alert.safetyInstructions?.length || 0} Mandates)</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && alert.safetyInstructions && (
                    <div className="mt-3 p-4 bg-sky-50/60 border border-sky-200 rounded-2xl space-y-2 animate-in fade-in duration-150">
                      {alert.safetyInstructions.map((instruction, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-sky-950">
                          <span className="w-5 h-5 rounded-full bg-sky-200 text-sky-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{instruction}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer with Acknowledgement button */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 font-mono">
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span>{alert.acknowledgedCount || 0} registered citizens have acknowledged safety receipt</span>
                  </div>

                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    disabled={isAcknowledged}
                    className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
                      isAcknowledged
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                    }`}
                  >
                    {isAcknowledged ? <CheckCircle2 className="w-4 h-4" /> : <BellRing className="w-4 h-4" />}
                    <span>{isAcknowledged ? 'Receipt Acknowledged (Recorded in SEOC DB)' : 'Acknowledge Receipt & Confirm Safe Location'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Info className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-800">No emergency alerts found</p>
            <p className="text-xs text-slate-500 mt-1">There are currently no active warnings matching your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
