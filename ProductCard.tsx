import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Building, Truck, ArrowLeft, Printer, FileText, Copy, Check, MessageCircle, ExternalLink, Send } from 'lucide-react';
import { CartItem, Order, PaymentMethodId } from '../types';
import { PORTUGAL_DISTRICTS } from '../data/mockData';
import { calculateShipping } from '../utils/shippingCalculator';
import { calculateCartTaxes } from '../utils/taxCalculator';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedDistrictId: string;
  onOrderCompleted: (order: Order) => void;
}

export const BANK_DETAILS = {
  accountHolder: 'ANABELA COSTA',
  nib: '0010 0000 6563 8420 0012 5',
  iban: 'PT500010000006563842000125',
  swift: 'BBPIPTPL',
  whatsappPhone: '+351 926 755 622',
  whatsappRaw: '351926755622',
  email: 'terra-australis-lda@outlook.com',
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  selectedDistrictId,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [deliveryMethod, setDeliveryMethod] = useState<'truck_lift' | 'pickup'>('truck_lift');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('bank_transfer');

  // Customer Form
  const [fullName, setFullName] = useState('Afonso Henriques');
  const [email, setEmail] = useState('afonso.henriques@exemplo.pt');
  const [phone, setPhone] = useState('912345678');
  const [nif, setNif] = useState('212345678');
  const [address, setAddress] = useState('Rua Principal de Santarém, nº 45');
  const [postalCode, setPostalCode] = useState('2000-010');
  const [districtId, setDistrictId] = useState(selectedDistrictId);
  const [notes, setNotes] = useState('Portão largo de acesso a camião na parte lateral da casa.');

  // Copy states
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Created Order object
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const taxes = calculateCartTaxes(items);
  const shipping = calculateShipping(districtId, items, deliveryMethod);
  const grandTotal = taxes.itemsTotalIncVat + shipping.shippingCost;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleProcessOrder = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const orderId = 'TA-' + Math.floor(100000 + Math.random() * 900000);
      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customer: {
          fullName,
          email,
          phone,
          nif,
          address,
          postalCode,
          city: PORTUGAL_DISTRICTS.find(d => d.id === districtId)?.name || 'Santarém',
          district: PORTUGAL_DISTRICTS.find(d => d.id === districtId)?.name || 'Santarém',
          deliveryNotes: notes,
        },
        items,
        subtotalExclVat: taxes.subtotalExclVat,
        vat6Total: taxes.vat6Amount,
        vat23Total: taxes.vat23Amount,
        vatTotal: taxes.totalVat,
        shippingCost: shipping.shippingCost,
        grandTotal,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'pending',
        orderStatus: 'processamento',
      };

      setCompletedOrder(newOrder);
      setIsProcessingPayment(false);
      setStep('confirmation');
      onOrderCompleted(newOrder);
    }, 1200);
  };

  const getWhatsAppShareUrl = (order: Order) => {
    const text = `Olá! Fiz a encomenda #${order.id} na Terra Australis no valor de ${order.grandTotal.toFixed(2)}€.\n\nNome: ${order.customer.fullName}\nTelefone: ${order.customer.phone}\n\nSegue em anexo o comprovativo da transferência bancária para:\n- IBAN: ${BANK_DETAILS.iban}\n- Titular: ${BANK_DETAILS.accountHolder}`;
    return `https://wa.me/${BANK_DETAILS.whatsappRaw}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-paper rounded-xl shadow-2xl overflow-hidden my-6 text-stone-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-stone-950 border-b border-paper flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-stone-950 font-black text-xs px-2.5 py-1 rounded tracking-widest uppercase flex items-center gap-1">
              <Building size={14} />
              TRANSFERÊNCIA BANCÁRIA
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-stone-100 uppercase tracking-tight">
                Finalizar Encomenda • Terra Australis LDA
              </h2>
              <p className="text-[10px] text-stone-400 font-sans">
                Pagamento Seguro por Transferência com envio de comprovativo via WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white bg-stone-900 rounded border border-paper transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="bg-stone-950 px-6 py-2.5 border-b border-paper flex justify-between text-[11px] font-bold uppercase tracking-wider text-stone-400">
          <span className={step === 'details' ? 'text-orange-500 font-extrabold' : ''}>1. Dados de Envio</span>
          <span>→</span>
          <span className={step === 'payment' ? 'text-orange-500 font-extrabold' : ''}>2. Dados de Transferência</span>
          <span>→</span>
          <span className={step === 'confirmation' ? 'text-emerald-400 font-extrabold' : ''}>3. Envio de Comprovativo</span>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 font-sans">
          
          {/* STEP 1: CUSTOMER DETAILS */}
          {step === 'details' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-stone-100 font-serif uppercase tracking-wider border-b border-paper pb-2">
                Dados Pessoais &amp; Endereço de Entrega em Portugal
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1 uppercase text-[10px] tracking-wider">Nome Completo *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 p-2.5 rounded border border-paper focus:border-orange-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1 uppercase text-[10px] tracking-wider">E-mail para Fatura *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 p-2.5 rounded border border-paper focus:border-orange-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1 uppercase text-[10px] tracking-wider">Telemóvel (PT) *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 p-2.5 rounded border border-paper focus:border-orange-600 outline-none"
                    placeholder="9xx xxx xxx"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1 uppercase text-[10px] tracking-wider">NIF (para Faturação) [Opcional]</label>
                  <input
                    type="text"
                    value={nif}
                    onChange={(e) => setNif(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 p-2.5 rounded border border-paper focus:border-orange-600 outline-none"
                    placeholder="999999990"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-semibold mb-1 uppercase text-[10px] tracking-wider">Morada Completa de Entrega *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 p-2.5 rounded border border-paper focus:border-orange-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1 uppercase text-[10px] tracking-wider">Código Postal *</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 p-2.5 rounded border border-paper focus:border-orange-600 outline-none"
                    placeholder="xxxx-xxx"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1 uppercase text-[10px] tracking-wider">Distrito *</label>
                  <select
                    value={districtId}
                    onChange={(e) => setDistrictId(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 p-2.5 rounded border border-paper focus:border-orange-600 outline-none font-semibold"
                  >
                    {PORTUGAL_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-semibold mb-1 uppercase text-[10px] tracking-wider">Instruções de Acesso (Camião com Plataforma):</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-stone-950 text-stone-100 p-2.5 rounded border border-paper focus:border-orange-600 outline-none"
                  />
                </div>
              </div>

              {/* Delivery Choice */}
              <div className="pt-2">
                <label className="block font-bold text-stone-200 mb-2 uppercase text-[10px] tracking-wider">Opção de Envio:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('truck_lift')}
                    className={`p-3 rounded border text-left flex items-start gap-3 transition-all ${
                      deliveryMethod === 'truck_lift'
                        ? 'bg-orange-950/40 text-orange-200 border-orange-500 font-bold'
                        : 'bg-stone-950 text-stone-400 border-paper'
                    }`}
                  >
                    <Truck size={20} className="text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-xs text-stone-100 uppercase tracking-wider">Camião c/ Plataforma Elevatória</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Entrega na morada ({shipping.shippingCost.toFixed(2)} €)
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-3 rounded border text-left flex items-start gap-3 transition-all ${
                      deliveryMethod === 'pickup'
                        ? 'bg-orange-950/40 text-orange-200 border-orange-500 font-bold'
                        : 'bg-stone-950 text-stone-400 border-paper'
                    }`}
                  >
                    <Building size={20} className="text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-xs text-stone-100 uppercase tracking-wider">Levantamento no Armazém</p>
                      <p className="text-[11px] text-emerald-400 mt-0.5">Grátis (No Nosso Armazém)</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-wider px-6 py-3 rounded text-xs transition-all shadow-md"
                >
                  Continuar para Transferência Bancária →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: BANK TRANSFER DETAILS */}
          {step === 'payment' && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-paper pb-2">
                <h3 className="font-bold text-sm text-stone-100 font-serif uppercase tracking-wider">
                  Pagamento por Transferência Bancária (NIB / IBAN)
                </h3>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
                  <ShieldCheck size={13} /> Conta Oficial Confirmada
                </span>
              </div>

              {/* Bank Details Display Card */}
              <div className="bg-stone-950 p-5 rounded-xl border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Instruções de Pagamento</p>
                    <p className="text-stone-200 text-xs mt-0.5">Efetue a transferência bancária para os dados abaixo e guarde o comprovativo:</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-stone-400 uppercase font-bold">Total a Transferir</p>
                    <p className="text-xl font-serif font-black text-amber-400">{grandTotal.toFixed(2)} €</p>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {/* Nome */}
                  <div className="bg-stone-900 p-3 rounded border border-stone-800 flex justify-between items-center">
                    <div>
                      <span className="text-stone-500 text-[10px] font-sans uppercase block font-bold">Nome do Titular</span>
                      <strong className="text-stone-100 text-sm tracking-wide">{BANK_DETAILS.accountHolder}</strong>
                    </div>
                    <button
                      onClick={() => handleCopy(BANK_DETAILS.accountHolder, 'nome')}
                      className="flex items-center gap-1 text-[10px] bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1.5 rounded transition-all font-sans"
                    >
                      {copiedField === 'nome' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedField === 'nome' ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>

                  {/* NIB */}
                  <div className="bg-stone-900 p-3 rounded border border-stone-800 flex justify-between items-center">
                    <div>
                      <span className="text-stone-500 text-[10px] font-sans uppercase block font-bold">NIB</span>
                      <strong className="text-emerald-400 text-sm tracking-widest">{BANK_DETAILS.nib}</strong>
                    </div>
                    <button
                      onClick={() => handleCopy(BANK_DETAILS.nib.replace(/\s/g, ''), 'nib')}
                      className="flex items-center gap-1 text-[10px] bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1.5 rounded transition-all font-sans"
                    >
                      {copiedField === 'nib' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedField === 'nib' ? 'Copiado' : 'Copiar NIB'}</span>
                    </button>
                  </div>

                  {/* IBAN */}
                  <div className="bg-stone-900 p-3 rounded border border-amber-500/30 flex justify-between items-center bg-amber-950/20">
                    <div>
                      <span className="text-amber-400 text-[10px] font-sans uppercase block font-bold">IBAN (Recomendado)</span>
                      <strong className="text-stone-100 text-sm tracking-widest">{BANK_DETAILS.iban}</strong>
                    </div>
                    <button
                      onClick={() => handleCopy(BANK_DETAILS.iban, 'iban')}
                      className="flex items-center gap-1 text-[10px] bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-3 py-1.5 rounded transition-all font-sans shadow"
                    >
                      {copiedField === 'iban' ? <Check size={12} className="text-stone-950" /> : <Copy size={12} />}
                      <span>{copiedField === 'iban' ? 'Copiado!' : 'Copiar IBAN'}</span>
                    </button>
                  </div>

                  {/* SWIFT */}
                  <div className="bg-stone-900 p-3 rounded border border-stone-800 flex justify-between items-center">
                    <div>
                      <span className="text-stone-500 text-[10px] font-sans uppercase block font-bold">BIC / SWIFT</span>
                      <strong className="text-stone-200 text-xs tracking-wider">{BANK_DETAILS.swift}</strong>
                    </div>
                    <button
                      onClick={() => handleCopy(BANK_DETAILS.swift, 'swift')}
                      className="flex items-center gap-1 text-[10px] bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1.5 rounded transition-all font-sans"
                    >
                      {copiedField === 'swift' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedField === 'swift' ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                {/* WhatsApp Instructions Note */}
                <div className="bg-emerald-950/50 border border-emerald-500/40 p-3.5 rounded-lg flex items-start gap-3">
                  <div className="p-2 bg-emerald-600 text-stone-950 rounded-full shrink-0 font-bold mt-0.5">
                    <MessageCircle size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-emerald-300 text-xs">Envio do Comprovativo por WhatsApp:</p>
                    <p className="text-stone-300 text-[11px] leading-relaxed">
                      Após realizar a transferência no seu banco ou Homebanking, clique no botão verde no passo seguinte para enviar a foto ou PDF do comprovativo diretamente para o nosso WhatsApp oficial (<strong className="text-emerald-400">{BANK_DETAILS.whatsappPhone}</strong>).
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary Line & Confirm Order */}
              <div className="bg-stone-950 p-4 rounded border border-paper flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                <div>
                  <p className="text-stone-400 uppercase text-[10px] tracking-wider font-bold">Total da Encomenda:</p>
                  <p className="text-2xl font-serif font-black text-amber-400">{grandTotal.toFixed(2)} €</p>
                  <p className="text-[10px] text-stone-500">Inclui IVA e transporte de camião com plataforma</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setStep('details')}
                    className="text-stone-400 hover:text-white uppercase font-bold text-xs underline"
                  >
                    ← Voltar
                  </button>

                  <button
                    onClick={handleProcessOrder}
                    disabled={isProcessingPayment}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider px-6 py-3 rounded text-xs shadow-lg flex items-center gap-2 transition-all transform active:scale-95"
                  >
                    {isProcessingPayment ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                        A Gerar Encomenda...
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Confirmar &amp; Registar Encomenda</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMATION & WHATSAPP DIRECT SUBMISSION */}
          {step === 'confirmation' && completedOrder && (
            <div className="space-y-6 text-xs text-center py-2 font-sans">
              <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded border border-emerald-500/30">
                  Encomenda #{completedOrder.id} Registada
                </span>
                <h3 className="text-2xl font-bold text-stone-100 font-serif uppercase tracking-tight mt-2">
                  Encomenda Pronta! Falta Apenas o Comprovativo
                </h3>
                <p className="text-stone-300 mt-1.5 max-w-lg mx-auto leading-relaxed">
                  Obrigado por escolher a <strong className="text-stone-100">Terra Australis LDA</strong>. Por favor, efetue a transferência bancária e envie o comprovativo para o nosso WhatsApp.
                </p>
              </div>

              {/* Prominent WhatsApp Call-To-Action Box */}
              <div className="bg-emerald-950/60 border-2 border-emerald-500 p-5 rounded-xl max-w-xl mx-auto text-center space-y-3 shadow-xl">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold uppercase text-xs tracking-wider">
                  <MessageCircle size={20} />
                  <span>Passo Final: Enviar Comprovativo no WhatsApp</span>
                </div>
                <p className="text-xs text-stone-200 max-w-md mx-auto leading-relaxed">
                  Clique no botão abaixo para abrir o WhatsApp da empresa com a sua encomenda já preenchida e anexe o comprovativo da transferência:
                </p>

                <a
                  href={getWhatsAppShareUrl(completedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-2xl transition-all transform hover:scale-105 active:scale-95"
                >
                  <Send size={18} />
                  <span>Enviar Comprovativo pelo WhatsApp</span>
                </a>

                <p className="text-[10px] text-emerald-300 font-mono">
                  Número de WhatsApp da Empresa: {BANK_DETAILS.whatsappPhone}
                </p>
              </div>

              {/* Bank Details Reminder Box */}
              <div className="bg-stone-950 p-5 rounded-xl border border-paper max-w-xl mx-auto text-left space-y-3 font-mono text-xs">
                <div className="border-b border-paper pb-2 flex justify-between items-center font-sans">
                  <span className="font-bold text-amber-400 uppercase">
                    Dados para Transferência Bancária
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Total: <strong className="text-amber-400 text-sm font-serif">{completedOrder.grandTotal.toFixed(2)} €</strong>
                  </span>
                </div>

                <div className="space-y-2 text-stone-300 text-[11px]">
                  <div className="flex justify-between items-center bg-stone-900 p-2 rounded">
                    <span>Titular: <strong>{BANK_DETAILS.accountHolder}</strong></span>
                  </div>

                  <div className="flex justify-between items-center bg-stone-900 p-2 rounded border border-amber-500/30">
                    <span>IBAN: <strong className="text-amber-300 font-bold">{BANK_DETAILS.iban}</strong></span>
                    <button
                      onClick={() => handleCopy(BANK_DETAILS.iban, 'iban_conf')}
                      className="text-[10px] bg-amber-600 text-stone-950 font-bold px-2 py-1 rounded font-sans"
                    >
                      {copiedField === 'iban_conf' ? 'Copiado!' : 'Copiar IBAN'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center bg-stone-900 p-2 rounded">
                    <span>NIB: <strong className="text-emerald-400">{BANK_DETAILS.nib}</strong></span>
                    <button
                      onClick={() => handleCopy(BANK_DETAILS.nib.replace(/\s/g, ''), 'nib_conf')}
                      className="text-[10px] bg-stone-800 text-stone-300 px-2 py-1 rounded font-sans"
                    >
                      {copiedField === 'nib_conf' ? 'Copiado!' : 'Copiar NIB'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center bg-stone-900 p-2 rounded">
                    <span>BIC / SWIFT: <strong>{BANK_DETAILS.swift}</strong></span>
                  </div>
                </div>

                {/* Products Summary */}
                <div className="bg-stone-900 p-3 rounded border border-stone-800 text-left space-y-1.5 my-3 font-sans">
                  <p className="font-bold text-stone-200 text-[11px] uppercase tracking-wider mb-1">Resumo dos Produtos:</p>
                  {completedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px] text-stone-300 border-b border-stone-800 pb-1.5 last:border-0">
                      <div>
                        <span className="font-semibold text-stone-100">{it.quantity}x {it.product.name}</span>
                        {it.selectedWoodSpecies && (
                          <span className="ml-2 text-orange-400 font-bold bg-orange-950/60 px-1.5 py-0.5 rounded border border-orange-600/30 text-[10px]">
                            Madeira: {it.selectedWoodSpecies}
                          </span>
                        )}
                        {it.selectedCutLength && (
                          <span className="ml-1.5 text-stone-400 text-[10px]">({it.selectedCutLength})</span>
                        )}
                      </div>
                      <span className="font-mono text-amber-400 font-bold">{(it.product.price * it.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] font-sans text-stone-400">
                  <strong>Endereço de Entrega:</strong> {completedOrder.customer.address}, {completedOrder.customer.postalCode} - {completedOrder.customer.district}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="bg-stone-900 hover:bg-stone-800 text-stone-200 border border-paper px-4 py-2.5 rounded font-bold uppercase tracking-wider text-xs flex items-center gap-2"
                >
                  <Printer size={15} />
                  <span>Imprimir Guia de Pagamento</span>
                </button>

                <button
                  onClick={onClose}
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 px-6 py-2.5 rounded font-bold uppercase tracking-wider text-xs shadow-md"
                >
                  Voltar à Loja
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
