import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Foot3DViewer } from './components/Foot3DViewer';
import { MeasurementForm } from './components/MeasurementForm';
import { ShoeCatalog } from './components/ShoeCatalog';
console.log("APP FILE LOADED");
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { BookingStatusPage } from './components/BookingStatusPage';
import { useAuth } from './auth/AuthProvider';
import { AuthModal } from './components/AuthModal';
import { AccountPanel } from './components/AccountPanel';
import { ResetPasswordView } from './components/ResetPasswordView';
import { listFavourites, toggleFavourite } from './lib/favourites';
import { listMeasurements } from './lib/measurements';
import { calculateSizesFromLength } from './utils/fitCalculator';

export function App() {
  const { user } = useAuth();
  // Navigation / Step state: 'measure' | 'catalog' | 'checkout' | 'confirmation'
  const [currentStep, setCurrentStep] = useState('measure');

  // Biometric Measurement State
  const [measurements, setMeasurements] = useState({
    lengthCm: 27.2,
    widthCm: 10.4,
    sizeEU: 43,
    sizeUK: 8.5,
    sizeUS: 9.5,
    sizeUnit: 'EU',
    surfaceFilter: 'all',
    archType: 'neutral'
  });

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('expecto_soleum_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountPanelOpen, setIsAccountPanelOpen] = useState(false);
  const [favouriteIds, setFavouriteIds] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem('expecto_soleum_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    let active = true;
    if (!user) { setFavouriteIds([]); return () => { active = false; }; }
    Promise.all([listFavourites(user.id), listMeasurements(user.id)]).then(([favourites, saved]) => {
      if (!active) return;
      setFavouriteIds(favourites.map((item) => item.shoe_id));
      const preferred = saved.find((item) => item.is_default);
      if (preferred) {
        const lengthCm = Number(preferred.foot_length_mm) / 10;
        const widthCm = Number(preferred.foot_width_mm) / 10;
        const sizes = calculateSizesFromLength(lengthCm);
        setMeasurements((current) => ({ ...current, lengthCm, widthCm, sizeEU: sizes.eu, sizeUK: sizes.uk, sizeUS: sizes.usMen, sizeUnit: preferred.size_system || 'EU' }));
      }
    }).catch((error) => console.error('Could not load account preferences:', error));
    return () => { active = false; };
  }, [user && user.id]);

  const handleToggleFavourite = async (shoeId) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    const wasFavourite = favouriteIds.includes(shoeId);
    setFavouriteIds((current) => wasFavourite ? current.filter((id) => id !== shoeId) : [...current, shoeId]);
    try {
      await toggleFavourite(user.id, shoeId, wasFavourite);
      showToast(wasFavourite ? 'Removed from favourites.' : 'Added to favourites.');
    } catch (error) {
      setFavouriteIds((current) => wasFavourite ? [...current, shoeId] : current.filter((id) => id !== shoeId));
      showToast(error.message || 'Could not update favourites.');
    }
  };

  const handleUseMeasurement = (saved) => {
    const lengthCm = Number(saved.foot_length_mm) / 10;
    const widthCm = Number(saved.foot_width_mm) / 10;
    const sizes = calculateSizesFromLength(lengthCm);
    setMeasurements((current) => ({ ...current, lengthCm, widthCm, sizeEU: sizes.eu, sizeUK: sizes.uk, sizeUS: sizes.usMen, sizeUnit: saved.size_system || 'EU' }));
    setIsAccountPanelOpen(false);
    setCurrentStep('measure');
    showToast('Loaded "' + saved.name + '" measurements.');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  // Cart Operations
  const handleAddToCart = (bootWithSize) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === bootWithSize.id && item.selectedSize === bootWithSize.selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prevCart, { ...bootWithSize, quantity: 1 }];
      }
    });

    showToast(`Added ${bootWithSize.name} (EU ${bootWithSize.selectedSize}) to Boot Bag!`);
  };

  const handleUpdateQuantity = (id, size, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedSize === size
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (id, size) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.selectedSize === size)));
  };

  // Direct Buy Flow
  const handleBuyNow = (bootWithSize) => {
    setCheckoutItems([{ ...bootWithSize, quantity: 1 }]);
    setCurrentStep('checkout');
  };

  // Proceed From Cart Drawer Flow
  const handleProceedToCheckoutFromCart = () => {
    setCheckoutItems(cart);
    setIsCartOpen(false);
    setCurrentStep('checkout');
  };

  // Order Complete
  const handleCompleteOrder = (orderData) => {
    setLastOrder(orderData);
    // If checkout was from full cart, clear it
    if (checkoutItems.length === cart.length) {
      setCart([]);
    }
    setCurrentStep('confirmation');
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (window.location.pathname === '/reset-password') return <ResetPasswordView />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentStep={currentStep}
        onNavigateStep={(step) => {
          if (step === 'checkout' && checkoutItems.length === 0) {
            if (cart.length > 0) {
              setCheckoutItems(cart);
              setCurrentStep('checkout');
            } else {
              showToast('Your cart is empty. Select a boot first!');
            }
          } else {
            setCurrentStep(step);
          }
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAccount={() => setIsAccountPanelOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-sky-500 text-slate-950 px-4 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-3 border border-sky-300 animate-bounce">
          <span className="text-base">⚡</span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 underline font-black text-slate-900 hover:text-black"
          >
            View Bag
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckoutFromCart}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* STEP 1: 3D MODEL & MEASUREMENT PAGE */}
        {currentStep === 'measure' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero / Value Proposition */}
            <div className="text-center max-w-3xl mx-auto pt-2 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-400 text-xs font-mono font-medium mb-3">
                <span>⚡</span>
                <span>ELIMINATE BLISTERS & TOE CROWDING IN FOOTBALL BOOTS</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Expecto Soleum. <br />
                <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Precision Boot Fit By 3D Biometrics.
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Football boots are built on radically different lasts. Rotate the 3D foot model below, dial in your exact heel-to-toe length and metatarsal width, and our matching algorithm will filter boots designed specifically for your anatomical foot shape.
              </p>
            </div>

            {/* Split Screen: 3D Model on Left, Interactive Measurement Form on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: 3D Foot Viewer (7 cols) */}
              <div className="lg:col-span-7">
                {!isAuthModalOpen && !isAccountPanelOpen && (
                  <Foot3DViewer
                    lengthCm={measurements.lengthCm}
                    widthCm={measurements.widthCm}
                    archType={measurements.archType}
                  />
                )}
              </div>

              {/* Right Column: Measurement Form (5 cols) */}
              <div className="lg:col-span-5">
                <MeasurementForm
                  measurements={measurements}
                  onChange={setMeasurements}
                  onNext={() => setCurrentStep('catalog')}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SHOE CATALOG WITH HOVER DETAILS & MEASUREMENT FILTERS */}
        {currentStep === 'catalog' && (
          <ShoeCatalog
            userMeasurements={measurements}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onBackToMeasurement={() => setCurrentStep('measure')}
            userId={user ? user.id : null}
            favouriteIds={favouriteIds}
            onToggleFavourite={handleToggleFavourite}
            onRequestAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* STEP 3: ORDER SUMMARY, ADDRESS & PAYMENT CHECKOUT */}
        {currentStep === 'checkout' && (
          <CheckoutView
            items={checkoutItems.length > 0 ? checkoutItems : cart}
            userMeasurements={measurements}
            onBack={() => setCurrentStep('catalog')}
            onCompleteOrder={handleCompleteOrder}
          />
        )}

        {/* STEP 4: ORDER CONFIRMATION & RECEIPT */}
        {currentStep === 'confirmation' && lastOrder && (
          <BookingStatusPage
            order={lastOrder}
            measurements={measurements}
            onRestart={() => setCurrentStep('measure')}
            onBackToCatalog={() => setCurrentStep('catalog')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-white">EXPECTO SOLEUM</span>
            <span>•</span>
            <span>Tailored Football Boot Fitting</span>
          </div>
          <div>
            Built with React, JavaScript, Three.js & Tailwind CSS
          </div>
        </div>
      </footer>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <AccountPanel isOpen={isAccountPanelOpen} user={user} onClose={() => setIsAccountPanelOpen(false)} onUseMeasurement={handleUseMeasurement} />
    </div>
  );
}
