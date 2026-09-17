import { ComplianceStandard, ProjectExperience } from '../types';

export const COMPLIANCE_STANDARDS: ComplianceStandard[] = [
  {
    code: "IS:2925 / EN 397",
    name: "Industrial Safety Helmets Specification",
    issuingBody: "Bureau of Indian Standards (BIS) & CEN Europe",
    category: "Head Protection",
    applicableProducts: [
      "Industrial Safety Helmets (HDPE)",
      "Vented Ratchet Suspension Helmets"
    ],
    description: "Mandates impact absorption, penetration resistance, flame resistance, and electrical insulation tests for industrial workers.",
    significance: "Required for entry into Mathura Refinery, construction sites, and heavy industrial workshops."
  },
  {
    code: "IS:15298 (Part-2) / EN ISO 20345",
    name: "Personal Protective Equipment - Safety Footwear",
    issuingBody: "Bureau of Indian Standards (BIS) & ISO International",
    category: "Foot Protection",
    applicableProducts: [
      "Karam Industrial Safety Shoes",
      "Steel-Toe Leather Work Boots"
    ],
    description: "Specifies 200 Joules steel toe cap impact resistance, dual-density PU anti-skid sole, puncture protection, and antistatic properties.",
    significance: "Crucial for preventing foot crushing injuries from dropped pipes, steel plates, and chemical splashes."
  },
  {
    code: "IS:3521 (Part-1):2021 / EN 361 & EN 355",
    name: "Fall Arrest Systems - Full Body Safety Harness",
    issuingBody: "Bureau of Indian Standards (BIS) & European Standards",
    category: "Fall Protection",
    applicableProducts: [
      "Udyogi Full Body Safety Harness UB 102 With SH60 and SA",
      "Twin Scaffold Hook Lanyards with Energy Absorber"
    ],
    description: "Requires minimum 22 kN breaking strength, dorsal fall arrest D-ring, and kinetic energy dissipation below 6 kN during arrest.",
    significance: "Compulsory for scaffolding, tower maintenance, and elevated refinery pipeline turnaround works."
  },
  {
    code: "ANSI Z87.1-2010 / EN 166",
    name: "Occupational and Educational Personal Eye Protection",
    issuingBody: "American National Standards Institute (ANSI) & CEN Europe",
    category: "Eye & Face Protection",
    applicableProducts: [
      "3M 1621IN Anti-Fog Clear Safety Goggles",
      "Polycarbonate Chemical Splash Goggles"
    ],
    description: "Stringent optical clarity, high-mass impact resistance, zero-mist anti-fog coating, and chemical splash deflection.",
    significance: "Essential for chemical liquid sampling, grinding, welding inspection, and dusty maintenance zones."
  },
  {
    code: "EN 388:2016 (Mechanical Cut Resistance)",
    name: "Protective Gloves Against Mechanical Risks",
    issuingBody: "European Committee for Standardization",
    category: "Hand Protection",
    applicableProducts: [
      "GENERIC White and Grey Cut Resistant Gloves (Pack of 12)",
      "GENERIC Orange and White Finger Coated Safety Gloves"
    ],
    description: "Measures abrasion, blade cut resistance, tear strength, and puncture resistance for handling sharp metal sheets and tools.",
    significance: "Prevents severe hand lacerations during sheet metal fabrication, glass handling, and machine overhaul."
  },
  {
    code: "MoRTH & IRC:SP:84 / IRC:67",
    name: "Specifications for Road Traffic Delineators & Studs",
    issuingBody: "Ministry of Road Transport & Highways / Indian Roads Congress",
    category: "Road & Traffic Safety",
    applicableProducts: [
      "GENERIC Traffic Safety Cones 750 mm (Pack of 4)",
      "SSWW 10X9 cm Plastic Road Stud Reflector Yellow (Pack of 25 pcs)",
      "Generic Lane Marking Tape 48 mm x 15 m (Pack of 6)"
    ],
    description: "Dictates retro-reflective prism reflectivity index, impact resilience against vehicular runovers, and weatherproof durability.",
    significance: "Ensures daytime and night visibility on refinery perimeter roads, highway lanes, and plant truck bays."
  }
];

export const PROJECT_EXPERIENCES: ProjectExperience[] = [
  {
    id: "proj-refinery-turnaround",
    clientType: "Refinery Mechanical & Piping Contractors",
    projectTitle: "Mathura Refinery Annual Turnaround & Shutdown Safety Supply",
    location: "Mathura Refinery Main Complex, Mathura, UP",
    suppliesProvided: [
      "Karam Industrial Safety Shoes (Bulk Consignment)",
      "Udyogi UB 102 Full Body Safety Harnesses with SH60 Scaffold Hooks",
      "3M 1621IN Anti-Fog Clear Goggles",
      "High-Visibility Reflective Neon Safety Jackets"
    ],
    timeline: "Annual & Ongoing Regular Contractor Supply",
    highlights: "Immediate same-day dispatch directly from UP SIDC Complex opposite Refinery Main Gate with full safety compliance certificates."
  },
  {
    id: "proj-highway-maintenance",
    clientType: "Highway Infrastructure & Civil EPC Contractors",
    projectTitle: "Delhi-Agra (NH-19) Highway Corridor Maintenance & Traffic Delineation",
    location: "NH-19 Expressway Stretch, Mathura Belt",
    suppliesProvided: [
      "GENERIC 750 mm (29.5 inch) Heavy-Duty PVC Cones with Reflective Strips",
      "SSWW 10X9 cm Plastic Road Stud Reflectors Yellow (Pack of 25 pcs)",
      "Generic Hazard Caution Lane Marking Tapes"
    ],
    timeline: "Civil Road Construction Phase",
    highlights: "Supplied heavy wind-stable traffic cones and high-index retro-reflective studs capable of withstanding continuous multi-ton truck transit."
  },
  {
    id: "proj-steel-fabrication",
    clientType: "Structural Steel & Pressure Vessel Manufacturers",
    projectTitle: "Heavy Fabrication Yard Safety Upgrades & Worker PPE",
    location: "Mathura Industrial Area, Uttar Pradesh",
    suppliesProvided: [
      "GENERIC White and Grey Cut-Resistant Gloves (Pack of 12)",
      "GENERIC Orange Finger Coated Cotton Grip Gloves (Pack of 3 Pair)",
      "Industrial HDPE Safety Helmets with Ratchet Suspension",
      "Generic Lane Marking Tape 48 mm x 15 m (Pack of 6)"
    ],
    timeline: "Quarterly Supply Agreement",
    highlights: "Provided worker cut protection reducing workshop hand injuries while establishing clear forklift transit safety lanes."
  },
  {
    id: "proj-etp-chemical",
    clientType: "Effluent Treatment & Industrial Maintenance Firms",
    projectTitle: "Industrial Drainage & Chemical Tank Cleaning PPE Consignment",
    location: "Kosi Kalan & Mathura Industrial Belt",
    suppliesProvided: [
      "Hitman Alento 11 inch PVC Safety Gumboots Black & Red",
      "Generic Rubber Hand Gloves 12 Inch Orange (Pack of 1 Pair)",
      "3M 1621IN Chemical Splash Goggles",
      "Barricade Warning Caution Tapes"
    ],
    timeline: "Turnkey Maintenance Project",
    highlights: "100% waterproof and chemical-resistant protective gear delivered within 3 hours for emergency sump cleaning operation."
  }
];

export const TRANSLATIONS = {
  en: {
    navHome: "Home",
    navAbout: "About Us",
    navProducts: "Our Products",
    navFeatured: "Featured",
    navStandards: "Standards & Compliance",
    navProjects: "Past Projects",
    navLocation: "Location & Directions",
    navContact: "Contact Us",
    visitingCard: "Visiting Card",
    rfqCart: "RFQ Cart",
    downloadCatalogue: "Download PDF Catalogue",
    callNow: "Call Now",
    requestQuote: "Request Quotation",
    sendWhatsapp: "Send WhatsApp",
    addToRfq: "Add to RFQ Cart",
    inRfqCart: "In RFQ Cart",
    viewSpecs: "View Specifications",
    heroBadge: "Authorised & Trusted Industrial Supplier",
    heroTitle: "Your Trusted Partner for Industrial Safety & Material Supplies",
    heroSubtitle: "Located at Refinery Main Gate, Mathura. Supplying Karam safety shoes, Udyogi harnesses, 3M goggles, traffic safety gear, and industrial consumables with immediate dispatch.",
    visitingCardSub: "Proprietor: Raj Singh Tarkar • 15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura",
    trustedBy: "Trusted Supplier for Refinery Maintenance & Infrastructure Contractors",
    emergencyBadge: "24/7 Urgent Industrial Orders Available On-Call",
    standardsTitle: "Industrial Standards & Safety Certifications",
    standardsSubtitle: "Every safety item supplied by Rajdeep Enterprises meets stringent national (BIS / IS) and international (EN / ANSI) standards required for refinery gate pass approval.",
    projectsTitle: "Client References & Past Projects",
    projectsSubtitle: "A proven track record supplying maintenance teams, EPC contractors, and fabrication facilities across Mathura, Agra, and Western Uttar Pradesh.",
    mapTitle: "Rajdeep Enterprises Shop Location & Directions",
    mapSubtitle: "Visit our shop situated at 15/1, U.P. S.I.D.C. Complex, opposite Mathura Refinery Main Gate for direct material inspection, pickups, and trade enquiries.",
    rfqTitle: "Bulk Quotation Request (BOQ / RFQ)",
    rfqSubtitle: "Select quantities, add your requirements, and generate an instant Bill of Quantities for quotation via WhatsApp or official email.",
    rfqEmpty: "Your RFQ Cart is empty. Add products from the catalogue below to build your quotation list.",
    panIndiaBadge: "Supplying Whole India Everywhere",
    panIndiaHeading: "All-India Supply Network & Custom Sourcing",
    panIndiaSub: "Delivering industrial safety equipment across every state and PIN code in India. Order any quantity required, and contact us directly for any extra materials or custom tools on demand.",
    anyQuantityTitle: "Order Any Quantity You Need",
    anyQuantityDesc: "Whether you need 5 units for an urgent repair, 250 units for a contractor team, or 25,000 units for a refinery turnaround, we deliver with no order size restrictions.",
    extraItemsTitle: "Need Any Extra Item? Contact Us!",
    extraItemsDesc: "Can't find a specific item or specialized PPE brand in our catalogue? Contact us directly! We source and supply all bespoke and non-standard industrial items on demand.",
    contactForExtra: "Contact Us for Extra Items",
    allIndiaDispatch: "Pan-India Doorstep Dispatch",
  },
  hi: {
    navHome: "होम",
    navAbout: "हमारे बारे में",
    navProducts: "हमारे उत्पाद",
    navFeatured: "विशेष उत्पाद",
    navStandards: "मानक व प्रमाणन",
    navProjects: "पिछली परियोजनाएं",
    navLocation: "स्थान व दिशा",
    navContact: "संपर्क करें",
    visitingCard: "विजिटिंग कार्ड",
    rfqCart: "कोटेशन कार्ट",
    downloadCatalogue: "कैटलॉग PDF डाउनलोड करें",
    callNow: "सीधे कॉल करें",
    requestQuote: "कोटेशन मांगें",
    sendWhatsapp: "व्हाट्सएप भेजें",
    addToRfq: "कोटेशन में जोड़ें",
    inRfqCart: "कार्ट में है",
    viewSpecs: "विवरण देखें",
    heroBadge: "विश्वसनीय औद्योगिक सुरक्षा सामग्री सप्लायर",
    heroTitle: "औद्योगिक सुरक्षा व सामग्री आपूर्ति में आपका विश्वसनीय साथी",
    heroSubtitle: "रिफाइनरी मेन गेट, मथुरा में स्थित। करम सेफ्टी शूज, उद्योगी हार्नेस, 3M चश्मे, ट्रैफिक सुरक्षा उपकरण व सामग्री की त्वरित डिलीवरी।",
    visitingCardSub: "प्रोपराइटर: राज सिंह तारकर • 15/1, यू.पी. एस.आई.डी.सी. कॉम्प्लेक्स, रिफाइनरी मेन गेट, मथुरा",
    trustedBy: "मथुरा रिफाइनरी ठेकेदारों व सिविल कंपनियों का भरोसेमंद सप्लायर",
    emergencyBadge: "आपातकालीन औद्योगिक आर्डर के लिए 24 घंटे कॉल पर उपलब्ध",
    standardsTitle: "औद्योगिक मानक व सुरक्षा प्रमाणन",
    standardsSubtitle: "राजदीप एंटरप्राइजेज द्वारा आपूर्ति किए गए सभी उत्पाद बीआईएस (IS) तथा अंतरराष्ट्रीय (EN / ANSI) मानकों के अनुरूप हैं, जो रिफाइनरी गेट पास व सुरक्षा ऑडिट के लिए आवश्यक हैं।",
    projectsTitle: "ग्राहक संदर्भ एवं पिछली परियोजनाएं",
    projectsSubtitle: "मथुरा, आगरा व पश्चिमी उत्तर प्रदेश में रिफाइनरी शटडाउन, राजमार्ग निर्माण व फैब्रिकेशन इकाइयों में सफल आपूर्ति का अनुभव।",
    mapTitle: "राजदीप एंटरप्राइजेज दुकान का स्थान व दिशा",
    mapSubtitle: "15/1, यू.पी. एस.आई.डी.सी. कॉम्प्लेक्स (रिफाइनरी मेन गेट के सामने) पर हमारी दुकान पर पधारें या सीधे सामग्री प्राप्त करें।",
    rfqTitle: "थोक कोटेशन अनुरोध (RFQ / BOQ)",
    rfqSubtitle: "उत्पाद की मात्रा चुनें और तुरंत व्हाट्सएप या ईमेल द्वारा आधिकारिक कोटेशन प्राप्त करें।",
    rfqEmpty: "आपकी कोटेशन कार्ट अभी खाली है। कोटेशन सूची बनाने के लिए नीचे दिए गए उत्पादों में से जोड़ें।",
    panIndiaBadge: "पूरे भारत में हर जगह सप्लाई",
    panIndiaHeading: "अखिल भारतीय आपूर्ति नेटवर्क एवं कस्टम सामग्री व्यवस्था",
    panIndiaSub: "भारत के सभी राज्यों व पिन कोड में सुरक्षा उपकरणों की डिलीवरी। जितनी संख्या में चाहें आर्डर करें और यदि कोई अतिरिक्त सामान चाहिए तो सीधे संपर्क करें।",
    anyQuantityTitle: "जितनी चाहें उतनी मात्रा में आर्डर करें",
    anyQuantityDesc: "आपातकालीन 5 पीस से लेकर 25,000+ पीस तक — किसी भी छोटी या बड़ी मात्रा में सामग्री की निर्बाध आपूर्ति।",
    extraItemsTitle: "कोई अतिरिक्त सामान चाहिए? तुरंत संपर्क करें!",
    extraItemsDesc: "यदि कोई ऐसा सुरक्षा सामान या विशेष ब्रांड चाहिए जो लिस्ट में नहीं है, तो हमें बताएं — हम विशेष रूप से आपके लिए मंगवाकर देंगे।",
    contactForExtra: "अतिरिक्त सामान के लिए संपर्क करें",
    allIndiaDispatch: "संपूर्ण भारत में घर/साइट तक डिलीवरी",
  }
};
