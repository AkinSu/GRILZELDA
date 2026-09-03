'use client';

import React from 'react';
import { SearchIcon, LocateFixedIcon, ChevronRightIcon } from 'lucide-react';

export function ProductFooter() {
  return (
    <section id="contact" className="bg-white px-6 pb-28 pt-32 lg:px-10">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[0.08em] text-ink">CONTACT AN ADVISOR</h2>
          <p className="mt-5 max-w-[38ch] text-[15px] leading-relaxed text-muted">
            Grilzelda advisors are available Monday to Friday, 10 AM to 8 PM ET, Saturday 11 AM to 6 PM ET.
          </p>
          <p className="mt-8 max-w-[38ch] text-[15px] leading-relaxed text-muted">
            Please{' '}
            <a href="#contact" className="text-ink underline underline-offset-4">email us</a>
            {' '}or{' '}
            <a href="#contact" className="text-ink underline underline-offset-4">live chat</a>
            {' '}with an advisor.
          </p>
        </div>

        <div id="stores">
          <h2 className="text-[15px] font-semibold tracking-[0.08em] text-ink">FIND US</h2>
          <p className="mt-5 text-[15px] text-muted">Find your nearest Grilzelda studio</p>
          <div className="mt-10 flex items-center gap-5">
            <div className="flex flex-1 items-center border-b border-hairline pb-2">
              <label htmlFor="store-search" className="sr-only">City or zip code</label>
              <input
                id="store-search"
                type="text"
                placeholder="City or zip code"
                className="w-full bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none" />
              <button type="button" aria-label="Search stores">
                <SearchIcon className="h-5 w-5 text-ink" strokeWidth={1.5} />
              </button>
            </div>
            <button type="button" aria-label="Use my location">
              <LocateFixedIcon className="h-5 w-5 text-ink" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-[15px] font-semibold tracking-[0.08em] text-ink">NEWSLETTER</h2>
          <p className="mt-5 text-[15px] text-muted">Subscribe for the latest from Grilzelda.</p>
          <div className="mt-10 flex items-center border-b border-hairline pb-2">
            <label htmlFor="product-newsletter" className="sr-only">Email address</label>
            <input
              id="product-newsletter"
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none" />
            <button type="button" className="flex items-center gap-1 text-[13px] font-medium tracking-[0.12em] text-ink">
              OK
              <ChevronRightIcon className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-24 flex flex-wrap items-center gap-4 border-t border-hairline pt-8 text-[15px]">
        <span className="logotype tracking-[0.12em] text-ink">GRILZELDA</span>
        <span className="text-[8px] text-muted">■</span>
        <a href="/" className="text-muted">Shop</a>
        <span className="text-[8px] text-muted">■</span>
        <a href="/" className="text-muted">Grillz</a>
        <span className="text-[8px] text-muted">■</span>
        <a href="/" className="text-muted">Book Appointment</a>
      </div>
    </section>
  );
}
