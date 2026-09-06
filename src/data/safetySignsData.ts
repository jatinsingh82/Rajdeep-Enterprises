import { Product } from '../types';

export interface SafetySignItem {
  id: string;
  code: string;
  title: string;
  category: 'mandatory' | 'warning' | 'prohibition' | 'emergency' | 'traffic';
  standard: string;
  description: string;
  iconType: string;
  defaultSize: string;
  materials: string[];
  productRef: Product;
}

export const SAFETY_SIGNS_DATA: SafetySignItem[] = [
  {
    id: 'sign-01',
    code: 'IS-9457-M01',
    title: 'Wear Safety Helmet at All Times',
    category: 'mandatory',
    standard: 'IS:9457 / ISO 7010-M001',
    description: 'Mandatory blue circular symbol indicating head protection requirement past this security barrier.',
    iconType: 'HardHat',
    defaultSize: '300mm x 400mm (Portrait)',
    materials: ['3M Class Prismatic Retro-Reflective', '3mm Aluminium Composite Panel (ACP)', 'Rigid PVC Sunboard'],
    productRef: {
      id: 'sign-prod-01',
      name: 'Safety Signboard: Wear Safety Helmet (IS:9457)',
      category: 'Safety Signages & Barricades',
      shortDescription: 'Industrial mandatory PPE sign board for site entry gates & fabrication yards.',
      fullDescription: 'High-visibility mandatory signage adhering to IS:9457 and ISO 7010 standards. Available in retro-reflective or durable ACP sheet with UV resistant print.',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615b3?auto=format&fit=crop&q=80&w=800',
      badge: 'IS:9457 Mandate',
      specifications: [
        'Standard: IS:9457 / ISO 7010',
        'Substrate: 3mm ACP / Sunboard / Retro-Reflective',
        'Standard Size: 300 x 400 mm / 600 x 450 mm',
        'Weatherproof: UV resistant laminating film, non-fading'
      ],
      commonUses: 'Plant Entry Gates, Scaffold Yards, Fabrication Areas'
    }
  },
  {
    id: 'sign-02',
    code: 'IS-9457-M02',
    title: 'Safety Footwear Mandatory',
    category: 'mandatory',
    standard: 'IS:9457 / ISO 7010-M008',
    description: 'Mandatory symbol requiring certified steel-toe / antistatic boots in the processing zone.',
    iconType: 'Footprints',
    defaultSize: '300mm x 400mm (Portrait)',
    materials: ['3M Retro-Reflective', '3mm ACP Panel', 'PVC Sunboard'],
    productRef: {
      id: 'sign-prod-02',
      name: 'Safety Signboard: Safety Footwear Mandatory (IS:9457)',
      category: 'Safety Signages & Barricades',
      shortDescription: 'Heavy-duty steel-toe boots mandatory alert sign for loading bays and refinery units.',
      fullDescription: 'Mandatory circular footwear icon compliant with factory inspection guidelines. Highly visible from 25+ meters.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
      badge: 'High Visibility',
      specifications: [
        'Standard: IS:9457 / ISO 7010-M008',
        'Substrate: 3mm Rigid ACP or 5mm Sunboard',
        'Sizes: 300 x 400 mm / 450 x 600 mm',
        'Mounting: Pre-drilled corner holes for easy clamping'
      ],
      commonUses: 'Refinery Process Units, Material Loading Docks, Heavy Machinery Zones'
    }
  },
  {
    id: 'sign-03',
    code: 'IS-9457-W01',
    title: 'Danger: Flammable Liquids & Gas Area',
    category: 'warning',
    standard: 'IS:9457 / ISO 7010-W021',
    description: 'Yellow triangular hazard alert for hydrocarbon storage tanks, battery rooms, and gas manifolds.',
    iconType: 'Flame',
    defaultSize: '600mm x 450mm (Landscape)',
    materials: ['Type IV Retro-Reflective on Aluminium', 'ACP Sheet', 'Glow-in-the-Dark Photoluminescent'],
    productRef: {
      id: 'sign-prod-03',
      name: 'Hazard Signboard: Flammable Gas & Liquid Area (IS:9457)',
      category: 'Safety Signages & Barricades',
      shortDescription: 'Critical hazard warning board for hydrocarbon terminals and fuel tank farms.',
      fullDescription: 'High-contrast triangular flammable hazard signboard. Essential for meeting OISD and refinery fire safety guidelines.',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800',
      badge: 'Refinery OISD',
      specifications: [
        'Standard: IS:9457 / OISD-STD-117',
        'Substrate: 1.5mm Aluminium Sheet with 3M Prismatic Vinyl',
        'Size: 600 x 450 mm',
        'Visibility: Certified retro-reflective for night illumination'
      ],
      commonUses: 'Fuel Depots, Battery Banks, Gas Manifold Rooms, Chemical Storage'
    }
  },
  {
    id: 'sign-04',
    code: 'IS-9457-W02',
    title: 'Caution: Men at Work / Deep Excavation',
    category: 'warning',
    standard: 'IS:9457 / IRC:SP:55 Highway Standard',
    description: 'Highway and trenching warning sign with high-intensity prismatic reflective face for road works.',
    iconType: 'AlertTriangle',
    defaultSize: '900mm x 750mm (Highway Grade)',
    materials: ['3M High Intensity Prismatic (HIP)', 'Aluminium Sheet 2mm with MS Frame'],
    productRef: {
      id: 'sign-prod-04',
      name: 'Highway Caution Board: Men At Work / Excavation (IRC:SP:55)',
      category: 'Safety Signages & Barricades',
      shortDescription: 'IRC:SP:55 compliant roadside signboard for pipeline digging & highway work.',
      fullDescription: 'Large-format highway hazard sign engineered for extreme weather, dust resistance, and 200m vehicle headlight retro-reflection.',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800',
      badge: 'IRC Highway Grade',
      specifications: [
        'Standard: IRC:SP:55-2014 & MoRTH Clause 800',
        'Substrate: Class C Micro-prismatic on MS/Aluminium frame',
        'Size: 900 x 750 mm / 600 x 600 mm',
        'Includes: Optional portable angle-iron tripod stand'
      ],
      commonUses: 'NH-19 Highway Projects, Pipeline Right-of-Way (RoW), Trenching'
    }
  },
  {
    id: 'sign-05',
    code: 'IS-9457-P01',
    title: 'Strictly No Smoking / No Naked Flames',
    category: 'prohibition',
    standard: 'IS:9457 / ISO 7010-P002',
    description: 'Red prohibition ring with match/cigarette symbol for refinery entry, oil manifolds, and chemical storage.',
    iconType: 'Ban',
    defaultSize: '450mm x 300mm',
    materials: ['ACP Panel', 'Sunboard', 'Glow-in-the-Dark Photoluminescent'],
    productRef: {
      id: 'sign-prod-05',
      name: 'Prohibition Signboard: No Smoking / Naked Flames (IS:9457)',
      category: 'Safety Signages & Barricades',
      shortDescription: 'Refinery gate and chemical warehouse compulsory prohibition signboard.',
      fullDescription: 'Mandatory zero-tolerance fire hazard signage for oil installations, fuel dispense points, and paint shops.',
      image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&q=80&w=800',
      badge: 'Zero Fire Tolerance',
      specifications: [
        'Standard: IS:9457 / OISD-117',
        'Substrate: 3mm Aluminium Composite Panel',
        'Size: 450 x 300 mm / 600 x 400 mm',
        'Printing: Non-solvent, UV cured silk screen / digital'
      ],
      commonUses: 'Refinery Security Gates, Solvent Warehouses, LPG Bulker Bays'
    }
  },
  {
    id: 'sign-06',
    code: 'IS-9457-E01',
    title: 'Emergency Assembly Point & First Aid',
    category: 'emergency',
    standard: 'IS:9457 / ISO 7010-E007',
    description: 'Green background beacon sign for muster stations and emergency first aid post identification.',
    iconType: 'ShieldAlert',
    defaultSize: '600mm x 600mm',
    materials: ['Photoluminescent Glow-in-the-dark', 'Retro-Reflective ACP', 'Sunboard'],
    productRef: {
      id: 'sign-prod-06',
      name: 'Emergency Signboard: Safe Assembly Point (IS:9457)',
      category: 'Safety Signages & Barricades',
      shortDescription: 'Emergency muster station and disaster response rally point marker.',
      fullDescription: 'Green and white emergency directional signboard. Essential for refinery mock drills, factory safety audits, and building exits.',
      image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&q=80&w=800',
      badge: 'Emergency Ready',
      specifications: [
        'Standard: IS:9457 / ISO 7010-E007',
        'Substrate: Photoluminescent Glow Sheet on ACP backing',
        'Size: 600 x 600 mm',
        'Glow Duration: 6+ hours after illumination exposure'
      ],
      commonUses: 'Refinery Muster Grounds, Plant Perimeter Gates, Admin Building Exits'
    }
  }
];
