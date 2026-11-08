import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  RotateCcw, 
  ShieldCheck, 
  Droplets, 
  HeartPulse, 
  Wrench, 
  FileText, 
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ChecklistItem } from '../../types';
import { StorageService } from '../../services/storage';
import { Language, translations } from '../../services/i18n';

interface ChecklistPageProps {
  language: Language;
}

export const ChecklistPage: React.FC<ChecklistPageProps> = ({ language }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const t = translations[language];

  const loadData = () => {
    setItems(StorageService.getChecklist());
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
    if (confirm('Reset all preparedness checklist checkmarks to baseline?')) {
      StorageService.resetChecklist();
    }
  };

  const completedCount = items.filter(i => i.checked).length;
  const totalCount = items.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const filtered = items.filter(i => activeCategory === 'all' || i.category === activeCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'water_food':
        return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'medical':
        return <HeartPulse className="w-4 h-4 text-rose-500" />;
      case 'tools':
        return <Wrench className="w-4 h-4 text-amber-500" />;
      case 'documents':
        return <FileText className="w-4 h-4 text-indigo-500" />;
      default:
        return <Users className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Overall Score */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-600" />
            <span>Emergency Preparedness & 72-Hour Survival Kit</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Household checklist conforming to NDMA standards for self-sufficiency during immediate disaster aftermath
          </p>
        </div>

        {/* Circular / Progress Indicator */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">Readiness Score</span>
              <span className="font-bold text-emerald-700">{percentage}%</span>
            </div>
            <div className="w-40 bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {completedCount} of {totalCount} items prepared
            </span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
            title="Reset Checklist"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Essentials' },
          { id: 'water_food', label: 'Drinking Water & Food' },
          { id: 'medical', label: 'First-Aid & Medicines' },
          { id: 'tools', label: 'Lights, Radios & Tools' },
          { id: 'documents', label: 'Vital Documents' },
          { id: 'special_needs', label: 'Emergency Cash & Special Needs' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Checklist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => handleToggle(item.id)}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 select-none ${
              item.checked
                ? 'bg-emerald-50/60 border-emerald-300'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="mt-0.5">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => {}}
                className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${item.checked ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                  {language === 'ta' ? item.titleTamil : item.title}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-sm bg-slate-100 text-slate-600">
                  {item.importance}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
