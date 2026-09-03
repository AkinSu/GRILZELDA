'use client';

import React from 'react';
import { PlusIcon, ShoppingBagIcon, UserIcon, SearchIcon, MenuIcon } from 'lucide-react';

interface HeaderProps {
  bagCount: number;
  onOpenMenu: () => void;
}

export function Header({ bagCount, onOpenMenu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <button
          type="button"
          className="hidden items-center gap-2 text-[13px] tracking-wide text-ink transition-opacity duration-150 ease-luxe hover:opacity-60 md:flex">
          <PlusIcon className="h-4 w-4" strokeWidth={1.5} />
          Contact Us
        </button>

        <button
          type="button"
          aria-label="Open navigation"
          onClick={onOpenMenu}
          className="text-ink transition-opacity duration-150 ease-luxe hover:opacity-60 md:hidden">
          <MenuIcon className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <a
          href="#"
          className="logotype absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[20px] font-normal leading-none tracking-[0.2em] text-ink md:text-[28px] md:tracking-[0.24em]">
          GRILZELDA
        </a>

        <nav aria-label="Utilities" className="flex items-center gap-5 md:gap-7">
          <button
            type="button"
            aria-label={`Shopping bag, ${bagCount} items`}
            className="relative text-ink transition-opacity duration-150 ease-luxe hover:opacity-60">
            <ShoppingBagIcon className="h-[21px] w-[21px]" strokeWidth={1.4} />
            {bagCount > 0 &&
              <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] leading-none text-white">
                {bagCount}
              </span>
            }
          </button>
          <button
            type="button"
            aria-label="My account"
            className="hidden text-ink transition-opacity duration-150 ease-luxe hover:opacity-60 sm:block">
            <UserIcon className="h-[21px] w-[21px]" strokeWidth={1.4} />
          </button>
          <button
            type="button"
            aria-label="Search"
            className="text-ink transition-opacity duration-150 ease-luxe hover:opacity-60">
            <SearchIcon className="h-[21px] w-[21px]" strokeWidth={1.4} />
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            className="hidden items-center gap-2 text-[13px] uppercase tracking-[0.06em] text-ink transition-opacity duration-150 ease-luxe hover:opacity-60 md:flex">
            <MenuIcon className="h-5 w-5" strokeWidth={1.5} />
            Menu
          </button>
        </nav>
      </div>
    </header>
  );
}
