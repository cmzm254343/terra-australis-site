import React from 'react';
import { Flame, Layers, Star, Sparkles, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { WOOD_SPECIES_COMPARISON } from '../data/mockData';

interface WoodComparisonToolProps {
  onClose?: () => void;
}

export const WoodComparisonTool: React.FC<WoodComparisonToolProps> = ({ onClose }) => {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl text-stone-100 max-w-4xl mx-auto my-6 relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white bg-stone-800 rounded-lg"
        >
          <X size={18} />
        </button>
      )}

      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-800">
        <div className="p-3 bg-gradient-to-br from-amber-600 to-orange-600 text-stone-950 rounded-xl font-bold shadow-md">
          <Layers size={24} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold font-serif text-stone-100">
            Comparador Técnico de Espécies de Lenha
          </h2>
          <p className="text-xs text-stone-400">
            Saiba qual a lenha com maior rendimento e poder calorífico para o seu equipamento de aquecimento.
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {WOOD_SPECIES_COMPARISON.map((item, idx) => (
          <div
            key={idx}
            className="bg-stone-950 border border-stone-800 hover:border-amber-500/50 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/30">
                  {item.stars === 5 ? 'Classe Premium' : 'Classe Standard'}
                </span>
                <div className="flex text-amber-400">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <Star key={i} size={11} className="fill-amber-400" />
                  ))}
                </div>
              </div>

              <h3 className="font-extrabold text-sm text-stone-100 font-serif mb-2">{item.species}</h3>

              <div className="space-y-2 border-t border-stone-850 pt-2 text-[11px]">
                <div>
                  <span className="text-stone-400 block">Poder Calorífico:</span>
                  <span className="font-bold text-amber-400 text-sm">{item.calorificPower}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Duração de Queima:</span>
                  <span className="font-medium text-stone-200">{item.burnDuration}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Densidade Média:</span>
                  <span className="font-medium text-stone-200">{item.density}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Resíduo de Cinza:</span>
                  <span className="font-medium text-emerald-400">{item.ashPercent}</span>
                </div>
              </div>
            </div>

            <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800 text-[10px]">
              <span className="text-stone-400 block font-bold mb-0.5 uppercase tracking-wider">Recomendado para:</span>
              <span className="text-stone-200 font-semibold">{item.idealFor}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Advice Box */}
      <div className="mt-6 p-4 bg-amber-950/30 border border-amber-600/30 rounded-xl text-xs space-y-2">
        <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
          <Sparkles size={16} />
          Dica do Especialista Terra Australis:
        </h4>
        <p className="text-stone-300 leading-relaxed">
          Para acender o fogo com facilidade, utilize alguns cavacos de <strong className="text-amber-200">Eucalipto ou Pinho Seco</strong>. Assim que a câmara de combustão estiver quente, adicione os toros pesados de <strong className="text-amber-200">Sobro ou Azinheira</strong> para manter o calor estável e uniforme durante várias horas.
        </p>
      </div>
    </div>
  );
};
