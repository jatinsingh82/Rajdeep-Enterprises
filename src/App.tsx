import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { EmergencyHotlineBanner } from './components/EmergencyHotlineBanner';
import { TradeKitsSection } from './components/TradeKitsSection';
import { AboutSection } from './components/AboutSection';
import { ProductsSection } from './components/ProductsSection';
import { PanIndiaSupplySection } from './components/PanIndiaSupplySection';
import { GstGuideSection } from './components/GstGuideSection';
import { StandardsSection } from './components/StandardsSection';
import { MapSection } from './components/MapSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { IndustriesSection } from './components/IndustriesSection';
import { CtaBanner } from './components/CtaBanner';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { VisitingCardModal } from './components/VisitingCardModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { EnquiryModal } from './components/EnquiryModal';
import { RfqModal } from './components/RfqModal';
import { BrandingPreviewModal } from './components/BrandingPreviewModal';
import { SizingGuideModal } from './components/SizingGuideModal';
import { FaqSection } from './components/FaqSection';
import { HseAuditModal } from './components/HseAuditModal';
import { VendorDossierModal } from './components/VendorDossierModal';
import { Product, RfqItem, Language } from './types';
import { generateProductCataloguePdf } from './utils/pdfGenerator';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedQuoteProduct, setSelectedQuoteProduct] = useState<string>('');
  const [isVisitingCardOpen, setIsVisitingCardOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [isSizingModalOpen, setIsSizingModalOpen] = useState(false);
  const [isHseAuditOpen, setIsHseAuditOpen] = useState(false);
  const [isVendorDossierOpen, setIsVendorDossierOpen] = useState(false);
  const [rfqItems, setRfqItems] = useState<RfqItem[]>([]);

  // Toggle Language between English and Hindi
  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  // RFQ Cart Management with custom quantity support
  const handleAddToRfq = (product: Product, quantity: number = 1) => {
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

  // Trigger Quote modal with optional prefilled product name
  const handleOpenQuoteModal = (productName?: string) => {
    setSelectedQuoteProduct(productName || 'General Industrial Safety Requirement');
    setIsQuoteModalOpen(true);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedDetailProduct(product);
  };

  const handleEnquireFromProduct = (productName: string) => {
    handleOpenQuoteModal(productName);
  };

  const handleDownloadPdf = () => {
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

      {/* 24/7 Site Emergency Hotline Banner */}
      <EmergencyHotlineBanner
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {/* Main Page Sections - Organized in Strict Top-to-Bottom Sequential Order */}
      <main className="flex-1">
        {/* 1. Hero Section with Real Shop Owner Front & Direct Contact */}
        <Hero
          onOpenQuoteModal={handleOpenQuoteModal}
          onOpenVisitingCard={() => setIsVisitingCardOpen(true)}
        />

        {/* 2. All Products Catalogue (Consolidated Safety, Gaskets, Stationery, Tools) */}
        <ProductsSection
          onSelectProduct={handleSelectProduct}
          onEnquire={handleEnquireFromProduct}
          onAddToRfq={handleAddToRfq}
          rfqProductIds={rfqProductIds}
          onDownloadPdf={handleDownloadPdf}
          lang={lang}
        />

        {/* 3. Turnkey Trade-Specific PPE Kits Configurator */}
        <TradeKitsSection
          onAddProductToRfq={handleAddToRfq}
          onOpenQuoteModal={handleOpenQuoteModal}
          lang={lang}
        />

        {/* 4. Whole India Supply & Any Quantity Logistics Section */}
        <PanIndiaSupplySection
          lang={lang}
          onEnquire={handleOpenQuoteModal}
        />

        {/* 6. GST Rates, HSN Codes & B2B Tax Calculator (Clamped to 10 Lakh) */}
        <GstGuideSection
          onOpenQuoteModal={handleOpenQuoteModal}
        />

        {/* 7. Standards & Certification Guide (IS / EN / CE / ANSI) */}
        <StandardsSection
          lang={lang}
          onEnquire={handleOpenQuoteModal}
        />

        {/* 8. Industries We Serve */}
        <IndustriesSection
          onEnquire={(req) => handleOpenQuoteModal(req)}
        />

        {/* 9. Core Principles Guiding Our Supply (Placed in the end) */}
        <WhyChooseUs
          onOpenQuoteModal={() => handleOpenQuoteModal('Industrial Partnership / Supplies')}
        />

        {/* 10. About Section (Placed in the end) */}
        <AboutSection
          onOpenVisitingCard={() => setIsVisitingCardOpen(true)}
          onOpenQuoteModal={() => handleOpenQuoteModal('General Company Quotation')}
        />

        {/* 11. Frequently Asked Questions (Placed in the end) */}
        <FaqSection
          onOpenQuoteModal={handleOpenQuoteModal}
          lang={lang}
        />

        {/* 12. Strong Call-To-Action Banner */}
        <CtaBanner
          onOpenQuoteModal={() => handleOpenQuoteModal('Immediate Quotation Request')}
        />

        {/* 13. Where Can You Find Us Section (Interactive Map & Directions) */}
        <MapSection
          lang={lang}
        />

        {/* 14. Contact Rajdeep Enterprises & Quotation Form */}
        <ContactSection
          initialRequirement={selectedQuoteProduct}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenVisitingCard={() => setIsVisitingCardOpen(true)}
        onOpenQuoteModal={() => handleOpenQuoteModal('General Inquiry')}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <FloatingWhatsApp />

      {/* Digital Visiting Card Replica Modal */}
      <VisitingCardModal
        isOpen={isVisitingCardOpen}
        onClose={() => setIsVisitingCardOpen(false)}
      />

      {/* Product Detail Specifications Modal */}
      <ProductDetailModal
        product={selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        onEnquire={handleEnquireFromProduct}
        onAddToRfq={handleAddToRfq}
        isInRfq={selectedDetailProduct ? rfqProductIds.includes(selectedDetailProduct.id) : false}
      />

      {/* Quick Quote / Enquiry Modal */}
      <EnquiryModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        productName={selectedQuoteProduct}
      />

      {/* Bulk RFQ Cart Modal */}
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

      {/* Custom PPE Branding & Logo Printing Studio Modal */}
      <BrandingPreviewModal
        isOpen={isBrandingModalOpen}
        onClose={() => setIsBrandingModalOpen(false)}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {/* Safety Shoe & Glove Sizing Guide Modal */}
      <SizingGuideModal
        isOpen={isSizingModalOpen}
        onClose={() => setIsSizingModalOpen(false)}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {/* HSE Site Gate Audit Checklist & PPE Shelf-Life Calculator Modal */}
      <HseAuditModal
        isOpen={isHseAuditOpen}
        onClose={() => setIsHseAuditOpen(false)}
        onOpenQuoteModal={handleOpenQuoteModal}
        onAddProductToRfq={handleAddToRfq}
      />

      {/* Corporate Vendor Empanelment & Procurement Dossier Modal */}
      <VendorDossierModal
        isOpen={isVendorDossierOpen}
        onClose={() => setIsVendorDossierOpen(false)}
        onOpenQuoteModal={handleOpenQuoteModal}
      />
    </div>
  );
}
