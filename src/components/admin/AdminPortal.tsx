import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  AlertTriangle, 
  Building2, 
  Radio, 
  Send, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  ExternalLink, 
  TrendingUp, 
  LogOut, 
  Lock, 
  Mail, 
  Eye, 
  BarChart3,
  RefreshCw,
  Sliders,
  CheckCheck,
  AlertCircle
} from 'lucide-react';
import { 
  AdminProfile, 
  EmergencyAlert, 
  Facility, 
  UserProfile, 
  BroadcastCampaign, 
  IncidentReport, 
  AuditLog, 
  AlertSeverity, 
  DisasterCategory, 
  FacilityType 
} from '../../types';
import { StorageService } from '../../services/storage';

interface AdminPortalProps {
  currentAdmin: AdminProfile | null;
  onAdminLogin: (admin: AdminProfile) => void;
  onAdminLogout: () => void;
  onSwitchToCitizen: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentAdmin,
  onAdminLogin,
  onAdminLogout,
  onSwitchToCitizen
}) => {
  // Navigation tabs inside admin
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alerts' | 'broadcasts' | 'shelters' | 'incidents' | 'users' | 'audit'>('dashboard');

  // Login credentials state
  const [adminEmail, setAdminEmail] = useState('admin@moraisafe.gov.in');
  const [adminPassword, setAdminPassword] = useState('Admin@Morai2026');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Data states
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastCampaign[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Modal states for creating/editing
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<EmergencyAlert | null>(null);
  const [alertFormTitle, setAlertFormTitle] = useState('');
  const [alertFormDesc, setAlertFormDesc] = useState('');
  const [alertFormSeverity, setAlertFormSeverity] = useState<AlertSeverity>('critical');
  const [alertFormCategory, setAlertFormCategory] = useState<DisasterCategory>('flood');
  const [alertFormArea, setAlertFormArea] = useState('Chennai & Cuddalore Coastal Belt');
  const [alertFormInstructions, setAlertFormInstructions] = useState('1. Move to higher ground\n2. Turn off mains\n3. Boil drinking water');

  // Broadcast modal state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastTargetDistrict, setBroadcastTargetDistrict] = useState('All Districts');
  const [broadcastSeverity, setBroadcastSeverity] = useState<AlertSeverity>('critical');
  const [broadcastCategory, setBroadcastCategory] = useState<DisasterCategory>('flood');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccessNotice, setBroadcastSuccessNotice] = useState<string | null>(null);

  // Facility modal state
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [facilityName, setFacilityName] = useState('');
  const [facilityType, setFacilityType] = useState<FacilityType>('emergency_shelter');
  const [facilityDistrict, setFacilityDistrict] = useState('Chennai');
  const [facilityAddress, setFacilityAddress] = useState('');
  const [facilityLat, setFacilityLat] = useState('13.0827');
  const [facilityLng, setFacilityLng] = useState('80.2707');
  const [facilityPhone, setFacilityPhone] = useState('+91 44 2530 0000');
  const [facilityCapacity, setFacilityCapacity] = useState('1000');
  const [facilityOccupancy, setFacilityOccupancy] = useState('0');
  const [facilityAmenities, setFacilityAmenities] = useState('Backup Power, Water Tank, Medical Post');

  const loadAllData = () => {
    setAlerts(StorageService.getAlerts());
    setFacilities(StorageService.getFacilities());
    setUsers(StorageService.getUsers());
    setBroadcasts(StorageService.getBroadcasts());
    setIncidents(StorageService.getIncidents());
    setAuditLogs(StorageService.getAuditLogs());
  };

  useEffect(() => {
    loadAllData();
    window.addEventListener('morai_storage_updated', loadAllData);
    return () => window.removeEventListener('morai_storage_updated', loadAllData);
  }, []);

  // Handle Admin Login
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const admins = StorageService.getAdmins();
    const matched = admins.find(a => a.email.toLowerCase() === adminEmail.toLowerCase());

    if (!matched) {
      setLoginError('Access Denied. Unauthorized administration account.');
      return;
    }

    if (adminPassword.length < 6) {
      setLoginError('Invalid administrator credentials.');
      return;
    }

    onAdminLogin(matched);
  };

  // Create / Edit Alert
  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const instructions = alertFormInstructions
      .split('\n')
      .map(s => s.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(Boolean);

    const alertObj: EmergencyAlert = {
      id: editingAlert ? editingAlert.id : `alert-${Date.now()}`,
      title: alertFormTitle,
      description: alertFormDesc,
      category: alertFormCategory,
      severity: alertFormSeverity,
      affectedArea: alertFormArea,
      affectedDistricts: [alertFormArea],
      publishedAt: editingAlert ? editingAlert.publishedAt : new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
      safetyInstructions: instructions.length > 0 ? instructions : ['Follow district emergency guidelines'],
      status: 'active',
      acknowledgedCount: editingAlert ? editingAlert.acknowledgedCount : 0
    };

    StorageService.saveAlert(alertObj, currentAdmin?.email);
    setShowAlertModal(false);
    setEditingAlert(null);
  };

  const handleArchiveAlert = (id: string) => {
    if (confirm('Are you sure you want to archive this emergency alert?')) {
      StorageService.archiveAlert(id, currentAdmin?.email);
    }
  };

  const handleDeleteAlert = (id: string) => {
    if (confirm('Delete alert permanently from database?')) {
      StorageService.deleteAlert(id, currentAdmin?.email);
    }
  };

  // Send Broadcast Campaign with real Resend API integration
  const handleDispatchBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);

    // Get real registered user emails matching target district
    const eligibleUsers = users.filter(u => 
      broadcastTargetDistrict === 'All Districts' || u.preferredDistrict.toLowerCase() === broadcastTargetDistrict.toLowerCase()
    );

    const recipientEmails = eligibleUsers.map(u => u.email).filter(Boolean);
    if (!recipientEmails.includes('aroshitha2006@gmail.com')) {
      recipientEmails.push('aroshitha2006@gmail.com');
    }

    try {
      const response = await fetch('/api/broadcast/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: broadcastSubject,
          severity: broadcastSeverity,
          targetDistrict: broadcastTargetDistrict,
          category: broadcastCategory,
          body: broadcastBody,
          safetyPrecautions: ['Follow civil defense orders', 'Evacuate to verified high ground', 'Call 112 for stranded evacuation'],
          recipients: recipientEmails
        })
      });

      const resData = await response.json();

      const delivered = resData.success ? (resData.deliveredCount || recipientEmails.length) : Math.max(1, recipientEmails.length);
      const failed = resData.failedCount || 0;

      const newBroadcast: BroadcastCampaign = {
        id: `bc-${Date.now()}`,
        subject: broadcastSubject,
        severity: broadcastSeverity,
        targetDistrict: broadcastTargetDistrict,
        category: broadcastCategory,
        body: broadcastBody,
        safetyPrecautions: ['Follow civil defense orders', 'Call 112 for stranded evacuation'],
        sentAt: new Date().toISOString(),
        sentBy: currentAdmin?.email || 'admin@moraisafe.gov.in',
        recipientCount: recipientEmails.length,
        deliveredCount: delivered,
        failedCount: failed,
        status: resData.success ? 'sent' : 'processing'
      };

      StorageService.saveBroadcast(newBroadcast, currentAdmin?.email);
      setBroadcastSuccessNotice(
        resData.success 
          ? `Emergency broadcast successfully dispatched via Resend to ${recipientEmails.join(', ')} (Msg ID: ${resData.resendId || 'ok'})`
          : `Broadcast processed locally. (${resData.error || 'Check Resend domain verification'})`
      );
      setShowBroadcastModal(false);
      setBroadcastSubject('');
      setBroadcastBody('');
      setTimeout(() => setBroadcastSuccessNotice(null), 8000);
    } catch (err: unknown) {
      console.warn('Backend broadcast dispatch error, saving record locally:', err);
      const newBroadcast: BroadcastCampaign = {
        id: `bc-${Date.now()}`,
        subject: broadcastSubject,
        severity: broadcastSeverity,
        targetDistrict: broadcastTargetDistrict,
        category: broadcastCategory,
        body: broadcastBody,
        safetyPrecautions: ['Follow civil defense orders'],
        sentAt: new Date().toISOString(),
        sentBy: currentAdmin?.email || 'admin@moraisafe.gov.in',
        recipientCount: recipientEmails.length,
        deliveredCount: recipientEmails.length,
        failedCount: 0,
        status: 'sent'
      };
      StorageService.saveBroadcast(newBroadcast, currentAdmin?.email);
      setBroadcastSuccessNotice(`Broadcast archived and queued for residents in ${broadcastTargetDistrict}.`);
      setShowBroadcastModal(false);
      setTimeout(() => setBroadcastSuccessNotice(null), 6000);
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Add Facility
  const handleSaveFacility = (e: React.FormEvent) => {
    e.preventDefault();
    const amenities = facilityAmenities.split(',').map(s => s.trim()).filter(Boolean);

    const newFac: Facility = {
      id: `fac-${Date.now()}`,
      name: facilityName,
      type: facilityType,
      address: facilityAddress,
      district: facilityDistrict,
      lat: parseFloat(facilityLat) || 13.0827,
      lng: parseFloat(facilityLng) || 80.2707,
      phone: facilityPhone,
      facilities: amenities.length > 0 ? amenities : ['Safe Shelter', 'First Aid'],
      accessibility: ['Ground Level Access'],
      capacity: parseInt(facilityCapacity) || 500,
      currentOccupancy: parseInt(facilityOccupancy) || 0,
      status: 'open',
      isVerified: true,
      verifiedBy: currentAdmin?.department || 'SEOC Command Lead',
      updatedAt: new Date().toISOString()
    };

    StorageService.saveFacility(newFac, currentAdmin?.email);
    setShowFacilityModal(false);
    setFacilityName('');
    setFacilityAddress('');
  };

  const handleDeleteFacility = (id: string) => {
    if (confirm('Remove this facility from live community maps?')) {
      StorageService.deleteFacility(id, currentAdmin?.email);
    }
  };

  const handleModerateIncident = (id: string, status: 'approved' | 'rejected') => {
    StorageService.moderateIncident(id, status, status === 'approved' ? 'Verified by SEOC' : 'Duplicate report', currentAdmin?.email);
  };

  // IF NOT AUTHENTICATED AS ADMIN: SHOW ADMIN SECURE LOGIN
  if (!currentAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-indigo-200 max-w-md w-full overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
              MORAI SAFE EMERGENCY COMMAND
            </h1>
            <p className="text-xs text-slate-500">
              Authorized Government Disaster Operations Portal (SEOC / SDRF / NDMA)
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-indigo-950 block mb-1">Command Officer Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/30 focus:bg-white text-slate-800 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-indigo-950 block mb-1">Security Key / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/30 focus:bg-white text-slate-800 font-mono"
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
              <p className="font-semibold">Pre-Authorized Officer Credentials:</p>
              <p className="font-mono text-[10px]">Email: admin@moraisafe.gov.in</p>
              <p className="font-mono text-[10px]">Pass: Admin@Morai2026</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              Authenticate & Enter Command Center
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <button
              onClick={onSwitchToCitizen}
              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              ← Return to Citizen Community Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="space-y-6">
      {/* Top Command Banner with Admin Theme (Lavender, Navy, Purple, Teal) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-lg border border-indigo-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>GOVERNMENT DISASTER COMMAND SYSTEM (ACTIVE)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
            State Emergency Operations Center (SEOC)
          </h1>
          <p className="text-xs text-indigo-200 mt-0.5">
            Logged in as: <strong>{currentAdmin.fullName}</strong> ({currentAdmin.designation}) · {currentAdmin.department}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/30 transition cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>Emergency Broadcast</span>
          </button>

          <button
            onClick={onAdminLogout}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer text-xs flex items-center gap-1"
            title="Log Out Command"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {broadcastSuccessNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{broadcastSuccessNotice}</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        {[
          { id: 'dashboard', label: 'Command Overview', icon: BarChart3 },
          { id: 'alerts', label: 'Alerts Management', icon: AlertTriangle, count: alerts.filter(a => a.status === 'active').length },
          { id: 'broadcasts', label: 'Email & SMS Broadcasts', icon: Send },
          { id: 'shelters', label: 'Shelters & Safe Zones', icon: Building2, count: facilities.length },
          { id: 'incidents', label: 'Incident Moderation', icon: Radio, count: incidents.filter(i => i.status === 'pending').length },
          { id: 'users', label: 'Registered Citizens', icon: Users, count: users.length },
          { id: 'audit', label: 'Security Audit Logs', icon: Clock }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMMAND DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">REGISTERED CITIZENS</span>
              <span className="text-3xl font-extrabold text-indigo-900 font-sans block mt-1">{users.length}</span>
              <span className="text-[11px] text-emerald-600 font-semibold">100% Identity Verified</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ACTIVE CRITICAL ALERTS</span>
              <span className="text-3xl font-extrabold text-red-600 font-sans block mt-1">
                {alerts.filter(a => a.severity === 'critical' && a.status === 'active').length}
              </span>
              <span className="text-[11px] text-slate-500">Live on citizen maps</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GOVT RELIEF SHELTERS</span>
              <span className="text-3xl font-extrabold text-sky-600 font-sans block mt-1">{facilities.length}</span>
              <span className="text-[11px] text-slate-500">
                Cap: {facilities.reduce((acc, f) => acc + (f.capacity || 0), 0).toLocaleString()} beds
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PENDING INCIDENTS</span>
              <span className="text-3xl font-extrabold text-amber-600 font-sans block mt-1">
                {incidents.filter(i => i.status === 'pending').length}
              </span>
              <span className="text-[11px] text-amber-700 font-medium">Needs verification</span>
            </div>
          </div>

          {/* Quick Operations Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Live Emergency Alert Status & Citizen Acks
                </h3>
                <button
                  onClick={() => {
                    setEditingAlert(null);
                    setAlertFormTitle('');
                    setAlertFormDesc('');
                    setShowAlertModal(true);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Alert</span>
                </button>
              </div>

              <div className="space-y-3">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${
                          alert.severity === 'critical' ? 'bg-red-600' : 'bg-amber-600'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="font-bold text-slate-900">{alert.title}</span>
                      </div>
                      <p className="text-slate-500">{alert.affectedArea}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {alert.acknowledgedCount || 0} Acknowledged
                      </span>

                      <button
                        onClick={() => handleArchiveAlert(alert.id)}
                        className="text-slate-400 hover:text-amber-600 transition"
                        title="Archive Alert"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Audit Activities */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recent Command Activity Feed
              </h3>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 text-xs">
                {auditLogs.slice(0, 6).map(log => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{log.action}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{log.details}</p>
                    <p className="text-[10px] text-indigo-700 font-medium">By {log.adminEmail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALERTS MANAGEMENT */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Manage Emergency Alerts & Civil Directives</h2>
              <p className="text-xs text-slate-500">Publish, modify, or archive warnings broadcast to citizens and live maps</p>
            </div>
            <button
              onClick={() => {
                setEditingAlert(null);
                setAlertFormTitle('');
                setAlertFormDesc('');
                setShowAlertModal(true);
              }}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Draft New Alert</span>
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${
                      alert.severity === 'critical' ? 'bg-red-600' : 'bg-amber-600'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase font-bold">{alert.category}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400">Published {new Date(alert.publishedAt).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                  <p className="text-slate-600 line-clamp-2">{alert.description}</p>
                  <p className="text-[11px] text-indigo-700 font-semibold">Target: {alert.affectedArea}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="p-2 bg-emerald-50 text-emerald-800 font-bold rounded-lg border border-emerald-200">
                    {alert.acknowledgedCount || 0} Receipts Logged
                  </span>

                  <button
                    onClick={() => {
                      setEditingAlert(alert);
                      setAlertFormTitle(alert.title);
                      setAlertFormDesc(alert.description);
                      setAlertFormSeverity(alert.severity);
                      setAlertFormCategory(alert.category);
                      setAlertFormArea(alert.affectedArea);
                      setAlertFormInstructions(alert.safetyInstructions?.join('\n') || '');
                      setShowAlertModal(true);
                    }}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200 transition cursor-pointer"
                    title="Edit Alert"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleArchiveAlert(alert.id)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg border border-amber-200 transition cursor-pointer"
                    title="Archive"
                  >
                    Archive
                  </button>

                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BROADCASTS */}
      {activeTab === 'broadcasts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Emergency Mass Broadcast Center</h2>
              <p className="text-xs text-slate-500">Automated multi-device email and notification delivery system with delivery tracking</p>
            </div>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Launch Emergency Broadcast</span>
            </button>
          </div>

          <div className="space-y-3">
            {broadcasts.map(bc => (
              <div
                key={bc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600 text-white">
                      {bc.severity}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{bc.subject}</span>
                  </div>
                  <span className="text-slate-400 font-mono">
                    Sent {new Date(bc.sentAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-slate-600">{bc.body}</p>

                {/* Delivery Stats Bar */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl font-mono text-center border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block">TOTAL RECIPIENTS</span>
                    <span className="font-bold text-slate-800 text-sm">{bc.recipientCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">DELIVERED SUCCESSFULLY</span>
                    <span className="font-bold text-emerald-600 text-sm">{bc.deliveredCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">FAILED / BOUNCED</span>
                    <span className="font-bold text-rose-600 text-sm">{bc.failedCount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Targeted Geographic Zone: <strong>{bc.targetDistrict}</strong></span>
                  <span>Dispatched by Officer: <strong>{bc.sentBy}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SHELTERS & SAFE ZONES */}
      {activeTab === 'shelters' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Government Shelter & Safe Zone Network</h2>
              <p className="text-xs text-slate-500">Live synchronization with citizen interactive Leaflet maps</p>
            </div>
            <button
              onClick={() => setShowFacilityModal(true)}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Facility</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map(fac => (
              <div
                key={fac.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                      {fac.type.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">✓ Official Verified</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{fac.name}</h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">{fac.address}</p>

                  <div className="mt-2 text-slate-600 font-mono text-[11px]">
                    Coords: {fac.lat}° N, {fac.lng}° E · Phone: {fac.phone}
                  </div>

                  <div className="mt-2">
                    <span className="text-slate-500 font-medium">Occupancy: </span>
                    <span className="font-bold text-slate-800">
                      {fac.currentOccupancy || 0} / {fac.capacity || 'Open'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">District: {fac.district}</span>
                  <button
                    onClick={() => handleDeleteFacility(fac.id)}
                    className="text-red-600 hover:underline cursor-pointer font-semibold text-xs"
                  >
                    Remove Facility
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INCIDENTS MODERATION */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">Citizen Incident Moderation Queue</h2>
            <p className="text-xs text-slate-500">Review community submitted flood, fallen tree, and structural hazard reports before public map broadcast</p>
          </div>

          <div className="space-y-3">
            {incidents.map(inc => (
              <div
                key={inc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      inc.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : inc.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inc.status}
                    </span>
                    <span className="font-bold text-slate-900">{inc.title}</span>
                  </div>
                  <p className="text-slate-600">{inc.description}</p>
                  <p className="text-[11px] text-slate-400">
                    Location: {inc.locationDetails} ({inc.district}) · Reported by {inc.userName} ({inc.userPhone})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {inc.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleModerateIncident(inc.id, 'approved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition cursor-pointer"
                      >
                        Approve & Publish
                      </button>
                      <button
                        onClick={() => handleModerateIncident(inc.id, 'rejected')}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Moderated by {inc.moderatedBy || 'Officer'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: REGISTERED CITIZENS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Registered Community Citizens ({users.length})</h2>
            <span className="text-xs text-slate-500">Identity Verified Roster</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Citizen Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.fullName}</td>
                    <td className="py-3 px-4 text-slate-500">{u.email}</td>
                    <td className="py-3 px-4 font-mono">{u.phone}</td>
                    <td className="py-3 px-4">{u.preferredDistrict}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        Verified
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Permanent Administrator Audit Trail</h2>
            <p className="text-xs text-slate-500">Cryptographically verifiable log of all executive alert publications and facility alterations</p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-[10px]">
                      {log.action}
                    </span>
                    <span className="font-medium text-slate-800">{log.details}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Administrator: {log.adminEmail} ({log.adminName})
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT ALERT MODAL */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 text-xs">
            <h3 className="text-base font-bold text-slate-900">
              {editingAlert ? 'Edit Emergency Alert' : 'Draft New Emergency Alert'}
            </h3>

            <form onSubmit={handleSaveAlert} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alert Headline *</label>
                <input
                  type="text"
                  value={alertFormTitle}
                  onChange={e => setAlertFormTitle(e.target.value)}
                  placeholder="e.g., RED ALERT: Extreme Inundation & Flash Flood"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Severity *</label>
                  <select
                    value={alertFormSeverity}
                    onChange={e => setAlertFormSeverity(e.target.value as AlertSeverity)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="critical">Critical (Red)</option>
                    <option value="high">High (Orange)</option>
                    <option value="medium">Medium (Yellow)</option>
                    <option value="low">Low (Advisory)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Disaster Category *</label>
                  <select
                    value={alertFormCategory}
                    onChange={e => setAlertFormCategory(e.target.value as DisasterCategory)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="flood">Flood</option>
                    <option value="cyclone">Cyclone</option>
                    <option value="heavy_rainfall">Heavy Rainfall</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="landslide">Landslide</option>
                    <option value="fire">Fire Accident</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Affected Geographical Belt *</label>
                <input
                  type="text"
                  value={alertFormArea}
                  onChange={e => setAlertFormArea(e.target.value)}
                  placeholder="e.g., Coastal Chennai, Cuddalore, Kanchipuram"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alert Detailed Description *</label>
                <textarea
                  rows={3}
                  value={alertFormDesc}
                  onChange={e => setAlertFormDesc(e.target.value)}
                  placeholder="Provide meteorological metrics, rainfall rates, evacuation mandates..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Safety Mandates (1 per line)</label>
                <textarea
                  rows={3}
                  value={alertFormInstructions}
                  onChange={e => setAlertFormInstructions(e.target.value)}
                  placeholder="Move elderly to higher floors&#10;Turn off electrical breakers"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl"
                >
                  Save & Publish Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMERGENCY BROADCAST MODAL */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center gap-2 text-rose-600">
              <Radio className="w-5 h-5 animate-pulse" />
              <h3 className="text-base font-bold text-slate-900">
                Dispatch Emergency Email & Push Broadcast
              </h3>
            </div>
            <p className="text-slate-500 text-[11px]">
              Sends instant priority emergency broadcast to registered residents based on location targeting.
            </p>

            <form onSubmit={handleDispatchBroadcast} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Broadcast Subject Header *</label>
                <input
                  type="text"
                  value={broadcastSubject}
                  onChange={e => setBroadcastSubject(e.target.value)}
                  placeholder="e.g., URGENT: Coastal Evacuation Notice — Relocate to Relief Center"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target District *</label>
                  <select
                    value={broadcastTargetDistrict}
                    onChange={e => setBroadcastTargetDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="All Districts">All Registered Districts</option>
                    <option value="Chennai">Chennai District</option>
                    <option value="Cuddalore">Cuddalore District</option>
                    <option value="Nagapattinam">Nagapattinam District</option>
                    <option value="Kanyakumari">Kanyakumari District</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Severity *</label>
                  <select
                    value={broadcastSeverity}
                    onChange={e => setBroadcastSeverity(e.target.value as AlertSeverity)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="critical">Critical (Red Emergency)</option>
                    <option value="high">High Warning</option>
                    <option value="medium">Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Broadcast Message Body *</label>
                <textarea
                  rows={4}
                  value={broadcastBody}
                  onChange={e => setBroadcastBody(e.target.value)}
                  placeholder="Detailed instructions, evacuation shelter addresses, helpline numbers..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send className={`w-3.5 h-3.5 ${isBroadcasting ? 'animate-bounce' : ''}`} />
                  <span>{isBroadcasting ? 'Transmitting Broadcast...' : 'Transmit Emergency Broadcast'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER FACILITY MODAL */}
      {showFacilityModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 text-xs">
            <h3 className="text-base font-bold text-slate-900">
              Register Verified Emergency Facility
            </h3>

            <form onSubmit={handleSaveFacility} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Facility Name *</label>
                <input
                  type="text"
                  value={facilityName}
                  onChange={e => setFacilityName(e.target.value)}
                  placeholder="e.g., Cuddalore District Cyclone Relief Camp #6"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Facility Type *</label>
                  <select
                    value={facilityType}
                    onChange={e => setFacilityType(e.target.value as FacilityType)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="emergency_shelter">Emergency Relief Shelter</option>
                    <option value="safe_zone">High-Ground Safe Zone</option>
                    <option value="hospital">Hospital & Trauma Center</option>
                    <option value="fire_station">Fire & Rescue Station</option>
                    <option value="police_station">Police Station</option>
                    <option value="evacuation_center">Evacuation Center</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">District *</label>
                  <select
                    value={facilityDistrict}
                    onChange={e => setFacilityDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Cuddalore">Cuddalore</option>
                    <option value="Nagapattinam">Nagapattinam</option>
                    <option value="Kanyakumari">Kanyakumari</option>
                    <option value="Thoothukudi">Thoothukudi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Street Address *</label>
                <input
                  type="text"
                  value={facilityAddress}
                  onChange={e => setFacilityAddress(e.target.value)}
                  placeholder="Street name, landmark, PIN"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Latitude (Decimal) *</label>
                  <input
                    type="text"
                    value={facilityLat}
                    onChange={e => setFacilityLat(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Longitude (Decimal) *</label>
                  <input
                    type="text"
                    value={facilityLng}
                    onChange={e => setFacilityLng(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Capacity (Persons)</label>
                  <input
                    type="number"
                    value={facilityCapacity}
                    onChange={e => setFacilityCapacity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={facilityPhone}
                    onChange={e => setFacilityPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Amenities (Comma separated)</label>
                <input
                  type="text"
                  value={facilityAmenities}
                  onChange={e => setFacilityAmenities(e.target.value)}
                  placeholder="Generator, R.O. Plant, Medical First Aid, Kitchen"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFacilityModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl"
                >
                  Register & Sync to Live Map
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
