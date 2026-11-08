import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  CheckCircle, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  FileDown,
  Layers,
  Calendar,
  Clock,
  Shield
} from 'lucide-react';
import { OFFICIAL_PDF_RESOURCES, PDFGeneratorService } from '../../services/pdfGenerator';
import { PDFResource } from '../../types';
import { Language, translations } from '../../services/i18n';

interface DisasterResourcesPageProps {
  language: Language;
}

export const DisasterResourcesPage: React.FC<DisasterResourcesPageProps> = ({ language }) => {
  const [resources, setResources] = useState<PDFResource[]>(OFFICIAL_PDF_RESOURCES);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'guides' | 'phases'>('guides');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const t = translations[language];

  const handleDownload = (resource: PDFResource) => {
    setDownloadingId(resource.id);
    try {
      PDFGeneratorService.generateResourcePDF(resource);
    } catch (err) {
      console.error('PDF Generation failed:', err);
      alert('Could not compile PDF guide. Please ensure downloads are permitted in your browser.');
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
      {/* Title & Tabs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>12 OFFICIAL NDMA & IMD ACCREDITED GUIDES</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              <span>{t.safetyGuidelines}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Download verified National Disaster Management Authority (NDMA) standard manuals and survival protocols.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'guides'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              12 Downloadable PDFs
            </button>
            <button
              onClick={() => setActiveTab('phases')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'phases'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Before / During / After Protocols
            </button>
          </div>
        </div>

        {activeTab === 'guides' && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-slate-100">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search manual title, disaster type, first-aid topics..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-indigo-500 transition"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-indigo-500 transition"
              >
                <option value="all">All Disciplines</option>
                <option value="safety">Public Safety & Evacuation</option>
                <option value="survival">Survival Rations & Gear</option>
                <option value="health">Emergency Medical & First-Aid</option>
                <option value="planning">Civil Defense & Community Planning</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'guides' ? (
        /* 12 Official PDF Guides Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(res => (
            <div
              key={res.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                    {res.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {res.pages} Pages · {res.fileSize}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {language === 'ta' && res.titleTamil ? res.titleTamil : res.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {res.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {res.keyTopics.slice(0, 3).map((topic, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      • {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  By {res.preparedBy}
                </span>

                <button
                  onClick={() => handleDownload(res)}
                  disabled={downloadingId === res.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <FileDown className={`w-3.5 h-3.5 ${downloadingId === res.id ? 'animate-bounce' : ''}`} />
                  <span>{downloadingId === res.id ? 'Generating...' : 'Download PDF'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Before, During, After Standard Operating Procedures */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Before */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 font-black flex items-center justify-center">
              1
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-600 tracking-wider">PHASE ONE</span>
              <h3 className="text-base font-bold text-slate-900">Before Disaster Strikes</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Prepare an Emergency Survival Kit with 72-hour food & potable water rations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Locate your closest verified cyclone safe shelter on the Morai Safe GIS map.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Keep important identity papers sealed in waterproof containers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Subscribe your home district for SMS and Resend emergency broadcasts.</span>
              </li>
            </ul>
          </div>

          {/* During */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 font-black flex items-center justify-center">
              2
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">PHASE TWO</span>
              <h3 className="text-base font-bold text-slate-900">During Extreme Event</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">!</span>
                <span>Stay indoors away from glass windows and loose roofing sheets during gale winds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">!</span>
                <span>Disconnect main electrical circuit breaker and LPG gas regulator immediately.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">!</span>
                <span>Do not walk or drive through flowing water; 15cm of fast water can knock down an adult.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">!</span>
                <span>Use the Morai Safe SOS button if stranded or in life-threatening distress.</span>
              </li>
            </ul>
          </div>

          {/* After */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center">
              3
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">PHASE THREE</span>
              <h3 className="text-base font-bold text-slate-900">Post-Disaster Recovery</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-sky-500 font-bold">✓</span>
                <span>Boil all drinking water for at least 10 minutes to prevent water-borne epidemics.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-500 font-bold">✓</span>
                <span>Beware of broken power lines, displaced wildlife, and structural fissures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-500 font-bold">✓</span>
                <span>Click "I am Safe" on active alerts to register your safety with disaster authorities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-500 font-bold">✓</span>
                <span>Report localized inundation or fallen trees via Morai Safe Incident Reporter.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
