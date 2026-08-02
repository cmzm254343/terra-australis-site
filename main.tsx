import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/351926755622?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20a%20entrega%20de%20lenha%20e%20pellets%20da%20Terra%20Australis."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all transform hover:scale-105 border border-emerald-400/40"
      title="Apoio ao Cliente WhatsApp Terra Australis LDA"
    >
      <MessageCircle size={24} className="fill-white text-emerald-600 animate-pulse" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold whitespace-nowrap pr-1">
        Apoio WhatsApp
      </span>
    </a>
  );
};
