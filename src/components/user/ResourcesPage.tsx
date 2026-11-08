import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  CheckCircle, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  FileDown
} from 'lucide-react';
import { OFFICIAL_PDF_RESOURCES, PDFGeneratorService } from '../../services/pdfGenerator';
import { PDFResource } from '../../types';
import { Language, translations } from '../../services/i18n';

interface ResourcesPageProps {
  language: Language;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ language }) => {
  const [resources, setResources] = useState<PDFResource[]>(OFFICIAL_PDF_RESOURCES);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const t = translations[language];

  const handleDownload = (resource: PDFResource) => {
    setDownloadingId(resource.id);
    try {
      PDFGeneratorService.generateResourcePDF(resource);
    } catch (err) {
      console.error('PDF Generation failed:', err);
      alert('Could not compile PDF. Please ensure browser popups or downloads are permitted.');
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  const filtered = resources.filter(res => {
    const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
    const matchesSearch = 
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.titleTamil.includes(search) ||
      res.description.toLowerCase().includes(search.toLowerCase()) ||
      res.keyTopics.some(k => k.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>OFFICIAL NDMA & IMD STANDARD GUIDANCE LIBRARY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            12 Official Disaster Preparedness PDF Guides
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Professionally formatted, authoritative survival documents. Each PDF includes step-by-step before/during/after instructions, grain preservation, medical storage, clean water chlorination, and household checklists.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search guides by topic (e.g., flood, food storage, chlorination, first aid)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-sky-500 transition"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
          >
            <option value="all">All Domains (Safety, Health, Survival, Planning)</option>
            <option value="safety">Disaster Safety & Evacuation</option>
            <option value="health">First Aid & Medicine Storage</option>
            <option value="survival">Survival Kit, Food & Water Storage</option>
            <option value="planning">Family, Children, Elderly & Disabilities</option>
          </select>
        </div>
      </div>

      {/* 12 Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(resource => {
          const isDownloading = downloadingId === resource.id;

          return (
            <div
              key={resource.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                    {resource.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {resource.pages} Pages · {resource.fileSize}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {language === 'ta' ? resource.titleTamil : resource.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {resource.description}
                  </p>
                </div>

                {/* Key Topics Tag Cloud */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    KEY CURATED TOPICS:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {resource.keyTopics.map((topic, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        • {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
                  <span>Authorized: {resource.preparedBy}</span>
                  <span className="font-semibold text-emerald-700">Official Standard</span>
                </div>
              </div>

              {/* Download Action */}
              <button
                onClick={() => handleDownload(resource)}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer active:scale-98"
              >
                <FileDown className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                <span>{isDownloading ? 'Generating PDF Document...' : t.downloadPdf}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
