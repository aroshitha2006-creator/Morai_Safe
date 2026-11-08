import jsPDF from 'jspdf';
import { PDFResource } from '../types';
export { OFFICIAL_PDF_RESOURCES } from './storage';

interface PDFDetailContent {
  title: string;
  subtitle: string;
  authority: string;
  beforeInstructions: string[];
  duringInstructions: string[];
  afterInstructions: string[];
  checklists: string[];
  foodAndWaterTips?: string[];
  medicineAndMedicalTips?: string[];
  references: string[];
  emergencyContacts: { service: string; number: string }[];
}

const PDF_CONTENTS: Record<string, PDFDetailContent> = {
  'pdf-flood-safety': {
    title: 'FLOOD PREPAREDNESS & RAPID SAFETY PROTOCOL',
    subtitle: 'National Disaster Management Authority (NDMA) & Tamil Nadu SDRF Standard Operating Guidelines',
    authority: 'Ministry of Home Affairs & Directorate of Disaster Management, Govt. of India',
    beforeInstructions: [
      'Ascertain whether your residence or workplace lies within a low-lying flood inundation catchment.',
      'Construct temporary sandbag barriers at doorway thresholds and ground-floor vents.',
      'Elevate essential appliances, electrical switchboards, inverter batteries, and chemical containers above projected flood levels.',
      'Clear rooftop downspouts and surrounding neighborhood stormwater street drains of polythene waste.',
      'Safeguard land deeds, ration cards, Aadhaar documents, and insurance bonds in airtight, waterproof bags.'
    ],
    duringInstructions: [
      'Turn OFF your central electrical breaker and close the main LPG gas cylinder regulator before floodwaters breach your floor.',
      'NEVER attempt to walk or drive through moving water. 15 cm of moving floodwater can destabilize an adult, and 30 cm can float a passenger car.',
      'Stay off bridges with rapidly flowing turbulent water underneath.',
      'If trapped inside a submerged structure, ascend to the highest floor or roof. DO NOT climb into a closed attic where rising waters could trap you.',
      'Signal rescue boats and aerial search helicopters using brightly colored cloth or an emergency whistle.'
    ],
    afterInstructions: [
      'Return home ONLY after civil authorities issue an official all-clear via AIR Radio or MORAI SAFE alerts.',
      'Do not switch electrical mains back on until a licensed wireman certifies all conduits are completely dry.',
      'Disinfect all living surfaces, kitchenware, and floors using a 0.5% sodium hypochlorite solution to prevent leptospirosis and cholera.',
      'Discard all food, medicines, and water that came into contact with contaminated floodwaters.',
      'Boil all municipal drinking water for minimum 1 minute rolling before consumption.'
    ],
    checklists: [
      'Emergency whistle for each family member',
      'Waterproof LED flashlights with extra cell batteries',
      'Minimum 12 liters potable water per person (3-day supply)',
      'Waterproof document pouch with essential IDs and insurance',
      'First-aid kit with Betadine, waterproof bandages, and sterile cotton'
    ],
    foodAndWaterTips: [
      'Store high-calorie biscuits, roasted gram (pottukadalai), dates, and ready-to-eat pouches.',
      'Disinfect suspect tap water using 1 chlorine tablet (Halazone 4mg) per 5 liters of clear water; wait 30 minutes before drinking.'
    ],
    medicineAndMedicalTips: [
      'Stock 10 packets of WHO-standard Oral Rehydration Salts (ORS) to treat acute waterborne diarrhea.',
      'Keep 15-day backup of prescription hypertension and diabetic medications in double zip-lock pouches.'
    ],
    references: [
      'NDMA National Flood Management Guidelines (2026 Edition)',
      'Central Water Commission (CWC) Flood Forecasting Protocol',
      'World Health Organization (WHO) Waterborne Disease Outbreak Control Manual'
    ],
    emergencyContacts: [
      { service: 'National Disaster Response (All-India)', number: '112' },
      { service: 'State Disaster Management Control Room', number: '1070' },
      { service: 'District Emergency Operations Center', number: '1077' },
      { service: 'State Flood & Cyclone Rescue Line', number: '1070' }
    ]
  },

  'pdf-cyclone-safety': {
    title: 'CYCLONE PREPAREDNESS & COASTAL SURGE DEFENSE',
    subtitle: 'Standard Operating Procedures for Tropical Cyclones in Coastal Regions',
    authority: 'India Meteorological Department (IMD) & National Cyclone Risk Mitigation Project',
    beforeInstructions: [
      'Inspect roof tiles, asbestos sheets, and tin sheds; nail down or replace damaged fastenings.',
      'Trim dead or overhanging tree branches located close to your house roof or electric service lines.',
      'Affix heavy-duty adhesive tape in an "X" pattern across large glass window panes to prevent dangerous shatter fragments.',
      'Dismantle or firmly lash rooftop TV dish antennas, empty plastic syntex tanks, and advertising boards.',
      'Store minimum 3 days of ready food, potable water, battery-operated radio, and fully charged power banks.'
    ],
    duringInstructions: [
      'Remain indoors in the strongest, central room of the building away from external windows.',
      'Turn off all electrical appliances and close the main LPG gas cylinder valve.',
      'Do not be misled by the temporary calm of the cyclone "Eye". The reverse gale winds will strike with equal or greater ferocity in the next 30 to 60 minutes.',
      'Listen continuously to official bulletins on battery-powered radio or MORAI SAFE portal.'
    ],
    afterInstructions: [
      'Do not venture outside until local authorities officially declare the cyclone has completely made landfall and dissipated.',
      'Beware of severed overhead live power cables lying in puddles or dangling from fallen trees. Report them to 1912 / 112 immediately.',
      'Check for gas leaks before lighting stoves, matches, or candles. Use battery torches only.',
      'Cooperate with relief officials and report trapped neighbors to NDRF/SDRF teams.'
    ],
    checklists: [
      'Tape on all glass windows and balcony doors',
      'AM/FM Transistor Radio with fresh battery pack',
      'Charged battery emergency lanterns and mobile power banks',
      'Clean plastic cans filled with chlorinated drinking water',
      'Heavy-duty plastic tarpaulin sheet and nylon cord'
    ],
    references: [
      'IMD Standard Cyclone Warning Protocol (Red/Orange/Yellow Bulletins)',
      'National Disaster Management Guidelines for Management of Cyclones'
    ],
    emergencyContacts: [
      { service: 'National Emergency Service', number: '112' },
      { service: 'Fire & Coastal Rescue', number: '101' },
      { service: 'Ambulance & Trauma Services', number: '108' },
      { service: 'TNEB Electricity Breakdown Control', number: '1912' }
    ]
  },

  'pdf-earthquake-safety': {
    title: 'EARTHQUAKE SAFETY, DROP-COVER-HOLD & RESCUE DRILL',
    subtitle: 'Seismic Vulnerability Mitigation and Building Safety Action Plan',
    authority: 'National Disaster Management Authority (NDMA) & National Centre for Seismology',
    beforeInstructions: [
      'Anchor heavy furniture, book racks, water heaters, and wardrobes securely to wall studs.',
      'Do not hang heavy mirrors or framed artwork directly above beds or sofas.',
      'Identify safe spots inside each room: beneath sturdy dining tables, interior load-bearing walls, or doorframes without glass.',
      'Keep heavy items on bottom shelves rather than top shelves.',
      'Know the exact location of water, gas, and electricity main shut-off valves and teach family members.'
    ],
    duringInstructions: [
      'DROP to your hands and knees immediately to prevent being knocked down.',
      'COVER your head and neck under a sturdy table or desk. If no shelter is nearby, drop next to an interior wall and cover your head with your arms.',
      'HOLD ON to your shelter until the shaking completely ceases. Be prepared to move with it.',
      'If outdoors, move to an open clear space away from buildings, power lines, chimneys, and flyovers.',
      'DO NOT use elevators during or immediately after seismic tremors.'
    ],
    afterInstructions: [
      'Expect aftershocks. Aftershocks can strike hours, days, or weeks after the main tremor and cause weakened structures to collapse.',
      'Inspect your premises for structural fissures, gas leaks, and damaged electrical wiring.',
      'If you smell gas, open all windows, evacuate immediately, and do not switch any lights or appliances on/off.',
      'Wear sturdy shoes to protect your feet from broken glass and debris.'
    ],
    checklists: [
      'Drop-Cover-Hold drill practiced by all household members',
      'Sturdy shoes and work gloves kept next to beds',
      'Heavy cupboards fastened with L-brackets',
      'Emergency whistle for trapped survivor signaling',
      'Fire extinguisher (ABC dry powder) checked and tagged'
    ],
    references: [
      'NDMA Seismic Vulnerability Guidelines (Bureau of Indian Standards IS 1893)',
      'USGS Earth Science & Earthquake Readiness Program'
    ],
    emergencyContacts: [
      { service: 'National Disaster Response (NDRF)', number: '112' },
      { service: 'Fire & Rescue Services', number: '101' },
      { service: 'State Disaster Emergency Line', number: '1070' }
    ]
  },

  'pdf-fire-safety': {
    title: 'FIRE PREVENTION, EXTINCTION & EVACUATION PROTOCOLS',
    subtitle: 'Standard Guidelines for Residential, Commercial & High-Rise Building Fires',
    authority: 'Fire & Rescue Services Directorate & National Building Code of India',
    beforeInstructions: [
      'Install smoke alarms and test their batteries twice a year.',
      'Maintain an ABC dry powder chemical fire extinguisher in the kitchen and common corridors.',
      'Never overload electrical extension sockets or run cables beneath carpets.',
      'Replace cracked or frayed electrical wires immediately.',
      'Map out two independent escape routes from every bedroom and conduct home evacuation drills.'
    ],
    duringInstructions: [
      'Remember the P-A-S-S technique for fire extinguishers: Pull the pin, Aim at the base of the fire, Squeeze the lever, Sweep side to side.',
      'If smoke is present, DROP TO THE FLOOR AND CRAWL on your hands and knees. Cooler, breathable air stays within 30-60 cm of the floor.',
      'Feel closed doors with the back of your hand before opening. If hot, DO NOT OPEN; use your secondary escape route.',
      'If your clothes catch fire: STOP, DROP TO THE GROUND, AND ROLL repeatedly to smother flames.',
      'NEVER use lifts during a fire alarm; use designated fire staircases.'
    ],
    afterInstructions: [
      'Never re-enter a burning or smoldering building for pets or valuables until cleared by the Fire Chief.',
      'Cool first-degree burns immediately under clean running tap water for minimum 15-20 minutes. Do not apply ice, butter, or toothpaste.',
      'Seek emergency hospital care for burns covering more than the palm size of the hand or involving the face, hands, or joints.'
    ],
    checklists: [
      'ABC Dry Chemical Extinguisher with valid inspection tag',
      'Fire blanket installed in kitchen near cooking stove',
      'Smoke detectors installed and tested',
      'Clear unobstructed staircase paths (no dumped bicycles/boxes)',
      'LPG rubber hose pipe (Suraksha) replaced every 2 years'
    ],
    references: [
      'National Building Code of India (Part IV Fire & Life Safety)',
      'Tamil Nadu Fire & Rescue Services Safety Standards'
    ],
    emergencyContacts: [
      { service: 'Fire & Rescue Services', number: '101' },
      { service: 'National Emergency Helpline', number: '112' },
      { service: 'Burns Casualty / Ambulance', number: '108' }
    ]
  },

  'pdf-first-aid': {
    title: 'FIRST AID & CRITICAL PRE-HOSPITAL EMERGENCY RESPONSE',
    subtitle: 'Standard Operating Procedures for Trauma, Cardiac Arrest & Disaster Injuries',
    authority: 'Indian Red Cross Society & World Health Organization (WHO) Guidelines',
    beforeInstructions: [
      'Assemble a fully stocked, water-resistant first-aid medical kit placed in a recognized location.',
      'Ensure family members learn hands-only adult CPR and basic bleeding control.',
      'Maintain an updated medical history sheet listing blood groups, allergies, and chronic conditions for each family member.',
      'Keep emergency phone numbers programmed on phone speed dials.'
    ],
    duringInstructions: [
      'BLEEDING CONTROL: Apply firm, uninterrupted direct pressure over wounds with sterile gauze. Elevate injured limbs above heart level if no fracture is suspected.',
      'ADULT CARDIAC ARREST (Hands-Only CPR): If unresponsive with no normal breathing, push hard and fast in the center of the chest at 100-120 compressions per minute (depth 5-6 cm).',
      'CHOKING: Deliver 5 back blows between shoulder blades followed by 5 abdominal thrusts (Heimlich Maneuver).',
      'BURNS: Douse immediately with clean, room-temperature running water for 20 minutes. Cover gently with sterile non-adherent dressing.',
      'FRACTURES: Immobilize the joint above and below the suspected bone break using a rigid splint (cardboard, wood, or rolled magazines). Do NOT attempt to straighten crooked limbs.'
    ],
    afterInstructions: [
      'Transfer stabilized patients immediately to the nearest verified trauma center via 108 ambulance.',
      'Monitor for traumatic shock: symptoms include pale cold clammy skin, rapid shallow breathing, and dizziness. Keep patient warm and elevate legs 30 cm if no head/spine injury.',
      'Never provide fluids or food to an unconscious patient or someone requiring imminent emergency surgery.'
    ],
    checklists: [
      'Sterile gauze swabs and roller bandages (various sizes)',
      'Betadine / Chlorhexidine antiseptic lotion',
      'Medical grade shears and stainless steel tweezers',
      'Digital clinical thermometer and pulse oximeter',
      'Elastic crepe compression bandages (for sprains/splints)'
    ],
    references: [
      'International Federation of Red Cross and Red Crescent Societies (IFRC) First Aid Guidelines',
      'Ministry of Health and Family Welfare Trauma Response Protocols'
    ],
    emergencyContacts: [
      { service: 'Ambulance Emergency (Toll Free)', number: '108' },
      { service: 'National Emergency Response System', number: '112' },
      { service: 'Red Cross Blood Bank Services', number: '044 2855 4548' }
    ]
  },

  'pdf-survival-kit': {
    title: '72-HOUR EMERGENCY SURVIVAL "GO-BAG" CHECKLIST',
    subtitle: 'Essential Household Equipment and Provisions for Rapid Disaster Evacuation',
    authority: 'National Disaster Management Authority (NDMA) Community Preparedness Unit',
    beforeInstructions: [
      'Pack your 72-Hour "Go-Bag" in a durable, water-repellent backpack kept in an easily accessible location near your main exit.',
      'Review and update food, battery, and water provisions every 6 months.',
      'Distribute weight evenly: heavy items close to the spine; emergency whistle and torch in outer accessible pockets.'
    ],
    duringInstructions: [
      'Grab your Go-Bag the instant an evacuation order is broadcast on MORAI SAFE.',
      'Ensure every family member carries their personal identification and medical summary card.'
    ],
    afterInstructions: [
      'Replenish any consumed rations, water, or medical dressing upon returning from shelters.'
    ],
    checklists: [
      'Potable Water: Minimum 3 liters per person per day in food-grade bottles',
      'Food: 3-day supply of ready-to-eat dry rations (roasted grams, energy bars, dry fruits)',
      'First Aid & Medication: Comprehensive medical kit plus 14-day prescription drugs',
      'Lighting: High-lumen LED torch, spare batteries, and emergency chemical light-sticks',
      'Power: 20,000 mAh power bank with multi-pin cables',
      'Communication: Battery-powered AM/FM radio and high-pitch emergency whistle',
      'Protection: Light raincoat, dust masks (N95), and sturdy leather work gloves',
      'Sanitation: Wet wipes, alcohol hand sanitizer, toilet paper, and biohazard garbage bags',
      'Tools: Multi-tool swiss army knife, roll of duct tape, and 15m parachute cord',
      'Documents: Sealed waterproof folder containing Aadhaar, property, insurance & bank cards',
      'Cash: ₹3,000 to ₹5,000 in small currency notes (₹50, ₹100, ₹200)'
    ],
    references: [
      'NDMA Emergency Kit Standards (Civil Protection Series)',
      'FEMA 72-Hour Survival Kit Guidelines'
    ],
    emergencyContacts: [
      { service: 'All India Emergency Hotline', number: '112' },
      { service: 'Disaster Relief Control', number: '1070' }
    ]
  },

  'pdf-food-storage': {
    title: 'LONG-TERM FOOD STORAGE & DISASTER NUTRITION PRESERVATION',
    subtitle: 'Scientific Methods for Grain Storage, Moisture Control & Shelf-Life Maximization',
    authority: 'National Institute of Nutrition (NIN) & Food Safety and Standards Authority of India (FSSAI)',
    beforeInstructions: [
      'Calculate baseline food requirements: An average adult requires 2,100 to 2,400 kcal and 50-60g protein daily during emergency stress.',
      'Select dry staples with long natural shelf lives: Parboiled rice (2-3 years), raw whole wheat (2-3 years), split pulses/dal (1-2 years), and millets (1-2 years).',
      'Use food-grade High-Density Polyethylene (HDPE) buckets with rubber airtight gaskets or multi-layer metallized Mylar bags.',
      'Incorporate food-grade oxygen absorbers (300cc to 500cc per 5kg container) to eliminate insects, weevils, and oxidative rancidity without hazardous pesticides.',
      'Store all food containers at least 15 cm off concrete floors on wooden pallets in a cool, dark, well-ventilated space (optimal 15°C to 24°C).'
    ],
    duringInstructions: [
      'Eat perishable food items from your refrigerator and freezer first within the initial 24-48 hours of power failure.',
      'Open the refrigerator and freezer doors as infrequently as possible. A closed freezer will keep food frozen for 48 hours if full.',
      'Inspect stored dry food before cooking: Discard immediately if mold, sour odor, or water intrusion is evident.',
      'Conserve cooking fuel: Soak beans and lentils overnight in potable water to reduce boiling time by 50%.'
    ],
    afterInstructions: [
      'Rotate your emergency food stockpile using the "FIFO" (First In, First Out) principle every 6 to 12 months.',
      'Re-seal bulk buckets tightly immediately after scooping daily rations to prevent ambient humidity absorption.'
    ],
    checklists: [
      'Food-grade airtight HDPE buckets with silicone seals',
      'Mylar foil bags (minimum 5-mil thickness) and iron heat sealer',
      '300cc Iron-based oxygen absorbers',
      'Manual, non-electric heavy-duty can opener',
      'Portable single-burner butane camping stove with 4 spare gas canisters'
    ],
    foodAndWaterTips: [
      'Do not store salt, sugar, or honey with oxygen absorbers (they harden into rock-like blocks). Store them in airtight containers with food-grade silica gel desiccant instead.',
      'High-protein Indian shelf-stable items: Sattu (roasted gram flour), sesame-jaggery bars (chikki), peanut brittle, and roasted beaten rice (poha).'
    ],
    references: [
      'FSSAI Manual on Safe Food Storage and Distribution During Disasters',
      'NIN Guidelines for Emergency Nutritional Rationing'
    ],
    emergencyContacts: [
      { service: 'National Disaster Emergency Helpline', number: '112' },
      { service: 'FSSAI Consumer Food Safety Grievance Line', number: '1800 112 100' }
    ]
  },

  'pdf-medicine-storage': {
    title: 'ESSENTIAL EMERGENCY MEDICINES & SAFE STORAGE GUIDELINES',
    subtitle: 'Clinical Protocols for Medical Supplies, Chronic Disease Care & Off-Grid Storage',
    authority: 'Directorate General of Health Services (DGHS) & Indian Red Cross Society',
    beforeInstructions: [
      'Maintain an unbroken 30-day supply of critical daily prescription medications (antihypertensives, insulin, thyroid, cardiovascular drugs).',
      'Store medications in their original blister packs with clear expiry dates visible.',
      'Keep a laminated copy of all active doctor prescriptions, dosage tables, and prescribing physicians\' contact details.',
      'Do not store medications in humid bathrooms or direct sunlight; choose an insulated cool bag.',
      'For temperature-sensitive insulin and biologicals: Procure a specialized medical cold-storage thermos pouch with reusable gel cold packs.'
    ],
    duringInstructions: [
      'During prolonged power blackouts, keep insulin vials inside an insulated flask with ice packs or immersed in an earthen clay pot (pot-in-pot evaporative cooling).',
      'NEVER consume pills that have been touched by floodwaters, changed color, crumbled, or possess a vinegar odor (indicates chemical breakdown).',
      'STRICT WARNING ON SELF-MEDICATION: Do not administer antibiotics, prescription steroids, or intravenous drips without verified medical doctor evaluation. Use only over-the-counter first-aid measures.'
    ],
    afterInstructions: [
      'Safely dispose of expired medications at designated government hospital pharmacy collection counters; do not flush into civic drains.',
      'Restock consumed first-aid supplies immediately following an emergency event.'
    ],
    checklists: [
      'WHO-Formula Oral Rehydration Salts (ORS) - 15 packets',
      'Paracetamol 500mg (Analgesic & Antipyretic) - 20 tablets',
      'Povidone-Iodine 5% Antiseptic Ointment & Solution',
      'Oral antihistamine (Cetirizine 10mg) for acute allergic reactions',
      'Electrolyte glucose powder (500g sealed box)',
      'Digital clinical thermometer with battery health check'
    ],
    medicineAndMedicalTips: [
      'How to prepare WHO-standard ORS in emergencies: Dissolve 1 full sachet of certified ORS powder into exactly 1 liter of boiled, cooled potable water. Discard any unused prepared solution after 24 hours.',
      'For asthmatic patients: Maintain 2 rescue Salbutamol inhalers with an aerochamber spacer in a shockproof waterproof case.'
    ],
    references: [
      'DGHS Indian Pharmacopoeia Guidelines for Emergency Medical Supplies',
      'World Health Organization Emergency Health Kit (IEHK) Specifications'
    ],
    emergencyContacts: [
      { service: 'Emergency Ambulance & Casualty Dispatch', number: '108' },
      { service: 'National Emergency Response System', number: '112' },
      { service: 'Poison Information Center (AIIMS New Delhi)', number: '1800 116 117' }
    ]
  },

  'pdf-safe-water': {
    title: 'SAFE DRINKING WATER PURIFICATION & STORAGE STANDARDS',
    subtitle: 'Water Disinfection, Halazone Chlorination & Storage Protocol for Communities',
    authority: 'Ministry of Jal Shakti & World Health Organization (WHO)',
    beforeInstructions: [
      'Calculate household water needs: Minimum 3 to 4 liters per person per day strictly for drinking and food rehydration; 15-20 liters for basic hygiene.',
      'Use food-grade Polyethylene (HDPE) or stainless steel storage vessels with tight screw caps and spigots.',
      'Wash and sanitize storage containers with a dilute chlorine solution (1 teaspoon bleach per liter of water) before filling.',
      'Store filled containers in an elevated, shaded location away from kerosene, chemicals, and pesticides.'
    ],
    duringInstructions: [
      'BOILING (Gold Standard): Bring suspect water to a vigorous, rolling boil for minimum 1 full minute. Allow to cool naturally in the same covered pot.',
      'CHLORINATION (Chemical Treatment): If boiling is impossible, add Halazone chlorine tablets (4mg per 5 liters of clear water) or 2 drops of unperfumed 5% sodium hypochlorite bleach per liter. Mix vigorously and wait 30 MINUTES before drinking. Water must have a slight chlorine scent.',
      'TURBID / MUDDY WATER: Always filter murky floodwater through multiple clean folded cotton cloths or allow suspended silt to settle for 6 hours before chemical disinfection.',
      'NEVER drink floodwater, seawater, or industrial run-off even after boiling.'
    ],
    afterInstructions: [
      'Clean water storage tanks every 3 months. Replace stored tap water every 6 months if not chemically preserved.',
      'Prevent mosquito breeding: Keep tank lids tightly clamped and vent pipes covered with fine brass wire mesh.'
    ],
    checklists: [
      'Food-grade 20-liter water dispenser jars with tap',
      'Chlorine Halazone purification tablets (100-pack)',
      'Clean multi-layered muslin/cotton filter cloths',
      'Dedicated clean long-handled ladle for water scooping'
    ],
    references: [
      'Bureau of Indian Standards IS 10500:2012 Drinking Water Specification',
      'WHO Guidelines for Drinking-Water Quality in Emergencies'
    ],
    emergencyContacts: [
      { service: 'Public Health & Sanitation Emergency Helpline', number: '104' },
      { service: 'National Emergency Service', number: '112' }
    ]
  },

  'pdf-family-plan': {
    title: 'FAMILY EMERGENCY COMMUNICATION & EVACUATION PLAN',
    subtitle: 'Household Disaster Action Matrix, Reunification Points & Child Safety',
    authority: 'National Disaster Management Authority (NDMA) Family Safety Directorate',
    beforeInstructions: [
      'Designate TWO physical meeting places: Meeting Place #1 directly outside your home (for house fires); Meeting Place #2 outside your neighborhood (park, community hall) in case of citywide floods.',
      'Designate an Out-of-District Contact Person: Choose a relative living in another city. During local disasters, long-distance phone lines often connect when local networks are jammed.',
      'Ensure every family member memorizes the contact relative\'s phone number and carries a printed emergency card.',
      'Plan your evacuation routes: Identify two alternate driving routes and one walking route out of your neighborhood.',
      'Teach all capable family members how and when to shut off electricity, water, and gas valves.'
    ],
    duringInstructions: [
      'COMMUNICATION RULE: "Text, Don\'t Talk". Send short SMS messages or WhatsApp text updates. SMS packets get through congested cell towers when voice calls fail.',
      'Each separated family member must call the out-of-district contact to check in and report their location.',
      'If instructed by civil authorities or MORAI SAFE to evacuate, leave immediately via the designated arterial evacuation corridor.'
    ],
    afterInstructions: [
      'Reunite at designated Meeting Place #2 if home is damaged or cordoned off by emergency forces.',
      'Notify your out-of-district contact immediately once family members are safely assembled.'
    ],
    checklists: [
      'Laminated Wallet Emergency Contact Cards for all children',
      'Pre-agreed Meeting Place #1 (Local) & Meeting Place #2 (Out of Area)',
      'Out-of-District relative assigned as central communication bridge',
      'Emergency house pet carrier and 3-day pet ration'
    ],
    references: [
      'NDMA Household Emergency Preparedness Framework',
      'UNICEF Child Protection in Emergency Guidelines'
    ],
    emergencyContacts: [
      { service: 'National Emergency Response (All India)', number: '112' },
      { service: 'Child Helpline (Toll Free 24/7)', number: '1098' },
      { service: 'Women Emergency Helpline', number: '181' }
    ]
  },

  'pdf-children-elderly': {
    title: 'EMERGENCY SAFETY & CARE FOR CHILDREN AND OLDER ADULTS',
    subtitle: 'Vulnerable Population Protection Protocols During Natural Calamities',
    authority: 'Ministry of Women & Child Development & Ministry of Social Justice',
    beforeInstructions: [
      'Prepare dedicated nutritional packs for infants and toddlers: High-energy infant formula, baby cereals, sterilized feeding bottles, and diapers.',
      'For elderly family members: Create an exhaustive Medical Information Summary detailing cardiovascular history, pacemaker status, diabetes, and mobility limitations.',
      'Ensure walking canes, walkers, wheelchairs, and hearing aid batteries are placed directly beside the bed each night.',
      'Establish a "Neighborhood Buddy System": Partner with trusted neighbors who can assist in carrying elderly or infirm relatives down staircases during sudden evacuations.'
    ],
    duringInstructions: [
      'Calm children by explaining the situation honestly without causing panic. Keep beloved comfort items (favorite blanket or small toy) readily accessible in their Go-Bag.',
      'Never leave children unattended in relief shelters, near rising water channels, or damaged buildings.',
      'For elderly individuals using oxygen concentrators: Switch immediately to backup portable oxygen cylinders upon power grid disconnection.',
      'Ensure elderly persons wear identification wristbands with emergency contact phone numbers and home addresses.'
    ],
    afterInstructions: [
      'Watch for signs of acute emotional distress, nightmares, or shock in children; provide patient listening and emotional reassurance.',
      'Consult doctors for elderly persons who have experienced prolonged exposure to dampness, cold, or skipped daily medications.'
    ],
    checklists: [
      'Infant formula powder and sealed sterile water flasks',
      'Pack of adult diapers and hygienic underpads',
      'Spare spectacles and hearing aid battery blister packs',
      'Child identification wristbands and comfort toy',
      'Elderly mobility assistant belt for evacuation lifting'
    ],
    references: [
      'WHO Clinical Guidelines for Care of Elderly in Emergencies',
      'UNICEF Infant and Young Child Feeding in Emergencies (IYCF-E)'
    ],
    emergencyContacts: [
      { service: 'Childline Emergency Care', number: '1098' },
      { service: 'Senior Citizen Helpline (National)', number: '14567' },
      { service: 'Ambulance & Trauma Medical Dispatch', number: '108' }
    ]
  },

  'pdf-disabilities': {
    title: 'EMERGENCY PREPAREDNESS FOR PERSONS WITH DISABILITIES (PwD)',
    subtitle: 'Inclusive Disaster Risk Reduction, Accessible Evacuation & Assistive Devices Plan',
    authority: 'Department of Empowerment of Persons with Disabilities & NDMA Guidelines',
    beforeInstructions: [
      'Create a Personal Support Network of at least 3 trusted individuals at home, workplace, and neighborhood who can provide swift evacuation assistance.',
      'For Wheelchair Users: Identify accessible ground-floor evacuation paths free of steps, narrow turnstiles, or heavy manual fire doors.',
      'For Visually Impaired Persons: Keep tactile maps, long canes, and audio recording devices in fixed, accessible locations.',
      'For Hearing Impaired Persons: Install vibrating bed-shaker smoke alarms and flashing strobe light emergency sirens.',
      'Secure a 7-day power backup (inverter / solar battery pack) for essential assistive equipment such as electric wheelchairs, suction machines, and ventilators.'
    ],
    duringInstructions: [
      'COMMUNICATE SPECIFIC NEEDS CLEARLY: Inform emergency first responders exactly how you need to be moved (e.g., "Do not lift me by my arms", "Support my neck", "Bring my wheelchair").',
      'If using an evacuation carry chair, follow trained two-person lifting techniques to descend staircases safely.',
      'Keep service animals harnessed and with you at all times; shelters are legally mandated to admit service animals.',
      'If trapped in smoke or darkness, use a whistle or high-intensity flashing beacon to pinpoint your location to rescue teams.'
    ],
    afterInstructions: [
      'Inspect wheelchairs, prosthetic limbs, and assistive electronics for structural cracks or water damage before reuse.',
      'Register with the District Disability Rehabilitation Officer at the relief center to access replacement assistive devices and specialized therapy.'
    ],
    checklists: [
      'Laminated Disability & Medical Communication Sheet',
      'Manual backup wheelchair or specialized evacuation transfer sling',
      'Spare charger and cables for motorized wheelchair battery',
      'Strobe-light and high-decibel personal emergency alarm',
      'Service animal emergency food, leash, and veterinary records'
    ],
    references: [
      'NDMA National Disaster Management Guidelines on Disability Inclusion (2026)',
      'Rights of Persons with Disabilities Act, 2016 (Section 24 - Disaster Relief)'
    ],
    emergencyContacts: [
      { service: 'Disability Emergency Assistance Helpline', number: '112' },
      { service: 'District Disability Welfare Helpline', number: '1800 180 5122' },
      { service: 'Medical Ambulance & Stretcher Transport', number: '108' }
    ]
  }
};

export class PDFGeneratorService {
  static generateResourcePDF(resource: PDFResource): void {
    const detail = PDF_CONTENTS[resource.id] || PDF_CONTENTS['pdf-flood-safety'];
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    const contentWidth = pageWidth - (margin * 2);

    let y = 18;

    // --- Header Banner (Official Indian Govt / NDMA Style) ---
    doc.setFillColor(15, 76, 129); // Deep official navy
    doc.rect(margin, y, contentWidth, 24, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('MORAI SAFE — COMMUNITY DISASTER MANAGEMENT PLATFORM', pageWidth / 2, y + 8, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('OFFICIAL EMERGENCY RESOURCE & PREPAREDNESS STANDARD // CERTIFIED REVISION', pageWidth / 2, y + 15, { align: 'center' });
    doc.text(`Doc ID: ${resource.id.toUpperCase()} · Published: ${resource.date} · Classification: PUBLIC LIFE-SAFETY`, pageWidth / 2, y + 20, { align: 'center' });

    y += 32;

    // --- Document Title Box ---
    doc.setFillColor(243, 246, 250);
    doc.setDrawColor(200, 215, 230);
    doc.rect(margin, y, contentWidth, 22, 'FD');

    doc.setTextColor(14, 43, 82);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    const splitTitle = doc.splitTextToSize(detail.title, contentWidth - 8);
    doc.text(splitTitle, margin + 4, y + 7);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(70, 90, 115);
    doc.text(detail.subtitle, margin + 4, y + 17);

    y += 28;

    // --- Authority & Endorsement ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Mandating Authority:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(detail.authority, margin + 35, y);

    y += 7;

    // --- Section Helper ---
    const drawSectionHeader = (title: string, color: [number, number, number] = [15, 76, 129]) => {
      if (y > pageHeight - 35) {
        doc.addPage();
        y = 20;
      }
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(title.toUpperCase(), margin + 3, y + 4.2);
      y += 9;
    };

    const drawBulletList = (items: string[]) => {
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);

      items.forEach((item, index) => {
        if (y > pageHeight - 22) {
          doc.addPage();
          y = 20;
        }
        const bulletPrefix = `${index + 1}. `;
        const splitText = doc.splitTextToSize(item, contentWidth - 10);
        doc.setFont('helvetica', 'bold');
        doc.text(bulletPrefix, margin + 2, y);
        doc.setFont('helvetica', 'normal');
        doc.text(splitText, margin + 8, y);
        y += (splitText.length * 4.2) + 1.8;
      });
      y += 3;
    };

    // 1. BEFORE DISASTER
    drawSectionHeader('PHASE 1: BEFORE DISASTER (PREVENTION & READINESS)', [21, 101, 192]);
    drawBulletList(detail.beforeInstructions);

    // 2. DURING DISASTER
    drawSectionHeader('PHASE 2: DURING DISASTER (IMMEDIATE LIFE-SAFETY ACTIONS)', [198, 40, 40]);
    drawBulletList(detail.duringInstructions);

    // 3. AFTER DISASTER
    drawSectionHeader('PHASE 3: AFTER DISASTER (RECOVERY, SANITATION & RETURN)', [46, 125, 50]);
    drawBulletList(detail.afterInstructions);

    // Check if new page needed for Page 2
    if (y > pageHeight - 65) {
      doc.addPage();
      y = 20;
    }

    // 4. CHECKLIST
    drawSectionHeader('MANDATORY HOUSEHOLD DISASTER CHECKLIST', [69, 90, 100]);
    detail.checklists.forEach((item) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      doc.setDrawColor(100, 116, 139);
      doc.rect(margin + 2, y - 2.8, 3.2, 3.2, 'D'); // check box square
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const splitText = doc.splitTextToSize(item, contentWidth - 12);
      doc.text(splitText, margin + 8, y);
      y += (splitText.length * 4.2) + 2;
    });
    y += 4;

    // Optional Food & Water / Medicine sections
    if (detail.foodAndWaterTips && detail.foodAndWaterTips.length > 0) {
      drawSectionHeader('FOOD & POTABLE WATER CRITICAL GUIDANCE', [13, 148, 136]);
      drawBulletList(detail.foodAndWaterTips);
    }

    if (detail.medicineAndMedicalTips && detail.medicineAndMedicalTips.length > 0) {
      drawSectionHeader('MEDICINE, FIRST-AID & HEALTH PRECAUTIONS', [142, 36, 170]);
      drawBulletList(detail.medicineAndMedicalTips);
    }

    // Verified Indian Emergency Helplines Box
    if (y > pageHeight - 48) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(248, 113, 113);
    doc.rect(margin, y, contentWidth, 24, 'FD');

    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('VERIFIED NATIONAL & STATE EMERGENCY CONTACT NUMBERS (INDIA)', margin + 4, y + 6);

    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    let contactColX = margin + 4;
    let contactRowY = y + 12;

    detail.emergencyContacts.forEach((contact, idx) => {
      if (idx === 2) {
        contactColX = margin + (contentWidth / 2) + 2;
        contactRowY = y + 12;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`${contact.service}: `, contactColX, contactRowY);
      doc.setTextColor(185, 28, 28);
      doc.text(`${contact.number}`, contactColX + 55, contactRowY);
      doc.setTextColor(30, 41, 59);
      contactRowY += 5;
    });

    y += 30;

    // References Footer
    if (y > pageHeight - 25) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Official References & Guidelines:', margin, y);
    y += 4;
    detail.references.forEach(ref => {
      doc.text(`• ${ref}`, margin + 3, y);
      y += 3.8;
    });

    // Page Numbering
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 150, 160);
      doc.text(`MORAI SAFE Disaster Preparedness Library · ${resource.title} · Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
    }

    // Trigger genuine browser download
    const filename = `${resource.id}_NDMA_morai_safe.pdf`;
    doc.save(filename);
  }
}
