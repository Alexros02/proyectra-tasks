'use client';

import { useState } from 'react';
import Header from './Header';
import LoginModal from './LoginModal';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <Header onLoginClick={handleLoginClick} />
      <main className="mx-auto h-screen px-4 sm:px-6 py-8 w-full">
        {children}
      </main>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseModal} 
      />
    </>
  );
}
