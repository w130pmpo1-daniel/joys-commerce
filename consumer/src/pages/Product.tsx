import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productApi, cartApi, getProxyImageUrl, type Product } from '../services/api';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { customer, logout } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping'>('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      productApi.getProduct(Number(id)).then(res => {
        setProduct(res.data);
        const images = res.data.gallery ? res.data.gallery.split(',') : [];
        setSelectedImage(images.length > 0 ? images[0] : (res.data.image_url || ''));
      });
    }
    updateCartCount();
  }, [id]);

  const updateCartCount = async () => {
    const cart = await cartApi.getCart();
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  const handleAddToCart = async () => {
    if (product) {
      await cartApi.addToCart(product, quantity);
      updateCartCount();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleBuyNow = async () => {
    if (product) {
      await cartApi.addToCart(product, quantity);
      updateCartCount();
      navigate('/cart');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const galleryImages = product?.gallery ? product.gallery.split(',') : [];
  if (product?.image_url && !galleryImages.includes(product.image_url) && galleryImages.length === 0) {
     galleryImages.push(product.image_url);
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-gray-200 border-t-[#A8BCA1] animate-spin"/>
          <div className="text-[#8B7E74] tracking-widest text-sm uppercase">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A4A4A] font-sans selection:bg-[#E6B8B8] selection:text-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#F0EBE0]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-serif font-bold text-[#2D3436] tracking-tight">
            Prodex
            <span className="text-[#A8BCA1]">.</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative group p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#636E72] group-hover:text-[#2D3436] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E6B8B8] text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="h-4 w-px bg-gray-200"></div>
            {customer ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-[#636E72] hover:text-[#2D3436] text-sm font-medium">Profile</Link>
                <button onClick={logout} className="text-[#636E72] hover:text-[#2D3436] text-sm font-medium">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/signin" className="text-[#636E72] hover:text-[#2D3436] text-sm font-medium tracking-wide transition-colors">Sign In</Link>
                <Link to="/signup" className="px-6 py-2.5 bg-[#2D3436] text-white rounded-full text-sm font-medium hover:bg-[#1a1f20] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <nav className="mb-10 text-xs tracking-wider uppercase text-[#8B7E74]">
          <Link to="/" className="hover:text-[#2D3436] transition-colors underline-offset-4 hover:underline">Home</Link>
          <span className="mx-3 text-[#D1D1D1]">/</span>
          {product.category && (
            <>
              <Link to={`/category/${encodeURIComponent(product.category)}`} className="hover:text-[#2D3436] transition-colors underline-offset-4 hover:underline">
                {product.category}
              </Link>
              <span className="mx-3 text-[#D1D1D1]">/</span>
            </>
          )}
          <span className="text-[#2D3436] font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Gallery */}
          <div className="space-y-6 sticky top-28">
            <div 
              className="relative aspect-[4/5] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden cursor-crosshair group border border-[#F5F5F5]"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {selectedImage ? (
                <div 
                  className="w-full h-full transition-transform duration-200 ease-out"
                  style={{
                    backgroundImage: `url(${getProxyImageUrl(selectedImage)})`,
                    backgroundPosition: isZoomed ? `${mousePos.x}% ${mousePos.y}%` : 'center',
                    backgroundSize: isZoomed ? '200%' : 'contain',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <img 
                    src={getProxyImageUrl(selectedImage)} 
                    alt={product.name} 
                    className={`w-full h-full object-contain transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`} 
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#FAFAFA]">
                  <span className="text-6xl opacity-20">📷</span>
                </div>
              )}
              
              {/* Image Counter Badge */}
              {galleryImages.length > 0 && (
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium tracking-wide shadow-sm border border-gray-100 text-[#636E72]">
                  {galleryImages.indexOf(selectedImage) + 1} / {galleryImages.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {galleryImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                      selectedImage === img 
                        ? 'border-[#A8BCA1] shadow-md scale-105' 
                        : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={getProxyImageUrl(img)} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div className="space-y-10 lg:pl-8">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-4xl font-serif text-[#2D3436] leading-tight">
                  {product.name}
                </h1>
                <button className="p-3 rounded-full hover:bg-[#FFF0F0] text-[#E6B8B8] transition-colors group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm text-[#636E72]">
                {product.brand && (
                  <span className="px-3 py-1 bg-[#F5F5F5] rounded-lg tracking-wide">
                    {product.brand}
                  </span>
                )}
                {product.sku && (
                  <span className="tracking-wider opacity-60">SKU: {product.sku}</span>
                )}
                <span className="flex items-center gap-1.5 text-[#A8BCA1] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#A8BCA1]"></span>
                  In Stock
                </span>
              </div>

              <div className="text-3xl font-light text-[#2D3436] tracking-tight">
                ${product.price.toLocaleString()}
              </div>
            </div>

            {/* Controls */}
            <div className="p-8 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#F5F5F5] space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold tracking-widest text-[#8B7E74] uppercase">Quantity</label>
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-[#FDFBF7] rounded-full border border-[#F0EBE0] p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[#636E72] hover:bg-white hover:shadow-sm transition-all"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium text-lg text-[#2D3436]">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[#636E72] hover:bg-white hover:shadow-sm transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-xl font-medium tracking-wide transition-all duration-300 transform active:scale-[0.98] ${
                    addedToCart 
                      ? 'bg-[#A8BCA1] text-white shadow-lg shadow-[#A8BCA1]/30' 
                      : 'bg-[#2D3436] text-white hover:bg-[#1a1f20] hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {addedToCart ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Added to Cart
                    </span>
                  ) : 'Add to Cart'}
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-[#E6B8B8] text-white rounded-xl font-medium tracking-wide hover:bg-[#dfacaa] hover:shadow-lg hover:shadow-[#E6B8B8]/30 hover:-translate-y-1 transition-all duration-300 transform active:scale-[0.98]"
                >
                  Buy Now
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#F5F5F5]">
                <div className="flex items-center gap-3 text-xs text-[#636E72]">
                  <div className="p-2 bg-[#F0F7EF] rounded-full text-[#A8BCA1]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span>Free shipping over $500</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#636E72]">
                  <div className="p-2 bg-[#F0F7EF] rounded-full text-[#A8BCA1]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="flex justify-center border-b border-[#F0EBE0] mb-12">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specs', label: 'Specifications' },
              { id: 'shipping', label: 'Shipping & Returns' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-4 text-sm font-medium tracking-widest uppercase transition-all relative ${
                  activeTab === tab.id 
                    ? 'text-[#2D3436]' 
                    : 'text-[#B2B2B2] hover:text-[#636E72]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2D3436] rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[300px] animate-fade-in">
            {activeTab === 'description' && (
              <div className="prose prose-lg prose-neutral max-w-none text-[#636E72] leading-relaxed">
                <p>{product.description}</p>
                {/* Fallback mock content for description if short */}
                {(!product.description || product.description.length < 100) && (
                   <p className="mt-4 opacity-60">
                     Experience the perfect blend of form and function. Designed with meticulous attention to detail, 
                     this product brings a touch of elegance to your daily life. Crafted from premium materials 
                     to ensure durability while maintaining a refined aesthetic.
                   </p>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="bg-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#F5F5F5]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {product.specifications ? product.specifications.split('|').map((spec, idx) => {
                    const [key, ...value] = spec.split(':');
                    return (
                      <div key={idx} className="flex justify-between border-b border-[#F5F5F5] pb-3">
                        <span className="font-medium text-[#2D3436]">{key.trim()}</span>
                        <span className="text-[#636E72]">{value.join(':').trim()}</span>
                      </div>
                    );
                  }) : (
                    <div className="col-span-2 text-center text-gray-400 italic py-10">No specific specifications available for this product.</div>
                  )}
                </div>
                {product.features && (
                  <div className="mt-12 pt-10 border-t border-[#F5F5F5]">
                    <h3 className="text-lg font-serif font-bold text-[#2D3436] mb-6">Key Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.features.split('|').map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-[#E6B8B8] rounded-full flex-shrink-0"></span>
                          <span className="text-[#636E72]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="bg-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#F5F5F5] text-[#636E72] space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F0F7EF] flex items-center justify-center flex-shrink-0 text-[#A8BCA1]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2D3436] mb-2">Standard Shipping</h3>
                    <p>Delivery within 3-5 business days. Free for orders over $500.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FFF0F0] flex items-center justify-center flex-shrink-0 text-[#E6B8B8]">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2D3436] mb-2">Hassle-Free Returns</h3>
                    <p>If you're not completely satisfied with your purchase, you can return it within 30 days for a full refund.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
