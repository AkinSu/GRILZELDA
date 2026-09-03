'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { womenProducts, menProducts } from '../../../data/products';
import { RingViewer } from '../../../components/RingViewer';

const allProducts = [...womenProducts, ...menProducts];

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = allProducts.find(p => p.id === slug);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-ink">Product not found.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#fff' }}>
      <RingViewer />
    </div>
  );
}
