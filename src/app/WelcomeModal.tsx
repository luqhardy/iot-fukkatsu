"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle keyboard events for accessibility (Escape key and focus trapping)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose} // Close on backdrop click
    >
      <div 
        ref={modalRef}
        className="bg-gray-900/90 text-white rounded-lg shadow-xl max-w-2xl w-full p-6 md:p-8 relative border border-white/10"
        style={{ animation: 'scale-in 0.2s ease-out forwards' }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/3 flex-shrink-0">

            <div className="bg-gray-700 rounded-lg aspect-square flex items-center justify-center">
            <Image src="/pi.png" alt="Logo" width={300} height={300} className="rounded-lg shadow-lg mb-4" />
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <h2 id="modal-title" className="text-2xl font-bold mb-4 font-sans">背景</h2>
            <div className="space-y-3 text-gray-300 font-sans text-sm md:text-base">
              <p>このウェブサイトは、神戸電子専門学校AIシステム開発学科に設置されているRaspberry Piからのデータを表示します。</p>
              <p>元々は、IoT開発をご担当の川本先生のプロジェクトでしたが、時間と共にサーバーが停止してしまいました。</p>
              <p>このプロジェクトでは、そのRaspberry Piを復活させ、再びデータを公開しています。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;