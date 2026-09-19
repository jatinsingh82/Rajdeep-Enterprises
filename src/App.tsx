import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProductsSection } from './components/ProductsSection';
import { IndustriesSection } from './components/IndustriesSection';
import { PanIndiaSupplySection } from './components/PanIndiaSupplySection';
import { ToolsAndGuidesHub } from './components/ToolsAndGuidesHub';
import { MapSection } from './components/MapSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { MobileBottomActionBar } from './components/MobileBottomActionBar';
import { Product, RfqItem, Language } from './types';
import { generateProductCataloguePdf } from './utils/pdfGenerator';
import { initAnalytics, trackRfqAddItem, trackCatalogueDownload } from './utils/analytics';
import { PRODUCTS } from './data/companyData';
import { CATEGORY_SEO_DATA } from './data/categorySeoData';

// Code-split secondary modals to reduce initial JavaScript bundle and improve INP/LCP
const VisitingCardModal = lazy(() => import('./components/VisitingCardModal').then(m => ({ default: m.VisitingCardModal })));
const ProductDetailModal = lazy(() => import('./components/ProductDetailModal').then(m => ({ default: m.ProductDetailModal })));
const EnquiryModal = lazy(() => import('./components/EnquiryModal').then(m => ({ default: m.EnquiryModal })));
const RfqModal = lazy(() => import('./components/RfqModal').then(m => ({ default: m.RfqModal })));
const BrandingPreviewModal = lazy(() => import('./components/BrandingPreviewModal').then(m => ({ default: m.BrandingPreviewModal })));
const SizingGuideModal = lazy(() => import('./components/SizingGuideModal').then(m => ({ default: m.SizingGuideModal })));
const HseAuditModal = lazy(() => import('./components/HseAuditModal').then(m => ({ default: m.HseAuditModal })));
const VendorDossierModal = lazy(() => import('./components/VendorDossierModal').then(m => ({ default: m.VendorDossierModal })));
const LegalModal = lazy(() => import('./components/LegalModal').then(m => ({ default: m.LegalModal })));

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedQuoteProduct, setSelectedQuoteProduct] = useState<string>('');
  const [selectedQuoteCategory, setSelectedQuoteCategory] = useState<string>('');
  const [selectedQuoteQuantity, setSelectedQuoteQuantity] = useState<string>('');
  const [isVisitingCardOpen, setIsVisitingCardOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [isSizingModalOpen, setIsSizingModalOpen] = useState(false);
  const [isHseAuditOpen, setIsHseAuditOpen] = useState(false);
  const [isVendorDossierOpen, setIsVendorDossierOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'disclaimer'>('privacy');

  // Initialize non-blocking analytics on mount if configured
  useEffect(() => {
    initAnalytics();
  }, []);

  // Synchronize URL Hash deep links for categories and products
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash) return;

      if (hash.startsWith('#product/')) {
        const productId = hash.replace('#product/', '').trim();
        const found = PRODUCTS.find((p) => p.id === productId);
        if (found) {
          setSelectedDetailProduct(found);
        }
      } else if (hash.startsWith('#category/')) {
        const slug = hash.replace('#category/', '').trim();
        const matched = Object.entries(CATEGORY_SEO_DATA).find(([_, info]) => info.slug === slug);
        if (matched) {
          setSelectedCategory(matched[0]);
          const el = document.getElementById('products');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [rfqItems, setRfqItems] = useState<RfqItem[]>(() => {
    try {
      const saved = localStorage.getItem('rajdeep_rfq_cart');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved RFQ cart', e);
    }
    return [];
  });

  // Persist RFQ cart whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('rajdeep_rfq_cart', JSON.stringify(rfqItems));
    } catch (e) {
      console.error('Error storing RFQ cart', e);
    }
  }, [rfqItems]);

  // Toggle Language between English and Hindi
  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  // RFQ Cart Management with custom quantity support
  const handleAddToRfq = (product: Product, quantity: number = 1) => {
    trackRfqAddItem({
      productId: product.id,
      productName: product.name,
      category: product.category,
      quantity,
    });
    setRfqItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateRfqQuantity = (productId: string, delta: number) => {
    setRfqItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as RfqItem[]
    );
  };

  const handleSetExactQuantity = (productId: string, quantity: number) => {
    setRfqItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const handleRemoveRfqItem = (productId: string) => {
    setRfqItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearRfqCart = () => {
    setRfqItems([]);
  };

  // Trigger Quote modal with optional prefilled product name, category, and quantity
  const handleOpenQuoteModal = (productName?: string, category?: string, quantity?: string) => {
    setSelectedQuoteProduct(productName || 'General Industrial Safety Requirement');
    setSelectedQuoteCategory(category || '');
    setSelectedQuoteQuantity(quantity || '');
    setIsQuoteModalOpen(true);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedDetailProduct(product);
    try {
      window.history.pushState(null, '', `#product/${product.id}`);
    } catch {
      window.location.hash = `product/${product.id}`;
    }
  };

  const handleCloseDetailProduct = () => {
    setSelectedDetailProduct(null);
    if (window.location.hash.startsWith('#product/')) {
      try {
        window.history.pushState(null, '', '#products');
      } catch {
        window.location.hash = 'products';
      }
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const seoInfo = CATEGORY_SEO_DATA[cat];
    if (seoInfo) {
      try {
        window.history.pushState(null, '', `#category/${seoInfo.slug}`);
      } catch {
        window.location.hash = `category/${seoInfo.slug}`;
      }
    } else if (cat === 'All Products') {
      try {
        window.history.pushState(null, '', '#products');
      } catch {
        window.location.hash = 'products';
      }
    }
  };

  const handleEnquireFromProduct = (productName: string, category?: string, quantity?: string) => {
    handleOpenQuoteModal(productName, category, quantity);
  };

  const handleDownloadPdf = () => {
    trackCatalogueDownload({
      format: 'pdf',
      source: 'catalogue_download_btn',
    });
    generateProductCataloguePdf();
  };

  const rfqProductIds = rfqItems.map((item) => item.product.id);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Sticky Top Navigation */}
      <Header
        onOpenQuoteModal={handleOpenQuoteModal}
        onOpenVisitingCard={() => setIsVisitingCardOpen(true)}
        lang={lang}
        onToggleLang={handleToggleLang}
        rfqCount={rfqItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenRfqModal={() => setIsRfqModalOpen(true)}
        onDownloadPdf={handleDownloadPdf}
        onOpenBrandingModal={() => setIsBrandingModalOpen(true)}
        onOpenSizingModal={() => setIsSizingModalOpen(true)}
        onOpenHseAuditModal={() => setIsHseAuditOpen(true)}
        onOpenVendorDossierModal={() => setIsVendorDossierOpen(true)}
      />

      {/* Main Page Sections - Organized in Strict Top-to-Bottom Sequential Order with ample bottom padding for mobile sticky CTA */}
      <main className="flex-1 pb-24 sm:pb-28 md:pb-0">
        {/* 1. Hero Section with Direct Contact & Action Controls */}
        <Hero
          onOpenQuoteModal={handleOpenQuoteModal}
          onOpenVisitingCard={() => setIsVisitingCardOpen(true)}
        />

        {/* 2. About Section */}
        <AboutSection
          onOpenVisitingCard={() => setIsVisitingCardOpen(true)}
          onOpenQuoteModal={() => handleOpenQuoteModal('General Company Quotation')}
        />

        {/* 3. Products Catalogue (Safety, Gaskets, Stationery, Tools) */}
        <ProductsSection
          onSelectProduct={handleSelectProduct}
          onEnquire={handleEnquireFromProduct}
          onAddToRfq={handleAddToRfq}
          rfqProductIds={rfqProductIds}
          onDownloadPdf={handleDownloadPdf}
          lang={lang}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />

        {/* 4. Why Choose Us / Core Supply Principles */}
        <WhyChooseUs
          onOpenQuoteModal={() => handleOpenQuoteModal('Industrial Partnership / Supplies')}
        />

        {/* 5. Industries We Serve */}
        <IndustriesSection
          onEnquire={handleOpenQuoteModal}
        />

        {/* 6. Whole India Supply & Logistics */}
        <PanIndiaSupplySection
          lang={lang}
          onEnquire={handleOpenQuoteModal}
        />

        {/* 7. Compliance & Technical Guides Hub */}
        <ToolsAndGuidesHub
          onAddProductToRfq={handleAddToRfq}
          onOpenQuoteModal={handleOpenQuoteModal}
          lang={lang}
        />

        {/* 8. Contact Rajdeep Enterprises & RFQ Form */}
        <ContactSection
          initialRequirement={selectedQuoteProduct}
        />

        {/* 9. Location: Where Can You Find Us (Interactive Map & Directions) */}
        <MapSection
          lang={lang}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenVisitingCard={() => setIsVisitingCardOpen(true)}
        onOpenQuoteModal={() => handleOpenQuoteModal('General Inquiry')}
        onOpenLegalModal={(tab) => {
          setLegalModalTab(tab || 'privacy');
          setIsLegalModalOpen(true);
        }}
      />

      {/* Floating WhatsApp Quick Action Button (shown on tablet/desktop) */}
      <FloatingWhatsApp />

      {/* Mobile-Only Fixed Bottom Action Bar (Call, WhatsApp, Directions) */}
      <MobileBottomActionBar />

      {/* Code-split and lazily loaded secondary modals */}
      <Suspense fallback={null}>
        {/* Digital Visiting Card Replica Modal */}
        {isVisitingCardOpen && (
          <VisitingCardModal
            isOpen={isVisitingCardOpen}
            onClose={() => setIsVisitingCardOpen(false)}
          />
        )}

        {/* Product Detail Specifications Modal */}
        {selectedDetailProduct && (
          <ProductDetailModal
            product={selectedDetailProduct}
            onClose={handleCloseDetailProduct}
            onEnquire={handleEnquireFromProduct}
            onAddToRfq={handleAddToRfq}
            isInRfq={selectedDetailProduct ? rfqProductIds.includes(selectedDetailProduct.id) : false}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {/* Quick Quote / Enquiry Modal */}
        {isQuoteModalOpen && (
          <EnquiryModal
            isOpen={isQuoteModalOpen}
            onClose={() => setIsQuoteModalOpen(false)}
            productName={selectedQuoteProduct}
            category={selectedQuoteCategory}
            initialQuantity={selectedQuoteQuantity}
          />
        )}

        {/* Bulk RFQ Cart Modal */}
        {isRfqModalOpen && (
          <RfqModal
            isOpen={isRfqModalOpen}
            onClose={() => setIsRfqModalOpen(false)}
            rfqItems={rfqItems}
            onUpdateQuantity={handleUpdateRfqQuantity}
            onSetExactQuantity={handleSetExactQuantity}
            onRemoveItem={handleRemoveRfqItem}
            onClearCart={handleClearRfqCart}
            lang={lang}
          />
        )}

        {/* Custom PPE Branding & Logo Printing Studio Modal */}
        {isBrandingModalOpen && (
          <BrandingPreviewModal
            isOpen={isBrandingModalOpen}
            onClose={() => setIsBrandingModalOpen(false)}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}

        {/* Safety Shoe & Glove Sizing Guide Modal */}
        {isSizingModalOpen && (
          <SizingGuideModal
            isOpen={isSizingModalOpen}
            onClose={() => setIsSizingModalOpen(false)}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}

        {/* HSE Site Gate Audit Checklist & PPE Shelf-Life Calculator Modal */}
        {isHseAuditOpen && (
          <HseAuditModal
            isOpen={isHseAuditOpen}
            onClose={() => setIsHseAuditOpen(false)}
            onOpenQuoteModal={handleOpenQuoteModal}
            onAddProductToRfq={handleAddToRfq}
          />
        )}

        {/* Corporate Vendor Empanelment & Procurement Dossier Modal */}
        {isVendorDossierOpen && (
          <VendorDossierModal
            isOpen={isVendorDossierOpen}
            onClose={() => setIsVendorDossierOpen(false)}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}

        {/* Basic Business Legal & Commercial Disclosures Modal */}
        {isLegalModalOpen && (
          <LegalModal
            isOpen={isLegalModalOpen}
            onClose={() => setIsLegalModalOpen(false)}
            initialTab={legalModalTab}
          />
        )}
      </Suspense>
    </div>
  );
}
