'use client';

import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

const columns = [
  {
    title: 'SHOP GRILZELDA',
    links: ['Open Face', 'Closed Face', 'Fang Sets', 'Single Cap', 'Double Cap', 'Diamond Cut', 'Iced Out', 'Custom Order'],
  },
  {
    title: 'SERVICES',
    links: ['Book Appointment', 'Custom Fitting', 'Repair & Resize', 'Care Guide', 'Shipping & Returns', 'FAQ'],
  },
  {
    title: 'STUDIO',
    links: ['Find Us', 'Book a Consultation', 'Group Booking'],
  },
  {
    title: 'THE HOUSE OF GRILZELDA',
    links: ['Our Story', 'Lookbook', 'Careers', 'Privacy Policy', 'Terms of Service', 'Accessibility'],
  },
];

export function RevealFooter() {
  const [highContrast, setHighContrast] = useState(false);

  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-0 flex h-screen flex-col overflow-y-auto bg-black px-6 py-16 text-white lg:px-10"
      aria-label="Site footer">
      <p className="logotype text-center text-4xl tracking-[0.35em] text-white">GRILZELDA</p>

      <div className="mt-auto grid grid-cols-2 gap-x-8 gap-y-12 pt-16 lg:grid-cols-4">
        {columns.map((col) =>
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-[14px] font-semibold tracking-[0.08em] text-white">{col.title}</h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((link) =>
                <li key={link}>
                  <a
                    href="#"
                    className={`text-[15px] transition-colors duration-150 ease-out hover:text-white ${
                      highContrast ? 'text-neutral-100' : 'text-neutral-400'
                    }`}>
                    {link}
                  </a>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>

      <div className="mt-16 flex items-center gap-4">
        <span className="text-[15px] text-neutral-300">Enable high contrast</span>
        <button
          type="button"
          role="switch"
          aria-checked={highContrast}
          onClick={() => setHighContrast((v) => !v)}
          className={`relative h-6 w-12 rounded-full transition-colors duration-150 ease-out ${
            highContrast ? 'bg-white' : 'bg-neutral-600'
          }`}>
          <span className={`absolute top-1 h-4 w-4 rounded-full transition-transform duration-150 ease-out ${
            highContrast ? 'translate-x-7 bg-black' : 'translate-x-1 bg-white'
          }`} />
        </button>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-neutral-800 pt-8">
        <button type="button" className="flex items-center gap-2 text-[15px] text-neutral-300">
          Change location and language
          <span className="text-white">United States - English (US)</span>
          <ChevronDownIcon className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-6 text-neutral-300">
          <a href="#" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
          <a href="#" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a href="#" aria-label="YouTube">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
