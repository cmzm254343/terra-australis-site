import React, { useState } from 'react';
import { X, Building2, Send, CheckCircle2 } from 'lucide-react';
import { PORTUGAL_DISTRICTS } from '../data/mockData';

interface BulkQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkQuoteModal: React.FC<BulkQuoteModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Lisboa');
  const [productType, setProductType] = useState('Paletes de Lenha de Sobro');
  const [quantity, setQuantity] = useState('5 Paletes');
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 text-stone-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white bg-stone-800 rounded-lg"
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-800">
              <div className="p-2 bg-amber-600/20 text-amber-400 rounded-lg">
                <Building2 size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-base font-serif text-stone-100">
                  Pedir Orçamento para Grandes Quantidades
                </h3>
                <p className="text-stone-400 text-[11px]">
                  Para condomínios, restaurantes, pizzarias, hotéis e compras volumosas.
                </p>
              </div>
            </div>

            <div className="bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-lg text-[11px] text-amber-200/90">
              ✉️ <strong>Envio Direto:</strong> Os pedidos de orçamento são encaminhados diretamente para o e-mail oficial da empresa: <span className="text-amber-400 font-mono font-bold">terra-australis-lda@outlook.com</span>.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Nome de Contacto *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-800 p-2.5 rounded-lg border border-stone-700 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Empresa / Restaurante [Opcional]</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-stone-800 p-2.5 rounded-lg border border-stone-700 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-800 p-2.5 rounded-lg border border-stone-700 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Telemóvel *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-800 p-2.5 rounded-lg border border-stone-700 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Distrito de Entrega *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-stone-800 p-2.5 rounded-lg border border-stone-700 text-stone-100"
                >
                  {PORTUGAL_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Produto Pretendido *</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full bg-stone-800 p-2.5 rounded-lg border border-stone-700 text-stone-100"
                >
                  <option value="Paletes de Lenha de Sobro">Paletes de Lenha de Sobro</option>
                  <option value="Paletes de Lenha de Azinheira">Paletes de Lenha de Azinheira</option>
                  <option value="Paletes de Pellets Enplus A1">Paletes de Pellets Enplus A1</option>
                  <option value="Camião Completo de Lenha (24 toneladas)">Camião Completo (24 Toneladas)</option>
                  <option value="Equipamentos / Salamandras">Equipamentos / Salamandras</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-300 font-medium mb-1">Quantidade Estimada / Frequência:</label>
                <input
                  type="text"
                  placeholder="Ex: 5 paletes por mês durante o Inverno"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-stone-800 p-2.5 rounded-lg border border-stone-700 text-stone-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-300 font-medium mb-1">Observações Adicionais:</label>
                <textarea
                  rows={2}
                  placeholder="Detalhes sobre acessos, horário de descarga ou requisitos especiais."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full bg-stone-800 p-2.5 rounded-lg border border-stone-700 text-stone-100"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold flex items-center gap-1.5"
              >
                <Send size={15} />
                <span>Enviar Pedido de Orçamento</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-stone-100">Pedido de Orçamento Enviado com Sucesso!</h3>
            <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
              O seu pedido de orçamento foi registado e enviado para o e-mail oficial da empresa (<strong className="text-amber-400">terra-australis-lda@outlook.com</strong>).
            </p>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              A equipa comercial da <strong>Terra Australis LDA</strong> responderá no prazo máximo de 24 horas úteis com uma proposta personalizada.
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-2 rounded-lg text-xs"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
