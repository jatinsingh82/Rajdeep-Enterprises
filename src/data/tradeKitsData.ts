import { TradeKit, HsnTaxRate } from '../types';

export const TRADE_KITS: TradeKit[] = [
  {
    id: "welder-kit",
    trade: "Welding & Hot Work",
    title: "Heavy-Duty Welder & Hot Work Safety Kit",
    badge: "Hot Work Certified",
    iconName: "Flame",
    description: "Complete personal protective ensemble for arc welding, gas cutting, brazing, and high-heat metal fabrication.",
    suitableFor: "Boiler erection crews, pipe welders, fabrication yards, refinery hot work permits.",
    standards: ["IS:1179 (Welding Goggles)", "IS:15298 (Safety Shoes)", "IS:2925 (Helmet)", "EN 388 (Abrasion/Heat)"],
    estimatedKitPriceRange: "Custom quote based on quantity (1 to 500+ kits)",
    items: [
      {
        productId: "safety-helmets",
        name: "Industrial Safety Helmet (HDPE IS:2925) with Heat Shield Fitment",
        qty: 1,
        spec: "Ratchet adjustment, sweatband, slot for welding screen adapter"
      },
      {
        productId: "safety-shoes",
        name: "Karam Industrial Safety Shoes (Steel Toe 200J)",
        qty: 1,
        spec: "Heat-resistant oil/acid PU sole, genuine buffalo grain leather"
      },
      {
        productId: "safety-goggles",
        name: "3M 1621IN Anti-Fog Clear Safety Goggles & Cutting Glasses",
        qty: 1,
        spec: "Polycarbonate high-impact lens with indirect ventilation"
      },
      {
        productId: "generic-cut-resistant-gloves",
        name: "Heavy-Duty Split Leather Welding Gauntlet Gloves",
        qty: 2,
        spec: "14-inch heat-resistant split cowhide with reinforced palm"
      },
      {
        name: "Chrome Leather Welder Apron & Arm Sleeves",
        qty: 1,
        spec: "Spatter-resistant split chrome leather with adjustable cotton ties"
      },
      {
        productId: "protective-masks",
        name: "Welding Fume & Particulate Respirator Mask",
        qty: 3,
        spec: "Active carbon layer with cool-flow exhalation valve"
      }
    ]
  },
  {
    id: "scaffolder-height-kit",
    trade: "Height Work & Scaffolding",
    title: "Scaffolder & Fall Arrest Height Safety Kit",
    badge: "Zero Drop Risk",
    iconName: "ShieldAlert",
    description: "Crucial fall arrest, anchor, and head protection kit mandatory for scaffolding builders, tower riggers, and pipe racks.",
    suitableFor: "Refinery turnaround towers, civil staging, high-rise structural erection, chimney inspection.",
    standards: ["IS:3521 (Part 1):2021", "EN 361", "IS:2925", "EN 397"],
    estimatedKitPriceRange: "Custom contractor rates with batch test certificates",
    items: [
      {
        productId: "belt-harness",
        name: "Udyogi UB 102 Full Body Safety Harness with Shock Absorber & Dual SH60 Hooks",
        qty: 1,
        spec: "Energy tear-webbing absorber, 2m twin lanyard, 55mm gate scaffold hooks"
      },
      {
        productId: "safety-helmets",
        name: "Industrial Safety Helmet with 4-Point Chin Strap (Class E/G)",
        qty: 1,
        spec: "Non-slip chin strap to prevent helmet falling during vertical climb"
      },
      {
        productId: "safety-shoes",
        name: "Karam High-Traction Anti-Skid Industrial Safety Shoes",
        qty: 1,
        spec: "Cleated PU sole engineered for wet steel staging and ladder rungs"
      },
      {
        productId: "generic-finger-coated-gloves",
        name: "Textured Latex Finger Coated Grip Gloves (Pack of 3)",
        qty: 1,
        spec: "Non-slip crinkle grip for wet scaffolding tubes and clamps"
      },
      {
        productId: "safety-jackets",
        name: "High-Visibility Fluorescent Safety Vest with 360° Tape",
        qty: 1,
        spec: "Class 2 retro-reflective stripes for crane operator visibility"
      },
      {
        name: "Tool Lanyard & Scaffold Hammer Holster",
        qty: 1,
        spec: "Elastic shock-cord tool tether preventing tool drops from height"
      }
    ]
  },
  {
    id: "refinery-turnaround-kit",
    trade: "Refinery Shutdown & Maintenance",
    title: "Refinery Turnaround & Petrochemical Safety Kit",
    badge: "Refinery Gate Pass Ready",
    iconName: "Factory",
    description: "Engineered specifically for refinery turnarounds, chemical unit overhauls, mechanical cleaning, and vessel entry.",
    suitableFor: "IOCL Mathura turnaround, GAIL Pata, chemical SEZs, tank farm maintenance.",
    standards: ["IS:15298", "IS:2925", "ANSI Z87.1", "EN 374 (Chemical)"],
    estimatedKitPriceRange: "Tiered bulk pricing for contractor workforces",
    items: [
      {
        productId: "safety-shoes",
        name: "Karam Anti-Static Oil & Hydrocarbon Resistant Safety Shoes",
        qty: 1,
        spec: "Steel toe cap, dual-density antistatic sole prevents static sparks"
      },
      {
        productId: "safety-goggles",
        name: "3M 1621IN Chemical Splash & Dust Goggles",
        qty: 1,
        spec: "Anti-fog polycarbonate, indirect ventilation prevents acid/solvent splashes"
      },
      {
        productId: "safety-helmets",
        name: "HDPE Industrial Helmet (White / Yellow / Blue) with Chin Strap",
        qty: 1,
        spec: "Impact and penetration certified as per IS:2925"
      },
      {
        productId: "generic-rubber-hand-gloves",
        name: "12-Inch Heavy Duty Industrial Natural Rubber Gloves",
        qty: 2,
        spec: "Extended forearm protection against chemical runoffs, grease, and washdown"
      },
      {
        productId: "protective-masks",
        name: "N95 Dust & Hydrocarbon Vapor Cartridge Respirator",
        qty: 5,
        spec: "Dual filtration layer for refinery catalytic and coke dust environments"
      },
      {
        productId: "safety-jackets",
        name: "High-Vis Neon Safety Vest with ID Badge Holder",
        qty: 1,
        spec: "Essential for refinery gate pass security verification"
      }
    ]
  },
  {
    id: "road-highway-kit",
    trade: "Road & Highway Infrastructure",
    title: "Highway EPC & Road Construction Safety Kit",
    badge: "IRC / MoRTH Compliant",
    iconName: "Truck",
    description: "High-visibility and traffic delineation kit for expressway builders, bituminous paving teams, and bridge engineers.",
    suitableFor: "NHAI projects, state highway widening, bridge girders, city road resurfacing.",
    standards: ["IRC:SP:55 (Work Zone Safety)", "IS:15809 (High-Vis)", "MoRTH Section 1500"],
    estimatedKitPriceRange: "Volume discounts with direct site delivery across India",
    items: [
      {
        productId: "safety-jackets",
        name: "Reflective High-Vis Safety Jacket (Neon Green / Orange)",
        qty: 2,
        spec: "Class 2 retro-reflective tape visible up to 300m under vehicle headlights"
      },
      {
        productId: "road-cones",
        name: "750 mm (29.5 inch) Heavy-Duty PVC Traffic Safety Cones (Pack of 4)",
        qty: 1,
        spec: "Weighted square base with dual high-intensity reflective collars"
      },
      {
        productId: "road-studs",
        name: "SSWW 10x9 cm Highway Yellow Cat-Eye Road Studs (Pack of 25)",
        qty: 1,
        spec: "Impact-resistant engineering polymer with dual-sided reflective lenses"
      },
      {
        productId: "gumboots",
        name: "Hitman Alento 11-inch PVC Safety Gumboots (Black & Red)",
        qty: 1,
        spec: "Waterproof lugged sole for wet bituminous mix, mud, and water logging"
      },
      {
        productId: "generic-lane-marking-tape",
        name: "Generic Lane Marking Hazard Caution Tape 48mm x 15m (Pack of 6)",
        qty: 1,
        spec: "Yellow & Black diagonal warning tape for traffic diversion barricades"
      },
      {
        productId: "safety-helmets",
        name: "Fluorescent High-Visibility Construction Safety Helmet",
        qty: 1,
        spec: "Reflective sticker band on crown for 360-degree night work visibility"
      }
    ]
  },
  {
    id: "electrical-substation-kit",
    trade: "Electrical & Substation Works",
    title: "Electrical Maintenance & Substation PPE Kit",
    badge: "Dielectric Safety",
    iconName: "Zap",
    description: "Insulated and dielectric protective gear for 11kV / 33kV substation engineers, switchgear crews, and transformer technicians.",
    suitableFor: "Industrial substations, power distribution utilities, panel board assembly, solar EPC plants.",
    standards: ["IS:4770 (Electrical Gloves)", "IS:2925 (Class E 20kV Dielectric)", "IS:15298"],
    estimatedKitPriceRange: "Custom quotation with individual breakdown",
    items: [
      {
        productId: "safety-helmets",
        name: "Dielectric Non-Conductive Safety Helmet (Class E - Up to 20,000V)",
        qty: 1,
        spec: "Zero metal parts, high dielectric strength shell tested for electrical flash"
      },
      {
        productId: "safety-shoes",
        name: "Karam Electrical Hazard Shock-Resistant Safety Shoes",
        qty: 1,
        spec: "Dual-density polyurethane non-conductive sole with composite/insulated toe"
      },
      {
        productId: "safety-goggles",
        name: "3M Arc Flash & UV Protective Clear Safety Goggles",
        qty: 1,
        spec: "99.9% UV absorption and high impact rating against electrical arc fragments"
      },
      {
        name: "Class 1 / Class 2 High Voltage Insulating Rubber Gloves (Sourced on Demand)",
        qty: 1,
        spec: "Tested up to 7,500V / 17,000V working voltage with leather protector gloves"
      },
      {
        productId: "workplace-safety-equipment",
        name: "LOTO Safety Padlock & Hasps Master Lockout Kit",
        qty: 1,
        spec: "Non-conductive nylon body safety padlocks with 'DO NOT OPERATE' tags"
      },
      {
        productId: "generic-cut-resistant-gloves",
        name: "HPPE PU-Coated Precision Cable Stripping Gloves",
        qty: 2,
        spec: "Level 5 cut resistance for sharp copper busbar and cable preparation"
      }
    ]
  },
  {
    id: "plant-visitor-kit",
    trade: "Plant Visitors & Safety Audits",
    title: "Executive Plant Visitor & Audit Safety Kit",
    badge: "Executive PPE",
    iconName: "UserCheck",
    description: "Neatly packaged VIP visitor kit for corporate audits, government factory inspectors, client delegations, and engineers.",
    suitableFor: "Refinery board visits, ISO 45001 safety audits, student tours, contractor site briefings.",
    standards: ["IS:2925", "IS:15809", "ANSI Z87.1"],
    estimatedKitPriceRange: "Pre-packed visitor cartons (10 to 100 sets)",
    items: [
      {
        productId: "safety-helmets",
        name: "Pure White Executive HDPE Safety Helmet with Foam Sweatband",
        qty: 1,
        spec: "Premium finish, lightweight ergonomic suspension, visitor designation"
      },
      {
        productId: "safety-jackets",
        name: "Premium Neon Green Reflective Vest with Clear ID Badge Pocket",
        qty: 1,
        spec: "Zip closure, transparent pocket for visitor pass & pen holder"
      },
      {
        productId: "safety-goggles",
        name: "Ultra-Lightweight Scratch-Resistant Safety Eyewear",
        qty: 1,
        spec: "Can be worn comfortably over prescription eyeglasses"
      },
      {
        productId: "protective-masks",
        name: "Individually Sealed N95 Particulate Respirator",
        qty: 1,
        spec: "Hygienic single-use sterile packaging"
      },
      {
        name: "Soft PU Foam Corded Ear Plugs (NRR 32 dB)",
        qty: 1,
        spec: "Individually poly-bagged noise reduction earplugs with tether cord"
      }
    ]
  },
  {
    id: "welding-piping-fabrication-kit",
    trade: "Piping, Welding & Fabrication",
    title: "Piping Turnaround, Welding & NDT Hardware Kit",
    badge: "Refinery Grade",
    iconName: "Flame",
    description: "Complete turnkey hardware, welding consumables, Champion gaskets, and NDT crack detection kit for mechanical pipeline crews.",
    suitableFor: "Refinery turnaround shutdowns, boiler maintenance, pipe spool fabrication, flange joint bolt-up.",
    standards: ["ASME Section V (NDT)", "AWS A5.1 (Electrodes)", "IS:2712 (CNAF Gaskets)", "ASTM A193 (B7 Studs)"],
    estimatedKitPriceRange: "Custom project quotation with bulk rates",
    items: [
      {
        productId: "welding-rods-electrodes",
        name: "Industrial Welding Rods (E7018 / E6013 - 20kg Carton)",
        qty: 1,
        spec: "Low-hydrogen iron powder radiographic grade electrodes"
      },
      {
        productId: "dpt-kit-ndt-crack",
        name: "DPT Kit (Cleaner, Penetrant, Developer - 3 Cans)",
        qty: 1,
        spec: "ASME Sec V compliant visible red dye penetrant spray kit"
      },
      {
        productId: "champion-gasket-sheet",
        name: "Non-Asbestos Champion Gasket Sheet (Style 20/54)",
        qty: 2,
        spec: "1.5m x 2.0m CNAF high-temp jointing sheet or cut flange rings"
      },
      {
        productId: "nuts-bolts-fasteners",
        name: "High-Tensile Flange Stud Bolts & 2H Nuts Set",
        qty: 24,
        spec: "ASTM A193 B7 stud bolts with heavy hex nuts"
      },
      {
        productId: "heavy-duty-pipe-wrench",
        name: "Heavy-Duty Cast Iron Pipe Wrench (Stillson 18\")",
        qty: 1,
        spec: "Induction-hardened serrated hook jaws for tight pipe gripping"
      },
      {
        productId: "heavy-duty-silicon-gun",
        name: "Heavy-Duty Metal Silicon Caulking Gun & RTV Sealant",
        qty: 1,
        spec: "12:1 mechanical thrust ratio with high-viscosity silicone"
      }
    ]
  },
  {
    id: "site-office-stationery-kit",
    trade: "Site Office & Documentation",
    title: "Contractor Site Office, Gate Pass & CAD Printing Kit",
    badge: "Site Office Essential",
    iconName: "Briefcase",
    description: "All-in-one site administration stationery pack including attendance registers, gate pass books, exercise copies, pens, paper cutter, and CAD drawing print sets.",
    suitableFor: "Site portacabins, security gate entries, QA/QC documentation desks, contractor project offices.",
    standards: ["Form D Labour Muster Roll", "Refinery Gate Pass Formats", "ISO 9001 Documentation"],
    estimatedKitPriceRange: "Site startup bundle or monthly replenishment",
    items: [
      {
        productId: "site-registers-documentation",
        name: "Worker Muster Roll, Gate Pass & Work Permit Registers",
        qty: 4,
        spec: "Hardbound 100/200-folio durable statutory audit format books"
      },
      {
        productId: "stationery-copies-notebooks",
        name: "Field Note Ruled Copies & Supervisor Pocket Notebooks",
        qty: 12,
        spec: "High-GSM bleed-free paper with spill-resistant covers"
      },
      {
        productId: "stationery-pens-markers",
        name: "Industrial Ballpoint Pens (Box of 50) + Metal Paint Markers",
        qty: 2,
        spec: "0.7mm smooth ballpoint pens and waterproof pipe paint markers"
      },
      {
        productId: "heavy-duty-paper-cutter",
        name: "Heavy-Duty Steel Base Guillotine Paper Cutter (A4/A3)",
        qty: 1,
        spec: "Spring-action safety blade with alignment grid"
      },
      {
        productId: "printout-photocopy-services",
        name: "Engineering CAD Blueprint Plots & Gate Pass Photocopy Sets",
        qty: 50,
        spec: "A3/A4 crisp black & white and color laser drawings with lamination"
      }
    ]
  }
];

export const HSN_TAX_RATES: HsnTaxRate[] = [
  {
    hsnCode: "6403",
    category: "Industrial Safety Footwear",
    gstRate: "18% / 5%",
    cgstRate: "9% / 2.5%",
    sgstRate: "9% / 2.5%",
    igstRate: "18% / 5%",
    appliesTo: "Karam steel-toe safety shoes, executive safety boots, PVC gumboots",
    complianceNotes: "Items valued under ₹1,000 per pair attract 5% GST; items above ₹1,000 attract standard 18% GST."
  },
  {
    hsnCode: "6506",
    category: "Industrial Safety Helmets & Hard Hats",
    gstRate: "18%",
    cgstRate: "9%",
    sgstRate: "9%",
    igstRate: "18%",
    appliesTo: "HDPE hard hats, ratchet suspension helmets, dielectric electrical helmets",
    complianceNotes: "Mandatory 18% GST with IS:2925 BIS certification details printed on invoice."
  },
  {
    hsnCode: "6307 / 6211",
    category: "Reflective High-Vis Jackets & Vests",
    gstRate: "12% / 18%",
    cgstRate: "6% / 9%",
    sgstRate: "6% / 9%",
    igstRate: "12% / 18%",
    appliesTo: "Neon polyester reflective vests, Class 2/3 road jackets with 3M retro-reflective tape",
    complianceNotes: "Tax rate depends on fiber composition (synthetic woven polyester vs technical garment)."
  },
  {
    hsnCode: "3926 / 8308",
    category: "Traffic Cones, Road Studs & Fall Arrest Harnesses",
    gstRate: "18%",
    cgstRate: "9%",
    sgstRate: "9%",
    igstRate: "18%",
    appliesTo: "750mm PVC traffic cones, plastic cat-eye road studs, Udyogi full body harnesses",
    complianceNotes: "Classified under fabricated plastic & safety articles of engineering polymers / alloy hardware."
  },
  {
    hsnCode: "6116 / 4015",
    category: "Industrial Work Gloves & Chemical Rubber Gloves",
    gstRate: "12% / 18%",
    cgstRate: "6% / 9%",
    sgstRate: "6% / 9%",
    igstRate: "12% / 18%",
    appliesTo: "Cut-resistant HPPE gloves, latex coated finger gloves, 12-inch rubber gloves",
    complianceNotes: "Knitted gloves attract 12% GST; vulcanized industrial rubber gloves attract 18% GST."
  },
  {
    hsnCode: "9004 / 9020",
    category: "Protective Eyewear & Industrial Respirators",
    gstRate: "18%",
    cgstRate: "9%",
    sgstRate: "9%",
    igstRate: "18%",
    appliesTo: "3M 1621IN anti-fog goggles, face shields, N95 particulate respirators",
    complianceNotes: "Optical safety apparatus and personal respiratory breathing equipment."
  },
  {
    hsnCode: "8311",
    category: "Welding Rods & Coated Electrodes",
    gstRate: "18%",
    cgstRate: "9%",
    sgstRate: "9%",
    igstRate: "18%",
    appliesTo: "E6013, E7018 low-hydrogen arc welding electrodes, SS rods, gas cutting blowpipe torches & copper nozzles",
    complianceNotes: "Base metal coated electrodes for electric arc welding with IBR / AWS test certification."
  },
  {
    hsnCode: "6812 / 8484",
    category: "Champion Non-Asbestos Gasket Sheets & Flange Jointing",
    gstRate: "18%",
    cgstRate: "9%",
    sgstRate: "9%",
    igstRate: "18%",
    appliesTo: "Champion Style 20, Style 54 compressed non-asbestos sheets, cut ring flange gaskets",
    complianceNotes: "High-temperature and high-pressure gasket jointing material compliant with IS:2712."
  },
  {
    hsnCode: "7318",
    category: "Industrial Nuts, Bolts, Studs & Washers",
    gstRate: "18%",
    cgstRate: "9%",
    sgstRate: "9%",
    igstRate: "18%",
    appliesTo: "Grade 8.8, 10.9 high tensile hex bolts, ASTM A193 B7 stud bolts, 2H heavy nuts",
    complianceNotes: "Standard threaded iron and steel fasteners for refinery piping and structural steel erection."
  },
  {
    hsnCode: "3824 / 3402",
    category: "DPT Kit (Dye Penetrant Crack Detection Chemicals)",
    gstRate: "18%",
    cgstRate: "9%",
    sgstRate: "9%",
    igstRate: "18%",
    appliesTo: "DPT Cleaner, Red Dye Penetrant, and White Developer spray aerosol cans",
    complianceNotes: "Non-destructive testing chemical preparations conforming to ASME Section V standards."
  },
  {
    hsnCode: "8467 / 8515",
    category: "Power Tools, Angle Grinders & Inverter Welding Machines",
    gstRate: "18%",
    cgstRate: "9%",
    sgstRate: "9%",
    igstRate: "18%",
    appliesTo: "4-inch / 7-inch angle grinders, 200A-400A IGBT arc welding machines, pipe wrenches",
    complianceNotes: "Handheld electric power tools and arc welding machinery."
  },
  {
    hsnCode: "4820 / 4911",
    category: "Site Stationery, Registers, Copies, Printouts & CAD Plots",
    gstRate: "12% / 18%",
    cgstRate: "6% / 9%",
    sgstRate: "6% / 9%",
    igstRate: "12% / 18%",
    appliesTo: "Hardbound worker muster registers, gate pass books, ruled copies, CAD drawing prints, photocopy xerox",
    complianceNotes: "Printed registers and stationery articles attract standard 12% to 18% GST."
  }
];
