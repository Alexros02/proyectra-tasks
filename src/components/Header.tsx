'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut, LogIn } from 'lucide-react';

const navItems: Array<{ href: string; label: string }> = [
  { href: '/', label: 'Inicio' },
  { href: '/tasks', label: 'Tareas' },
  { href: '/about', label: 'Acerca' },
];

interface HeaderProps {
  onLoginClick?: () => void;
}

export const Header = ({ onLoginClick }: HeaderProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user, logout, login } = useAuth();
  const handleLoginClick = onLoginClick ?? login;

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
        <div className="relative flex w-full justify-between h-16 items-center">
          {/* Logo - Siempre a la izquierda */}
          <div className="flex-shrink-0 z-10">
            <Link href="/" aria-label="Ir al inicio" className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Proyectra Tasks
              </span>
            </Link>
          </div>

          {/* Navegación central - Posicionamiento absoluto para que no se mueva */}
          <nav
            className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2"
            aria-label="Navegación principal"
          >
            {/* <div className="flex items-center gap-8">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  aria-label={item.label}
                >
                  {item.label}
                </Link>
              ))}
            </div> */}
          </nav>

          {/* Área de usuario - Solo visible en desktop */}
          <div className="hidden lg:flex items-center justify-end ml-auto">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.displayName || 'Usuario'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">En línea</span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="flex items-center gap-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <LogIn className="w-4 h-4" />
                Iniciar sesión
              </button>
            )}
          </div>

          {/* Botón de menú móvil */}
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={isOpen}
            onClick={handleToggleMenu}
            onKeyDown={handleKeyDownToggle}
            className="lg:hidden  rounded-lg border border-gray-200 p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <span className="sr-only">Abrir menú</span>
            {isOpen ? (
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden pb-4" role="dialog" aria-modal="true">
            <div className="mt-4 space-y-2">
              {/* Navegación móvil */}
              <div className="space-y-1">
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    aria-label={item.label}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Separador */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

              {/* Área de usuario móvil */}
              <div className="space-y-3">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.displayName || 'Usuario'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">En línea</p>
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className="w-full flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    <LogIn className="w-4 h-4" />
                    Iniciar sesión
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
