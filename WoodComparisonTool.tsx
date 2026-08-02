import React, { useState } from 'react';
import { X, Star, ShoppingCart, Truck, ShieldCheck, Flame, Scale, Check, MapPin, Calculator, Code2, AlertTriangle, Layers } from 'lucide-react';
import { Product } from '../types';
import { PORTUGAL_DISTRICTS } from '../data/mockData';
import { calculateShipping } from '../utils/shippingCalculator';
import { getProductSchema } from '../utils/seo';

interface ProductDetailModalProps {
  product: Product | null;
  selectedDistrictId: string;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, cutLength?: string, woodSpecies?: string) => void;
  onBuyNowMbway: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  selectedDistrictId,
  onClose,
  onAddToCart,
  onBuyNowMbway,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [cutLength, setCutLength] = useState('30cm (Standard)');
  const [selectedSpecies, setSelectedSpecies] = useState('Carvalho');
  const [calcDistrictId, setCalcDistrictId] = useState(selectedDistrictId);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'reviews' | 'seo'>('details');

  const allImages = [product.image, ...(product.additionalImages || [])];

  // Shipping simulation for this specific product
  const shippingInfo = calculateShipping(
    calcDistrictId,
    [{ product, quantity }]
  );

  const productSchemaJson = JSON.stringify(getProductSchema(product), null, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-6 text-stone-100 max-h-[92vh] flex flex-col">
        
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Flame className="text-amber-500" size={20} />
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Ficha do Produto • Terra Australis LDA
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left: Gallery Column (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-950 border border-stone-800">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {product.vatRate === 0.06 && (
                  <span className="absolute top-3 left-3 bg-emerald-700 text-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-md">
                    IVA 6% Incluído
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === img ? 'border-amber-500 scale-105' : 'border-stone-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Badges Box */}
              <div className="bg-stone-850 p-3.5 rounded-xl border border-stone-800 text-xs space-y-2">
                <div className="flex items-center gap-2 text-stone-300">
                  <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                  <span>Origem Nacional 100% Certificada</span>
                </div>
                <div className="flex items-center gap-2 text-stone-300">
                  <Truck size={16} className="text-amber-400 shrink-0" />
                  <span>Descarga com Camião c/ Plataforma Elevatória</span>
                </div>
              </div>
            </div>

            {/* Right: Info & Purchase Controls (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-amber-500 font-semibold mb-1">
                  <span className="uppercase tracking-wider">{product.category === 'lenha' ? 'Lenha de Aquecimento' : product.category === 'fogoes' ? 'Fogões a Lenha' : product.category === 'suportes' ? 'Suportes para Lenha' : 'Extras'}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={14} className="fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-stone-500">({product.reviewCount} avaliações)</span>
                  </div>
                </div>

                <h1 className="text-2xl font-bold font-serif text-stone-100">{product.name}</h1>
                <p className="text-stone-300 text-xs mt-2 leading-relaxed font-sans">{product.fullDescription}</p>
              </div>

              {/* Pricing Box */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400">Preço com IVA ({(product.vatRate * 100).toFixed(0)}%):</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-400 font-serif">
                      {(product.price * quantity).toFixed(2)} €
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-stone-500 line-through">
                        {(product.originalPrice * quantity).toFixed(2)} €
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right text-xs text-stone-400">
                  <p className="font-semibold text-stone-200">{product.unit}</p>
                  <p className="text-[11px] text-stone-400">Peso Total: {product.weightKg * quantity} kg</p>
                </div>
              </div>

              {/* Pallet Pack Clarification Notice */}
              {product.category === 'lenha' && (
                <div className="bg-orange-950/40 border border-orange-500/40 p-3 rounded-xl flex items-start gap-2.5 text-xs text-stone-200">
                  <Layers size={18} className="text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-orange-400 uppercase text-[10px] tracking-wider block mb-0.5">
                      Nota Sobre os Packs de Lenha (Paletes):
                    </span>
                    <p className="text-[11px] text-stone-300 leading-snug">
                      Todos os nossos <strong>Packs de Lenha</strong> correspondem a <strong>Paletes empilhadas de 1.8 m³</strong> (revestidas a filme e cintadas), facilitando o descarregamento por camião e arrumação direta no seu espaço.
                    </p>
                  </div>
                </div>
              )}

              {/* Wood Species Choice Selector */}
              {product.category === 'lenha' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-200 uppercase tracking-wider">
                    Escolha a Madeira do Pack / Palete:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      { id: 'Carvalho', name: 'Carvalho', desc: 'Queima Lenta & Brasas' },
                      { id: 'Faia', name: 'Faia', desc: 'Chama Viva & Calor' },
                      { id: 'Bétula', name: 'Bétula', desc: 'Ignição Rápida' },
                      { id: 'Sobro/Azinheira', name: 'Sobro / Azinheira', desc: 'Densidade Máxima' },
                      { id: 'Eucalipto', name: 'Eucalipto', desc: 'Calor Rápido & Intenso' },
                      { id: 'Oliveira', name: 'Oliveira', desc: 'Brasas Duradouras' },
                      { id: 'Pinho Seco', name: 'Pinho Seco', desc: 'Tradição & Acendimento' },
                      { id: 'Mistura Serrana', name: 'Mistura Serrana', desc: 'Variedade Tradicional' },
                    ].map((sp) => (
                      <button
                        key={sp.id}
                        type="button"
                        onClick={() => setSelectedSpecies(sp.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          selectedSpecies === sp.id
                            ? 'bg-orange-600 text-white font-bold border-orange-500 shadow-md ring-1 ring-orange-400'
                            : 'bg-stone-950 text-stone-300 border-paper hover:border-orange-500/50'
                        }`}
                      >
                        <p className="font-serif font-bold text-xs">{sp.name}</p>
                        <p className="text-[9px] opacity-80 uppercase tracking-tight">{sp.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wood Cut Length Selector (for firewood) */}
              {product.category === 'lenha' && (
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5 uppercase tracking-wider">
                    Selecione o Tamanho de Corte dos Toros:
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {['25cm (Pequeno/Salamandras)', '30cm (Standard)', '40cm (Lareiras Grandes)'].map((len) => (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setCutLength(len)}
                        className={`p-2 rounded-lg border font-medium text-center transition-all ${
                          cutLength === len
                            ? 'bg-amber-600/30 text-amber-300 border-amber-500 font-bold'
                            : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750'
                        }`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">Quantidade:</label>
                  <div className="flex items-center bg-stone-800 rounded-lg border border-stone-700">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-stone-300 hover:text-white font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm font-bold text-amber-400">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-stone-300 hover:text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex-1 flex gap-2 pt-5">
                  <button
                    onClick={() => {
                      onAddToCart(product, quantity, cutLength, product.category === 'lenha' ? selectedSpecies : undefined);
                      onClose();
                    }}
                    className="flex-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
                  >
                    <ShoppingCart size={18} />
                    <span>Adicionar ao Carrinho</span>
                  </button>

                  <button
                    onClick={() => {
                      onAddToCart(product, quantity, cutLength, product.category === 'lenha' ? selectedSpecies : undefined);
                      onBuyNowMbway(product);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
                    title="Encomendar Já com Transferência Bancária"
                  >
                    <span>Comprar Já</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Secondary Info Tabs */}
          <div className="border-t border-stone-800 pt-4">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-2 text-xs">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'details' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Especificações Técnicas
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'shipping' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Calculator size={13} />
                Calculador de Portes
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'reviews' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Avaliações ({product.reviewCount})
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'seo' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Code2 size={13} />
                Schema.org (SEO)
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-4 text-xs">
              {activeTab === 'details' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <div className="space-y-2">
                    <p className="text-stone-400">Poder Calorífico Estimado:</p>
                    <p className="font-bold text-amber-400 text-sm">{product.calorificPowerKwhKg || 'N/A'} kWh/kg</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-stone-400">Teor de Humidade:</p>
                    <p className="font-bold text-stone-200 text-sm">
                      {product.moistureContentPercentage ? `< ${product.moistureContentPercentage}% (Super Seca)` : 'Seca em Estufa'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-stone-400">Dimensões / Embalagem:</p>
                    <p className="font-bold text-stone-200">{product.dimensionsCm || product.unit}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-stone-400">Taxa de IVA Aplicável:</p>
                    <p className="font-bold text-emerald-400">{(product.vatRate * 100).toFixed(0)}% (Lei Portuguesa Biocombustíveis)</p>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-stone-800">
                    <label className="font-bold text-stone-200 flex items-center gap-1.5">
                      <MapPin size={16} className="text-amber-500" />
                      Selecione o Distrito de Destino (Portugal):
                    </label>
                    <select
                      value={calcDistrictId}
                      onChange={(e) => setCalcDistrictId(e.target.value)}
                      className="bg-stone-800 text-stone-200 px-3 py-1.5 rounded-lg border border-stone-700 text-xs focus:outline-none focus:border-amber-500"
                    >
                      {PORTUGAL_DISTRICTS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="bg-stone-900 p-3 rounded-lg border border-stone-800">
                      <p className="text-[11px] text-stone-400">Custo de Envio Calculado:</p>
                      <p className="text-lg font-bold text-amber-400">{shippingInfo.shippingCost.toFixed(2)} €</p>
                      <p className="text-[10px] text-stone-500">+ IVA ({(shippingInfo.vatShipping).toFixed(2)} €)</p>
                    </div>

                    <div className="bg-stone-900 p-3 rounded-lg border border-stone-800">
                      <p className="text-[11px] text-stone-400">Prazo Estimado de Entrega:</p>
                      <p className="text-sm font-bold text-stone-200">{shippingInfo.estimatedDays}</p>
                    </div>

                    <div className="bg-stone-900 p-3 rounded-lg border border-stone-800">
                      <p className="text-[11px] text-stone-400">Método de Descarga:</p>
                      <p className="text-xs font-semibold text-emerald-400">Plataforma Elevatória Térrea</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-stone-200">Classificação Média dos Clientes</p>
                      <p className="text-amber-400 font-extrabold text-lg">{product.rating} de 5.0 estrelas</p>
                    </div>
                    <span className="text-xs text-stone-400">Baseado em {product.reviewCount} compras verificadas</span>
                  </div>

                  <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-200">João M. (Lisboa)</span>
                      <div className="flex text-amber-400"><Star size={12} className="fill-amber-400" /><Star size={12} className="fill-amber-400" /><Star size={12} className="fill-amber-400" /><Star size={12} className="fill-amber-400" /><Star size={12} className="fill-amber-400" /></div>
                    </div>
                    <p className="text-stone-300">"Lenha de sobro excecional! Muito bem seca, arde com uma chama limpa e fica em brasas a noite toda. A entrega por camião no pátio correu perfeitamente."</p>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-2">
                  <p className="text-stone-400 text-[11px]">
                    Abaixo está o código de Rich Snippets <strong>Schema.org Product</strong> injetado automaticamente para motores de busca (Google Portugal SEO):
                  </p>
                  <pre className="bg-stone-900 text-amber-300 p-3 rounded text-[10px] overflow-x-auto font-mono max-h-48 border border-stone-800">
                    {productSchemaJson}
                  </pre>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
