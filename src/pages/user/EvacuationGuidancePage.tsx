import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LifeBuoy, 
  MapPin, 
  CheckSquare, 
  ShieldCheck, 
  Compass, 
  Navigation, 
  AlertTriangle, 
  Info, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { ChecklistItem } from '../../types';
import { Language, translations } from '../../services/i18n';

interface EvacuationGuidancePageProps {
  language: Language;
}

export const EvacuationGuidancePage: React.FC<EvacuationGuidancePageProps> = ({ language }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const t = translations[language];

  const loadData = () => {
    setChecklist(StorageService.getChecklist());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('morai_storage_updated', loadData);
    return () => window.removeEventListener('morai_storage_updated', loadData);
  }, []);

  const handleToggle = (id: string) => {
    StorageService.toggleChecklistItem(id);
  };

  const handleReset = () => {
    StorageService.resetChecklist();
  };

  const completedCount = checklist.filter(c => c.checked).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>NDMA STANDARDIZED EVACUATION CORRIDORS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <LifeBuoy className="w-6 h-6 text-emerald-600" />
              <span>Evacuation Route Guidance & Preparedness</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Standard operating procedures for safe family transit, coastal evacuation pickup points, and go-bag checklists.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/user/maps"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Compass className="w-4 h-4" />
              <span>Locate Nearest Shelter</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Evacuation Protocol Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-sm">
            01
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Step 1: Secure Domestic Premises</h3>
          <p className="text-slate-600 leading-relaxed">
            Turn off main electrical breakers, close cylinder valves on LPG gas connections, and securely bolt outward-facing windows against high-speed wind shears.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-sm">
            02
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Step 2: Evacuation Transit & Route</h3>
          <p className="text-slate-600 leading-relaxed">
            Travel only via designated government arterial evacuation corridors. Avoid riverbeds, culverts, and subway underpasses which can inundate within minutes.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
            03
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Step 3: Registration at Shelter</h3>
          <p className="text-slate-600 leading-relaxed">
            Report directly to the shelter reception desk to register all family members with NDRF/Revenue officials to ensure ration allotment and family reunification.
          </p>
        </div>
      </div>

      {/* Interactive Emergency Kit Go-Bag Checklist */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-sky-600" />
              <span>72-Hour Emergency Go-Bag Survival Kit</span>
            </h2>
            <p className="text-xs text-slate-500">
              Verify that all essential life-support items are packed in an easy-to-carry waterproof backpack.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-xl border border-sky-100">
              {completedCount} of {checklist.length} Items Packed ({progressPercent}%)
            </span>

            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Reset Checklist"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-sky-500 to-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklist.map(item => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition select-none flex items-start gap-3 ${
                item.checked
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => {}}
                className="rounded text-sky-600 focus:ring-sky-500 mt-0.5 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className={`font-bold block ${item.checked ? 'line-through opacity-80' : ''}`}>
                  {language === 'ta' && item.titleTamil ? item.titleTamil : item.title}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {item.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
