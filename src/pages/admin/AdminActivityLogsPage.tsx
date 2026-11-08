import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  ShieldCheck, 
  Radio, 
  Send, 
  Building2, 
  User, 
  Lock 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { AuditLog } from '../../types';

export const AdminActivityLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const loadData = () => {
    setLogs(StorageService.getAuditLogs());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('morai_storage_updated', loadData);
    return () => window.removeEventListener('morai_storage_updated', loadData);
  }, []);

  const filtered = logs.filter(l => {
    const matchesCat = categoryFilter === 'all' || l.category === categoryFilter;
    const matchesSearch = 
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.adminEmail.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              <span>FORENSIC AUDIT TRAIL</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Clock className="w-6 h-6 text-slate-700" />
              <span>Immutable Activity & Security Logs</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Timestamped cryptographic records of every alert published, shelter updated, report moderated, and broadcast sent.
            </p>
          </div>

          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
            {logs.length} Logged Events
          </span>
        </div>

        {/* Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-slate-100">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail by action, officer or details..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
            >
              <option value="all">All Action Categories</option>
              <option value="alert">Alert Operations</option>
              <option value="broadcast">Mass Broadcasts</option>
              <option value="incident">Incident Moderation</option>
              <option value="facility">Shelter Updates</option>
              <option value="auth">Officer Authentication</option>
            </select>
          </div>
        </div>
      </div>

      {/* Log Stream */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.map(entry => (
            <div key={entry.id} className="p-4 hover:bg-slate-50/70 transition flex items-start justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {entry.action}
                  </span>
                  <span className="font-semibold text-slate-800">{entry.adminName}</span>
                  <span className="text-slate-400 font-mono text-[11px]">({entry.adminEmail})</span>
                </div>
                <p className="text-slate-600">{entry.details}</p>
              </div>

              <span className="text-[11px] text-slate-400 font-mono shrink-0">
                {new Date(entry.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
