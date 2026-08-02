import React from 'react';
import { ShoppingCart, Eye, Star, Flame, Scale, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
}) => {
  return (
    <div className="group bg-stone-900 rounded-xl border border-paper hover:border-orange-500/60 transition-all duration-300 shadow-xl flex flex-col overflow-hidden relative">
      
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-950 cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

        {/* Badges Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.featured && (
            <span className="bg-amber-500 text-stone-950 font-extrabold text-[9px] tracking-widest uppercase px-2 py-0.5 rounded shadow border border-amber-300 backdrop-blur-sm">
              ★ Destaque
            </span>
          )}
          {product.vatRate === 0.06 && (
            <span className="bg-emerald-950/90 text-emerald-300 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border border-emerald-500/40 backdrop-blur-sm">
              IVA 6% Energia
            </span>
          )}
          {product.isPallet && (
            <span className="bg-orange-600/90 text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border border-orange-400/40 backdrop-blur-sm">
              Palete Completa
            </span>
          )}
          {product.moistureContentPercentage && (
            <span className="bg-stone-900/90 text-stone-300 text-[9px] font-medium tracking-wider uppercase px-2 py-0.5 rounded border border-paper backdrop-blur-sm">
              Humidade {product.moistureContentPercentage}%
            </span>
          )}
        </div>

        {/* Quick View Button Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute top-2.5 right-2.5 bg-stone-950/80 hover:bg-orange-600 text-stone-200 hover:text-white p-2 rounded backdrop-blur-sm transition-colors border border-paper"
          title="Ver Detalhes & Calculador de Portes"
        >
          <Eye size={15} />
        </button>

        {/* Stock status overlay if low */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 bg-red-950/90 text-red-200 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border border-red-500/40">
            Apenas {product.stock} em stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#0c0a09]">
        <div>
          {/* Category & Species */}
          <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1 font-sans">
            <span className="uppercase font-bold tracking-[1.5px] text-orange-500">
              {product.category === 'lenha' ? 'Lenha de Aquecimento' : product.category === 'fogoes' ? 'Fogões a Lenha' : product.category === 'suportes' ? 'Suportes para Lenha' : 'Extras'}
            </span>
            <div className="flex items-center gap-1 text-orange-400">
              <Star size={11} className="fill-orange-500 text-orange-500" />
              <span className="font-bold">{product.rating}</span>
              <span className="text-stone-500">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-serif font-bold text-stone-100 text-base hover:text-orange-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-stone-400 text-xs line-clamp-2 mt-1.5 font-sans leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Firewood Species Available Banner */}
          {product.category === 'lenha' && (
            <div className="mt-2 text-[10px] text-orange-300 bg-orange-950/40 border border-orange-500/30 px-2 py-1 rounded flex items-center gap-1 font-medium">
              <span className="font-bold uppercase tracking-wider text-[9px] text-orange-400">Madeiras:</span>
              <span className="truncate">Carvalho, Faia, Bétula, Sobro, Eucalipto, Oliveira</span>
            </div>
          )}

          {/* Specs pills */}
          <div className="flex items-center gap-2 flex-wrap text-[10px] text-stone-300 mt-3 font-sans">
            <span className="inline-flex items-center gap-1 bg-stone-900 px-2.5 py-1 rounded text-stone-300 border border-paper uppercase font-semibold tracking-wider">
              <Scale size={11} className="text-orange-500" />
              {product.unit}
            </span>
            {product.calorificPowerKwhKg && (
              <span className="inline-flex items-center gap-1 bg-orange-950/30 px-2.5 py-1 rounded text-orange-300 border border-orange-600/30 uppercase font-semibold tracking-wider">
                <Flame size={11} className="text-orange-500" />
                {product.calorificPowerKwhKg} kWh/kg
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-3 border-t border-paper flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-serif text-orange-500">
                {product.price.toFixed(2)} €
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-600 line-through">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>
            <p className="text-[9px] text-stone-500 uppercase font-semibold tracking-wider">
              c/ IVA ({(product.vatRate * 100).toFixed(0)}%) inc.
            </p>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-wider px-3.5 py-2 rounded text-xs transition-all active:scale-95 shadow-md"
            title="Adicionar ao Carrinho"
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </div>

      </div>
    </div>
  );
};
