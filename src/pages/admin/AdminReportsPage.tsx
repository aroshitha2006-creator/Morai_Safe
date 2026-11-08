import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  ExternalLink,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { IncidentReport } from '../../types';

export const AdminReportsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const loadData = () => {
    setIncidents(StorageService.getIncidents());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('morai_storage_updated', loadData);
    return () => window.removeEventListener('morai_storage_updated', loadData);
  }, []);

  const handleModerate = (id: string, status: 'approved' | 'rejected') => {
    const reason = status === 'rejected' ? 'Field observation could not be verified by revenue inspector' : 'Verified by district disaster coordinator';
    StorageService.moderateIncident(id, status, reason);
  };

  const filtered = incidents.filter(i => statusFilter === 'all' || i.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>CITIZEN HAZARD SURVEILLANCE & TRIAGE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <span>Incident Moderation Queue</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Verify ground reports from citizens before publishing them as live hazard markers on the public community map.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
            {(['pending', 'approved', 'rejected', 'all'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-xl capitalize transition cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab} ({incidents.filter(i => tab === 'all' || i.status === tab).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Queue is Clear</h3>
            <p className="text-xs text-slate-500">No incident reports currently pending under this filter.</p>
          </div>
        ) : (
          filtered.map(inc => (
            <div
              key={inc.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    {inc.incidentType.replace('_', ' ')}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    inc.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    inc.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {inc.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400">
                    District: <strong>{inc.district}</strong>
                  </span>
                </div>

                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(inc.reportedAt).toLocaleString()}</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{inc.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{inc.description}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-4 text-slate-600">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{inc.userName}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{inc.userPhone}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{inc.locationDetails}</span>
                  </span>
                </div>

                {inc.lat && inc.lng && (
                  <a
                    href={`https://www.google.com/maps?q=${inc.lat},${inc.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>View Coordinates ({inc.lat.toFixed(4)}, {inc.lng.toFixed(4)})</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {inc.status === 'pending' && (
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    onClick={() => handleModerate(inc.id, 'rejected')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject / Flag False</span>
                  </button>

                  <button
                    onClick={() => handleModerate(inc.id, 'approved')}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Place on Map</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
