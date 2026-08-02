import React from 'react';
import { Flame, Trees, Zap, CookingPot, Box, Calculator, Layers, FileText, Building2 } from 'lucide-react';
import { CategoryType } from '../types';

interface NavbarProps {
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onOpenShippingWidget: () => void;
  onOpenComparison: () => void;
  onOpenQuoteModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenShippingWidget,
  onOpenComparison,
  onOpenQuoteModal,
}) => {
  const categories = [
    { id: 'all', label: 'Todos os Produtos', icon: Flame },
    { id: 'lenha', label: 'Lenha Seca & Paletes', icon: Trees },
    { id: 'fogoes', label: 'Fogões a Lenha', icon: CookingPot },
    { id: 'suportes', label: 'Suportes para Lenha', icon: Box },
    { id: 'pellets', label: 'Extras', icon: Zap },
  ];

  return (
    <nav className="bg-[#0c0a09] border-b border-paper py-1 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-max gap-4 py-1.5 text-xs font-sans">
          {/* Main Category Tabs */}
          <div className="flex items-center gap-2 py-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id as CategoryType)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded text-[11px] font-bold uppercase tracking-[1.5px] transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900 border border-transparent hover:border-paper'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : 'text-orange-500'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Utilities */}
          <div className="flex items-center gap-2 border-l border-paper pl-4 py-1">
            <button
              onClick={onOpenShippingWidget}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] text-orange-400 bg-orange-950/30 hover:bg-orange-900/50 border border-orange-600/40 font-bold uppercase tracking-wider transition-all"
            >
              <Calculator size={13} className="text-orange-500" />
              <span>Simular Portes</span>
            </button>

            <button
              onClick={onOpenComparison}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] text-stone-300 hover:text-white hover:bg-stone-900 border border-transparent hover:border-paper font-bold uppercase tracking-wider transition-all"
            >
              <Layers size={13} className="text-orange-500" />
              <span>Poder Calorífico</span>
            </button>

            <button
              onClick={onOpenQuoteModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] text-stone-300 hover:text-white hover:bg-stone-900 border border-transparent hover:border-paper font-bold uppercase tracking-wider transition-all"
            >
              <Building2 size={13} className="text-orange-500" />
              <span>Grandes Quantidades</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
