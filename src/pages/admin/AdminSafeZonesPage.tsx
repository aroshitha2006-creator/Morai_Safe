import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Users, 
  X,
  ExternalLink
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { Facility, FacilityType } from '../../types';

export const AdminSafeZonesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);

  const [name, setName] = useState('');
  const [nameTamil, setNameTamil] = useState('');
  const [type, setType] = useState<FacilityType>('emergency_shelter');
  const [district, setDistrict] = useState('Chennai');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('13.0827');
  const [lng, setLng] = useState('80.2707');
  const [phone, setPhone] = useState('+91 44 2530 0000');
  const [capacity, setCapacity] = useState('1000');
  const [occupancy, setOccupancy] = useState('0');
  const [amenities, setAmenities] = useState('Backup Solar Power, RO Clean Water, Medical First Aid, Kitchen');

  const [search, setSearch] = useState('');

  const loadData = () => {
    setFacilities(StorageService.getFacilities());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('morai_storage_updated', loadData);
    return () => window.removeEventListener('morai_storage_updated', loadData);
  }, []);

  const handleOpenCreate = () => {
    setEditingFacility(null);
    setName('');
    setNameTamil('');
    setType('emergency_shelter');
    setDistrict('Chennai');
    setAddress('');
    setLat('13.0827');
    setLng('80.2707');
    setPhone('+91 44 2530 0000');
    setCapacity('1000');
    setOccupancy('0');
    setAmenities('Backup Solar Power, RO Clean Water, Medical First Aid');
    setShowModal(true);
  };

  const handleOpenEdit = (f: Facility) => {
    setEditingFacility(f);
    setName(f.name);
    setNameTamil(f.nameTamil || '');
    setType(f.type);
    setDistrict(f.district);
    setAddress(f.address);
    setLat(f.lat.toString());
    setLng(f.lng.toString());
    setPhone(f.phone);
    setCapacity(f.capacity?.toString() || '1000');
    setOccupancy(f.currentOccupancy?.toString() || '0');
    setAmenities(f.facilities.join(', '));
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const facilityObj: Facility = {
      id: editingFacility ? editingFacility.id : `fac-${Date.now()}`,
      name,
      nameTamil: nameTamil || undefined,
      type,
      district,
      address,
      lat: parseFloat(lat) || 13.0827,
      lng: parseFloat(lng) || 80.2707,
      phone,
      facilities: amenities.split(',').map(s => s.trim()).filter(Boolean),
      accessibility: ['Ground Floor Accessible', 'Wheelchair Ramps'],
      capacity: parseInt(capacity) || 1000,
      currentOccupancy: parseInt(occupancy) || 0,
      status: 'open',
      isVerified: true,
      verifiedBy: 'State Disaster Management Authority',
      updatedAt: new Date().toISOString()
    };

    StorageService.saveFacility(facilityObj);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this facility from verified refuge shelters?')) {
      StorageService.deleteFacility(id);
    }
  };

  const handleUpdateOccupancy = (fac: Facility, delta: number) => {
    const nextOcc = Math.max(0, Math.min(fac.capacity || 10000, (fac.currentOccupancy || 0) + delta));
    StorageService.saveFacility({ ...fac, currentOccupancy: nextOcc });
  };

  const filtered = facilities.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.district.toLowerCase().includes(search.toLowerCase()) ||
    f.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span>VERIFIED RELIEF CAMPS & SAFE LOGISTICS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-sky-600" />
              <span>Shelters & Safe Zones Directory</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Update real-time bed capacity, drinking water stocks, and verified facilities across disaster sectors.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Shelter Hub</span>
          </button>
        </div>

        {/* Search */}
        <div className="pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search shelters by name, sector or district..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-indigo-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(fac => {
          const occRate = fac.capacity ? Math.round(((fac.currentOccupancy || 0) / fac.capacity) * 100) : 0;
          return (
            <div
              key={fac.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                    {fac.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400">{fac.district}</span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{fac.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{fac.address}</p>
                </div>

                {/* Occupancy Progress & Rapid Adjuster */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Live Occupancy:</span>
                    <strong className="text-slate-900">
                      {fac.currentOccupancy || 0} / {fac.capacity || 'N/A'} ({occRate}%)
                    </strong>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        occRate > 80 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, occRate)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">Rapid Update:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateOccupancy(fac, -25)}
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold hover:bg-slate-100"
                      >
                        -25
                      </button>
                      <button
                        onClick={() => handleUpdateOccupancy(fac, 25)}
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-bold hover:bg-slate-100"
                      >
                        +25
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Phone: </span>
                  <a href={`tel:${fac.phone}`} className="text-indigo-600 hover:underline">{fac.phone}</a>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  {fac.lat.toFixed(3)}, {fac.lng.toFixed(3)}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(fac)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(fac.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Create/Edit Facility */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingFacility ? 'Edit Relief Shelter Facility' : 'Register New Emergency Shelter'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Facility Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Cuddalore Port Cyclone Camp"
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Facility Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as FacilityType)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  >
                    <option value="emergency_shelter">Relief Shelter</option>
                    <option value="safe_zone">High-Ground Safe Zone</option>
                    <option value="hospital">Trauma Hospital</option>
                    <option value="fire_station">Fire & Rescue Post</option>
                    <option value="evacuation_center">Evacuation Transit Center</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Direct Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Physical Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Capacity (Persons)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Current Occupancy</label>
                  <input
                    type="number"
                    value={occupancy}
                    onChange={e => setOccupancy(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Latitude</label>
                  <input
                    type="text"
                    value={lat}
                    onChange={e => setLat(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Longitude</label>
                  <input
                    type="text"
                    value={lng}
                    onChange={e => setLng(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Verified On-Site Amenities (comma separated)</label>
                <input
                  type="text"
                  value={amenities}
                  onChange={e => setAmenities(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
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
                  Save Shelter Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
