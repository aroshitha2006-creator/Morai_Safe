import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  ShieldCheck, 
  Clock, 
  Save, 
  X
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { EmergencyContact } from '../../types';

export const AdminContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  const [name, setName] = useState('');
  const [nameTamil, setNameTamil] = useState('');
  const [number, setNumber] = useState('');
  const [altNumber, setAltNumber] = useState('');
  const [category, setCategory] = useState<EmergencyContact['category']>('disaster');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState('All Districts');
  const [available24x7, setAvailable24x7] = useState(true);

  const [search, setSearch] = useState('');

  const loadData = () => {
    setContacts(StorageService.getEmergencyContacts());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('morai_storage_updated', loadData);
    return () => window.removeEventListener('morai_storage_updated', loadData);
  }, []);

  const handleOpenCreate = () => {
    setEditingContact(null);
    setName('');
    setNameTamil('');
    setNumber('');
    setAltNumber('');
    setCategory('disaster');
    setDescription('');
    setDistrict('All Districts');
    setAvailable24x7(true);
    setShowModal(true);
  };

  const handleOpenEdit = (c: EmergencyContact) => {
    setEditingContact(c);
    setName(c.name);
    setNameTamil(c.nameTamil || '');
    setNumber(c.number);
    setAltNumber(c.altNumber || '');
    setCategory(c.category);
    setDescription(c.description);
    setDistrict(c.district || 'All Districts');
    setAvailable24x7(c.available24x7);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const contactObj: EmergencyContact = {
      id: editingContact ? editingContact.id : `cnt-${Date.now()}`,
      name,
      nameTamil: nameTamil || undefined,
      number,
      altNumber: altNumber || undefined,
      category,
      description,
      district,
      available24x7,
      isTollFree: number.length <= 4
    };

    StorageService.saveEmergencyContact(contactObj);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this emergency contact from the verified public directory?')) {
      StorageService.deleteEmergencyContact(id);
    }
  };

  const filtered = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.number.includes(search) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>VERIFIED CRISIS DIRECTORY REGISTRY</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Phone className="w-6 h-6 text-emerald-600" />
              <span>Emergency Helpline Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Maintain official helpline numbers, district operations desks, ambulance networks, and SDRF command lines.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Helpline Number</span>
          </button>
        </div>

        {/* Search */}
        <div className="pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search directory by name, authority or phone number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-indigo-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div
            key={c.id}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {c.category}
                </span>
                {c.available24x7 && (
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>24x7 Active</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{c.description}</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 font-mono text-base font-black text-slate-900">
                {c.number}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">{c.district || 'All Districts'}</span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingContact ? 'Edit Helpline Number' : 'Add New Crisis Helpline'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Helpline Agency Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. NDRF Regional Center"
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Primary Hotline Number</label>
                  <input
                    type="text"
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                    placeholder="e.g. 112 or 044-28593990"
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  >
                    <option value="national">National Emergency</option>
                    <option value="disaster">Disaster Cell</option>
                    <option value="medical">Medical Ambulance</option>
                    <option value="fire">Fire & Rescue</option>
                    <option value="police">Police Command</option>
                    <option value="district">District Control Room</option>
                    <option value="special">Special / Coast Guard</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jurisdiction District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="All Districts or Chennai"
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Role & Instructions</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe emergency scope..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
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
                  Save Helpline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
