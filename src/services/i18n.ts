export type Language = 'en' | 'ta';

export interface Translations {
  appName: string;
  tagline: string;
  portalUser: string;
  portalAdmin: string;
  dashboard: string;
  liveMap: string;
  safeZones: string;
  shelters: string;
  emergencyAlerts: string;
  resources: string;
  checklist: string;
  quiz: string;
  reportIncident: string;
  disasterRisk: string;
  sosButton: string;
  emergencyContacts: string;
  login: string;
  register: string;
  logout: string;
  profile: string;
  currentAlerts: string;
  weatherConditions: string;
  nearbyShelters: string;
  getDirections: string;
  callNow: string;
  acknowledgeAlert: string;
  acknowledged: string;
  downloadPdf: string;
  critical: string;
  high: string;
  medium: string;
  low: string;
  filterByDistrict: string;
  searchPlaceholder: string;
  safetyInstructions: string;
  allDistricts: string;
  openStatus: string;
  fullStatus: string;
  verifiedOfficial: string;
  languageToggle: string;
  safetyGuidelines: string;
  signIn: string;
  welcome: string;
  situationSubtitle: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "MORAI SAFE",
    tagline: "Community Disaster Management & Emergency Alert Platform",
    portalUser: "Citizen Portal",
    portalAdmin: "Emergency Command Portal",
    dashboard: "Dashboard",
    liveMap: "Live Community Map",
    safeZones: "Safe Zones",
    shelters: "Emergency Shelters",
    emergencyAlerts: "Emergency Alerts",
    resources: "PDF Safety Library",
    checklist: "Emergency Checklist",
    quiz: "Disaster Preparedness Quiz",
    reportIncident: "Report Incident",
    disasterRisk: "Disaster Risk Monitor",
    sosButton: "EMERGENCY SOS",
    emergencyContacts: "Emergency Numbers",
    login: "Sign In",
    register: "Register",
    logout: "Sign Out",
    profile: "My Profile",
    currentAlerts: "Active Emergency Alerts",
    weatherConditions: "Live Meteorological Observations",
    nearbyShelters: "Verified Emergency Facilities",
    getDirections: "Get Directions",
    callNow: "Call Helpline",
    acknowledgeAlert: "Acknowledge Alert",
    acknowledged: "Acknowledged",
    downloadPdf: "Download PDF Guide",
    critical: "CRITICAL",
    high: "HIGH",
    medium: "MEDIUM",
    low: "ADVISORY",
    filterByDistrict: "Filter by District",
    searchPlaceholder: "Search facilities, alerts, guidelines...",
    safetyInstructions: "Immediate Safety Actions",
    allDistricts: "All Districts",
    openStatus: "Available & Ready",
    fullStatus: "At Maximum Capacity",
    verifiedOfficial: "NDMA / District Authority Verified",
    languageToggle: "தமிழ்",
    safetyGuidelines: "NDMA Safety Guidelines",
    signIn: "Sign In",
    welcome: "Welcome",
    situationSubtitle: "Real-time emergency management, evacuation shelter routing, and meteorological early warnings."
  },
  ta: {
    appName: "மொரை சேஃப் (MORAI SAFE)",
    tagline: "சமூக பேரிடர் மேலாண்மை மற்றும் அவசர எச்சரிக்கை தளம்",
    portalUser: "பொதுமக்கள் தளம்",
    portalAdmin: "நிர்வாகக் கட்டுப்பாட்டு மையம்",
    dashboard: "முகப்பு",
    liveMap: "நேரலை வரைபடம்",
    safeZones: "பாதுகாப்பான மண்டலங்கள்",
    shelters: "அவசர நிவாரண முகாம்கள்",
    emergencyAlerts: "அவசர எச்சரிக்கைகள்",
    resources: "பாதுகாப்பு கையேடுகள் (PDF)",
    checklist: "தயார்நிலை சரிபார்ப்புப் பட்டியல்",
    quiz: "பேரிடர் பாதுகாப்பு வினாடி வினா",
    reportIncident: "பாதிப்பைப் பதிவு செய்க",
    disasterRisk: "பேரிடர் இடர் கண்காணிப்பு",
    sosButton: "அவசர SOS உதவி",
    emergencyContacts: "அவசர உதவி எண்கள்",
    login: "உள்நுழைக",
    register: "பதிவு செய்க",
    logout: "வெளியேறுக",
    profile: "சுயவிவரம்",
    currentAlerts: "செயலில் உள்ள எச்சரிக்கைகள்",
    weatherConditions: "நேரலை வானிலை நிலவரம்",
    nearbyShelters: "அங்கீகரிக்கப்பட்ட அவசர மையங்கள்",
    getDirections: "வழிகாட்டுதல் பெறுக",
    callNow: "அழைக்க",
    acknowledgeAlert: "எச்சரிக்கையை உறுதிசெய்",
    acknowledged: "உறுதிசெய்யப்பட்டது",
    downloadPdf: "PDF பதிவிறக்குக",
    critical: "அதிதீவிரம்",
    high: "தீவிரம்",
    medium: "மிதமானது",
    low: "முன்னெச்சரிக்கை",
    filterByDistrict: "மாவட்டம் வாரியாக வடிக்க",
    searchPlaceholder: "முகாம்கள், எச்சரிக்கைகள் தேடுக...",
    safetyInstructions: "உடனடி பாதுகாப்பு வழிகாட்டல்கள்",
    allDistricts: "அனைத்து மாவட்டங்கள்",
    openStatus: "செயலில் & தயார்நிலையில்",
    fullStatus: "முழு கொள்ளளவு எட்டப்பட்டது",
    verifiedOfficial: "அரசு பேரிடர் மேலாண்மை ஆணையத்தால் சரிபார்க்கப்பட்டது",
    languageToggle: "English",
    safetyGuidelines: "NDMA பாதுகாப்பு வழிகாட்டுதல்கள்",
    signIn: "உள்நுழைக",
    welcome: "வரவேற்கிறோம்",
    situationSubtitle: "நேரலை அவசரக்கால மேலாண்மை, பாதுகாப்பு முகாம்கள் வழிகாட்டல் மற்றும் வானிலை எச்சரிக்கைகள்."
  }
};
