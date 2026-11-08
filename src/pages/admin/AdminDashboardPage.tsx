import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Radio, 
  AlertTriangle, 
  Building2, 
  Users, 
  Send, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Activity, 
  CheckCircle2, 
  ExternalLink,
  Flame,
  CloudRain
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { EmergencyAlert, Facility, IncidentReport, BroadcastCampaign, UserProfile } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastCampaign[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  const loadData = () => {
    setAlerts(StorageService.getAlerts());
    setFacilities(StorageService.getFacilities());
    setIncidents(StorageService.getIncidents());
    setBroadcasts(StorageService.getBroadcasts());
    setUsers(StorageService.getUsers());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('morai_storage_updated', loadData);
    return () => window.removeEventListener('morai_storage_updated', loadData);
  }, []);

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;
  const pendingReports = incidents.filter(i => i.status === 'pending');
  const totalShelterCapacity = facilities.reduce((sum, f) => sum + (f.capacity || 0), 0);
  const totalOccupancy = facilities.reduce((sum, f) => sum + (f.currentOccupancy || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Command Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden border border-slate-800">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SYSTEM STATUS: ALL TELEMETRY CHANNELS ACTIVE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            State Disaster Operations Command
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Centralized surveillance dashboard coordinating emergency alert dispatches, citizen hazard moderation, and shelter logistics across South Indian coastal sectors.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/admin/alerts"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Official Alert</span>
            </Link>

            <Link
              to="/admin/notifications"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Mass Resend Broadcast</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <Radio className="w-5 h-5 text-rose-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">ACTIVE ALERTS</span>
          </div>
          <span className="text-3xl font-black text-slate-900">{activeAlerts.length}</span>
          <p className="text-[11px] text-rose-600 font-semibold">{criticalCount} High/Critical</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">PENDING REPORTS</span>
          </div>
          <span className="text-3xl font-black text-slate-900">{pendingReports.length}</span>
          <p className="text-[11px] text-amber-700 font-semibold">Citizen submissions</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">SAFE SHELTERS</span>
          </div>
          <span className="text-3xl font-black text-slate-900">{facilities.length}</span>
          <p className="text-[11px] text-slate-500">{totalOccupancy}/{totalShelterCapacity} Occupancy</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <Users className="w-5 h-5 text-indigo-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">CITIZEN ROSTER</span>
          </div>
          <span className="text-3xl font-black text-slate-900">{users.length}</span>
          <p className="text-[11px] text-emerald-600 font-semibold">Verified residents</p>
        </div>
      </div>

      {/* Two-Column Stage: Quick Moderation Queue + Recent Broadcasts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Citizen Reports */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900">Incident Moderation Queue</h2>
            </div>
            <Link to="/admin/reports" className="text-xs text-indigo-600 font-semibold hover:underline">
              Moderate All ({pendingReports.length})
            </Link>
          </div>

          {pendingReports.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
              No pending citizen disaster submissions in queue.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReports.slice(0, 3).map(inc => (
                <div key={inc.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[10px] uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      {inc.incidentType.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400 text-[10px]">{new Date(inc.reportedAt).toLocaleTimeString()}</span>
                  </div>
                  <h4 className="font-bold text-slate-900">{inc.title}</h4>
                  <p className="text-slate-600 text-[11px] line-clamp-1">{inc.description}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-500">By {inc.userName} · {inc.district}</span>
                    <Link to="/admin/reports" className="text-indigo-600 font-bold hover:underline">
                      Review & Approve →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Broadcast Log */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Recent Mass Broadcasts</h2>
            </div>
            <Link to="/admin/notifications" className="text-xs text-indigo-600 font-semibold hover:underline">
              New Dispatch
            </Link>
          </div>

          <div className="space-y-3">
            {broadcasts.slice(0, 3).map(b => (
              <div key={b.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    b.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {b.severity}
                  </span>
                  <span className="text-[10px] text-slate-400">{new Date(b.sentAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-slate-900 line-clamp-1">{b.subject}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Zone: {b.targetDistrict}</span>
                  <span className="text-emerald-600 font-semibold">✓ {b.deliveredCount} Sent</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
