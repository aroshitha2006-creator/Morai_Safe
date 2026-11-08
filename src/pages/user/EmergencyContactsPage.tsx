import React, { useState, useEffect, useMemo } from 'react';
import { 
  Phone, 
  Search, 
  ShieldAlert, 
  Clock, 
  Building2, 
  Flame, 
  HeartHandshake, 
  Anchor, 
  Users, 
  HelpCircle,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { EmergencyContact } from '../../types';
import { StorageService } from '../../services/storage';
import { Language, translations } from '../../services/i18n';

interface EmergencyContactsPageProps {
  language: Language;
}

const CATEGORY_MAP: Record<string, { label: string; bg: string; text: string }> = {
  national: { label: 'National Universal', bg: 'bg-rose-50', text: 'text-rose-700' },
  disaster: { label: 'Disaster Cell', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  medical: { label: 'Medical Ambulance', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  fire: { label: 'Fire & Rescue', bg: 'bg-amber-50', text: 'text-amber-700' },
  police: { label: 'Police & Security', bg: 'bg-sky-50', text: 'text-sky-700' },
  district: { label: 'District Cell', bg: 'bg-purple-50', text: 'text-purple-700' },
  special: { label: 'Special Helpline', bg: 'bg-teal-50', text: 'text-teal-700' }
};

export const EmergencyContactsPage: React.FC<EmergencyContactsPageProps> = ({ language }) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const t = translations[language];

  const loadContacts = () => {
    setContacts(StorageService.getEmergencyContacts());
  };

  useEffect(() => {
    loadContacts();
    window.addEventListener('morai_storage_updated', loadContacts);
    return () => window.removeEventListener('morai_storage_updated', loadContacts);
  }, []);

  const handleCopy = (id: string, num: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(num);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
      const matchesDist = selectedDistrict === 'all' || (c.district && c.district.toLowerCase().includes(selectedDistrict.toLowerCase())) || c.district === 'All Districts';
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.nameTamil && c.nameTamil.includes(searchQuery)) ||
        c.number.includes(searchQuery) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesDist && matchesSearch;
    });
  }, [contacts, selectedCategory, selectedDistrict, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>24x7 VERIFIED DIRECTORY</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Phone className="w-6 h-6 text-rose-600" />
              <span>Official Emergency Helplines</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              National crisis lines, disaster control rooms, ambulance dispatch, and district collectorate emergency cells.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:112"
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span>Dial 112 Now</span>
            </a>
          </div>
        </div>

        {/* Quick Dial Primary Helplines Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <a
            href="tel:112"
            className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between hover:bg-rose-100 transition group"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-600 block">Unified National</span>
              <span className="text-lg font-black text-rose-900">112</span>
            </div>
            <Phone className="w-5 h-5 text-rose-600 group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="tel:1070"
            className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between hover:bg-indigo-100 transition group"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-600 block">Disaster SEOC</span>
              <span className="text-lg font-black text-indigo-900">1070</span>
            </div>
            <ShieldAlert className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="tel:108"
            className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between hover:bg-emerald-100 transition group"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">Ambulance</span>
              <span className="text-lg font-black text-emerald-900">108</span>
            </div>
            <HeartHandshake className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="tel:101"
            className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between hover:bg-amber-100 transition group"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-600 block">Fire & Rescue</span>
              <span className="text-lg font-black text-amber-900">101</span>
            </div>
            <Flame className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
          </a>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-3 border-t border-slate-100">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search helpline name, authority or phone number..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-sky-500 transition"
            >
              <option value="all">All Helpline Categories</option>
              <option value="national">National Universal</option>
              <option value="disaster">Disaster Operations</option>
              <option value="medical">Medical Ambulance</option>
              <option value="fire">Fire & Rescue</option>
              <option value="police">Police & Security</option>
              <option value="district">District Collectorates</option>
              <option value="special">Coast Guard & Special</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-sky-500 transition"
            >
              <option value="all">All Coastal Sectors</option>
              <option value="Chennai">Chennai</option>
              <option value="Cuddalore">Cuddalore</option>
              <option value="Nagapattinam">Nagapattinam</option>
              <option value="Kanyakumari">Kanyakumari</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map(contact => {
          const cat = CATEGORY_MAP[contact.category] || CATEGORY_MAP.special;
          return (
            <div
              key={contact.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${cat.bg} ${cat.text}`}>
                    {cat.label}
                  </span>
                  {contact.available24x7 && (
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>24x7 Active</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {language === 'ta' && contact.nameTamil ? contact.nameTamil : contact.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {contact.description}
                  </p>
                </div>

                {contact.district && (
                  <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Jurisdiction: {contact.district}
                  </span>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-base font-black text-slate-900 font-mono tracking-wide">
                    {contact.number}
                  </span>
                  <button
                    onClick={() => handleCopy(contact.id, contact.number)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    title="Copy number"
                  >
                    {copiedId === contact.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${contact.number.replace(/[^0-9+]/g, '')}`}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Helpline</span>
                  </a>
                  {contact.altNumber && (
                    <a
                      href={`tel:${contact.altNumber.replace(/[^0-9+]/g, '')}`}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                      title={`Alt: ${contact.altNumber}`}
                    >
                      Alt
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
