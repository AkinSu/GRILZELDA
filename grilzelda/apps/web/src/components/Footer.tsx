'use client';

import React from 'react';

const COLUMNS: { title: string; links: string[] }[] = [
  { title: 'May we help you?', links: ['Contact Us', 'FAQs', 'Book an Appointment', 'Shipping & Returns'] },
  { title: 'Services', links: ['Gift Services', 'Personalisation', 'Grilzelda Repairs', 'Product Care'] },
  { title: 'Our Company', links: ['About Grilzelda', 'Sustainability', 'Careers', 'Store Locator'] }
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-hairline px-4 py-16 md:px-8">
      <div className="grid gap-12 md:grid-cols-4">
        <div>
          <p className="text-[13px] uppercase tracking-[0.1em] text-ink">Sign up for Grilzelda updates</p>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted">
            Receive news on collections, exclusive events and the world of Grilzelda.
          </p>
          <form className="mt-5 flex" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              placeholder="Email address"
              className="w-full border border-hairline px-4 py-3 text-[13px] outline-none transition-colors duration-150 ease-luxe focus:border-ink" />
            <button
              type="submit"
              className="border border-l-0 border-ink bg-ink px-5 text-[12px] uppercase tracking-[0.1em] text-white transition-opacity duration-150 ease-luxe hover:opacity-85">
              Join
            </button>
          </form>
        </div>

        {COLUMNS.map((column) =>
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-[13px] uppercase tracking-[0.1em] text-ink">{column.title}</h2>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) =>
                <li key={link}>
                  <a
                    href="#"
                    className="text-[13px] text-muted transition-colors duration-150 ease-luxe hover:text-ink">
                    {link}
                  </a>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>

      <p className="mt-16 text-[12px] text-muted">© 2026 Grilzelda — All rights reserved.</p>
    </footer>
  );
}
