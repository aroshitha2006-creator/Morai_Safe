export type DisasterCategory = 
  | 'flood' 
  | 'cyclone' 
  | 'heavy_rainfall' 
  | 'earthquake' 
  | 'landslide' 
  | 'fire' 
  | 'tsunami' 
  | 'industrial_hazard' 
  | 'general';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface EmergencyAlert {
  id: string;
  title: string;
  titleTamil?: string;
  description: string;
  descriptionTamil?: string;
  category: DisasterCategory;
  severity: AlertSeverity;
  affectedArea: string;
  affectedDistricts: string[];
  publishedAt: string;
  expiresAt: string;
  safetyInstructions: string[];
  imageUrl?: string;
  isArchived?: boolean;
  status: 'active' | 'archived' | 'expired';
  acknowledgedCount: number;
}

export interface AlertAcknowledgement {
  id: string;
  alertId: string;
  userId: string;
  userName: string;
  userLocation: string;
  timestamp: string;
  userSafeNote?: string;
}

export type FacilityType = 
  | 'safe_zone' 
  | 'emergency_shelter' 
  | 'hospital' 
  | 'fire_station' 
  | 'police_station' 
  | 'evacuation_center';

export interface Facility {
  id: string;
  name: string;
  nameTamil?: string;
  type: FacilityType;
  address: string;
  district: string;
  lat: number;
  lng: number;
  phone: string;
  altPhone?: string;
  facilities: string[];
  accessibility: string[];
  capacity?: number;
  currentOccupancy?: number;
  status: 'open' | 'high_occupancy' | 'full' | 'standby';
  isVerified: boolean;
  photoUrl?: string;
  verifiedBy?: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDistrict: string;
  address?: string;
  isEmailVerified: boolean;
  role: 'user' | 'admin';
  notificationPreferences: {
    criticalAlerts: boolean;
    weatherWarnings: boolean;
    shelterUpdates: boolean;
    emailBroadcasts: boolean;
    browserPush: boolean;
  };
  createdAt: string;
  lastLogin: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  fullName: string;
  designation: string;
  department: string;
  role: 'super_admin' | 'disaster_officer' | 'field_coordinator';
  lastLogin: string;
}

export interface WeatherData {
  city: string;
  district: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  condition: string;
  conditionCode: number;
  warning?: string;
  warningLevel?: 'none' | 'yellow' | 'orange' | 'red';
  updatedAt: string;
  isLive: boolean;
}

export interface PDFResource {
  id: string;
  title: string;
  titleTamil: string;
  category: 'safety' | 'survival' | 'health' | 'planning';
  description: string;
  pages: number;
  preparedBy: string;
  date: string;
  fileSize: string;
  keyTopics: string[];
}

export interface BroadcastCampaign {
  id: string;
  subject: string;
  severity: AlertSeverity;
  targetDistrict: string;
  category: DisasterCategory;
  body: string;
  safetyPrecautions: string[];
  sentAt: string;
  sentBy: string;
  recipientCount: number;
  deliveredCount: number;
  failedCount: number;
  status: 'sent' | 'processing' | 'failed';
}

export interface IncidentReport {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  incidentType: 'flooding' | 'tree_fall' | 'structural_damage' | 'trapped_persons' | 'power_hazard' | 'other';
  title: string;
  description: string;
  district: string;
  locationDetails: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  reportedAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  adminName: string;
  action: string;
  category: 'alert' | 'facility' | 'broadcast' | 'incident' | 'user' | 'auth';
  targetId?: string;
  details: string;
  timestamp: string;
}

export interface ChecklistItem {
  id: string;
  category: 'water_food' | 'medical' | 'tools' | 'documents' | 'special_needs';
  title: string;
  titleTamil: string;
  description: string;
  importance: 'essential' | 'recommended' | 'optional';
  checked: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  questionTamil: string;
  category: string;
  options: string[];
  optionsTamil: string[];
  correctAnswer: number;
  explanation: string;
  explanationTamil: string;
}

export interface EmergencyContact {
  id: string;
  category: 'national' | 'police' | 'fire' | 'medical' | 'disaster' | 'district' | 'special';
  name: string;
  nameTamil?: string;
  number: string;
  altNumber?: string;
  description: string;
  district?: string;
  isTollFree?: boolean;
  available24x7: boolean;
}

export interface DistrictSubscription {
  district: string;
  subscribedAt: string;
  emailAlerts: boolean;
  pushAlerts: boolean;
}
