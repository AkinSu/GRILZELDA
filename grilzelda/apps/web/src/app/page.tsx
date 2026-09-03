'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { MenuDrawer } from '../components/MenuDrawer';
import { Footer } from '../components/Footer';
import { Collection } from '../views/Collection';
import type { Gender } from '../types/product';

export default function Page() {
  const [gender, setGender] = useState<Gender>('women');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white">
      <Header bagCount={0} onOpenMenu={() => setMenuOpen(true)} />
      <Collection gender={gender} onGenderChange={setGender} />
      <Footer />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
