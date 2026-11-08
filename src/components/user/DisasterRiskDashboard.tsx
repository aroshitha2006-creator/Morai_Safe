import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  BarChart2, 
  MapPin, 
  CloudRain, 
  Waves, 
  Flame,
  Info
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { EmergencyAlert, Facility } from '../../types';
import { Language, translations } from '../../services/i18n';

interface DisasterRiskDashboardProps {
  language: Language;
}

export const DisasterRiskDashboard: React.FC<DisasterRiskDashboardProps> = ({ language }) => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  const t = translations[language];

  useEffect(() => {
    setAlerts(StorageService.getAlerts());
    setFacilities(StorageService.getFacilities());
  }, []);

  // District Risk Matrix
  const districtRiskData = [
    { district: 'Chennai', floodRisk: 'High', cycloneRisk: 'High', shelterCount: 4, riverCatchments: 'Adyar, Cooum, Buckingham Canal' },
    { district: 'Cuddalore', floodRisk: 'Critical', cycloneRisk: 'Critical', shelterCount: 5, riverCatchments: 'Gadilam, Pennaiyar, Uppanar' },
    { district: 'Nagapattinam', floodRisk: 'High', cycloneRisk: 'Critical', shelterCount: 6, riverCatchments: 'Cauvery Delta, Vettar' },
    { district: 'Kanyakumari', floodRisk: 'Medium', cycloneRisk: 'High', shelterCount: 3, riverCatchments: 'Pazhayar, Valliyar' },
    { district: 'Thoothukudi', floodRisk: 'High', cycloneRisk: 'Medium', shelterCount: 4, riverCatchments: 'Tamirabarani' },
    { district: 'Nilgiris', floodRisk: 'Medium (Landslides)', cycloneRisk: 'Low', shelterCount: 2, riverCatchments: 'Bhavani River Slopes' }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-sky-600" />
            <span>Regional Disaster Vulnerability & Risk Monitor</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official hazard vulnerability indices, coastal surge historical trends, and river catchment surveillance
          </p>
        </div>

        <div className="p-2.5 bg-sky-50 text-sky-900 rounded-xl border border-sky-200 text-xs max-w-sm">
          <strong>NDMA Classification:</strong> Official Government Warnings are legally binding. Statistical risk indices denote vulnerability estimations.
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ACTIVE RED WARNINGS</span>
          <span className="text-2xl font-extrabold text-red-600 font-sans block mt-1">
            {alerts.filter(a => a.severity === 'critical' && a.status === 'active').length}
          </span>
          <span className="text-[11px] text-slate-500">Immediate evacuation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ORANGE ALERTS</span>
          <span className="text-2xl font-extrabold text-amber-600 font-sans block mt-1">
            {alerts.filter(a => a.severity === 'high' && a.status === 'active').length}
          </span>
          <span className="text-[11px] text-slate-500">Severe storm caution</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">VERIFIED SHELTER CAPACITY</span>
          <span className="text-2xl font-extrabold text-sky-600 font-sans block mt-1">
            {facilities.reduce((acc, f) => acc + (f.capacity || 0), 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500">Persons registered</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">COMMUNITY CITIZEN ACKS</span>
          <span className="text-2xl font-extrabold text-emerald-600 font-sans block mt-1">
            {alerts.reduce((acc, a) => acc + (a.acknowledgedCount || 0), 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500">Receipts logged</span>
        </div>
      </div>

      {/* District Vulnerability Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            District Vulnerability & River Catchment Index
          </h2>
          <span className="text-[11px] text-slate-400">2026 Coastal Hazard Assessment</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">District / Coastal Sector</th>
                <th className="py-3 px-4">Flood Vulnerability</th>
                <th className="py-3 px-4">Cyclone & Surge Risk</th>
                <th className="py-3 px-4">Active Shelters</th>
                <th className="py-3 px-4">Vulnerable Catchments / Waterways</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {districtRiskData.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{d.district}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                      d.floodRisk === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {d.floodRisk}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                      d.cycloneRisk === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {d.cycloneRisk}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold">{d.shelterCount} Facilities</td>
                  <td className="py-3.5 px-4 text-slate-500">{d.riverCatchments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
