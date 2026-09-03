'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { womenProducts, menProducts } from '../../../data/products';
import { Header } from '../../../components/Header';
import { MenuDrawer } from '../../../components/MenuDrawer';
import { ProductGallery } from '../../../components/product/ProductGallery';
import { ProductDetails } from '../../../components/product/ProductDetails';
import { ProductBuyPanel } from '../../../components/product/ProductBuyPanel';
import { ProductStickyBar } from '../../../components/product/ProductStickyBar';
import { ProductFooter } from '../../../components/product/ProductFooter';
import { RevealFooter } from '../../../components/product/RevealFooter';

const allProducts = [...womenProducts, ...menProducts];

const INSPO_IMGS = [
  '/inspo1.jpg', '/inspo2.jpg', '/inspo3.jpg', '/inspo4.webp',
  '/inspo5.webp', '/inspo6.webp', '/inspo7.webp', '/inspo8.webp',
];

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = allProducts.find(p => p.id === slug);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-ink">Product not found.</p>
      </div>
    );
  }

  return (
    <div id="top" className="w-full bg-white text-ink">
      <Header bagCount={0} onOpenMenu={() => setMenuOpen(true)} transparent />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <ProductStickyBar product={product} />

      <main className="relative z-10 mb-[100vh] w-full bg-white shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
        <ProductGallery images={INSPO_IMGS} name={product.name} />

        <section id="product" className="px-6 pt-24 lg:px-10">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-24">
            <ProductDetails product={product} />
            <div id="buy-panel">
              <ProductBuyPanel />
            </div>
          </div>
        </section>

        <ProductFooter />
      </main>

      <RevealFooter />
    </div>
  );
}
