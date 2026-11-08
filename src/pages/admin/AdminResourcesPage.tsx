import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  ShieldCheck, 
  BookOpen, 
  Plus, 
  FileDown, 
  ExternalLink 
} from 'lucide-react';
import { OFFICIAL_PDF_RESOURCES, PDFGeneratorService } from '../../services/pdfGenerator';
import { PDFResource } from '../../types';

export const AdminResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<PDFResource[]>(OFFICIAL_PDF_RESOURCES);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (res: PDFResource) => {
    setDownloadingId(res.id);
    try {
      PDFGeneratorService.generateResourcePDF(res);
    } catch (e) {
      console.error('PDF generation error:', e);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  const filtered = resources.filter(r => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>NDMA ACCREDITED STANDARD OPERATING PROCEDURES</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              <span>Disaster Guides & Guidelines Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified SOPs and safety documents published for citizens, field officers, and community volunteer cells.
            </p>
          </div>

          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
            {resources.length} Official Documents
          </span>
        </div>

        {/* Search */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-slate-100">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter safety manuals..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
            >
              <option value="all">All Categories</option>
              <option value="safety">Public Safety & Evacuation</option>
              <option value="survival">Survival Rations & Gear</option>
              <option value="health">Medical & Trauma First-Aid</option>
              <option value="planning">Civil Defense & Community Planning</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => (
          <div
            key={r.id}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                  {r.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{r.pages} Pages</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">{r.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{r.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400">By {r.preparedBy}</span>
              <button
                onClick={() => handleDownload(r)}
                disabled={downloadingId === r.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>{downloadingId === r.id ? 'Compiling...' : 'PDF Preview'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
