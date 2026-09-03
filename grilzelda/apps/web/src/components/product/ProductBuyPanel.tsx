'use client';

import React, { useState } from 'react';
import { PhoneIcon, MapPinIcon, PlusIcon, MinusIcon } from 'lucide-react';

export function ProductBuyPanel() {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <div className="lg:sticky lg:top-24">
      <p className="text-[15px] text-ink">
        Select the size of the item to see the expected delivery date.
      </p>

      <button
        type="button"
        className="mt-6 w-full bg-ink py-5 text-[13px] font-semibold tracking-[0.14em] text-white transition-opacity duration-150 ease-out hover:opacity-85">
        SELECT SIZE
      </button>

      <div className="mt-12 space-y-3">
        <a href="#contact" className="flex items-center gap-3 text-[15px] text-ink">
          <PhoneIcon className="h-[18px] w-[18px]" strokeWidth={1.5} />
          <span className="underline underline-offset-4">Contact Us</span>
        </a>
        <p className="text-[15px] text-ink">Our advisors are available to help you.</p>
      </div>

      <div className="mt-8">
        <a href="#stores" className="flex items-center gap-3 text-[15px] text-ink">
          <MapPinIcon className="h-[18px] w-[18px]" strokeWidth={1.5} />
          <span className="underline underline-offset-4">Find in studio and Book an appointment</span>
        </a>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => setServicesOpen((v) => !v)}
          aria-expanded={servicesOpen}
          className="flex items-center gap-3 text-[15px] text-ink">
          {servicesOpen
            ? <MinusIcon className="h-[18px] w-[18px]" strokeWidth={1.5} />
            : <PlusIcon className="h-[18px] w-[18px]" strokeWidth={1.5} />
          }
          <span className="underline underline-offset-4">Grilzelda Services</span>
        </button>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink">
          Complimentary Shipping &amp; In-Studio Pickup, Complimentary Exchanges &amp; Returns,
          Secure Payments and Signature Packaging
        </p>
        {servicesOpen &&
          <ul className="mt-4 space-y-1.5 text-[15px] text-muted">
            <li>Complimentary shipping on all orders</li>
            <li>In-studio pickup within 2–4 business days</li>
            <li>Complimentary returns within 30 days</li>
            <li>Signature Grilzelda packaging</li>
          </ul>
        }
      </div>
    </div>
  );
}
