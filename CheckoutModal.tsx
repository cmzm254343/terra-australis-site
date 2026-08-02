import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShippingCalculatorWidget } from './components/ShippingCalculatorWidget';
import { WoodComparisonTool } from './components/WoodComparisonTool';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { BulkQuoteModal } from './components/BulkQuoteModal';
import { VolumePricingSection } from './components/VolumePricingSection';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Footer } from './components/Footer';

import { PRODUCTS, FAQS } from './data/mockData';
import { CategoryType, Product, CartItem, Order } from './types';
import { calculateCartTaxes } from './utils/taxCalculator';
import { getLocalBusinessSchema } from './utils/seo';
import { ChevronDown, ChevronUp, Flame, HelpCircle, ShieldCheck, Truck, Sparkles, MapPin } from 'lucide-react';

export default function App() {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('lisboa');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Products list in state so admin can update stock
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => [
    {
      product: PRODUCTS[0], // Pre-populate with 1 pallet for instant demonstration
      quantity: 1,
      selectedCutLength: '30cm (Standard)',
      selectedWoodSpecies: 'Carvalho'
    }
  ]);

  // Orders list state
  const [orders, setOrders] = useState<Order[]>([]);

  // Modals & Views visibility state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isShippingWidgetOpen, setIsShippingWidgetOpen] = useState<boolean>(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Inject Schema.org LocalBusiness JSON-LD into DOM
  useEffect(() => {
    const scriptId = 'schema-local-business';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(getLocalBusinessSchema());
      document.head.appendChild(script);
    }
  }, []);

  // Cart helpers
  const handleAddToCart = (product: Product, quantity = 1, cutLength?: string, woodSpecies?: string) => {
    const species = woodSpecies || (product.category === 'lenha' ? 'Carvalho' : undefined);
    const cut = cutLength || (product.category === 'lenha' ? '30cm (Standard)' : undefined);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedWoodSpecies === species && item.selectedCutLength === cut
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedCutLength: cut,
          selectedWoodSpecies: species
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderCompleted = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCartItems([]); // Clear cart
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans antialiased selection:bg-amber-600 selection:text-stone-950 flex flex-col">
      
      {/* Header Bar */}
      <Header
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        selectedDistrictId={selectedDistrictId}
        onSelectDistrict={setSelectedDistrictId}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Navbar with Categories */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenShippingWidget={() => setIsShippingWidgetOpen(true)}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
      />

      {/* Main Page Area */}
      <main className="flex-1 space-y-8 pb-12">
        
        {/* Hero Section */}
        <HeroBanner
          onExploreProducts={() => {
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenShippingWidget={() => setIsShippingWidgetOpen(true)}
          onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        />

        {/* Volume Pricing Section (Lenha Seca by m³) */}
        <VolumePricingSection
          products={productList}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          onQuickView={(p) => setSelectedProduct(p)}
        />

        {/* Dynamic Shipping Calculator Widget (If toggled or on homepage) */}
        {isShippingWidgetOpen && (
          <div className="max-w-7xl mx-auto px-4">
            <ShippingCalculatorWidget
              selectedDistrictId={selectedDistrictId}
              onSelectDistrict={setSelectedDistrictId}
              onClose={() => setIsShippingWidgetOpen(false)}
            />
          </div>
        )}

        {/* Wood Comparison Tool (If toggled) */}
        {isComparisonOpen && (
          <div className="max-w-7xl mx-auto px-4">
            <WoodComparisonTool onClose={() => setIsComparisonOpen(false)} />
          </div>
        )}

        {/* Product Catalog */}
        <div id="catalog-section">
          <ProductGrid
            products={productList}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onQuickView={(p) => setSelectedProduct(p)}
            searchQuery={searchQuery}
          />
        </div>

        {/* Why Choose Terra Australis Section */}
        <section className="bg-stone-900 border-y border-stone-800 py-12">
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-extrabold font-serif text-stone-100">
                Porquê Escolher a Terra Australis LDA?
              </h2>
              <p className="text-xs text-stone-400">
                Garantimos os mais elevados padrões de qualidade na preparação e transporte de biocombustíveis em Portugal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-2 text-center">
                <div className="w-12 h-12 bg-amber-600/20 text-amber-400 rounded-xl flex items-center justify-center mx-auto border border-amber-500/30">
                  <Flame size={24} />
                </div>
                <h3 className="font-bold text-stone-200 text-sm">Lenha Seca &lt; 15% Humidade</h3>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Secagem controlada em estufa e ao ar livre. Sem fumos excessivos, acendimento fácil e máximo rendimento.
                </p>
              </div>

              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-2 text-center">
                <div className="w-12 h-12 bg-amber-600/20 text-amber-400 rounded-xl flex items-center justify-center mx-auto border border-amber-500/30">
                  <Truck size={24} />
                </div>
                <h3 className="font-bold text-stone-200 text-sm">Plataforma Elevatória Térrea</h3>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Camiões equipados para descarregar a palete diretamente no piso da sua garagem ou alpendre.
                </p>
              </div>

              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-2 text-center">
                <div className="w-12 h-12 bg-amber-600/20 text-amber-400 rounded-xl flex items-center justify-center mx-auto border border-amber-500/30">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-bold text-stone-200 text-sm">Certificação Enplus A1</h3>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Pellets de pinho 100% puro de origem portuguesa sem aditivos. Teor de cinzas inferior a 0.5%.
                </p>
              </div>

              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-2 text-center">
                <div className="w-12 h-12 bg-amber-600/20 text-amber-400 rounded-xl flex items-center justify-center mx-auto border border-amber-500/30">
                  <Sparkles size={24} />
                </div>
                <h3 className="font-bold text-stone-200 text-sm">IVA Reduzido a 6%</h3>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Cumprimento estrito da legislação fiscal portuguesa de incentivo aos biocombustíveis de aquecimento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold font-serif text-stone-100 flex items-center justify-center gap-2">
              <HelpCircle size={22} className="text-amber-500" />
              Perguntas Frequentes sobre Compra de Lenha & Pellets
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Respostas às dúvidas mais comuns sobre entregas, armazenamento e taxas em Portugal.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full text-left p-4 font-bold text-stone-200 flex justify-between items-center hover:text-amber-400 transition-colors"
                >
                  <span className="pr-4">{faq.question}</span>
                  {openFaqIndex === idx ? (
                    <ChevronUp size={18} className="text-amber-500 shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-stone-500 shrink-0" />
                  )}
                </button>

                {openFaqIndex === idx && (
                  <div className="p-4 pt-0 text-stone-300 leading-relaxed border-t border-stone-850 font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Floating Widgets & Modals */}
      <WhatsAppButton />

      <ProductDetailModal
        product={selectedProduct}
        selectedDistrictId={selectedDistrictId}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNowMbway={(product) => {
          setSelectedProduct(null);
          setIsCheckoutOpen(true);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        selectedDistrictId={selectedDistrictId}
        onSelectDistrict={setSelectedDistrictId}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        selectedDistrictId={selectedDistrictId}
        onOrderCompleted={handleOrderCompleted}
      />

      <BulkQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenShippingWidget={() => setIsShippingWidgetOpen(true)}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
      />
    </div>
  );
}
