'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const navItems: Array<{ href: string; label: string }> = [
  { href: '/', label: 'Inicio' },
  { href: '/tasks', label: 'Tareas' },
  { href: '/about', label: 'Acerca' },
];

export const Header = (): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggleMenu = (): void => {
    setIsOpen(prev => !prev);
  };

  const handleKeyDownToggle = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggleMenu();
    }
  };

  // Close menu on route change or escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" aria-label="Ir al inicio" className="tabindex-0 flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight">Proyectra Tasks</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                aria-label={item.label}
                tabIndex={0}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={isOpen}
            onClick={handleToggleMenu}
            onKeyDown={handleKeyDownToggle}
            className="md:hidden inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/10 p-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            <span className="sr-only">Abrir menú</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4" role="dialog" aria-modal="true">
            <div className="mt-2 grid gap-2">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm text-foreground/90 hover:bg-black/5 dark:hover:bg-white/10"
                  aria-label={item.label}
                  tabIndex={0}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
