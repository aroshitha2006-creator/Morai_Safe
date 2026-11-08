import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  Save,
  X
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { EmergencyAlert, AlertSeverity, DisasterCategory } from '../../types';

export const AdminAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<EmergencyAlert | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<AlertSeverity>('critical');
  const [category, setCategory] = useState<DisasterCategory>('flood');
  const [affectedArea, setAffectedArea] = useState('Chennai & Cuddalore Coastal Belt');
  const [instructions, setInstructions] = useState('1. Move to higher ground\n2. Turn off mains electrical breaker\n3. Boil drinking water');
  const [search, setSearch] = useState('');

  const loadAlerts = () => {
    setAlerts(StorageService.getAlerts());
  };

  useEffect(() => {
    loadAlerts();
    window.addEventListener('morai_storage_updated', loadAlerts);
    return () => window.removeEventListener('morai_storage_updated', loadAlerts);
  }, []);

  const handleOpenCreate = () => {
    setEditingAlert(null);
    setTitle('');
    setDescription('');
    setSeverity('critical');
    setCategory('flood');
    setAffectedArea('Chennai Coastal Sector');
    setInstructions('1. Follow instructions of NDRF/SDRF teams\n2. Disconnect electricity\n3. Keep go-bag ready');
    setShowModal(true);
  };

  const handleOpenEdit = (a: EmergencyAlert) => {
    setEditingAlert(a);
    setTitle(a.title);
    setDescription(a.description);
    setSeverity(a.severity);
    setCategory(a.category);
    setAffectedArea(a.affectedArea);
    setInstructions(a.safetyInstructions?.join('\n') || '');
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const instArray = instructions
      .split('\n')
      .map(s => s.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(Boolean);

    const alertObj: EmergencyAlert = {
      id: editingAlert ? editingAlert.id : `alert-${Date.now()}`,
      title,
      description,
      category,
      severity,
      affectedArea,
      affectedDistricts: [affectedArea],
      publishedAt: editingAlert ? editingAlert.publishedAt : new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
      safetyInstructions: instArray.length > 0 ? instArray : ['Follow civil defense guidelines'],
      status: 'active',
      acknowledgedCount: editingAlert ? editingAlert.acknowledgedCount : 0
    };

    StorageService.saveAlert(alertObj);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this official alert?')) {
      StorageService.deleteAlert(id);
    }
  };

  const handleToggleStatus = (a: EmergencyAlert) => {
    const nextStatus = a.status === 'active' ? 'archived' : 'active';
    StorageService.saveAlert({ ...a, status: nextStatus });
  };

  const filtered = alerts.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.affectedArea.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span>EMERGENCY ALERT MANAGEMENT & CRISIS BROADCAST</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Radio className="w-6 h-6 text-rose-600" />
              <span>Civil Defense Alert Center</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Publish, calibrate, and resolve official multi-hazard disaster warnings across target districts.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Alert</span>
          </button>
        </div>

        {/* Search */}
        <div className="pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search alerts by title or sector..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-indigo-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filtered.map(a => (
          <div
            key={a.id}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  a.severity === 'critical' ? 'bg-rose-100 text-rose-800' :
                  a.severity === 'high' ? 'bg-amber-100 text-amber-800' :
                  'bg-sky-100 text-sky-800'
                }`}>
                  {a.severity} · {a.category}
                </span>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  a.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {a.status === 'active' ? '● LIVE ACTIVE' : 'RESOLVED'}
                </span>

                <span className="text-[11px] text-slate-400">
                  Target: <strong>{a.affectedArea}</strong>
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{a.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{a.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleToggleStatus(a)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  a.status === 'active'
                    ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {a.status === 'active' ? 'Resolve & Archive' : 'Reactivate'}
              </button>

              <button
                onClick={() => handleOpenEdit(a)}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Edit Alert"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(a.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                title="Delete Alert"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit Alert */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingAlert ? 'Edit Emergency Alert' : 'Publish New Disaster Alert'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as AlertSeverity)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  >
                    <option value="critical">CRITICAL (Immediate Danger / Evacuate)</option>
                    <option value="high">HIGH (High Risk to Life / Property)</option>
                    <option value="medium">MEDIUM (Precautionary Advisory)</option>
                    <option value="low">LOW (Informational Watch)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Disaster Hazard Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as DisasterCategory)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  >
                    <option value="flood">Flooding / Inundation</option>
                    <option value="cyclone">Severe Cyclone</option>
                    <option value="heavy_rainfall">Heavy Coastal Rain</option>
                    <option value="tsunami">Tsunami Warning</option>
                    <option value="fire">Fire Emergency</option>
                    <option value="industrial_hazard">Industrial / Chemical Hazard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Affected Zone / District</label>
                <input
                  type="text"
                  value={affectedArea}
                  onChange={e => setAffectedArea(e.target.value)}
                  placeholder="e.g. Chennai & Cuddalore Coastal Belt"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alert Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. FLASH FLOOD WARNING: Adyar Basin Breach Warning"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Situation Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detailed instructions and field observations..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Safety Mandates (One per line)</label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-sm hover:bg-indigo-700"
                >
                  {editingAlert ? 'Save Changes' : 'Broadcast Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
