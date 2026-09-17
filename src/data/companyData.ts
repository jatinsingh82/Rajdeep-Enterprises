import { Product, Industry, CoreValue } from '../types';

import karamSafetyShoesImg from '../assets/images/karam_safety_shoes_1788718103055.jpg';
import cutResistantGlovesImg from '../assets/images/cut_resistant_gloves_1788718116658.jpg';
import fingerCoatedGlovesImg from '../assets/images/finger_coated_gloves_1788718137335.jpg';
import rubberHandGlovesImg from '../assets/images/rubber_hand_gloves_1788718149536.jpg';
import udyogiSafetyHarnessImg from '../assets/images/udyogi_safety_harness_1788718169035.jpg';
import goggles3m1621inImg from '../assets/images/goggles_3m_1621in_1788718184415.jpg';
import hitmanAlentoGumbootImg from '../assets/images/hitman_alento_gumboot_1788718199530.jpg';
import trafficSafetyConesImg from '../assets/images/traffic_safety_cones_1788718216753.jpg';
import roadStudsReflectorImg from '../assets/images/road_studs_reflector_1788718233846.jpg';
import laneMarkingTapeImg from '../assets/images/lane_marking_tape_1788718250238.jpg';

// New industrial supplies, site stationery, tools & equipment images
import dptKitImg from '../assets/images/dpt_kit_ndt_1788722279573.jpg';
import championGasketImg from '../assets/images/champion_gasket_1788722291494.jpg';
import weldingRodsImg from '../assets/images/welding_rods_1788722305396.jpg';
import gasCutterTorchImg from '../assets/images/gas_cutter_torch_1788722317916.jpg';
import hydraCraneImg from '../assets/images/hydra_crane_1788722333122.jpg';
import siliconGunImg from '../assets/images/silicon_gun_1788722347715.jpg';
import pipeWrenchImg from '../assets/images/pipe_wrench_1788722360648.jpg';
import weldingMachineImg from '../assets/images/welding_machine_1788722375451.jpg';
import siteRegistersImg from '../assets/images/site_registers_1788722389549.jpg';
import nutsBoltsImg from '../assets/images/nuts_bolts_1788722407439.jpg';
import angleGrinderImg from '../assets/images/angle_grinder_1788722425491.jpg';
import paperCutterImg from '../assets/images/paper_cutter_1788722440209.jpg';
import printoutPhotocopyImg from '../assets/images/printout_photocopy_1788722455127.jpg';
import siteCopiesImg from '../assets/images/site_copies_1788722489396.jpg';
import sitePensImg from '../assets/images/site_pens_1788722506236.jpg';
import shopOwnerImg from '../assets/images/real_father_shop_1789213228977.jpg';

export const COMPANY_INFO = {
  name: "Rajdeep Enterprises",
  shortName: "Rajdeep Enterprises",
  tagline: "All Kinds of Safety Accessories & Material Supplies",
  heroHeading: "Industrial Safety PPE, Site Stationery, Hardware & Material Supplies",
  heroSubheading: "Supplying safety accessories, welding consumables, Champion gaskets, site registers, stationery, power tools, and heavy crane rental to refineries and construction sites nationwide.",
  contactPerson: "Raj Singh Tarkar",
  designation: "Proprietor & Supply Lead",
  ownerImage: shopOwnerImg,
  phone: "09997993895",
  displayPhone: "+91 99979 93895",
  secondaryPhone: "08923993895",
  displaySecondaryPhone: "+91 89239 93895",
  whatsappNumber: "919997993895",
  email: "rjsinghtarkar@gmail.com",
  address: "15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura, Uttar Pradesh",
  fullAddress: "15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura, Uttar Pradesh - 281005, India",
  landmark: "Refinery Main Gate (Mathura)",
  supplyReach: "Supplying in Whole India Everywhere (All 28 States & 8 UTs with Doorstep Dispatch)",
  supplyReachShort: "Whole India Supply Everywhere",
  quantityFlexibility: "Order Any Quantity You Need (From 1 Piece to 50,000+ Bulk Consignments - No Minimum or Maximum Limit)",
  customSourcingNotice: "Need Any Extra Item Not Listed? Contact Us Directly! We source and supply all specialized safety accessories, bespoke PPE, custom branded workwear, and industrial hardware on demand.",
  gstStatus: "Available on Invoice / Quotation",
  operatingHours: "Monday – Saturday: 9:00 AM – 8:00 PM (Emergency Industrial Orders On-Call)",
  locationCoordinates: {
    lat: 27.4239,
    lng: 77.6974
  },
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rajdeep+Enterprises,+15/1,+U.P.+S.I.D.C.+Complex,+Refinery+Main+Gate,+Mathura,+Uttar+Pradesh+-+281005",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Rajdeep+Enterprises,+15/1,+U.P.+S.I.D.C.+Complex,+Refinery+Main+Gate,+Mathura,+Uttar+Pradesh+-+281005",
  whatsappDefaultMessage: "Hello, I am interested in your safety accessories, industrial materials, site stationery and hardware supplies. I would like to get a quotation.",
};

export const PRODUCT_CATEGORIES = [
  "All Products",
  "Featured Safety",
  "Personal Protective Equipment (PPE)",
  "Site Stationery & Documentation",
  "Welding & NDT Testing",
  "Hardware, Gaskets & Sealants",
  "Power Tools & Machinery",
  "Industrial Safety & Fall Protection",
  "Road & Traffic Safety",
  "Material Supplies & Accessories"
];

export const PRODUCTS: Product[] = [
  {
    id: "safety-helmets",
    name: "Industrial Safety Helmets",
    category: "Personal Protective Equipment (PPE)",
    shortDescription: "Heavy-duty impact-resistant safety helmets with ratchet suspension for construction and industrial sites.",
    fullDescription: "Manufactured from high-density polyethylene (HDPE) polymer with multi-point adjustable chin strap, ventilation vents, and sweatband. Designed to provide maximum head protection against falling objects, impacts, and electrical hazards.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    badge: "Featured on Card",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Material: High-Density Polyethylene (HDPE)",
      "Standards: IS:2925 / EN 397 Certified",
      "Colors: Safety Yellow, White, Blue, Red, Orange",
      "Adjustment: Manual Ratchet & Sturdy Chin Strap",
      "Features: Shock absorption, slot for ear muffs/visors"
    ],
    commonUses: "Refineries, construction sites, manufacturing plants, civil engineering works"
  },
  {
    id: "safety-shoes",
    name: "Karam Industrial Safety Shoes",
    category: "Personal Protective Equipment (PPE)",
    shortDescription: "Karam brand steel-toe puncture-resistant leather industrial safety shoes with anti-skid dual-density PU sole.",
    fullDescription: "Genuine Karam industrial safety footwear engineered for heavy factory, fabrication, and refinery duty. Features a 200 Joules impact-resistant alloy steel toe cap, genuine grain leather upper, dual-density oil and acid-resistant polyurethane sole, antistatic protection, and shock-absorbing heel.",
    image: karamSafetyShoesImg,
    badge: "Karam Certified",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Brand: Karam Safety Footwear",
      "Toe Cap: 200 Joules Impact Steel Toe Protection",
      "Sole: Dual Density Polyurethane (PU) Anti-Static",
      "Upper: High-grade breathable water-repellent buffalo grain leather",
      "Standards: IS:15298 (Part-2) & EN ISO 20345 Certified",
      "Sizes: UK / India 5 to 12"
    ],
    commonUses: "Mathura refinery sites, heavy workshops, fabrication units, chemical storage, warehouses"
  },
  {
    id: "safety-jackets",
    name: "Reflective Safety Jackets",
    category: "Personal Protective Equipment (PPE)",
    shortDescription: "High-visibility fluorescent neon safety vests with 360° retro-reflective tapes.",
    fullDescription: "High-visibility polyester safety jackets featuring 2-inch wide micro-prismatic or glass bead reflective stripes. Essential for low-light operations, highway projects, refinery turnaround maintenance, and plant inspections.",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
    badge: "Essential PPE",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Fabric: 100% Breathable Polyester mesh or solid fabric",
      "Reflective Tape: High-intensity 2-inch Class 2 tapes",
      "Closure: Heavy-duty front zipper or Velcro fastener",
      "Colors: High-Vis Neon Green, Fluorescent Orange",
      "Pockets: Pen slot, ID badge holder, mobile pocket"
    ],
    commonUses: "Highway maintenance, traffic control, plant safety officers, construction crews"
  },
  {
    id: "generic-cut-resistant-gloves",
    name: "GENERIC White and Grey Standard Cut Resistant Gloves, (Pack of 12)",
    category: "Personal Protective Equipment (PPE)",
    shortDescription: "HPPE fiber standard cut-resistant white and grey industrial work gloves in a value pack of 12 pairs.",
    fullDescription: "High-performance HPPE cut-resistant knitted safety work gloves featuring a durable grey polyurethane (PU) palm and finger coating for superior grip, tactile sensitivity, and cut protection during metal handling, blade work, and glass assembly.",
    image: cutResistantGlovesImg,
    badge: "Pack of 12",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Package Contents: Pack of 12 Pairs",
      "Material: HPPE Cut-Resistant Yarn with Polyurethane Coating",
      "Color: White knit shell with Grey PU coated palm",
      "Cut Protection: High mechanical cut, abrasion & tear resistance",
      "Design: Elasticated knit wrist prevents debris entry",
      "Applications: Sheet metal handling, sharp part fabrication, glass work"
    ],
    commonUses: "Sheet metal handling, mechanical maintenance, glass processing, CNC machining, warehouse packaging"
  },
  {
    id: "generic-finger-coated-gloves",
    name: "GENERIC Orange and White Free Size Finger Coated Safety Gloves, (Pack of 3 Pair)",
    category: "Personal Protective Equipment (PPE)",
    shortDescription: "Breathable white cotton knitted work gloves with high-traction orange latex coated fingers in a pack of 3 pairs.",
    fullDescription: "Free-size industrial safety work gloves featuring a breathable seamless white cotton shell and textured high-visibility orange latex finger and palm coating. Provides exceptional anti-slip grip and abrasion resistance for construction, handling, and workshop tasks.",
    image: fingerCoatedGlovesImg,
    badge: "Pack of 3 Pair",
    isFeatured: false,
    isCardPhotoItem: true,
    specifications: [
      "Package Contents: Pack of 3 Pairs",
      "Size: Free Size stretchable ergonomic fit",
      "Coating: Heavy-duty textured anti-slip orange latex coating",
      "Shell: Breathable white seamless cotton knit",
      "Grip: Non-slip crinkle texture for dry, wet, and oily handling",
      "Usage: Reusable, washable, and high-durability construction"
    ],
    commonUses: "General material handling, warehouse loading, masonry work, carpentry, scaffolding"
  },
  {
    id: "generic-rubber-hand-gloves",
    name: "Generic Rubber Hand Gloves 12 Inch, Orange (Pack of 1 Pair)",
    category: "Personal Protective Equipment (PPE)",
    shortDescription: "12-inch heavy-duty orange industrial latex rubber gloves for chemical splash and liquid protection.",
    fullDescription: "Premium 12-inch elbow-length industrial natural rubber gloves designed to protect hands and forearms against water, detergents, chemical runoffs, oils, and mild acids. Features diamond-pattern textured palm and fingers for secure grip in wet environments.",
    image: rubberHandGlovesImg,
    badge: "12 Inch Heavy Duty",
    isFeatured: false,
    isCardPhotoItem: true,
    specifications: [
      "Package Contents: 1 Pair (Pack of 1 Pair)",
      "Length: 12 Inch (300 mm) extended forearm protection",
      "Material: Heavy-duty natural latex rubber",
      "Color: High-visibility safety orange",
      "Pattern: Diamond non-slip palm texture",
      "Resistance: Water, cleaning chemicals, detergents, and light acids"
    ],
    commonUses: "Industrial sanitation, refinery maintenance washing, chemical transfer, wet processing, laboratories"
  },
  {
    id: "belt-harness",
    name: "Udyogi Full Body Safety Harness Ub 102 With Sh60 and SA",
    category: "Industrial Safety & Fall Protection",
    shortDescription: "Udyogi UB 102 certified full body safety harness with Energy Shock Absorber (SA) and dual SH60 scaffold hooks.",
    fullDescription: "Engineered by Udyogi, the UB 102 Full Body Safety Harness is equipped with an integrated Energy Shock Absorber (SA) and twin 2.0-meter lanyard featuring SH60 forged scaffold hooks. Certified for fall arrest compliance at height, scaffoldings, and refinery towers.",
    image: udyogiSafetyHarnessImg,
    badge: "Udyogi Certified",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Brand & Model: Udyogi UB 102 with SH60 and SA",
      "Shock Absorber: Built-in tear-webbing energy shock absorber (SA)",
      "Hooks: Dual SH60 large opening (55mm gate) forged alloy scaffold hooks",
      "Webbing: 44mm high-tenacity polyester webbing with black contrast stitching",
      "Attachment: 1 Dorsal D-ring for fall arrest and 2 frontal textile loops",
      "Standards: IS:3521 (Part 1):2021 & EN 361 Certified"
    ],
    commonUses: "Refinery scaffolding, tower maintenance, pipe rack inspection, civil works at height, structural steel erection"
  },
  {
    id: "safety-goggles",
    name: "3M 1621IN Anti-Fog Clear Safety Goggles",
    category: "Personal Protective Equipment (PPE)",
    shortDescription: "Genuine 3M 1621IN transparent polycarbonate protective safety goggles with anti-fog coating and indirect ventilation.",
    fullDescription: "Authentic 3M 1621IN protective safety goggles designed for chemical splash and impact protection. Features a clear anti-fog polycarbonate lens, a flexible transparent vinyl frame that molds comfortably to the face, and indirect ventilation ports that circulate air while blocking liquid droplets and dust.",
    image: goggles3m1621inImg,
    badge: "3M Original",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Brand & Model: 3M 1621IN",
      "Lens: High-impact optical grade clear polycarbonate",
      "Coating: Anti-fog coating with 99.9% UV protection",
      "Ventilation: 4 indirect ventilation ports preventing fogging and chemical ingress",
      "Headband: Fully adjustable wide elastic headband",
      "Standards: ANSI Z87.1-2010 / EN 166 compliant"
    ],
    commonUses: "Chemical processing, grinding, lathe operation, liquid transfer, refinery sampling, plant laboratories"
  },
  {
    id: "gumboots",
    name: "Hitman Alento 11 inch PVC Safety Gumboot Black and Red",
    category: "Personal Protective Equipment (PPE)",
    shortDescription: "Hitman Alento 11-inch heavy-duty waterproof injection molded PVC gumboot with black shaft and red anti-skid lugged sole.",
    fullDescription: "Hitman Alento 11-inch PVC industrial gumboots engineered for challenging industrial and outdoor environments. Crafted with a heavy-duty seamless black PVC body and an aggressive red lugged anti-slip outsole, providing reliable protection against mud, sludge, wastewater, and oil.",
    image: hitmanAlentoGumbootImg,
    badge: "Hitman Alento",
    isFeatured: false,
    isCardPhotoItem: true,
    specifications: [
      "Brand & Model: Hitman Alento 11 Inch",
      "Height: 11 Inch ergonomic calf coverage",
      "Color: Black body with high-contrast Red sole",
      "Material: 100% Virgin injection molded PVC",
      "Outsole: Heavy cleated anti-skid red PVC tread",
      "Resistance: Waterproof, mud-resistant, mild chemical & oil resistance"
    ],
    commonUses: "Drainage works, construction sites, effluent treatment plants, monsoon operations, wet industrial floors"
  },
  {
    id: "road-cones",
    name: "GENERIC Traffic & road Safety Cone with Reflective Strips 750 mm (29.5 inch)Size Heavy-Duty Construction Zone Equipment PVC (Pack of 4)",
    category: "Road & Traffic Safety",
    shortDescription: "750 mm (29.5 inch) heavy-duty PVC construction zone traffic safety cones with dual reflective strips in a pack of 4.",
    fullDescription: "Heavy-duty 750 mm (29.5 inch) flexible PVC traffic safety cones designed for construction zones, plant internal roadways, and traffic management. Supplied in a pack of 4 with high-intensity reflective collar sleeves and a weighted stable base that resists highway wind drafts.",
    image: trafficSafetyConesImg,
    badge: "Pack of 4 (750mm)",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Package Contents: Pack of 4 Cones",
      "Height: 750 mm (29.5 inch) high-visibility profile",
      "Reflective Sleeves: Twin high-intensity white retro-reflective collars",
      "Material: Heavy-duty UV-stabilized impact-absorbing PVC",
      "Base: Heavy square base for wind stability and anti-tipping",
      "Color: High-visibility fluorescent day-glow orange"
    ],
    commonUses: "Refinery internal roadways, traffic diversion, road construction, plant parking bays, hazardous area cordoning"
  },
  {
    id: "road-studs",
    name: "SSWW 10X9 cm Plastic Road Stud Reflector Yellow (Pack of 25 pcs)",
    category: "Road & Traffic Safety",
    shortDescription: "SSWW 10x9 cm highway yellow plastic road stud reflectors with dual-sided cat-eye reflective prisms in a pack of 25 pcs.",
    fullDescription: "SSWW brand 10x9 cm plastic road stud reflectors designed for lane demarcation, road medians, and factory driveway safety. Manufactured from heavy-duty impact-resistant engineering polymer with twin micro-prismatic yellow reflective lenses and a molded bottom shank for asphalt grouting.",
    image: roadStudsReflectorImg,
    badge: "Pack of 25 pcs",
    isFeatured: false,
    isCardPhotoItem: true,
    specifications: [
      "Brand & Model: SSWW 10X9 cm Plastic Road Stud Reflector",
      "Package Contents: Pack of 25 pcs",
      "Dimensions: 10 cm x 9 cm (Height: approx. 2 cm)",
      "Reflective Prisms: Dual-sided prismatic acrylic cat-eye lenses (Yellow)",
      "Material: High-impact injection-molded ABS / engineering polymer",
      "Fixing: Underside grouting shank with grooved adhesive bonding base"
    ],
    commonUses: "Industrial transit corridors, refinery internal roads, highway lane dividers, loading docks, speed bumps"
  },
  {
    id: "protective-masks",
    name: "Protective Masks & Respirators",
    category: "Personal Protective Equipment (PPE)",
    shortDescription: "N95 particulate respirators and dual chemical cartridge masks for dust and toxic vapor protection.",
    fullDescription: "Multi-layered electrostatically charged filter media masks protecting against fine respirable dust, silica, fumes, and organic vapors encountered during industrial operations.",
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=800&q=80",
    badge: "Health Protection",
    isFeatured: false,
    isCardPhotoItem: false,
    specifications: [
      "Filtration Efficiency: >= 95% against non-oil solid & liquid particles",
      "Valves: Optional exhalation cool-flow valve for comfort",
      "Cartridges: Organic vapor, acid gas, and particulate pre-filters",
      "Fastening: Elastic dual-headband with adjustable nose bridge",
      "Certifications: BIS / CE compliant"
    ],
    commonUses: "Painting booths, grinding rooms, chemical processing, dusty cement and coal facilities"
  },
  {
    id: "workplace-safety-equipment",
    name: "Workplace & Industrial Safety Equipment",
    category: "Industrial Safety & Fall Protection",
    shortDescription: "Barricade warning tapes, convex safety mirrors, lockout-tagout (LOTO) kits, and eye wash units.",
    fullDescription: "Comprehensive safety accessories required to meet workplace safety compliance, OSHA standards, and plant inspection audits. Prevents blind-spot collisions and unauthorized access to hazardous areas.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    badge: "Plant Compliance",
    isFeatured: false,
    isCardPhotoItem: false,
    specifications: [
      "Warning Tapes: Yellow/Black and Red/White hazard caution barricade rolls",
      "Convex Mirrors: 60cm & 80cm outdoor unbreakable polycarbonate mirrors",
      "LOTO Kits: Safety padlocks, hasps, cable lockouts, and warning tags",
      "Spill Control: Chemical absorbent pads, booms, and spill kits",
      "Eye Wash: Portable gravity-fed and wall-mount emergency eye wash stations"
    ],
    commonUses: "Forklift transit aisles, warehouse intersections, hazardous machinery isolation, emergency stations"
  },
  {
    id: "generic-lane-marking-tape",
    name: "Generic Lane marking tape 48 mm x 15 m Yellow Black (Pack of 6)",
    category: "Material Supplies & Accessories",
    shortDescription: "48 mm x 15 m yellow and black hazard caution lane marking floor adhesive tape in a pack of 6 rolls.",
    fullDescription: "Industrial-grade self-adhesive PVC lane marking hazard tape measuring 48 mm in width and 15 meters per roll. Features high-contrast diagonal yellow and black warning stripes with strong rubber adhesive for delineating walkways, machinery clearances, and safety zones in factories and warehouses.",
    image: laneMarkingTapeImg,
    badge: "Pack of 6 Rolls",
    isFeatured: true,
    isCardPhotoItem: false,
    specifications: [
      "Package Contents: Pack of 6 Rolls",
      "Dimensions: 48 mm Width x 15 Meters Length per roll",
      "Pattern: High-contrast diagonal Yellow & Black hazard stripes",
      "Material: Heavy-duty PVC vinyl film with pressure-sensitive adhesive",
      "Adhesion: Strong rubber resin adhesive bonding to concrete, epoxy, tiles",
      "Durability: Resistant to foot traffic, forklift wheels, scuffing, and moisture"
    ],
    commonUses: "Factory floor demarcation, warehouse forklift lanes, hazardous obstacle marking, emergency exits"
  },
  {
    id: "welding-rods-electrodes",
    name: "Industrial Welding Rods & Electrodes (E6013, E7018 Low Hydrogen)",
    category: "Welding & NDT Testing",
    shortDescription: "AWS A5.1 E6013, E7018 low-hydrogen, and stainless steel welding electrodes in 2.5mm, 3.15mm, and 4.0mm sizes.",
    fullDescription: "Heavy-duty industrial arc welding electrodes manufactured for structural steel fabrication, high-pressure piping, and refinery maintenance. Features smooth arc strike, minimal spatter, easy slag detachability, and radiographic quality weld bead. Available in E6013 general purpose rutile, E7018 basic low-hydrogen iron powder, and SS-308L / SS-316L stainless steel grades.",
    image: weldingRodsImg,
    badge: "AWS / IBR Approved",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Grades: AWS A5.1 E7018 (Low Hydrogen), AWS E6013 (Rutile), SS-308L, SS-316L",
      "Diameters: 2.5 mm, 3.15 mm, 4.0 mm, 5.0 mm",
      "Standards: IS:814, AWS A5.1, IBR Certified & Radiographic Grade",
      "Packaging: Moisture-proof hermetically sealed 5 kg packets & 20 kg master cartons",
      "Mechanical Properties: Tensile strength 510-610 MPa, Yield strength > 420 MPa, Elongation > 24%",
      "Current Type: AC / DC (+/-) with all-position welding capability"
    ],
    commonUses: "Refinery pipeline hot work, structural truss welding, boiler header fabrication, storage tanks, equipment repair"
  },
  {
    id: "dpt-kit-ndt-crack",
    name: "DPT Kit (Dye Penetrant Testing) for Weld Crack Detection",
    category: "Welding & NDT Testing",
    shortDescription: "3-can aerosol NDT inspection kit (Cleaner, Penetrant, Developer) for surface crack and flaw detection in welds & pipes.",
    fullDescription: "Professional non-destructive testing (NDT) Dye Penetrant Testing (DPT) aerosol kit engineered for detecting surface-breaking defects, cracks, porosity, lack of fusion, and pinholes in welded steel joints, pressure vessels, pipelines, and boiler structures. Formulated in compliance with ASME Section V, ASTM E165, and IS:3658 standards with bright red dye penetrant for clear contrast inspection.",
    image: dptKitImg,
    badge: "NDT Tested • 3 Cans",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Kit Composition: 3 Aerosol Cans (1x Cleaner/Remover, 1x Red Dye Penetrant, 1x White Developer)",
      "Standards: ASME Section V, ASTM E165, IS:3658 & ISO 3452-2 Compliant",
      "Sensitivity: Level 2 Normal Sensitivity - Reveals micro-cracks down to 1-2 microns",
      "Application: Steel pipes, refinery welding joints, boiler fabrication, casting inspection",
      "Packaging: 400ml / 500ml pressurized spray aerosol cans with directional actuator",
      "Shelf Life: 24 Months in factory sealed container (Batch test certificates included)"
    ],
    commonUses: "Mathura Refinery pipe weld inspection, structural steel fabrication, storage tank maintenance, boiler turnaround"
  },
  {
    id: "gas-cutter-blowpipe-set",
    name: "Heavy-Duty Oxy-Acetylene & Oxy-LPG Gas Cutter Blowpipe Torch Set",
    category: "Welding & NDT Testing",
    shortDescription: "Solid forged brass cutting blowpipe with ANME/PNME copper nozzles, dual control knobs, and safety flashback arrestors.",
    fullDescription: "Industrial-grade 90-degree gas cutting blowpipe torch set designed for fast, clean cutting of mild steel and alloy plates up to 300mm thickness. Constructed with solid forged brass head and stainless steel gas tubes for maximum heat resistance. Compatible with both Oxy-Acetylene (ANME nozzles) and Oxy-LPG (PNME nozzles) setups.",
    image: gasCutterTorchImg,
    badge: "Heavy-Duty Brass",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Head Angle: 90° heavy forged brass cutting head with triangular tube design",
      "Cutting Capacity: Mild steel plates from 3 mm to 300 mm thickness",
      "Nozzle Compatibility: ANME (Acetylene) & PNME (LPG / Propane) sizes 1/16\", 3/64\", 1/8\"",
      "Gas Types: Oxygen + Acetylene or Oxygen + Commercial LPG",
      "Safety Features: Built-in non-return valves & inlet flashback arrestors",
      "Accessories Included: Cutting blowpipe, 3x copper cutting nozzles, nozzle cleaner set, and spanner"
    ],
    commonUses: "Scrap cutting, pipe beveling, structural steel dismantling, refinery shutdown maintenance, metal fabrication"
  },
  {
    id: "inverter-welding-machine",
    name: "Heavy-Duty Inverter ARC Welding Machine (200A - 400A)",
    category: "Power Tools & Machinery",
    shortDescription: "IGBT digital inverter MMA welding machine with copper welding cable, 400A brass holder, and earth clamp.",
    fullDescription: "High-efficiency single-phase / three-phase IGBT inverter ARC welding machine delivering stable, smooth welding current with minimal spatter. Equipped with digital amperage display, anti-stick protection, hot start, and adjustable arc force. Built to withstand fluctuations in site voltage and intense duty cycles during heavy fabrication and site erection.",
    image: weldingMachineImg,
    badge: "IGBT Inverter 400A",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Current Range: 20A to 400A continuous variable output with digital LED display",
      "Technology: Advanced IGBT module with high-frequency inverter technology",
      "Duty Cycle: 60% at 400A / 100% at 310A (Heavy industrial rating)",
      "Electrode Compatibility: Runs 2.5mm, 3.15mm, 4.0mm, and 5.0mm electrodes continuously",
      "Protections: Thermal overload, over-voltage, under-voltage, and short-circuit auto cutoff",
      "Package: Inverter unit, 50 sq mm 5m copper welding cable, 400A heavy brass electrode holder & earth clamp"
    ],
    commonUses: "Field fabrication, pipe rack erection, refinery turnaround, boiler repair, workshop structural welding"
  },
  {
    id: "champion-gasket-sheet",
    name: "Non-Asbestos Champion Gasket Sheet (Style 20 / 54) for Flanges",
    category: "Hardware, Gaskets & Sealants",
    shortDescription: "Genuine Champion compressed non-asbestos jointing (CNAF) gasket sheets and pre-cut flange gaskets for steam, oil & gas.",
    fullDescription: "Authentic Champion brand compressed non-asbestos fiber (CNAF) jointing gasket sheets manufactured from aramid fibers, mineral fibers, and premium elastomer binders. Specifically engineered for sealing high-pressure pipe flanges, heat exchangers, valves, and pump casings against steam, oils, hydrocarbons, water, and industrial gases.",
    image: championGasketImg,
    badge: "Genuine Champion",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Brand & Styles: Champion Style 20 (High Steam/Pressure) & Champion Style 54 (Oil & Hydrocarbon)",
      "Sheet Sizes: 1.5m x 2.0m, 1.5m x 4.0m, and custom pre-cut circular flange gaskets (ANSI 150# - 600#)",
      "Thickness Range: 0.5 mm, 1.0 mm, 1.5 mm, 2.0 mm, 3.0 mm, 4.0 mm, 5.0 mm",
      "Max Temperature: Up to 450°C (continuous service up to 250°C)",
      "Max Pressure: Up to 100 kg/cm² (100 bar)",
      "Certifications: IS:2712 Grade W/1, BS 7531 Grade Y, DIN 3754"
    ],
    commonUses: "Refinery pipe flanges, boiler steam joints, hydrocarbon transfer manifolds, pump body gaskets, valve bonnets"
  },
  {
    id: "nuts-bolts-fasteners",
    name: "High-Tensile Industrial Nuts, Bolts & Full-Thread Studs (Grade 8.8 / 10.9)",
    category: "Hardware, Gaskets & Sealants",
    shortDescription: "Grade 8.8 / 10.9 hex bolts, ASTM A193 B7 stud bolts, 2H heavy hex nuts, and lock washers in all standard sizes.",
    fullDescription: "Comprehensive inventory of industrial high-tensile fasteners engineered for structural steel connections, pipe flange bolting, and machinery anchoring. Supplied in ASTM A193 B7 stud bolts with ASTM A194 2H heavy hex nuts for petrochemical applications, as well as IS:1364 / ISO 4014 Grade 8.8 and 10.9 hex head bolts with plain and spring washers.",
    image: nutsBoltsImg,
    badge: "Grade 8.8 / B7 Studs",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Grades: Metric Grade 8.8, 10.9, 12.9 & ASTM A193 B7 / B7M studs with 2H heavy hex nuts",
      "Sizes & Diameters: M6 to M48 (Metric) / 1/4\" to 2\" (UNC/UNF) in varied lengths (25mm to 500mm)",
      "Finishes: Black oxide, Hot-Dip Galvanized (HDG), Yellow zinc plated, PTFE / Xylan coated",
      "Threads: Precision rolled threads (Metric coarse/fine & UNC 8-UN)",
      "Standards: IS:1367, ISO 898-1, ASTM A193, ASME B18.2.1 / B18.2.2",
      "Certificates: Mill Test Certificate (MTC) and dimensional inspection reports on demand"
    ],
    commonUses: "Pipe flange bolting, structural steel trusses, pump foundation grouting, pressure vessel assembly"
  },
  {
    id: "heavy-duty-silicon-gun",
    name: "Heavy-Duty Metal Silicon Caulking Gun & RTV Sealants",
    category: "Hardware, Gaskets & Sealants",
    shortDescription: "Reinforced steel skeleton caulking gun with 12:1 thrust ratio for 300ml-310ml silicone and polyurethane sealants.",
    fullDescription: "Industrial heavy-duty metal skeleton silicone caulking gun designed for smooth, fatigue-free dispensing of high-viscosity silicone sealants, polyurethane adhesives, and acrylic mastic. Features a heavy-gauge stamped steel carriage, hardened pressure push rod, instant pressure-release thumb trigger, and built-in puncture needle.",
    image: siliconGunImg,
    badge: "12:1 Thrust Ratio",
    isFeatured: false,
    isCardPhotoItem: true,
    specifications: [
      "Mechanism: Heavy-duty 12:1 mechanical advantage dual-thrust drive mechanism",
      "Cartridge Capacity: Fits all standard 300 ml, 310 ml, and 10.1 oz sealant tubes",
      "Body: Thick stamped carbon steel skeleton frame with powder-coated anti-rust finish",
      "Features: Drip-free instant pressure release thumb brake & built-in cartridge seal punch",
      "Sealant Compatibility: RTV silicone, firestop mastic, polyurethane, acoustic, and hybrid sealants",
      "Durability: Engineered for continuous daily construction and glazing use"
    ],
    commonUses: "Refinery duct sealing, weatherproofing, structural glazing, electrical panel cable glands, firestop filling"
  },
  {
    id: "heavy-duty-pipe-wrench",
    name: "Heavy-Duty Cast Iron Pipe Wrench (Stillson Type - 10\" to 36\")",
    category: "Hardware, Gaskets & Sealants",
    shortDescription: "Drop-forged malleable cast iron pipe wrench with induction-hardened serrated hook jaws for piping & plumbing.",
    fullDescription: "Heavy-duty Stillson type industrial pipe wrench engineered for rigorous refinery piping, plumbing, and mechanical fabrication work. Built with an unbreakable ductile cast iron I-beam handle, precision machined induction-hardened alloy steel hook and heel jaws, and a smooth self-cleaning knurled adjustment nut.",
    image: pipeWrenchImg,
    badge: "Drop-Forged 10\"-36\"",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Available Sizes: 10\" (250mm), 14\" (350mm), 18\" (450mm), 24\" (600mm), 36\" (900mm)",
      "Jaw Opening Capacity: Grips pipes from 1/2\" (15mm) up to 5\" (125mm) outer diameter",
      "Material: High-grade malleable ductile cast iron with hardened carbon steel jaws",
      "Jaws: Floating hook jaw with deep serrated teeth for non-slip bite on smooth metal pipes",
      "Handle: Ergonomic heavy I-beam handle with durable safety red baked enamel finish",
      "Standards: Conforms to IS:4003 / Federal Specification GGG-W-651e Type II"
    ],
    commonUses: "Refinery process piping, valve installation, threaded pipe fitting, fire sprinkler lines, pump manifolds"
  },
  {
    id: "angle-grinder-power-tool",
    name: "Industrial Heavy-Duty Angle Grinder (4-inch / 100mm & 7-inch / 180mm)",
    category: "Power Tools & Machinery",
    shortDescription: "High-torque 850W & 2200W industrial angle grinder with protective wheel guard, side handle, and abrasive discs.",
    fullDescription: "High-performance industrial angle grinder built for continuous weld seam dressing, heavy metal cutting, beveling, and surface descaling. Powered by a heavy-duty copper armature with epoxy-coated field coils to protect against metallic abrasive dust. Features spindle lock for quick disc changes and two-position vibration-damped side handle.",
    image: angleGrinderImg,
    badge: "850W - 2200W Heavy Duty",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Wheel Sizes: 100 mm (4-inch) for tight corners & 180 mm (7-inch) for heavy cutting",
      "Power Rating: 850W (4-inch) / 2200W (7-inch) heavy copper wound motor",
      "No-Load Speed: 11,000 RPM (4-inch) / 8,500 RPM (7-inch)",
      "Protection: Labyrinth dust-sealed bearings and anti-rotation burst-proof wheel guard",
      "Accessories Included: Wheel guard, auxiliary side handle, two-pin pin wrench, and carbon brush set",
      "Consumables Supplied: Thin metal cutting wheels, grinding discs, flap discs, and wire cup brushes"
    ],
    commonUses: "Weld bead grinding, pipe beveling, plate edge chamfering, rust removal, structural steel cutting"
  },
  {
    id: "crane-machines-rental",
    name: "Hydra Mobile Crane & Farana Crane Machine Rental / Supply (12T - 25T)",
    category: "Power Tools & Machinery",
    shortDescription: "12-Ton to 25-Ton Hydra pick-and-carry mobile cranes and Farana heavy equipment for site erection & refinery lifting.",
    fullDescription: "Dependable heavy lifting solutions featuring certified 12-Ton, 14-Ton, 16-Ton, and 25-Ton Hydra pick-and-carry mobile cranes and Farana cranes. Available for daily, weekly, monthly, and turnaround contract rental across Mathura Refinery, industrial complexes, and civil highway projects. All cranes are supplied with certified third-party load test certificates, calibrated wire slings, D-shackles, and experienced safety-trained operators.",
    image: hydraCraneImg,
    badge: "12T - 25T Hydra Cranes",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Crane Models: 12-Ton, 14-Ton, 16-Ton Hydra Mobile Cranes & 20T-25T Heavy Farana Cranes",
      "Boom Length: 3-stage / 4-stage heavy telescopic hydraulic boom up to 18 meters height",
      "Compliance: Valid Third-Party Inspection (TPI) load test certificate & RTO fitness",
      "Safety Equipment: Safe Load Indicator (SLI), reverse audio buzzer, beacon light, boom limit switch",
      "Crew: Certified heavy commercial crane operator and skilled rigger available",
      "Deployment: Mathura Refinery shutdown, UP SIDC industrial belt, NH-19 corridor, and pan-India projects"
    ],
    commonUses: "Refinery tower equipment lifting, pipe spool erection, heavy structural loading/unloading, plant machinery shifting"
  },
  {
    id: "site-registers-documentation",
    name: "Industrial Site Attendance, Gate Pass & Safety Work Permit Registers",
    category: "Site Stationery & Documentation",
    shortDescription: "Hardbound muster roll registers, site gate pass books, hot work permit books, and store inventory ledgers.",
    fullDescription: "Comprehensive range of heavy-duty hardbound industrial registers specifically designed for refinery contractors, factory offices, and project site gates. Includes worker muster roll attendance registers (Form D / 30-day formats), contractor gate entry/exit books, daily hot/cold work permit slip books with duplicate carbon copies, and material inward/outward ledger books.",
    image: siteRegistersImg,
    badge: "Site Ledgers & Books",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Register Varieties: Worker Muster Roll / Attendance, Gate Pass (In/Out), Hot Work Permit, Store Inward/Outward",
      "Binding: Heavy-duty hardboard cloth binding with stitched spines for durability on dusty sites",
      "Pages & Sizes: 100 Folios (200 pages) / 200 Folios (400 pages) in A4 and Ledger Folio sizes",
      "Paper Quality: 70-80 GSM thick ruled ledger paper preventing ink bleed and feathering",
      "Form Formats: Pre-printed statutory compliance columns approved for industrial audits",
      "Customization: Custom contractor name and logo printing available for bulk orders"
    ],
    commonUses: "Refinery gate security, contractor labour records, daily safety briefings, warehouse stock tracking"
  },
  {
    id: "stationery-copies-notebooks",
    name: "Field Note Copies, Ruled Registers & Engineering Log Books",
    category: "Site Stationery & Documentation",
    shortDescription: "100 / 200 / 400-page ruled exercise copies, hardcover site record books, and supervisor pocket field notepads.",
    fullDescription: "Essential site office stationery copies and log books for site engineers, supervisors, foremen, and field staff. Manufactured with high-opacity bright white paper and sturdy binding. Includes four-line, single-rule, practical graph copies, and pocket-sized supervisor spiral log books for noting down daily task measurements and safety observations.",
    image: siteCopiesImg,
    badge: "Copies & Log Books",
    isFeatured: false,
    isCardPhotoItem: true,
    specifications: [
      "Formats: Single Rule, Graph Paper, Blank Drawing, and Quad Rule Copies",
      "Page Counts: 100 Pages, 200 Pages, and 400 Pages jumbo thick volumes",
      "Paper Quality: 65 - 75 GSM super-white smooth writing surface",
      "Covers: Laminated waterproof thick board cover protecting against site dust and grease",
      "Sizes: Standard Exercise Copy (Crown/A5) & Full Size Long Register (A4)",
      "Quantity Options: Available in single units or discounted carton packs of 24/48 copies"
    ],
    commonUses: "Daily site progress notes, civil measurement records, engineer field logbooks, inventory counts"
  },
  {
    id: "stationery-pens-markers",
    name: "Industrial Ballpoint Pens, Permanent Markers & Paint Markers",
    category: "Site Stationery & Documentation",
    shortDescription: "Smooth-flow ballpoint pen boxes, permanent chisel-tip markers, and metallic paint markers for steel & pipes.",
    fullDescription: "Industrial stationery writing supplies designed for demanding site environments. Contains packs of reliable 0.7mm smooth-writing blue, black, and red ballpoint pens, alongside waterproof permanent markers that write legibly on plastic tags, wooden crates, steel pipes, and galvanized sheets. Also includes white and yellow oil-based paint markers for weld numbering and inspector approvals.",
    image: sitePensImg,
    badge: "Pens & Markers Pack",
    isFeatured: false,
    isCardPhotoItem: true,
    specifications: [
      "Ballpoint Pens: 0.7 mm fine-tip blue, black, and red smooth gel and ballpoint pens (Pack of 20/50)",
      "Permanent Markers: Chisel and bullet tip black/blue permanent markers (fade & water-resistant)",
      "Paint Markers: High-opacity oil-based white, yellow, and red paint pens for metal, oily pipes, and tyres",
      "Highlighters & Markers: Fluorescent text markers for document audit and drawing checks",
      "Durability: Fast-drying ink resistant to water, smudging, and industrial weather",
      "Bulk Supply: Available by the box or custom stationery hampers for site portacabins"
    ],
    commonUses: "Drawing markup, pipe weld numbering, gate pass signing, daily muster roll logging, inspection tagging"
  },
  {
    id: "heavy-duty-paper-cutter",
    name: "Heavy-Duty Guillotine Paper Cutter & Precision Trimming Board",
    category: "Site Stationery & Documentation",
    shortDescription: "Solid metal base A4/A3 guillotine paper trimmer with alignment grid and spring-action safety blade.",
    fullDescription: "Solid steel base heavy-duty manual guillotine paper cutter designed for site offices, reprographic rooms, and project portacabins. Features a precision printed centimeter and inch alignment grid, adjustable magnetic paper guide clamp, and a self-sharpening hardened steel blade with safety finger guard and transport latch.",
    image: paperCutterImg,
    badge: "A4 / A3 Guillotine Cutter",
    isFeatured: false,
    isCardPhotoItem: true,
    specifications: [
      "Cutting Capacity: Cuts up to 12-15 sheets of 80 GSM paper simultaneously with clean edges",
      "Sizes Supported: A3, B4, A4, B5, A5, B6, B7 cutting sizes marked on table",
      "Base: Heavy-gauge solid steel table with rubber non-skid feet for table stability",
      "Blade: Heavy high-carbon hardened steel blade with ergonomic curved lever handle",
      "Safety Features: Safety latch blade lock and transparent acrylic finger guard shield",
      "Guide: Adjustable magnetic lateral paper clamp for repetitive precision cuts"
    ],
    commonUses: "Trimming drawing blueprints, cutting safety gate passes, sizing contractor ID badges, site documentation"
  },
  {
    id: "printout-photocopy-services",
    name: "Engineering CAD Blueprint Printouts, Bulk Photocopy & Lamination",
    category: "Site Stationery & Documentation",
    shortDescription: "A4, A3, CAD large-format drawing prints, bulk gate pass photocopy xerox, spiral binding & ID lamination.",
    fullDescription: "Instant on-demand site reprographic and printing services located right at UP SIDC Complex, Refinery Main Gate Mathura. We provide high-resolution architectural blueprints, CAD plots, P&ID drawings (A4, A3, A2, A1, A0), high-speed bulk digital photocopying for contractor dossiers, colour documentation, spiral and comb binding, and heavy pouch lamination for site ID cards and gate passes.",
    image: printoutPhotocopyImg,
    badge: "CAD Prints • Xerox • Spiral",
    isFeatured: true,
    isCardPhotoItem: true,
    specifications: [
      "Printout Sizes: A4, A3 high-speed laser prints & wide-format A2, A1, A0 CAD plot prints",
      "Modes: High-density Crisp Black & White and Full-Color engineering plots",
      "Bulk Photocopy: High-speed commercial digital photocopiers handling 10,000+ sheets daily",
      "Finishing Services: Plastic spiral binding, wiro binding, thermal hardbound, and corner stapling",
      "Lamination: Hot pouch lamination for ID cards, safety badges, gate passes, and work permits",
      "Rapid Site Delivery: Send PDF / DWG / scans via WhatsApp or email for immediate counter pickup or site delivery"
    ],
    commonUses: "Refinery turnaround drawing sets, contractor gate pass sets, safety permit dossiers, tender documents"
  }
];

export const CORE_VALUES: CoreValue[] = [
  {
    title: "Quality Products",
    description: "Reliable safety accessories and industrial materials manufactured to meet strict industrial and ISI/EN quality standards.",
    iconName: "ShieldCheck"
  },
  {
    title: "Customer-Focused Service",
    description: "Professional and responsive assistance to help contractors, plant managers, and safety officers select the exact right equipment.",
    iconName: "Users"
  },
  {
    title: "Trusted Local Supplier",
    description: "Centrally based at UP SIDC Complex, Refinery Main Gate in Mathura, serving Mathura, Agra, and Western Uttar Pradesh with fast dispatch.",
    iconName: "MapPin"
  },
  {
    title: "Easy Enquiries",
    description: "Quick, transparent, and convenient communication through direct phone calls, instant WhatsApp chats, and structured RFQ quotation forms.",
    iconName: "PhoneCall"
  }
];

export const INDUSTRIES: Industry[] = [
  {
    id: "manufacturing",
    name: "Manufacturing Plants",
    description: "Assembly lines, automotive components, and heavy engineering production facilities.",
    iconName: "Factory",
    commonProducts: ["Safety Shoes", "Nitrile Gloves", "Safety Goggles", "Ear Plugs", "High-Vis Vests"]
  },
  {
    id: "refineries",
    name: "Refineries & Petrochemical",
    description: "Mathura Refinery vendors, chemical processing units, and high-hazard storage zones.",
    iconName: "Flame",
    commonProducts: ["Antistatic Shoes", "Full Body Harness", "Chemical Goggles", "Respirator Masks", "Fire Blankets"]
  },
  {
    id: "construction",
    name: "Construction & Infrastructure",
    description: "Civil projects, bridge works, industrial building erection, and civil contractors.",
    iconName: "HardHat",
    commonProducts: ["Safety Helmets", "Scaffold Harnesses", "Reflective Jackets", "Safety Nets", "Warning Tapes"]
  },
  {
    id: "warehouses",
    name: "Warehouses & Logistics",
    description: "Material handling centers, supply depots, transport yards, and storage hubs.",
    iconName: "Package",
    commonProducts: ["Convex Mirrors", "Traffic Cones", "Heavy-Duty Gloves", "Steel-Toe Boots", "Floor Markings"]
  },
  {
    id: "workshops",
    name: "Workshops & Fabrication",
    description: "Welding shops, machining centers, lathe operators, and mechanical maintenance teams.",
    iconName: "Wrench",
    commonProducts: ["Leather Welding Gloves", "Face Shields", "Grinding Goggles", "Welding Aprons", "Ear Protection"]
  },
  {
    id: "engineering",
    name: "Engineering & Contractors",
    description: "EPC contractors, electrical and mechanical erection firms, turnaround maintenance teams.",
    iconName: "Building2",
    commonProducts: ["Complete PPE Kits", "Road Studs", "Industrial Tarpaulins", "Material Supplies", "Safety Signages"]
  }
];

export const FAQS = [
  {
    question: "Where is Rajdeep Enterprises located in Mathura?",
    answer: "We are located at 15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura, Uttar Pradesh. Our strategic location right at the Refinery Main Gate allows us to serve refinery contractors and industrial clients rapidly."
  },
  {
    question: "Do you supply both safety equipment and general industrial materials?",
    answer: "Yes. As specified on our company visiting card ('All Kinds of Safety Accessories & All Types of Material Suppliers'), we supply full PPE ranges, road safety accessories, fall arrest gear, as well as general industrial consumables, tarpaulins, and project material supplies."
  },
  {
    question: "How can I get an urgent quotation or order supplies?",
    answer: "You can directly call Raj Singh Tarkar at 09997993895, send an instant WhatsApp message through the button on our site, or submit the quotation form. We provide prompt pricing and availability."
  },
  {
    question: "Do you provide bulk delivery for industrial shutdown and turnarounds?",
    answer: "Yes, we cater to bulk requirements for annual plant shutdowns, large infrastructure tenders, contractor mobilizations, and ongoing factory supplies with flexible delivery across Mathura, Agra, and Western UP."
  }
];
