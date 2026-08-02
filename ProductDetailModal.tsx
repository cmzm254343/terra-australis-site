import React, { useState } from 'react';
import { Flame, Search, ShoppingCart, Truck, Phone, ShieldCheck, MapPin, FileCode, Layers } from 'lucide-react';
import { PORTUGAL_DISTRICTS, PRODUCTS } from '../data/mockData';
import { Product } from '../types';

interface HeaderProps {
  cartItemCount: number;
  cartTotal: number;
  selectedDistrictId: string;
  onSelectDistrict: (districtId: string) => void;
  onOpenCart: () => void;
  onOpenComparison: () => void;
  onOpenQuoteModal: () => void;
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  cartTotal,
  selectedDistrictId,
  onSelectDistrict,
  onOpenCart,
  onOpenComparison,
  onOpenQuoteModal,
  onSelectProduct,
  searchQuery,
  setSearchQuery,
}) => {
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const currentDistrict = PORTUGAL_DISTRICTS.find(d => d.id === selectedDistrictId) || PORTUGAL_DISTRICTS[0];

  const searchFilteredProducts = searchQuery.trim()
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0a09] text-stone-100 border-b border-paper shadow-lg">
      {/* Top Bar - Announcements & Quick Contacts */}
      <div className="bg-stone-950 text-xs text-stone-300 py-1.5 px-4 border-b border-paper">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-orange-400 font-semibold tracking-wider uppercase text-[10px]">
              <Truck size={13} className="animate-pulse text-orange-500" />
              Entregas em todo o Portugal Continental e Ilhas
            </span>
            <span className="hidden md:inline text-stone-700">|</span>
            <span className="hidden md:inline flex items-center gap-1 text-stone-400 text-[11px]">
              <ShieldCheck size={13} className="text-emerald-400" />
              Madeira Certificada 100% Nacional &amp; IVA a 6%
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans">
            <button
              onClick={onOpenQuoteModal}
              className="text-orange-400 hover:text-orange-300 font-bold uppercase tracking-wider text-[11px] transition-colors underline"
            >
              Orçamentos para Paletes / Empresas
            </button>
            <span className="text-stone-700">|</span>
            <a
              href="tel:+351926755622"
              className="flex items-center gap-1 hover:text-white transition-colors text-[11px]"
            >
              <Phone size={12} className="text-orange-500" />
              +351 926 755 622
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo Terra Australis LDA - Editorial Style */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-950/60 group-hover:scale-105 transition-transform">
              <Flame size={24} className="text-white fill-white" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-2xl font-bold tracking-tight text-stone-100 uppercase">
                  TERRA AUSTRALIS<span className="text-orange-500 font-serif">.</span>
                </span>
                <span className="text-[9px] bg-orange-600/90 text-white px-1.5 py-0.2 rounded font-bold uppercase tracking-widest ml-1">
                  LDA
                </span>
              </div>
              <p className="text-[9px] text-stone-400 font-bold tracking-[2px] uppercase">
                Lenha • Pellets • Aquecimento • Portugal
              </p>
            </div>
          </div>

          {/* Search Bar with Live Preview */}
          <div className="relative flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Procurar lenha de sobro, fogões, suportes, pellets..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full bg-stone-950/80 text-stone-100 text-xs pl-10 pr-10 py-3 rounded border border-paper focus:outline-none focus:border-orange-600 placeholder-stone-500 tracking-wide font-sans"
              />
              <Search className="absolute left-3.5 top-3.5 text-stone-500" size={16} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200 text-[10px] bg-stone-800 px-2 py-1 rounded uppercase tracking-wider font-bold"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {showSearchResults && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-stone-900 border border-paper rounded shadow-2xl z-50 max-h-80 overflow-y-auto p-2">
                {searchFilteredProducts.length > 0 ? (
                  searchFilteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        setShowSearchResults(false);
                      }}
                      className="flex items-center gap-3 p-2.5 hover:bg-stone-800 rounded cursor-pointer transition-colors border-b border-paper last:border-0"
                    >
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded bg-stone-950" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-serif font-bold text-stone-100 truncate">{p.name}</p>
                        <p className="text-[11px] text-orange-400 font-bold">
                          {p.price.toFixed(2)} € <span className="text-stone-500 font-sans">({p.unit})</span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-3 text-xs text-stone-400 text-center">Nenhum produto encontrado para "{searchQuery}".</p>
                )}
              </div>
            )}
          </div>

          {/* Right Controls - District Selector, Comparison & Cart */}
          <div className="flex items-center gap-3">
            {/* District Fast Switcher */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
                className="flex items-center gap-2 text-xs bg-stone-950 hover:bg-stone-900 text-stone-200 px-3.5 py-2.5 rounded border border-paper transition-colors"
                title="Alterar Distrito para Cálculo de Portes"
              >
                <MapPin size={15} className="text-orange-500" />
                <div className="text-left">
                  <p className="text-[9px] text-stone-400 uppercase tracking-wider leading-none">Distrito de Envio:</p>
                  <p className="font-bold text-stone-100 text-xs font-serif">{currentDistrict.name}</p>
                </div>
              </button>

              {showDistrictDropdown && (
                <div className="absolute right-0 top-full mt-2 bg-stone-950 border border-paper rounded shadow-2xl z-50 w-64 p-2 max-h-72 overflow-y-auto">
                  <p className="text-[10px] font-bold text-orange-500 px-2 py-1 uppercase tracking-widest">
                    Selecione o Distrito (Portugal):
                  </p>
                  {PORTUGAL_DISTRICTS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        onSelectDistrict(d.id);
                        setShowDistrictDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex justify-between items-center transition-colors ${
                        d.id === selectedDistrictId
                          ? 'bg-orange-600/20 text-orange-400 font-bold border border-orange-600/40'
                          : 'text-stone-300 hover:bg-stone-900'
                      }`}
                    >
                      <span>{d.name}</span>
                      <span className="text-[10px] text-stone-500">Desde €{d.baseShippingCost}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Comparison Tool Button */}
            <button
              onClick={onOpenComparison}
              className="hidden lg:flex items-center gap-1.5 text-xs bg-stone-950 hover:bg-stone-900 text-stone-300 px-3.5 py-2.5 rounded border border-paper transition-colors uppercase font-bold tracking-wider"
              title="Comparar Espécies de Lenha (Sobro, Azinheira, Eucalipto)"
            >
              <Layers size={15} className="text-orange-500" />
              <span>Comparar Lenhas</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-3 bg-white hover:bg-orange-500 hover:text-white text-stone-950 px-4 py-2.5 rounded font-black uppercase tracking-[2px] text-xs transition-all transform active:scale-95 shadow-md"
            >
              <ShoppingCart size={18} />
              <div className="text-left hidden xs:block">
                <p className="text-[9px] uppercase font-bold opacity-80 leading-none">Carrinho</p>
                <p className="text-xs font-extrabold">{cartTotal.toFixed(2)} €</p>
              </div>

              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 block md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar lenha, pellets, paletes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-950 text-stone-100 text-xs pl-9 pr-3 py-2.5 rounded border border-paper focus:outline-none focus:border-orange-600"
            />
            <Search className="absolute left-3 top-3 text-stone-500" size={15} />
          </div>
        </div>
      </div>
    </header>
  );
};
