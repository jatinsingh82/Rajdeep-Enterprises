import { COMPANY_INFO, PRODUCTS } from '../data/companyData';
import { COMPLIANCE_STANDARDS } from '../data/extraData';

export const generateProductCataloguePdf = async () => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);

  // Colors
  const primaryNavy = [15, 23, 42]; // slate-900
  const accentOrange = [234, 88, 12]; // orange-600
  const goldAmber = [217, 119, 6]; // amber-600
  const neutralGrey = [100, 116, 139]; // slate-500
  const lightBg = [248, 250, 252]; // slate-50

  let currentY = margin;

  const addHeader = (pageNum: number) => {
    // Top border accent
    doc.setFillColor(accentOrange[0], accentOrange[1], accentOrange[2]);
    doc.rect(0, 0, pageWidth, 4, 'F');

    // Company Banner
    doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.rect(margin, currentY, contentWidth, 26, 'F');

    // Enterprise Name
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('RAJDEEP ENTERPRISES', margin + 6, currentY + 9);

    // Tagline
    doc.setFontSize(8);
    doc.setTextColor(251, 191, 36); // amber-400
    doc.text('ALL KINDS OF SAFETY ACCESSORIES & ALL TYPES OF MATERIAL SUPPLIERS', margin + 6, currentY + 15);

    // Contact info in banner
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(226, 232, 240);
    doc.setFontSize(7.5);
    doc.text(`Proprietor: ${COMPANY_INFO.contactPerson}  |  Ph: ${COMPANY_INFO.phone}, ${COMPANY_INFO.secondaryPhone}`, margin + 6, currentY + 21);
    doc.text(`Refinery Main Gate, Mathura (U.P.)  |  Email: ${COMPANY_INFO.email}`, pageWidth - margin - 6, currentY + 21, { align: 'right' });

    currentY += 32;
  };

  const addFooter = (pageNum: number, totalPagesStr = '') => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(neutralGrey[0], neutralGrey[1], neutralGrey[2]);
    doc.text(
      `Rajdeep Enterprises • 15/1, U.P. S.I.D.C. Complex, Refinery Main Gate, Mathura (U.P.) • Mobile: ${COMPANY_INFO.phone} / ${COMPANY_INFO.secondaryPhone}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
    doc.text(
      `Page ${pageNum}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );
  };

  // PAGE 1: TITLE & INTRO
  addHeader(1);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('OFFICIAL INDUSTRIAL SAFETY & MATERIAL CATALOGUE', margin, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(neutralGrey[0], neutralGrey[1], neutralGrey[2]);
  doc.text(
    'Certified PPE and material supplies for Mathura Refinery contractors, civil works, and fabrication facilities.',
    margin,
    currentY
  );
  currentY += 8;

  // Key Highlights Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
  doc.text('FAST DISPATCH AT REFINERY MAIN GATE:', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text(
    '• 24/7 On-Call Supply for Emergency Turnaround Work   • GST Tax Invoicing Available   • Bulk Quantity Contractor Rates',
    margin + 4,
    currentY + 12
  );
  currentY += 24;

  // Render Product Items
  let pageNumber = 1;

  PRODUCTS.forEach((product, idx) => {
    // Check if we need a new page
    if (currentY > pageHeight - 40) {
      addFooter(pageNumber);
      doc.addPage();
      pageNumber++;
      currentY = margin;
      addHeader(pageNumber);
    }

    // Card background
    const cardHeight = 28;
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.roundedRect(margin, currentY, contentWidth, cardHeight, 1.5, 1.5, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, currentY, contentWidth, cardHeight, 1.5, 1.5, 'S');

    // Index & Product Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    const nameLine = `${idx + 1}. ${product.name.toUpperCase()}`;
    const truncatedName = nameLine.length > 68 ? nameLine.substring(0, 68) + '...' : nameLine;
    doc.text(truncatedName, margin + 4, currentY + 6);

    // Category & Badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
    doc.text(product.category.toUpperCase(), margin + 4, currentY + 11);

    if (product.badge) {
      doc.setTextColor(goldAmber[0], goldAmber[1], goldAmber[2]);
      doc.text(`[${product.badge}]`, margin + 68, currentY + 11);
    }

    // Short Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(product.shortDescription, contentWidth - 8);
    doc.text(descLines.slice(0, 2), margin + 4, currentY + 16);

    // Key specs single line
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(neutralGrey[0], neutralGrey[1], neutralGrey[2]);
    const specsLine = product.specifications.slice(0, 2).join('  |  ');
    doc.text(`Key Specs: ${specsLine}`, margin + 4, currentY + 24);

    currentY += cardHeight + 4;
  });

  // STANDARDS REFERENCE TABLE ON FINAL PAGE
  if (currentY > pageHeight - 65) {
    addFooter(pageNumber);
    doc.addPage();
    pageNumber++;
    currentY = margin;
    addHeader(pageNumber);
  }

  currentY += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('KEY SAFETY STANDARDS & COMPLIANCE TABLE', margin, currentY);
  currentY += 6;

  COMPLIANCE_STANDARDS.slice(0, 5).forEach((std) => {
    if (currentY > pageHeight - 20) {
      addFooter(pageNumber);
      doc.addPage();
      pageNumber++;
      currentY = margin;
      addHeader(pageNumber);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
    doc.text(std.code, margin + 2, currentY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text(` - ${std.name}`, margin + 42, currentY);

    currentY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(neutralGrey[0], neutralGrey[1], neutralGrey[2]);
    doc.text(`Target Gear: ${std.applicableProducts.join(', ')}`, margin + 2, currentY);
    currentY += 5;
  });

  // Footer for the last page
  addFooter(pageNumber);

  // Save the document
  doc.save('Rajdeep_Enterprises_Safety_Product_Catalogue.pdf');
};
