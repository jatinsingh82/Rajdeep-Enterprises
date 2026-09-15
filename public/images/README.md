# Rajdeep Enterprises — Real Image Asset Directory

This directory structure organizes all image assets for Rajdeep Enterprises. It allows the business owner or webmaster to easily replace stock/placeholder images with authentic photographs of the Mathura storefront, inventory, refinery supply operations, and products.

---

## Directory Structure

```
public/images/
├── brand/        # Official logos, visiting card graphics, and favicons
├── business/     # Authentic storefront, depot, truck loading bay & Mathura Refinery Gate photos
├── products/     # High-resolution genuine photographs of safety PPE, gaskets, tools & consumables
├── guides/       # Technical reference charts, trade kit kits, and compliance guides
├── social/       # OpenGraph (1200x630) social sharing preview card for WhatsApp, LinkedIn, Facebook
└── README.md     # Asset instructions (this file)
```

---

## Recommended Image Guidelines

| Category | Recommended Dimensions | File Format | Purpose / Placement |
| :--- | :--- | :--- | :--- |
| **Social Share** | `1200 x 630 px` | `.jpg` or `.png` | Displayed when sharing website link on WhatsApp, LinkedIn, Facebook, iMessage |
| **Storefront & Depot** | `1920 x 1080 px` | `.jpg` or `.webp` | Hero section, About Us, and Location depot card |
| **Products** | `800 x 800 px` (1:1 square) | `.jpg` or `.webp` | Product catalog cards, modal zoom, and RFQ items |
| **Logo / Emblem** | Vector SVG or `512 x 512 px` | `.svg` or `.png` (transparent) | Header navigation, footer, visiting card, and invoices |

---

## Current Genuine Photos

- `public/owner-father.jpg`: Genuine photograph of proprietor **Raj Singh Tarkar** outside the Rajdeep Enterprises shop at UP SIDC Complex, Refinery Main Gate, Mathura.
  - Used in: Hero section background card, official visiting card, and social share metadata preview.

---

## How to Update Product or Store Photos

1. Export your photograph from your phone or camera in `.jpg` or `.webp`.
2. Name the file cleanly without spaces (e.g. `karam-safety-shoes-actual.jpg`).
3. Place it inside `public/images/products/` or `public/images/business/`.
4. In `src/data/companyData.ts`, update the `image:` property for that product to `/images/products/your-photo.jpg`.
5. Run `npm run build` or deploy to Vercel.
