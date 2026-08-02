import React from 'react';
import { X, ShoppingCart, Trash2, Truck, ShieldCheck, ArrowRight, Scale, MapPin } from 'lucide-react';
import { CartItem } from '../types';
import { PORTUGAL_DISTRICTS } from '../data/mockData';
import { calculateShipping } from '../utils/shippingCalculator';
import { calculateCartTaxes } from '../utils/taxCalculator';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedDistrictId: string;
  onSelectDistrict: (districtId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  selectedDistrictId,
  onSelectDistrict,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const taxes = calculateCartTaxes(items);
  const shipping = calculateShipping(selectedDistrictId, items);
  const grandTotal = taxes.itemsTotalIncVat + shipping.shippingCost;

  const totalWeightKg = items.reduce((sum, item) => sum + item.product.weightKg * item.quantity, 0);
  const totalPallets = items.reduce((sum, item) => sum + (item.product.isPallet ? item.quantity : 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/80 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-amber-500" size={20} />
              <h2 className="font-bold text-base font-serif text-stone-100">O seu Carrinho de Compras</h2>
              <span className="bg-amber-600 text-stone-950 text-xs font-extrabold px-2 py-0.5 rounded-full">
                {items.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white bg-stone-800 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-stone-950 border border-stone-800 rounded-xl p-3 flex gap-3 relative group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg bg-stone-900 border border-stone-800"
                  />
                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="font-bold text-xs text-stone-200 truncate">{item.product.name}</h4>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] mt-0.5">
                      {item.selectedWoodSpecies && (
                        <span className="text-orange-400 font-bold bg-orange-950/60 px-1.5 py-0.5 rounded border border-orange-600/30">
                          Madeira: {item.selectedWoodSpecies}
                        </span>
                      )}
                      {item.selectedCutLength && (
                        <span className="text-amber-300 font-medium bg-stone-900 px-1.5 py-0.5 rounded border border-paper">
                          Corte: {item.selectedCutLength}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Peso: {item.product.weightKg * item.quantity} kg
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity buttons */}
                      <div className="flex items-center bg-stone-850 rounded border border-stone-750 text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-400 hover:text-white font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold text-amber-400">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-400 hover:text-white font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Total for this line */}
                      <span className="font-extrabold text-sm text-amber-400 font-serif">
                        {(item.product.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="absolute top-2 right-2 text-stone-500 hover:text-red-400 p-1"
                    title="Remover"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-stone-400 space-y-3">
                <ShoppingCart size={40} className="mx-auto text-stone-600" />
                <p className="text-sm font-semibold text-stone-300">O seu carrinho está vazio</p>
                <p className="text-xs">Adicione lenha, pellets ou salamandras para continuar.</p>
              </div>
            )}
          </div>

          {/* Cart Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-4 bg-stone-950 border-t border-stone-800 space-y-3 text-xs">
              
              {/* Weight & Pallet summary */}
              <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-stone-300">
                  <Scale size={14} className="text-amber-500" />
                  <span>Peso Total: <strong className="text-amber-400">{totalWeightKg} kg</strong></span>
                </div>
                {totalPallets > 0 && (
                  <span className="bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-600/30">
                    {totalPallets} {totalPallets === 1 ? 'Palete' : 'Paletes'}
                  </span>
                )}
              </div>

              {/* District & Shipping selector */}
              <div className="flex items-center justify-between gap-2">
                <label className="text-stone-400 font-semibold flex items-center gap-1">
                  <MapPin size={13} className="text-amber-500" />
                  Distrito de Envio:
                </label>
                <select
                  value={selectedDistrictId}
                  onChange={(e) => onSelectDistrict(e.target.value)}
                  className="bg-stone-800 text-stone-200 text-xs px-2 py-1 rounded border border-stone-700 focus:outline-none focus:border-amber-500"
                >
                  {PORTUGAL_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-stone-850 text-stone-300">
                <div className="flex justify-between">
                  <span className="text-stone-400">Produtos (s/ IVA):</span>
                  <span>{taxes.subtotalExclVat.toFixed(2)} €</span>
                </div>
                {taxes.vat6Amount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>IVA Biocombustíveis (6%):</span>
                    <span>{taxes.vat6Amount.toFixed(2)} €</span>
                  </div>
                )}
                {taxes.vat23Amount > 0 && (
                  <div className="flex justify-between text-stone-400">
                    <span>IVA Equipamentos/Acessórios (23%):</span>
                    <span>{taxes.vat23Amount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-400">Portes de Envio ({shipping.district}):</span>
                  <span className="font-semibold text-amber-400">
                    {shipping.shippingCost === 0 ? 'GRÁTIS' : `${shipping.shippingCost.toFixed(2)} €`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-amber-400 pt-2 border-t border-stone-800 font-serif">
                  <span>Total com IVA:</span>
                  <span>{grandTotal.toFixed(2)} €</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all transform active:scale-95"
              >
                <span>Finalizar Encomenda</span>
                <ArrowRight size={18} />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
