import { 
  EmergencyAlert, 
  Facility, 
  UserProfile, 
  AdminProfile, 
  BroadcastCampaign, 
  IncidentReport, 
  AuditLog, 
  AlertAcknowledgement, 
  ChecklistItem,
  PDFResource,
  EmergencyContact,
  DistrictSubscription
} from '../types';

const STORAGE_KEYS = {
  USERS: 'morai_users',
  CURRENT_USER: 'morai_current_user',
  ADMINS: 'morai_admins',
  CURRENT_ADMIN: 'morai_current_admin',
  ALERTS: 'morai_alerts',
  FACILITIES: 'morai_facilities',
  ACKNOWLEDGEMENTS: 'morai_acknowledgements',
  BROADCASTS: 'morai_broadcasts',
  INCIDENTS: 'morai_incidents',
  AUDIT_LOGS: 'morai_audit_logs',
  CHECKLIST: 'morai_checklist',
  QUIZ_RESULTS: 'morai_quiz_results',
  LANGUAGE: 'morai_language',
  CONTACTS: 'morai_contacts',
  SUBSCRIPTIONS: 'morai_subscriptions'
};

// Seed verified facilities across Tamil Nadu & Coastal India
const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'Cuddalore Coastal Cyclone Relief Center #4',
    nameTamil: 'கடலூர் கடலோர புயல் நிவாரண மையம் #4',
    type: 'emergency_shelter',
    address: 'Near Devanampattinam Beach Road, Cuddalore, Tamil Nadu 607001',
    district: 'Cuddalore',
    lat: 11.7480,
    lng: 79.7714,
    phone: '+91 4142 221234',
    facilities: ['Backup Solar Power', 'R.O. Clean Water Plant', 'Medical First Aid Post', 'Kitchen & Food Storage', 'Sanitation Blocks'],
    accessibility: ['Wheelchair Ramps', 'Ground Floor Accessible', 'Braille Signage'],
    capacity: 1200,
    currentOccupancy: 180,
    status: 'open',
    isVerified: true,
    verifiedBy: 'Tamil Nadu State Disaster Management Authority (TNSDMA)',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fac-2',
    name: 'Rajiv Gandhi Government General Hospital (Trauma Hub)',
    nameTamil: 'ராஜீவ் காந்தி அரசு பொது மருத்துவமனை (அவசர பிரிவு)',
    type: 'hospital',
    address: 'EVR Periyar Salai, Park Town, Chennai, Tamil Nadu 600003',
    district: 'Chennai',
    lat: 13.0818,
    lng: 80.2783,
    phone: '+91 44 2530 5000',
    facilities: ['24x7 Trauma Center', 'ICU 120 Beds', 'Blood Bank', 'Emergency Helipad', 'Decontamination Unit'],
    accessibility: ['Elevators', 'Wheelchair Ramps', 'Dedicated Ambulance Bay'],
    capacity: 2500,
    currentOccupancy: 1950,
    status: 'open',
    isVerified: true,
    verifiedBy: 'Directorate of Medical Services',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fac-3',
    name: 'Guindy Elevated Multi-hazard Safe Zone',
    nameTamil: 'கிண்டி உயரமான பல்துறை பாதுகாப்பு மண்டலம்',
    type: 'safe_zone',
    address: 'Gandhi Mandapam Road, Guindy, Chennai, Tamil Nadu 600025',
    district: 'Chennai',
    lat: 13.0067,
    lng: 80.2206,
    phone: '+91 44 2235 1111',
    facilities: ['High-Ground Elevated Platform (Flood Proof)', 'Helicopter Airdrop Zone', 'Communication Tower', 'Potable Water Tanker Station'],
    accessibility: ['Wide Paved Access Roads', 'Barrier Free Grounds'],
    capacity: 3500,
    currentOccupancy: 0,
    status: 'open',
    isVerified: true,
    verifiedBy: 'Greater Chennai Corporation Disaster Cell',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fac-4',
    name: 'Egmore Fire & State Rescue Headquarters',
    nameTamil: 'எழும்பூர் தீயணைப்பு மற்றும் மீட்புப்பணி தலைமை மையம்',
    type: 'fire_station',
    address: 'Gandhi Irwin Road, Egmore, Chennai, Tamil Nadu 600008',
    district: 'Chennai',
    lat: 13.0827,
    lng: 80.2607,
    phone: '101',
    altPhone: '+91 44 2855 4311',
    facilities: ['Heavy Inflatable Boats (NDRF)', 'Tree Clearance Chainsaws', 'High Power De-watering Pumps', 'Emergency Search & Rescue Dog Unit'],
    accessibility: ['24x7 Rapid Response Dispatch'],
    capacity: 200,
    currentOccupancy: 45,
    status: 'open',
    isVerified: true,
    verifiedBy: 'Tamil Nadu Fire & Rescue Services',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fac-5',
    name: 'Nagapattinam Coastal Multi-Purpose Evacuation Shelter',
    nameTamil: 'நாகப்பட்டினம் கடலோர பல்நோக்கு வெளியேற்ற முகாம்',
    type: 'evacuation_center',
    address: 'Velankanni Coastal Highway, Nagapattinam, Tamil Nadu 611001',
    district: 'Nagapattinam',
    lat: 10.7656,
    lng: 79.8427,
    phone: '+91 4365 242333',
    facilities: ['High Wind Resistant Dome', 'Diesel Generators', 'Community Kitchen', 'Maternal & Child Care Room'],
    accessibility: ['Wheelchair Friendly', 'Assisted Bathrooms'],
    capacity: 900,
    currentOccupancy: 95,
    status: 'open',
    isVerified: true,
    verifiedBy: 'District Collectorate Nagapattinam',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fac-6',
    name: 'Marina Beach Coastal Police & Lifeguard Command',
    nameTamil: 'மெரினா கடற்கரை கடலோர காவல் மற்றும் உயிர்காப்பாளர் மையம்',
    type: 'police_station',
    address: 'Kamarajar Salai, Triplicane, Chennai, Tamil Nadu 600005',
    district: 'Chennai',
    lat: 13.0500,
    lng: 80.2824,
    phone: '100',
    altPhone: '+91 44 2844 7788',
    facilities: ['Coastal Patrol Vehicles', 'Public Address Warning Systems', 'First Responder Drones', 'Emergency Radio VHF'],
    accessibility: ['All-Weather Command Post'],
    capacity: 100,
    currentOccupancy: 30,
    status: 'open',
    isVerified: true,
    verifiedBy: 'Greater Chennai Police',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fac-7',
    name: 'Kanyakumari High-Ground Tsunami Evacuation Complex',
    nameTamil: 'கன்னியாகுமரி ஆழிப்பேரலை பாதுகாப்பு மற்றும் வெளியேற்ற மையம்',
    type: 'safe_zone',
    address: 'Vivekanandapuram Hillock, Kanyakumari, Tamil Nadu 629702',
    district: 'Kanyakumari',
    lat: 8.0883,
    lng: 77.5385,
    phone: '+91 4652 246260',
    facilities: ['Elevation +42m Above Sea Level', 'Underground Water Reservoirs', 'Satellite Phone Link', 'Solar Battery Bank'],
    accessibility: ['Gradual Incline Rampway', 'All Mobility Access'],
    capacity: 1500,
    currentOccupancy: 0,
    status: 'open',
    isVerified: true,
    verifiedBy: 'District Disaster Management Authority Kanyakumari',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fac-8',
    name: 'Cuddalore District Government Headquarters Hospital',
    nameTamil: 'கடலூர் மாவட்ட அரசு தலைமை மருத்துவமனை',
    type: 'hospital',
    address: 'Government Hospital Road, Cuddalore Old Town, Tamil Nadu 607003',
    district: 'Cuddalore',
    lat: 11.7505,
    lng: 79.7610,
    phone: '+91 4142 230400',
    facilities: ['24/7 Emergency Casualty', 'Flood Resilient Power Generators', 'Ambulance Fleet (108)', 'Antivenom & ORS Supplies'],
    accessibility: ['Ground Level Triage', 'Stretcher Access'],
    capacity: 800,
    currentOccupancy: 620,
    status: 'high_occupancy',
    isVerified: true,
    verifiedBy: 'Directorate of Health Services',
    updatedAt: new Date().toISOString()
  }
];

// Initial active disaster alerts
const INITIAL_ALERTS: EmergencyAlert[] = [
  {
    id: 'alert-1',
    title: 'RED ALERT: Heavy to Extremely Heavy Inundation & Coastal Surge Advisory',
    titleTamil: 'சிவப்பு எச்சரிக்கை: மிகக் கனமழை மற்றும் கடலோர அலை எழுச்சி எச்சரிக்கை',
    description: 'IMD reports intense convective precipitation exceeding 200mm over North Coastal Tamil Nadu. Low-lying zones along Adyar, Cooum and Gadilam rivers are at imminent risk of waterlogging. NDRF and SDRF teams have been mobilized.',
    descriptionTamil: 'வட கடலோர மாவட்டங்களில் 200 மி.மீ-க்கு அதிகமான மிகக் கனமழை பெய்ய வாய்ப்புள்ளதாக வானிலை மையம் எச்சரித்துள்ளது. தாழ்வான பகுதிகள் மற்றும் ஆறுகளின் கரையோரப் பகுதிகளில் நீர்மட்டம் உயரும் அபாயம் உள்ளது.',
    category: 'flood',
    severity: 'critical',
    affectedArea: 'Chennai, Cuddalore, Kanchipuram and Chengalpattu Coastal Belts',
    affectedDistricts: ['Chennai', 'Cuddalore', 'Kanchipuram', 'Chengalpattu'],
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    safetyInstructions: [
      'Move elderly family members, children and pets to verified elevated shelters immediately.',
      'Turn off your main electrical circuit breakers if water enters living areas.',
      'Boil all municipal drinking water for minimum 1 minute rolling before consumption.',
      'Avoid walking or driving through moving floodwaters (just 15 cm can sweep an adult off balance).',
      'Keep your 72-hour Emergency Survival Kit and mobile phones fully charged with power banks.'
    ],
    status: 'active',
    acknowledgedCount: 246
  },
  {
    id: 'alert-2',
    title: 'ORANGE WARNING: Deep Depression Intensification & Squally Winds',
    titleTamil: 'ஆரஞ்சு எச்சரிக்கை: ஆழ்ந்த காற்றழுத்த தாழ்வு மண்டலம் மற்றும் பலத்த காற்று',
    description: 'Deep depression in Bay of Bengal moving west-northwestwards with sustained wind speeds of 55-65 km/h gusting to 75 km/h. Sea condition is rough to very rough. Fishermen are strictly advised not to venture into deep sea.',
    descriptionTamil: 'வங்கக்கடலில் நிலைகொண்டுள்ள ஆழ்ந்த காற்றழுத்த தாழ்வு மண்டலம் மேற்கு-வடமேற்கு திசையில் நகர்ந்து மணிக்கு 55-65 கி.மீ வேகத்தில் காற்று வீசக்கூடும். மீனவர்கள் கடலுக்குச் செல்ல வேண்டாம் என அறிவுறுத்தப்படுகிறார்கள்.',
    category: 'cyclone',
    severity: 'high',
    affectedArea: 'Nagapattinam, Ramanathapuram, Thoothukudi, Viluppuram',
    affectedDistricts: ['Nagapattinam', 'Ramanathapuram', 'Thoothukudi', 'Viluppuram'],
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    safetyInstructions: [
      'Reinforce glass window panes with adhesive cross-taping or wooden shutters.',
      'Clear rooftop loose debris, asbestos sheets, and unsecured overhead plastic water tanks.',
      'Park vehicles away from tall trees, rusted electric poles, and advertising hoardings.',
      'Store minimum 20 liters of safe drinking water per household in clean closed containers.'
    ],
    status: 'active',
    acknowledgedCount: 182
  },
  {
    id: 'alert-3',
    title: 'YELLOW ADVISORY: Landslide Caution in Nilgiris & Western Ghats Foothills',
    titleTamil: 'மஞ்சள் எச்சரிக்கை: நீலகிரி மற்றும் மேற்குத் தொடர்ச்சி மலை அடிவாரப் பகுதிகளில் நிலச்சரிவு எச்சரிக்கை',
    description: 'Continuous moderate downpours have saturated soil layers on mountain slopes. Slow soil creep and localized minor rockfalls observed near ghat roads. Night travel on hill highways is restricted.',
    descriptionTamil: 'தொடர் மழை காரணமாக மலைச்சரிவுகளில் மண் தளர்வடைந்துள்ளது. மலைப்பாதைகளில் இரவு நேரப் பயணம் தவிர்க்கப்பட வேண்டும்.',
    category: 'landslide',
    severity: 'medium',
    affectedArea: 'Nilgiris (Ooty-Coonoor Ghat), Kodaikanal, Valparai',
    affectedDistricts: ['Nilgiris', 'Coimbatore', 'Dindigul'],
    publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
    safetyInstructions: [
      'Watch for unusual sounds such as cracking trees or boulders knocking together.',
      'Evacuate immediately if doors/windows stick or cracks appear in plaster walls.',
      'Avoid camping or halting vehicles near steep slopes or ravine beds.'
    ],
    status: 'active',
    acknowledgedCount: 94
  }
];

// Initial 12 PDF Resources as required by Part 3 of prompt
export const OFFICIAL_PDF_RESOURCES: PDFResource[] = [
  {
    id: 'pdf-flood-safety',
    title: '1. Flood Preparedness & Rapid Safety Guide',
    titleTamil: '1. வெள்ள அபாயத் தயார்நிலை மற்றும் விரைவுப் பாதுகாப்பு வழிகாட்டி',
    category: 'safety',
    description: 'Comprehensive NDMA guidelines on flood warning signals, sandbag barriers, electrical safety, waterborne disease prevention, and safe evacuation procedures.',
    pages: 4,
    preparedBy: 'NDMA & Tamil Nadu Disaster Management Cell',
    date: '2026 Revision',
    fileSize: '420 KB',
    keyTopics: ['Warning Stages', 'Sandbag Deployment', 'Electrical Isolation', 'Waterborne Disease Mitigation', 'Evacuation Drill']
  },
  {
    id: 'pdf-cyclone-safety',
    title: '2. Cyclone Preparedness & Coastal Safety Protocols',
    titleTamil: '2. புயல் பாதுகாப்பு மற்றும் கடலோர சமூக வழிகாட்டு நெறிமுறைகள்',
    category: 'safety',
    description: 'Official protocols for cyclone alerts, window shutter reinforcement, safe shelter transition, electrical wire hazard safety, and post-storm precautions.',
    pages: 4,
    preparedBy: 'India Meteorological Department (IMD) & SDRF',
    date: '2026 Revision',
    fileSize: '390 KB',
    keyTopics: ['Color-Coded IMD Alerts', 'Structural Protection', 'Live Wire Dangers', 'Post-Cyclone Hazards', 'Emergency Radio Frequencies']
  },
  {
    id: 'pdf-earthquake-safety',
    title: '3. Earthquake Safety, Drop-Cover-Hold & Evacuation',
    titleTamil: '3. நிலநடுக்கப் பாதுகாப்பு: தரை அமர்-மூடிக்கொள்-பிடித்துக்கொள் பயிற்சி',
    category: 'safety',
    description: 'Immediate indoor survival actions, structural vulnerability checks, safe open-ground assembly, aftershock readiness, and search-and-rescue signaling.',
    pages: 3,
    preparedBy: 'National Disaster Management Authority (NDMA)',
    date: '2026 Revision',
    fileSize: '350 KB',
    keyTopics: ['Drop, Cover & Hold On', 'Unsafe Spaces to Avoid', 'Post-Quake Gas Leak Protocol', 'Aftershock Management', 'High-Rise Evacuation']
  },
  {
    id: 'pdf-fire-safety',
    title: '4. Fire Safety, Prevention & High-Rise Evacuation',
    titleTamil: '4. தீ விபத்து தடுப்பு, பாதுகாப்பு மற்றும் வெளியேற்ற வழிகாட்டி',
    category: 'safety',
    description: 'PASS fire extinguisher technique, electrical short-circuit prevention, low-smoke crawling procedures, and multi-story building exit plans.',
    pages: 4,
    preparedBy: 'Fire & Rescue Services Department',
    date: '2026 Revision',
    fileSize: '380 KB',
    keyTopics: ['P-A-S-S Extinguisher Protocol', 'Smoke Inhalation Avoidance', 'LPG Gas Cylinder Safety', 'Fire Blanket Usage', 'Assembly Point Protocol']
  },
  {
    id: 'pdf-first-aid',
    title: '5. First Aid & Critical Emergency Response',
    titleTamil: '5. முதலுதவி மற்றும் அவசர உயிர்காப்பு வழிகாட்டி',
    category: 'health',
    description: 'Step-by-step guidance for severe bleeding control, tourniquet application, CPR chest compressions, fracture splinting, and hypothermia care.',
    pages: 5,
    preparedBy: 'Indian Red Cross Society & WHO Certified Protocols',
    date: '2026 Revision',
    fileSize: '490 KB',
    keyTopics: ['Direct Pressure Bleeding Control', 'Hands-Only Adult CPR', 'Burn Cooling Protocols', 'Fracture Splinting', 'Snakebite / Shock First Aid']
  },
  {
    id: 'pdf-survival-kit',
    title: '6. 72-Hour Emergency Survival Kit Checklist',
    titleTamil: '6. 72 மணி நேர அவசர உயிர்வாழ்வு பெட்டக சரிபார்ப்புப் பட்டியல்',
    category: 'survival',
    description: 'Complete breakdown of what every Indian household needs: food, water, light, communication, tools, personal hygiene, and water-sealed document pouch.',
    pages: 3,
    preparedBy: 'NDMA Community Disaster Taskforce',
    date: '2026 Revision',
    fileSize: '310 KB',
    keyTopics: ['Water Allocation (3L/Day)', 'Non-Perishable Nutrition', 'Flashlights & Dynamo Radios', 'Sanitation Packets', 'Document Waterproofing']
  },
  {
    id: 'pdf-food-storage',
    title: '7. Long-Term Food Storage & Preservation Techniques',
    titleTamil: '7. நீண்ட கால உணவு தானிய சேமிப்பு மற்றும் பாதுகாப்பு முறைகள்',
    category: 'survival',
    description: 'Detailed instructions on preserving rice, wheat flour, lentils/pulses, ready-to-eat meals, preventing moisture, oxygen absorbers, and pest defense.',
    pages: 4,
    preparedBy: 'National Institute of Nutrition & Food Safety Authority',
    date: '2026 Revision',
    fileSize: '410 KB',
    keyTopics: ['Rice & Wheat Preservation', 'Moisture Proof Packaging', 'Pulses & Lentils Rotation', 'Vacuum & Food-grade Buckets', 'Shelf-Life Calculation']
  },
  {
    id: 'pdf-medicine-storage',
    title: '8. Essential Emergency Medicines & Medical Supplies',
    titleTamil: '8. அத்தியாவசிய அவசர மருந்துகள் மற்றும் சேமிப்பு வழிகாட்டல்',
    category: 'health',
    description: 'Official medicine lists: ORS sachets, antiseptics, pain relievers, sterile gauze, safe storage of chronic insulin/cardiac meds without electricity.',
    pages: 4,
    preparedBy: 'Directorate General of Health Services (DGHS)',
    date: '2026 Revision',
    fileSize: '430 KB',
    keyTopics: ['WHO-Standard ORS Electrolytes', 'Chronic Disease Prescription Backup', 'Cold-Chain Insulin Storage Tips', 'Wound Dressings', 'Medicine Expiry Tracking']
  },
  {
    id: 'pdf-safe-water',
    title: '9. Safe Drinking Water Purification & Storage',
    titleTamil: '9. பாதுகாப்பான குடிநீர் சுத்திகரிப்பு மற்றும் சேமிப்பு முறைகள்',
    category: 'survival',
    description: 'Chlorine tablet dosing, 1-minute rolling boil, ceramic filtration, food-grade HDPE containers, and preventing mosquito breeding.',
    pages: 3,
    preparedBy: 'Ministry of Jal Shakti & WHO Guidelines',
    date: '2026 Revision',
    fileSize: '340 KB',
    keyTopics: ['Chlorine Halazone Dosing', 'Rolling Boil Disinfection', 'HDPE Water Container Criteria', 'Safe Dipping & Dispensing', 'Water Testing Strips']
  },
  {
    id: 'pdf-family-plan',
    title: '10. Family Emergency Communication & Evacuation Plan',
    titleTamil: '10. குடும்ப அவசர தொடர்பு மற்றும் வெளியேற்ற திட்டம்',
    category: 'planning',
    description: 'Designating primary and secondary meeting points, choosing an out-of-district contact relative, wallet cards for school children, and reunion protocols.',
    pages: 3,
    preparedBy: 'NDMA Family Preparedness Directorate',
    date: '2026 Revision',
    fileSize: '320 KB',
    keyTopics: ['Two Meeting Places (Near Home / Outside Area)', 'Out-of-Town Relative Hub', 'SMS over Voice Protocol', 'Child Identity Cards', 'Pet Evacuation Care']
  },
  {
    id: 'pdf-children-elderly',
    title: '11. Emergency Safety for Children & Older Adults',
    titleTamil: '11. குழந்தைகள் மற்றும் முதியோருக்கான அவசர பாதுகாப்பு வழிகாட்டி',
    category: 'planning',
    description: 'Pediatric rehydration, infant formula safety, elderly mobility assistance, continuous oxygen backup, dementia caregiver disaster strategies.',
    pages: 4,
    preparedBy: 'Ministry of Social Justice & Empowerment & UNICEF',
    date: '2026 Revision',
    fileSize: '390 KB',
    keyTopics: ['Infant Feeding Safety', 'Mobility Device Waterproofing', 'Elderly Medical Summary Cards', 'Comfort Items & Trauma Relief', 'Neighborhood Buddy System']
  },
  {
    id: 'pdf-disabilities',
    title: '12. Preparedness for Persons with Disabilities (PwD)',
    titleTamil: '12. மாற்றுத்திறனாளிகளுக்கான பிரத்யேக பேரிடர் தயார்நிலை',
    category: 'planning',
    description: 'Accessible escape routes, wheelchair emergency evacuation, tactile and visual alert systems, service animal care, and assistive device battery backup.',
    pages: 4,
    preparedBy: 'Department of Empowerment of Persons with Disabilities',
    date: '2026 Revision',
    fileSize: '400 KB',
    keyTopics: ['Wheelchair Carry-Down Techniques', 'Visual & Tactile Alert Alarms', '7-Day Assistive Tech Power Plan', 'Personal Support Network Matrix', 'Disability Registry Link']
  }
];

// Initial Checklist Items
const INITIAL_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk-1',
    category: 'water_food',
    title: 'Drinking Water (Minimum 12 Litres per person)',
    titleTamil: 'குடிநீர் (ஒரு நபருக்கு குறைந்தபட்சம் 12 லிட்டர்)',
    description: 'Stored in clean, tightly closed food-grade food-safe containers for 3 days minimum.',
    importance: 'essential',
    checked: true
  },
  {
    id: 'chk-2',
    category: 'water_food',
    title: 'Ready-to-Eat Non-Perishable Food',
    titleTamil: 'சமைக்கத் தேவையில்லாத உலர் உணவுப் பொருட்கள்',
    description: 'Roasted gram, nuts, dates, energy biscuits, canned legumes that do not require cooking or refrigeration.',
    importance: 'essential',
    checked: true
  },
  {
    id: 'chk-3',
    category: 'medical',
    title: 'First-Aid Kit with Bandages & Antiseptic',
    titleTamil: 'முதலுதவி பெட்டி, கட்டுத்துணி மற்றும் கிருமிநாசினி',
    description: 'Sterile gauze rolls, cotton, Betadine solution, adhesive plasters, medical scissors, and tweezers.',
    importance: 'essential',
    checked: false
  },
  {
    id: 'chk-4',
    category: 'medical',
    title: 'Prescription Medicines & ORS Sachets',
    titleTamil: 'தினசரி மருத்துவ மாத்திரைகள் மற்றும் ஓ.ஆர்.எஸ் பாக்கெட்டுகள்',
    description: 'Minimum 14-day supply of daily BP, diabetes, thyroid or heart medications with doctor prescriptions.',
    importance: 'essential',
    checked: false
  },
  {
    id: 'chk-5',
    category: 'tools',
    title: 'Waterproof LED Torch with Spare Batteries',
    titleTamil: 'நீர்புகா எல்.இ.டி டார்ச் மற்றும் கூடுதல் பேட்டரிகள்',
    description: 'High-lumen flashlight and headlamp for hands-free movement in power outages.',
    importance: 'essential',
    checked: true
  },
  {
    id: 'chk-6',
    category: 'tools',
    title: 'Battery-Operated or Solar Emergency Radio',
    titleTamil: 'பேட்டரி அல்லது சோலார் மூலம் இயங்கும் வானொலி',
    description: 'To receive All India Radio (AIR) and NDMA official disaster broadcasts when mobile towers collapse.',
    importance: 'essential',
    checked: false
  },
  {
    id: 'chk-7',
    category: 'tools',
    title: 'High-Capacity Power Bank (20,000 mAh)',
    titleTamil: 'முழுமையாக சார்ஜ் செய்யப்பட்ட பவர் பேங்க்',
    description: 'Fully charged with USB cables for mobile phones and emergency signaling.',
    importance: 'essential',
    checked: true
  },
  {
    id: 'chk-8',
    category: 'documents',
    title: 'Waterproof Pouch with Aadhaar, Land & Bank Records',
    titleTamil: 'நீர்புகா பையில் ஆதார், நிலம் மற்றும் வங்கி ஆவணங்கள்',
    description: 'Certified copies and original IDs, property deeds, ration cards, insurance and educational certificates.',
    importance: 'essential',
    checked: false
  },
  {
    id: 'chk-9',
    category: 'tools',
    title: 'High-Pitch Emergency Whistle',
    titleTamil: 'அவசர ஒலி எழுப்பும் விசில்கள்',
    description: 'To signal rescue workers if trapped under debris or isolated by rising floodwaters.',
    importance: 'essential',
    checked: false
  },
  {
    id: 'chk-10',
    category: 'special_needs',
    title: 'Emergency Cash in Small Denominations',
    titleTamil: 'சிறிய ரூபாய் நோட்டுகளாக அவசர ரொக்கப் பணம்',
    description: 'ATMs and digital UPI payment servers fail during severe cyclones and grid failures.',
    importance: 'recommended',
    checked: true
  }
];

// Initial Incident Reports
const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc-1',
    userId: 'user-sample-1',
    userName: 'Karthik Subramanian',
    userPhone: '+91 98401 22334',
    incidentType: 'flooding',
    title: 'Severe Waterlogging Over 3.5 Feet on Velachery Main Road',
    description: 'Stormwater canal breached near AGS Colony. Inundation entered ground floor apartments. Power shut off as precaution.',
    district: 'Chennai',
    locationDetails: 'Near AGS Colony 4th Cross, Velachery, Chennai',
    lat: 12.9815,
    lng: 80.2180,
    status: 'approved',
    reportedAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    moderatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    moderatedBy: 'admin@moraisafe.gov.in'
  },
  {
    id: 'inc-2',
    userId: 'user-sample-2',
    userName: 'Ananya Meenakshi',
    userPhone: '+91 94440 98765',
    incidentType: 'tree_fall',
    title: 'Massive Banyan Tree Uprooted Blocking Hospital Access Road',
    description: 'Heavy wind gust brought down 40-year banyan tree completely blocking ambulance lane leading to Old Town Hospital.',
    district: 'Cuddalore',
    locationDetails: 'Hospital Road Junction, Cuddalore Old Town',
    lat: 11.7512,
    lng: 79.7625,
    status: 'approved',
    reportedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    moderatedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    moderatedBy: 'admin@moraisafe.gov.in'
  }
];

// Admin default profiles
const INITIAL_ADMINS: AdminProfile[] = [
  {
    id: 'admin-super',
    email: 'admin@moraisafe.gov.in',
    fullName: 'Dr. R. Vijayakumar, IAS',
    designation: 'Special Relief Commissioner & State Disaster Officer',
    department: 'State Emergency Operations Center (SEOC)',
    role: 'super_admin',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'admin-field',
    email: 'cuddalore.control@moraisafe.gov.in',
    fullName: 'M. Senthil Nathan',
    designation: 'District Emergency Operations Center Lead',
    department: 'Revenue & Disaster Management Department',
    role: 'disaster_officer',
    lastLogin: new Date().toISOString()
  }
];

// Default sample user
const INITIAL_USER: UserProfile = {
  id: 'usr-default',
  fullName: 'Aroshitha R.',
  email: 'aroshitha2006@gmail.com',
  phone: '+91 98402 11223',
  preferredDistrict: 'Chennai',
  address: 'No 45, Anna Nagar 2nd Avenue, Chennai 600040',
  isEmailVerified: true,
  role: 'user',
  notificationPreferences: {
    criticalAlerts: true,
    weatherWarnings: true,
    shelterUpdates: true,
    emailBroadcasts: true,
    browserPush: true
  },
  createdAt: '2026-01-15T10:00:00Z',
  lastLogin: new Date().toISOString()
};

// Initial Broadcast Logs
const INITIAL_BROADCASTS: BroadcastCampaign[] = [
  {
    id: 'bc-101',
    subject: 'URGENT: Coastal Evacuation & Inundation Warning for Coastal Chennai & Cuddalore',
    severity: 'critical',
    targetDistrict: 'Chennai',
    category: 'flood',
    body: 'Continuous downpour forecast for next 24 hours. Verified shelters at Guindy and Cuddalore are open with generator backup, food and water. Please review the attached PDF safety guidelines.',
    safetyPrecautions: ['Move to higher floors', 'Do not drive through underpasses', 'Call 112 for stranded evacuation'],
    sentAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    sentBy: 'admin@moraisafe.gov.in',
    recipientCount: 4280,
    deliveredCount: 4212,
    failedCount: 68,
    status: 'sent'
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    adminEmail: 'admin@moraisafe.gov.in',
    adminName: 'Dr. R. Vijayakumar, IAS',
    action: 'PUBLISH_ALERT',
    category: 'alert',
    targetId: 'alert-1',
    details: 'Issued RED ALERT for Chennai, Cuddalore coastal belts with 24h validity.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'log-2',
    adminEmail: 'admin@moraisafe.gov.in',
    adminName: 'Dr. R. Vijayakumar, IAS',
    action: 'DISPATCH_BROADCAST',
    category: 'broadcast',
    targetId: 'bc-101',
    details: 'Sent high-priority emergency email broadcast to 4,280 registered residents.',
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString()
  },
  {
    id: 'log-3',
    adminEmail: 'cuddalore.control@moraisafe.gov.in',
    adminName: 'M. Senthil Nathan',
    action: 'UPDATE_SHELTER',
    category: 'facility',
    targetId: 'fac-1',
    details: 'Updated occupancy for Cuddalore Shelter #4 to 180 persons. R.O. plant confirmed active.',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  }
];

export class StorageService {
  private static notifyChange() {
    window.dispatchEvent(new Event('morai_storage_updated'));
  }

  // --- Users ---
  static getUsers(): UserProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      const initial = [INITIAL_USER];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [INITIAL_USER];
    }
  }

  static getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      // Default to logged-in verified sample user for seamless immediate demo
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USER));
      return INITIAL_USER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.notifyChange();
  }

  static saveUser(user: UserProfile): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    if (this.getCurrentUser()?.id === user.id) {
      this.setCurrentUser(user);
    }
    this.notifyChange();
  }

  // --- Admin ---
  static getAdmins(): AdminProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMINS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(INITIAL_ADMINS));
      return INITIAL_ADMINS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ADMINS;
    }
  }

  static getCurrentAdmin(): AdminProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static setCurrentAdmin(admin: AdminProfile | null): void {
    if (admin) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(admin));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
    }
    this.notifyChange();
  }

  // --- Alerts ---
  static getAlerts(): EmergencyAlert[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(INITIAL_ALERTS));
      return INITIAL_ALERTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ALERTS;
    }
  }

  static saveAlert(alert: EmergencyAlert, adminEmail = 'admin@moraisafe.gov.in'): void {
    const alerts = this.getAlerts();
    const index = alerts.findIndex(a => a.id === alert.id);
    const isNew = index === -1;
    if (index >= 0) {
      alerts[index] = alert;
    } else {
      alerts.unshift(alert);
    }
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));

    this.addAuditLog({
      adminEmail,
      adminName: 'Authorized Disaster Officer',
      action: isNew ? 'CREATE_ALERT' : 'UPDATE_ALERT',
      category: 'alert',
      targetId: alert.id,
      details: `${isNew ? 'Created' : 'Updated'} alert: "${alert.title}" (${alert.severity.toUpperCase()})`
    });

    this.notifyChange();
  }

  static archiveAlert(alertId: string, adminEmail = 'admin@moraisafe.gov.in'): void {
    const alerts = this.getAlerts().map(a => {
      if (a.id === alertId) {
        return { ...a, status: 'archived' as const };
      }
      return a;
    });
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    this.addAuditLog({
      adminEmail,
      adminName: 'Authorized Disaster Officer',
      action: 'ARCHIVE_ALERT',
      category: 'alert',
      targetId: alertId,
      details: `Archived emergency alert ID ${alertId}`
    });
    this.notifyChange();
  }

  static deleteAlert(alertId: string, adminEmail = 'admin@moraisafe.gov.in'): void {
    const alerts = this.getAlerts().filter(a => a.id !== alertId);
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    this.addAuditLog({
      adminEmail,
      adminName: 'Authorized Disaster Officer',
      action: 'DELETE_ALERT',
      category: 'alert',
      targetId: alertId,
      details: `Deleted emergency alert ID ${alertId}`
    });
    this.notifyChange();
  }

  // --- Acknowledgements ---
  static getAcknowledgements(): AlertAcknowledgement[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ACKNOWLEDGEMENTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static acknowledgeAlert(alertId: string, user: UserProfile, note?: string): void {
    const acks = this.getAcknowledgements();
    const exists = acks.some(a => a.alertId === alertId && a.userId === user.id);
    if (!exists) {
      acks.push({
        id: `ack-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        alertId,
        userId: user.id,
        userName: user.fullName,
        userLocation: user.preferredDistrict,
        timestamp: new Date().toISOString(),
        userSafeNote: note
      });
      localStorage.setItem(STORAGE_KEYS.ACKNOWLEDGEMENTS, JSON.stringify(acks));

      // Increment alert count
      const alerts = this.getAlerts().map(a => {
        if (a.id === alertId) {
          return { ...a, acknowledgedCount: (a.acknowledgedCount || 0) + 1 };
        }
        return a;
      });
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
      this.notifyChange();
    }
  }

  static isAlertAcknowledgedByUser(alertId: string, userId: string): boolean {
    const acks = this.getAcknowledgements();
    return acks.some(a => a.alertId === alertId && a.userId === userId);
  }

  // --- Facilities (Safe Zones, Shelters, Hospitals, Fire, Police) ---
  static getFacilities(): Facility[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FACILITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(INITIAL_FACILITIES));
      return INITIAL_FACILITIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FACILITIES;
    }
  }

  static saveFacility(facility: Facility, adminEmail = 'admin@moraisafe.gov.in'): void {
    const list = this.getFacilities();
    const index = list.findIndex(f => f.id === facility.id);
    const isNew = index === -1;
    if (index >= 0) {
      list[index] = facility;
    } else {
      list.push(facility);
    }
    localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(list));

    this.addAuditLog({
      adminEmail,
      adminName: 'Facility Command Lead',
      action: isNew ? 'CREATE_FACILITY' : 'UPDATE_FACILITY',
      category: 'facility',
      targetId: facility.id,
      details: `${isNew ? 'Added new' : 'Updated'} facility: ${facility.name} (${facility.type}) in ${facility.district}`
    });

    this.notifyChange();
  }

  static deleteFacility(facilityId: string, adminEmail = 'admin@moraisafe.gov.in'): void {
    const list = this.getFacilities().filter(f => f.id !== facilityId);
    localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(list));
    this.addAuditLog({
      adminEmail,
      adminName: 'Facility Command Lead',
      action: 'DELETE_FACILITY',
      category: 'facility',
      targetId: facilityId,
      details: `Removed facility ID ${facilityId}`
    });
    this.notifyChange();
  }

  // --- Broadcasts ---
  static getBroadcasts(): BroadcastCampaign[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BROADCASTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BROADCASTS, JSON.stringify(INITIAL_BROADCASTS));
      return INITIAL_BROADCASTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BROADCASTS;
    }
  }

  static saveBroadcast(broadcast: BroadcastCampaign, adminEmail = 'admin@moraisafe.gov.in'): void {
    const list = this.getBroadcasts();
    list.unshift(broadcast);
    localStorage.setItem(STORAGE_KEYS.BROADCASTS, JSON.stringify(list));

    this.addAuditLog({
      adminEmail,
      adminName: 'Emergency Communications Director',
      action: 'DISPATCH_BROADCAST',
      category: 'broadcast',
      targetId: broadcast.id,
      details: `Broadcast sent to ${broadcast.recipientCount} citizens (${broadcast.targetDistrict}): "${broadcast.subject}"`
    });

    this.notifyChange();
  }

  // --- Incidents ---
  static getIncidents(): IncidentReport[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(INITIAL_INCIDENTS));
      return INITIAL_INCIDENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_INCIDENTS;
    }
  }

  static submitIncident(incident: Omit<IncidentReport, 'id' | 'reportedAt' | 'status'>): IncidentReport {
    const full: IncidentReport = {
      ...incident,
      id: `inc-${Date.now()}`,
      status: 'pending',
      reportedAt: new Date().toISOString()
    };
    const list = this.getIncidents();
    list.unshift(full);
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(list));
    this.notifyChange();
    return full;
  }

  static moderateIncident(incidentId: string, status: 'approved' | 'rejected', reason?: string, adminEmail = 'admin@moraisafe.gov.in'): void {
    const list = this.getIncidents().map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status,
          rejectionReason: reason,
          moderatedAt: new Date().toISOString(),
          moderatedBy: adminEmail
        };
      }
      return inc;
    });
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(list));

    this.addAuditLog({
      adminEmail,
      adminName: 'Operations Lead',
      action: status === 'approved' ? 'APPROVE_INCIDENT' : 'REJECT_INCIDENT',
      category: 'incident',
      targetId: incidentId,
      details: `${status.toUpperCase()} community incident report (${incidentId}): ${reason || 'Verified by disaster team'}`
    });

    this.notifyChange();
  }

  // --- Checklist ---
  static getChecklist(): ChecklistItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(INITIAL_CHECKLIST));
      return INITIAL_CHECKLIST;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CHECKLIST;
    }
  }

  static toggleChecklistItem(id: string): void {
    const items = this.getChecklist().map(item => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(items));
    this.notifyChange();
  }

  static resetChecklist(): void {
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(INITIAL_CHECKLIST));
    this.notifyChange();
  }

  // --- Audit Logs ---
  static getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  static addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString()
    });
    // Keep last 150 entries
    if (logs.length > 150) logs.length = 150;
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  }

  // Broadcast alias
  static addBroadcast(broadcast: BroadcastCampaign, adminEmail?: string): void {
    this.saveBroadcast(broadcast, adminEmail);
  }

  // --- Emergency Directory Contacts ---
  static getEmergencyContacts(): EmergencyContact[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(INITIAL_CONTACTS));
      return INITIAL_CONTACTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CONTACTS;
    }
  }

  static saveEmergencyContact(contact: EmergencyContact, adminEmail = 'admin@moraisafe.gov.in'): void {
    const list = this.getEmergencyContacts();
    const existingIndex = list.findIndex(c => c.id === contact.id);
    if (existingIndex >= 0) {
      list[existingIndex] = contact;
    } else {
      list.unshift(contact);
    }
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(list));
    this.addAuditLog({
      adminEmail,
      adminName: 'Operations Lead',
      action: 'UPDATE_DIRECTORY',
      category: 'facility',
      targetId: contact.id,
      details: `Updated emergency contact ${contact.name} (${contact.number})`
    });
    this.notifyChange();
  }

  static deleteEmergencyContact(id: string, adminEmail = 'admin@moraisafe.gov.in'): void {
    const list = this.getEmergencyContacts().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(list));
    this.addAuditLog({
      adminEmail,
      adminName: 'Operations Lead',
      action: 'DELETE_DIRECTORY',
      category: 'facility',
      targetId: id,
      details: `Removed emergency directory contact ${id}`
    });
    this.notifyChange();
  }

  // --- District Subscriptions ---
  static getSubscriptions(): DistrictSubscription[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    if (!raw) {
      const defaults: DistrictSubscription[] = [
        { district: 'Chennai', subscribedAt: new Date().toISOString(), emailAlerts: true, pushAlerts: true },
        { district: 'Cuddalore', subscribedAt: new Date().toISOString(), emailAlerts: true, pushAlerts: false }
      ];
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(defaults));
      return defaults;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static toggleDistrictSubscription(district: string, type: 'email' | 'push'): void {
    const subs = this.getSubscriptions();
    const existing = subs.find(s => s.district.toLowerCase() === district.toLowerCase());
    if (existing) {
      if (type === 'email') existing.emailAlerts = !existing.emailAlerts;
      if (type === 'push') existing.pushAlerts = !existing.pushAlerts;
      if (!existing.emailAlerts && !existing.pushAlerts) {
        const filtered = subs.filter(s => s.district.toLowerCase() !== district.toLowerCase());
        localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(filtered));
        this.notifyChange();
        return;
      }
    } else {
      subs.push({
        district,
        subscribedAt: new Date().toISOString(),
        emailAlerts: type === 'email',
        pushAlerts: type === 'push'
      });
    }
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
    this.notifyChange();
  }

  static saveUserProfile(profile: UserProfile): void {
    const users = this.getUsers().map(u => u.id === profile.id ? profile : u);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    if (this.getCurrentUser()?.id === profile.id) {
      this.setCurrentUser(profile);
    }
    this.notifyChange();
  }
}

const INITIAL_CONTACTS: EmergencyContact[] = [
  {
    id: 'cnt-1',
    category: 'national',
    name: 'National Emergency Response Support System',
    nameTamil: 'தேசிய அவசரக்கால உதவி அமைப்பு (112)',
    number: '112',
    description: 'Unified 24x7 emergency response for Police, Fire, and Ambulance across India.',
    district: 'All Districts',
    isTollFree: true,
    available24x7: true
  },
  {
    id: 'cnt-2',
    category: 'disaster',
    name: 'State Disaster Management Authority (SEOC)',
    nameTamil: 'மாநில பேரிடர் மேலாண்மை கட்டுப்பாட்டு மையம்',
    number: '1070',
    altNumber: '+91 44 2859 3990',
    description: 'State Emergency Operations Center for cyclone, flood & disaster warnings.',
    district: 'All Districts',
    isTollFree: true,
    available24x7: true
  },
  {
    id: 'cnt-3',
    category: 'district',
    name: 'District Collectorate Emergency Control Room',
    nameTamil: 'மாவட்ட ஆட்சியர் அலுவலக பேரிடர் பிரிவு',
    number: '1077',
    description: 'Direct link to District Disaster Management Authority (DDMA) command cells.',
    district: 'All Districts',
    isTollFree: true,
    available24x7: true
  },
  {
    id: 'cnt-4',
    category: 'fire',
    name: 'Fire & Rescue Services Control',
    nameTamil: 'தீயணைப்பு மற்றும் மீட்புப்பணி அவசர எண்',
    number: '101',
    altNumber: '+91 44 2855 4311',
    description: 'Immediate fire extinguishing, flood boat rescues, and structural collapse response.',
    district: 'All Districts',
    isTollFree: true,
    available24x7: true
  },
  {
    id: 'cnt-5',
    category: 'medical',
    name: 'Government Emergency Medical Ambulance',
    nameTamil: 'அவசர மருத்துவ ஊர்தி சேவை (108 ஆம்புலன்ஸ்)',
    number: '108',
    altNumber: '+91 44 2819 0300',
    description: '24x7 free emergency ambulance service with paramedic support.',
    district: 'All Districts',
    isTollFree: true,
    available24x7: true
  },
  {
    id: 'cnt-6',
    category: 'police',
    name: 'Police Control & Rapid Action Force',
    nameTamil: 'காவல்துறை கட்டுப்பாட்டு அறை',
    number: '100',
    altNumber: '112',
    description: 'Law enforcement, civil protection, and area cordon operations during disasters.',
    district: 'All Districts',
    isTollFree: true,
    available24x7: true
  },
  {
    id: 'cnt-7',
    category: 'special',
    name: 'Women Helpline & Distress Protection',
    nameTamil: 'மகளிர் உதவி மையம் (181)',
    number: '181',
    description: '24x7 emergency safety and psychological counseling for women in distress.',
    district: 'All Districts',
    isTollFree: true,
    available24x7: true
  },
  {
    id: 'cnt-8',
    category: 'special',
    name: 'National Childline Emergency Rescue',
    nameTamil: 'குழந்தைகள் அவசர உதவி எண் (1098)',
    number: '1098',
    description: 'Special emergency protection for lost, stranded or unaccompanied children.',
    district: 'All Districts',
    isTollFree: true,
    available24x7: true
  },
  {
    id: 'cnt-9',
    category: 'disaster',
    name: 'National Disaster Response Force (NDRF)',
    nameTamil: 'தேசிய பேரிடர் மீட்புப்படை (NDRF)',
    number: '011-24363260',
    altNumber: '+91 97110 77372',
    description: 'Specialized airborne and flood boat rescue unit deployed during severe inundation.',
    district: 'All Districts',
    isTollFree: false,
    available24x7: true
  },
  {
    id: 'cnt-10',
    category: 'special',
    name: 'Indian Coast Guard Search & Rescue',
    nameTamil: 'இந்திய கடலோர காவல்படை மீட்பு மையம்',
    number: '1554',
    altNumber: '+91 44 2346 0405',
    description: 'Maritime search and rescue, fisherman distress alerts, and coastal storm surveillance.',
    district: 'Coastal Belt',
    isTollFree: true,
    available24x7: true
  },
  {
    id: 'cnt-11',
    category: 'district',
    name: 'Greater Chennai Corporation Disaster Helpline',
    nameTamil: 'பெருநகர சென்னை மாநகராட்சி கட்டுப்பாட்டு அறை',
    number: '1913',
    altNumber: '+91 44 2561 9206',
    description: 'Inundation pumping, fallen tree clearance, and relief camp coordination in Chennai.',
    district: 'Chennai',
    isTollFree: true,
    available24x7: true
  },
  {
    id: 'cnt-12',
    category: 'district',
    name: 'Cuddalore District Collectorate Flood Cell',
    nameTamil: 'கடலூர் மாவட்ட பேரிடர் கட்டுப்பாட்டு அறை',
    number: '04142-220000',
    altNumber: '1077',
    description: 'Cyclone warnings and shelter status for Cuddalore coastal villages.',
    district: 'Cuddalore',
    isTollFree: false,
    available24x7: true
  }
];
