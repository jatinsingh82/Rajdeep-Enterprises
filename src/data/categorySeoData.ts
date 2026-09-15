export interface CategorySeoInfo {
  slug: string;
  categoryName: string;
  seoTitle: string;
  metaDescription: string;
  heading: string;
  summary: string;
  audience: string;
  keyItems: string[];
  standards: string;
  typicalApplications: string;
}

export const CATEGORY_SEO_DATA: Record<string, CategorySeoInfo> = {
  "Personal Protective Equipment (PPE)": {
    slug: "ppe",
    categoryName: "Personal Protective Equipment (PPE)",
    seoTitle: "Personal Protective Equipment (PPE) Supplies | Rajdeep Enterprises Mathura",
    metaDescription: "BIS and EN certified PPE gear for refinery and construction workers in Mathura: IS:2925 safety helmets, Karam steel-toe shoes, cut-resistant gloves, and high-visibility jackets.",
    heading: "Personal Protective Equipment (PPE) & Workforce Protection",
    summary: "Complete head-to-toe personnel safety equipment meeting statutory Indian Standards (IS) and European Norms (EN). Built for high-hazard work environments requiring mandatory PPE compliance for site gate entry and daily work permits.",
    audience: "Refinery turnaround contractors, EPC civil engineers, mechanical fabrication teams, and site safety supervisors.",
    keyItems: [
      "IS:2925 Industrial Safety Helmets with Ratchet",
      "Karam Steel-Toe Safety Shoes (IS:15298)",
      "High-Visibility Reflective Safety Jackets (EN 471 Class 2)",
      "Level 5 Cut-Resistant & Nitrile Grip Gloves",
      "Anti-Fog Chemical & Impact Safety Goggles",
      "PVC Heavy-Duty Safety Gumboots"
    ],
    standards: "IS:2925 (Helmets), IS:15298 Part-2 (Safety Shoes), EN 388 (Protective Gloves), EN 471 (Hi-Vis Apparel)",
    typicalApplications: "Refinery plant turnarounds, civil construction sites, heavy engineering workshops, petrochemical storage units."
  },
  "Welding & NDT Testing": {
    slug: "welding-ndt",
    categoryName: "Welding & NDT Testing",
    seoTitle: "Welding Electrodes, Gas Cutters & DPT Testing Kits | Rajdeep Enterprises Mathura",
    metaDescription: "Industrial welding consumables in Mathura: E6013 and E7018 welding rods, Non-Destructive Testing (NDT) dye penetrant kits, gas cutting blowpipes, and portable inverter welding machines.",
    heading: "Welding Consumables & Non-Destructive Testing (NDT) Supplies",
    summary: "Consumables and equipment for structural pipeline welding, fabrication, and weld-joint crack inspection. Includes certified dye penetrant inspection chemicals (cleaner, penetrant, developer) for ASME and API compliance checks.",
    audience: "Piping contractors, vessel fabricators, mechanical erection teams, and QA/QC weld inspection engineers.",
    keyItems: [
      "E6013 Mild Steel & E7018 Low-Hydrogen Electrodes",
      "DPT Dye Penetrant Testing 3-Can Inspection Kits",
      "Heavy-Duty Gas Cutting Blowpipes & Nozzles",
      "IGBT Inverter Arc Welding Machines (250A - 400A)"
    ],
    standards: "AWS A5.1 / ASME Section II-C, ASME Section V Article 6 (NDT Dye Penetrant), IS:814",
    typicalApplications: "Refinery pipeline fabrication, boiler maintenance, pressure vessel overhauls, steel structural erection."
  },
  "Hardware, Gaskets & Sealants": {
    slug: "hardware-gaskets",
    categoryName: "Hardware, Gaskets & Sealants",
    seoTitle: "Champion Gasket Sheets, Grade 8.8 Fasteners & Industrial Hardware Mathura",
    metaDescription: "Genuine Champion compressed asbestos & non-asbestos jointing sheets, high-tensile Grade 8.8 studs, bolts, nuts, and heavy-duty silicone sealant guns supplied opposite Refinery Main Gate, Mathura.",
    heading: "Industrial Gaskets, High-Tensile Fasteners & Sealing Hardware",
    summary: "Flange jointing sheets, pipe sealing materials, and high-tensile bolting hardware designed for steam, hydrocarbon, cooling water, and structural applications. Available in custom cut sheet dimensions and full roll lengths.",
    audience: "Piping maintenance contractors, mechanical turnaround engineers, pump mechanics, and industrial plant plumbers.",
    keyItems: [
      "Genuine Champion CAF & CNAF Gasket Jointing Sheets (0.5mm to 5.0mm)",
      "High-Tensile Grade 8.8 / 10.9 Studs, Nuts, and Spring Washers",
      "Heavy-Duty Aluminum Barrel Silicone & Sealant Applicator Guns",
      "Heavy-Duty Drop-Forged Pipe Wrenches (12\" to 36\")"
    ],
    standards: "IS:2712 (Compressed Asbestos Fiber Jointing), DIN 933 / ISO 4017 (Grade 8.8 Fasteners), ASME B16.21 (Flange Gaskets)",
    typicalApplications: "Pipe flange joint sealing, heat exchanger maintenance, structural steel jointing, pump gland packing."
  },
  "Power Tools & Machinery": {
    slug: "power-tools",
    categoryName: "Power Tools & Machinery",
    seoTitle: "Industrial Power Tools & Crane Machinery Rental | Rajdeep Enterprises Mathura",
    metaDescription: "Heavy-duty 4-inch & 7-inch angle grinders, portable welding inverters, and mobile crane machinery rental (12T - 50T Hydra & Telescopic) for Mathura industrial and refinery projects.",
    heading: "Power Tools & Heavy Crane Machinery Operations",
    summary: "High-power metalworking electric tools and mobile lifting crane rental for structural erection, fabrication, and equipment positioning. Power tools feature heavy-duty copper armatures and safety cut-offs for continuous site operations.",
    audience: "Mechanical contractors, equipment erection engineers, scrap handling crews, and structural fabricators.",
    keyItems: [
      "Heavy-Duty Angle Grinders (850W 100mm & 2200W 180mm)",
      "Portable Inverter Arc Welding Units",
      "Hydra & Telescopic Mobile Cranes (12 Ton to 50 Ton Capacity Rental)",
      "Certified Crane Riggers & Slings Available On Demand"
    ],
    standards: "IS:3010 / IEC 60745 (Electric Power Tool Safety), Factory Act Lifting Equipment Compliance",
    typicalApplications: "Structural steel grinding, pipe beveling, heavy equipment lifting, plant maintenance shutdowns."
  },
  "Industrial Safety & Fall Protection": {
    slug: "fall-protection",
    categoryName: "Industrial Safety & Fall Protection",
    seoTitle: "Full Body Safety Harnesses & Height Fall Protection | Rajdeep Enterprises Mathura",
    metaDescription: "IS:3521 and EN 361 certified full-body safety harnesses with shock-absorbing lanyards, scaffold hooks, and work-at-height arrest systems available at Mathura Refinery Main Gate.",
    heading: "Height Safety, Fall Arrest & Scaffolding Protection",
    summary: "Certified fall arrest equipment engineered to prevent fatal injuries during work-at-height operations. Includes high-tenacity polyester webbing, alloy steel D-rings, and energy-absorbing dual lanyards with forged scaffolding snap hooks.",
    audience: "Scaffolders, structural painters, insulation contractors, tank maintenance teams, and high-altitude riggers.",
    keyItems: [
      "IS:3521 / EN 361 Certified Full Body Safety Harness",
      "Dual Shock-Absorbing Lanyards with Giant Scaffold Hooks",
      "Work Positioning Belts and Fall Arrester Blocks",
      "Scaffolding Tagging Systems and Safety Nets"
    ],
    standards: "IS:3521:1999 (Industrial Safety Belts and Harnesses), EN 361 (Full Body Harnesses), EN 355 (Energy Absorbers)",
    typicalApplications: "Column scaffolding, storage tank painting, high-level structural welding, chimney stack inspections."
  },
  "Road & Traffic Safety": {
    slug: "traffic-safety",
    categoryName: "Road & Traffic Safety",
    seoTitle: "Traffic Cones, Road Studs & Barricading Tapes | Rajdeep Enterprises Mathura",
    metaDescription: "Heavy-duty UV-stabilized PVC road cones (750mm), aluminum cat-eye road studs, and yellow-black floor hazard marking tapes for highway EPCs and plant logistics lanes in Mathura-Agra corridor.",
    heading: "Road Traffic Management & Site Perimeter Safety",
    summary: "Durable visual delineation products for traffic diversion, road construction, plant driveway demarcations, and pedestrian pathway management. Engineered with high-intensity prismatic reflective sheeting for day and night visibility.",
    audience: "Highway EPC contractors, refinery traffic marshals, warehouse safety heads, and infrastructure concessionaires.",
    keyItems: [
      "750mm Heavy-Duty Flexible PVC Traffic Cones with Rubber Base",
      "Die-Cast Aluminum & Polycarbonate Solar Cat-Eye Road Studs",
      "Heavy-Duty Yellow/Black Floor Hazard Marking Tape (50mm & 100mm)",
      "High-Visibility Fluorescent Safety Cones with Prismatic Reflective Sleeves"
    ],
    standards: "IRC:SP:84 / IRC:67 (Indian Roads Congress Road Safety Markings), ASTM D4956 Retroreflective Sheeting",
    typicalApplications: "Expressway lane cordoning, refinery perimeter traffic lanes, warehouse forklift paths, parking areas."
  },
  "Site Stationery & Documentation": {
    slug: "site-stationery",
    categoryName: "Site Stationery & Documentation",
    seoTitle: "Industrial Site Registers, Gate Pass Books & Stationery | Rajdeep Enterprises Mathura",
    metaDescription: "Statutory labor registers, hot work permit books, site entry pass slips, heavy-duty paper cutters, and drawing printout services located directly at UP SIDC Complex, Refinery Main Gate, Mathura.",
    heading: "Site Documentation, Statutory Registers & Project Stationery",
    summary: "Standardized site records and administrative stationery for industrial audits, labor compliance, work permit sign-offs, and drawing reproduction. Keeps site offices fully equipped for client inspections and safety audits.",
    audience: "Site timekeepers, HR administrators, safety auditors, EPC documentation controllers, and project accountants.",
    keyItems: [
      "Hardbound Site Attendance & Gate Entry Registers",
      "Hot Work / Cold Work Permit Triplicate Slip Books",
      "Contractor Material Challan & Gate Pass Books",
      "Industrial Marking Pens, Permanent Markers, and Paper Cutters",
      "Instant Blueprint / Drawing Printout & Photocopy Counter Service"
    ],
    standards: "Compliant with Indian Factories Act 1948 & Contract Labour (Regulation and Abolition) Act 1970",
    typicalApplications: "Site entry gates, security cabins, safety permit issuing desks, contractor field offices."
  },
  "Material Supplies & Accessories": {
    slug: "material-supplies",
    categoryName: "Material Supplies & Accessories",
    seoTitle: "Industrial Materials, Gumboots, Mask Supplies & Consumables | Rajdeep Enterprises",
    metaDescription: "Comprehensive industrial consumables: N95/FFP2 dust masks, chemical-resistant rubber gloves, heavy PVC gumboots, and custom hardware accessories supplied with pan-India dispatch.",
    heading: "General Industrial Supplies, Chemical PPE & Site Accessories",
    summary: "Essential day-to-day site supplies, worker protective disposables, chemical handling gear, and custom on-demand hardware. If you need any specialized item not standardly cataloged, we source it locally and nationally.",
    audience: "General contractors, housekeeping and chemical cleaning teams, plant maintenance crews, and logistics operators.",
    keyItems: [
      "Anti-Dust & Particulate Filtration Masks (N95 / FFP2 / 3M Compatible)",
      "Heavy-Duty Nitrile and Natural Rubber Chemical Gloves",
      "Waterproof Acid and Alkali Resistant Safety Gumboots",
      "Custom Sourced Industrial Consumables on Client Request"
    ],
    standards: "IS:9473 (Respiratory Masks), IS:4770 (Rubber Gloves), IS:13695 (PVC Gumboots)",
    typicalApplications: "Chemical handling, tank de-sludging, dust-prone cement/aggregate work, routine facility upkeep."
  }
};

/**
 * Helper to retrieve SEO category data by exact name or slug
 */
export function getCategorySeo(categoryNameOrSlug: string): CategorySeoInfo | undefined {
  if (!categoryNameOrSlug) return undefined;
  
  // Direct match by category name
  if (CATEGORY_SEO_DATA[categoryNameOrSlug]) {
    return CATEGORY_SEO_DATA[categoryNameOrSlug];
  }

  // Slug match
  const normalized = categoryNameOrSlug.toLowerCase().trim();
  return Object.values(CATEGORY_SEO_DATA).find(
    (c) => c.slug === normalized || c.categoryName.toLowerCase() === normalized
  );
}
