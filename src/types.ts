export interface Product {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  badge?: string;
  isFeatured?: boolean;
  specifications: string[];
  commonUses: string;
  isCardPhotoItem?: boolean;
}

export interface Industry {
  id: string;
  name: string;
  description: string;
  iconName: string;
  commonProducts: string[];
}

export interface CoreValue {
  title: string;
  description: string;
  iconName: string;
}

export interface EnquiryFormData {
  fullName: string;
  companyName: string;
  phoneNumber: string;
  emailAddress: string;
  productRequirement: string;
  quantity: string;
  message: string;
}

export interface RfqItem {
  product: Product;
  quantity: number;
  customNotes?: string;
}

export type Language = 'en' | 'hi';

export interface ComplianceStandard {
  code: string;
  name: string;
  issuingBody: string;
  category: string;
  applicableProducts: string[];
  description: string;
  significance: string;
}

export interface ProjectExperience {
  id: string;
  clientType: string;
  projectTitle: string;
  location: string;
  suppliesProvided: string[];
  timeline: string;
  highlights: string;
}

export interface TradeKitItem {
  productId?: string;
  name: string;
  qty: number;
  spec: string;
}

export interface TradeKit {
  id: string;
  trade: string;
  title: string;
  badge: string;
  iconName: string;
  description: string;
  suitableFor: string;
  items: TradeKitItem[];
  standards: string[];
  estimatedKitPriceRange: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  designation: string;
  company: string;
  location: string;
  projectContext: string;
  quote: string;
  rating: number;
  date: string;
  verifiedBadge: string;
}

export interface HsnTaxRate {
  hsnCode: string;
  category: string;
  gstRate: string;
  cgstRate: string;
  sgstRate: string;
  igstRate: string;
  appliesTo: string;
  complianceNotes: string;
}

