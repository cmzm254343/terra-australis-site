import React from 'react';
import { Flame, ShieldCheck, Truck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import lenhaSobroImg from '../assets/images/lenha_sobro_azinheira_1785574904904.jpg';

interface HeroBannerProps {
  onExploreProducts: () => void;
  onOpenShippingWidget: () => void;
  onOpenQuoteModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreProducts,
  onOpenShippingWidget,
  onOpenQuoteModal,
}) => {
  return (
    <div className="relative overflow-hidden bg-[#0c0a09] text-stone-100 border-b border-paper">
      {/* Background Radial Glow */}
      <div className="bg-fire-radial absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Editorial Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <span className="badge-editorial mb-4">
                Em Destaque • Biocombustíveis Certificados
              </span>
              
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] uppercase tracking-tight text-stone-100 mt-2">
                Calor que<br />Respeita a<br />
                <span className="text-orange-500 italic lowercase font-serif font-normal">natureza.</span>
              </h1>
            </div>

            <p className="text-stone-400 text-sm sm:text-base leading-relaxed max-w-xl font-sans">
              A <strong className="text-stone-200 font-semibold">Terra Australis LDA</strong> fornece soluções de aquecimento em biomassa de alta densidade no mercado português. Fornecemos <strong className="text-stone-200">Lenha Seca (&lt;15% humidade)</strong> em metro cúbico a partir de <strong className="text-orange-400">50€/m³</strong> e <strong className="text-stone-200">Pellets Enplus A1</strong> com entrega ao domicílio por camião com plataforma elevatória.
            </p>

            {/* Quick Price List Ticker */}
            <div className="bg-stone-900/80 border border-orange-600/30 rounded p-3 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 block">
                ★ Tabela de Lenha Seca por Volume (m³)
              </span>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-stone-200 font-serif font-bold text-xs">
                <span>1 m³ = <span className="text-orange-400">50€</span></span>
                <span className="text-stone-600">•</span>
                <span>5 m³ = <span className="text-orange-400">210€</span></span>
                <span className="text-stone-600">•</span>
                <span>10 m³ = <span className="text-orange-400">380€</span></span>
                <span className="text-stone-600">•</span>
                <span>20 m³ = <span className="text-orange-400">660€</span></span>
                <span className="text-stone-600">•</span>
                <span>40 m³ = <span className="text-orange-400">1370€</span></span>
              </div>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div className="flex items-center gap-2 bg-stone-900/90 p-3 rounded border border-paper">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span className="text-stone-300 font-semibold uppercase tracking-wider text-[11px]">Humidade &lt; 15%</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900/90 p-3 rounded border border-paper">
                <Truck size={16} className="text-orange-500 shrink-0" />
                <span className="text-stone-300 font-semibold uppercase tracking-wider text-[11px]">Plataforma Elevatória</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900/90 p-3 rounded border border-paper">
                <ShieldCheck size={16} className="text-orange-400 shrink-0" />
                <span className="text-stone-300 font-semibold uppercase tracking-wider text-[11px]">Taxa IVA 6% Incluída</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onExploreProducts}
                className="flex items-center gap-3 bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-[2px] uppercase px-7 py-4 rounded text-xs transition-all transform active:scale-95 shadow-xl"
              >
                <span>Ver Catálogo Completo</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onOpenShippingWidget}
                className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-200 font-semibold uppercase tracking-wider px-5 py-4 rounded border border-paper transition-all text-xs"
              >
                <span>Simular Portes por Distrito</span>
              </button>

              <button
                onClick={onOpenQuoteModal}
                className="text-orange-400 hover:text-orange-300 text-xs font-bold uppercase tracking-wider underline px-2 py-1"
              >
                Orçamento Empresas →
              </button>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden border border-paper shadow-2xl bg-stone-900 p-2">
              <img
                src={lenhaSobroImg}
                alt="Lenha de Sobro e Azinheira Terra Australis"
                className="w-full h-72 sm:h-80 object-cover rounded"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-stone-950/95 backdrop-blur-md rounded border border-paper text-xs flex justify-between items-center">
                <div>
                  <p className="font-serif text-lg font-bold text-stone-100">Palete de Lenha de Sobro (1.8 m³)</p>
                  <p className="text-orange-500 font-bold text-sm">245,00 € <span className="text-[10px] text-stone-400 uppercase font-sans">(c/ IVA 6% inc.)</span></p>
                </div>
                <span className="bg-orange-600 text-white font-bold px-3 py-1.5 rounded text-[10px] uppercase tracking-widest">
                  Destaque
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
