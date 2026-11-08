import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { UserProfile } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');

  const loadData = () => {
    setUsers(StorageService.getUsers());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('morai_storage_updated', loadData);
    return () => window.removeEventListener('morai_storage_updated', loadData);
  }, []);

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search) ||
    u.preferredDistrict.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>VERIFIED CITIZEN RESIDENT REGISTRY</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-600" />
              <span>Registered Citizen Directory</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Citizens verified for emergency broadcasts, shelter admission, and district disaster warnings.
            </p>
          </div>

          <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-200">
            {users.length} Citizens Enrolled
          </span>
        </div>

        {/* Search */}
        <div className="pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by citizen name, email, phone or district..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Users Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(u => (
          <div
            key={u.id}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {u.role === 'admin' ? 'Officer' : 'Resident'}
                </span>
                {u.isEmailVerified && (
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{u.fullName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{u.email}</span>
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{u.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>District: <strong>{u.preferredDistrict}</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>Enrolled: {new Date(u.createdAt).toLocaleDateString()}</span>
              <span>Last active: {new Date(u.lastLogin).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
