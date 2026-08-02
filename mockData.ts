import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { CategoryType, Product, WoodSpecies } from '../types';

interface ProductGridProps {
  products: Product[];
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  searchQuery: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onAddToCart,
  onQuickView,
  searchQuery,
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState<WoodSpecies | 'all'>('all');
  const [onlyPallets, setOnlyPallets] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'power'>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }
        // Wood species filter
        if (selectedSpecies !== 'all' && p.woodSpecies !== selectedSpecies) {
          return false;
        }
        // Pallets filter
        if (onlyPallets && !p.isPallet) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.shortDescription.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'power') return (b.calorificPowerKwhKg || 0) - (a.calorificPowerKwhKg || 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, activeCategory, selectedSpecies, onlyPallets, searchQuery, sortBy]);

  const resetFilters = () => {
    onSelectCategory('all');
    setSelectedSpecies('all');
    setOnlyPallets(false);
    setSortBy('featured');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-paper">
        <div>
          <span className="badge-editorial mb-2">Catálogo Oficial • Terra Australis LDA</span>
          <h2 className="text-3xl font-bold text-stone-100 font-serif uppercase tracking-tight">
            Lenha, Pellets &amp; <span className="text-orange-500 italic lowercase font-serif font-normal">aquecimento</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            Mostrando {filteredProducts.length} produto(s) certificados com entrega direta ao domicílio em Portugal.
          </p>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Species Filter */}
          {activeCategory === 'lenha' || activeCategory === 'all' ? (
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value as WoodSpecies | 'all')}
              className="bg-stone-900 text-stone-200 text-xs px-3 py-2 rounded border border-paper focus:outline-none focus:border-orange-600 font-sans uppercase tracking-wider font-bold"
            >
              <option value="all">Todas as Espécies</option>
              <option value="sobro">Sobro / Sobreiro</option>
              <option value="azinheira">Azinheira</option>
              <option value="eucalipto">Eucalipto</option>
              <option value="mistura">Mistura</option>
            </select>
          ) : null}

          {/* Pallets Toggle */}
          <button
            onClick={() => setOnlyPallets(!onlyPallets)}
            className={`text-xs px-3.5 py-2 rounded border uppercase font-bold tracking-wider transition-all ${
              onlyPallets
                ? 'bg-orange-600 text-white border-orange-500 shadow-md'
                : 'bg-stone-900 text-stone-300 border-paper hover:bg-stone-800'
            }`}
          >
            <span>Paletes Completas</span>
          </button>

          {/* Sorting */}
          <div className="flex items-center gap-1.5 bg-stone-900 px-3 py-1.5 rounded border border-paper">
            <ArrowUpDown size={13} className="text-orange-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-stone-200 text-xs focus:outline-none py-0.5 uppercase tracking-wider font-bold"
            >
              <option value="featured">Destaques Primeiro</option>
              <option value="price-asc">Preço: Menor para Maior</option>
              <option value="price-desc">Preço: Maior para Menor</option>
              <option value="rating">Melhor Avaliados</option>
              <option value="power">Poder Calorífico (kWh/kg)</option>
            </select>
          </div>

          {(selectedSpecies !== 'all' || onlyPallets || activeCategory !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-stone-400 hover:text-orange-400 p-2 text-xs flex items-center gap-1 transition-colors uppercase font-bold tracking-wider"
              title="Limpar Filtros"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      ) : (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center my-8">
          <Filter size={40} className="text-stone-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-200">Nenhum produto corresponde aos seus filtros</h3>
          <p className="text-stone-400 text-xs mt-1 max-w-md mx-auto">
            Tente selecionar outra categoria, limpar a barra de pesquisa ou desativar o filtro de paletes.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-lg text-xs"
          >
            Restaurar Filtros Padrão
          </button>
        </div>
      )}
    </section>
  );
};
