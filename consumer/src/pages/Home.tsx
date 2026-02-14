import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productApi, categoryApi, cartApi, getProxyImageUrl, type Product, type Category } from '../services/api';

export default function Home() {
  const { customer, logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    updateCartCount();
    categoryApi.getCategories().then(res => setCategories(res.data));
    productApi.getProducts().then(res => setProducts(res.data));
  }, []);

  const updateCartCount = async () => {
    const cart = await cartApi.getCart();
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  const handleLogout = () => {
    logout();
  };

  const handleAddToCart = async (product: Product) => {
    await cartApi.addToCart(product, 1);
    updateCartCount();
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#5A5A5A]">
      {/* Announcement Bar */}
      <div className="bg-[#BFA2DB] text-white text-center py-2 text-sm font-medium tracking-wide">
        FREE WORLDWIDE TRACKED SHIPPING ON ORDERS OVER $50 ✨
      </div>

      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#F0F0F0]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Mobile Menu Icon (Placeholder) */}
            <button className="md:hidden text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link to="/" className="text-3xl font-serif font-bold text-[#4A4A4A] tracking-tight">
              Prodex<span className="text-[#BFA2DB]">.</span>
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              <Link to="/" className="text-[#5A5A5A] hover:text-[#BFA2DB] text-sm font-medium uppercase tracking-wider transition-colors">Home</Link>
              {categories.slice(0, 4).map(cat => (
                <Link 
                  key={cat.id} 
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  className="text-[#5A5A5A] hover:text-[#BFA2DB] text-sm font-medium uppercase tracking-wider transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-6">
              <Link to="/search" className="text-[#5A5A5A] hover:text-[#BFA2DB]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              
              {customer ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="text-[#5A5A5A] hover:text-[#BFA2DB] text-sm font-medium">Profile</Link>
                  <button onClick={handleLogout} className="text-[#5A5A5A] hover:text-[#BFA2DB] text-sm font-medium">Logout</button>
                </div>
              ) : (
                <Link to="/signin" className="text-[#5A5A5A] hover:text-[#BFA2DB]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}

              <Link to="/cart" className="relative text-[#5A5A5A] hover:text-[#BFA2DB] transition-transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#BFA2DB] text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] text-white bg-[#BFA2DB] rounded-full uppercase shadow-lg">
            New Collection
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#4A4A4A] mb-8 leading-tight drop-shadow-sm">
            Find Your Inner <br/> <span className="text-[#9D84B7] italic">Calm</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Curated stationery and lifestyle goods to inspire your daily rituals and creative moments.
          </p>
          <button 
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 bg-[#4A4A4A] text-white rounded-full font-medium tracking-wide hover:bg-[#BFA2DB] transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            Shop Collection
          </button>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFE5E5] rounded-3xl p-8 flex flex-col items-center text-center shadow-lg hover:-translate-y-2 transition-transform duration-500 cursor-pointer h-64 justify-center group">
            <h3 className="text-2xl font-serif font-bold text-[#4A4A4A] mb-2 group-hover:text-[#FF7675] transition-colors">New Arrivals</h3>
            <p className="text-gray-600 mb-4">Fresh stationery just for you</p>
            <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#FF7675] shadow-md group-hover:scale-110 transition-transform">→</span>
          </div>
          <div className="bg-[#E0F3F4] rounded-3xl p-8 flex flex-col items-center text-center shadow-lg hover:-translate-y-2 transition-transform duration-500 cursor-pointer h-64 justify-center group">
            <h3 className="text-2xl font-serif font-bold text-[#4A4A4A] mb-2 group-hover:text-[#4ECDC4] transition-colors">Best Sellers</h3>
            <p className="text-gray-600 mb-4">Loved by our community</p>
            <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4ECDC4] shadow-md group-hover:scale-110 transition-transform">→</span>
          </div>
          <div className="bg-[#FDF6EC] rounded-3xl p-8 flex flex-col items-center text-center shadow-lg hover:-translate-y-2 transition-transform duration-500 cursor-pointer h-64 justify-center group">
            <h3 className="text-2xl font-serif font-bold text-[#4A4A4A] mb-2 group-hover:text-[#F7B731] transition-colors">Sale</h3>
            <p className="text-gray-600 mb-4">Limited time offers</p>
            <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#F7B731] shadow-md group-hover:scale-110 transition-transform">→</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-[#FDFCF8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4A4A4A] mb-4">Shop by Category</h2>
            <div className="w-20 h-1 bg-[#BFA2DB] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => (
              <Link 
                key={cat.id}
                to={`/category/${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center"
              >
                <div className="w-full aspect-square rounded-[2rem] bg-gray-100 overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-all duration-300 relative">
                  <div className={`absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity bg-gradient-to-br ${
                    ['from-pink-200 to-rose-200', 'from-blue-200 to-cyan-200', 'from-green-200 to-emerald-200', 'from-purple-200 to-violet-200'][idx % 4]
                  }`}></div>
                  <div className="w-full h-full flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">
                    {['📦', '✏️', '📒', '✂️', '🖊️', '🎨'][idx % 6] || '📦'}
                  </div>
                </div>
                <span className="font-medium text-[#4A4A4A] text-sm tracking-wide uppercase group-hover:text-[#BFA2DB] transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4A4A4A] mb-2">Featured Collection</h2>
              <p className="text-gray-500">Curated picks for your desk setup</p>
            </div>
            <Link to="/category/all" className="hidden md:block text-[#BFA2DB] font-medium hover:text-[#9D84B7] border-b-2 border-[#BFA2DB] pb-1">
              View All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 8).map(product => (
              <div key={product.id} className="group">
                <div className="relative overflow-hidden rounded-[2rem] bg-[#F7F7F7] aspect-[4/5] mb-6">
                  {/* Image */}
                  <Link to={`/product/${product.id}`} className="block h-full w-full">
                    {(product.thumbnail || product.image_url) ? (
                      <img 
                        src={getProxyImageUrl(product.thumbnail || product.image_url)} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                        📷
                      </div>
                    )}
                  </Link>
                  
                  {/* Quick Add Button - Appears on Hover */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur text-[#4A4A4A] py-3 rounded-xl font-medium shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#4A4A4A] hover:text-white"
                  >
                    Add to Cart
                  </button>

                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-[#FF7675] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                    New
                  </div>
                </div>

                <div className="text-center">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-[#4A4A4A] text-lg mb-1 group-hover:text-[#BFA2DB] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-[#9D84B7] font-bold text-lg">
                    ${product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/category/all" className="inline-block px-8 py-3 border-2 border-[#4A4A4A] text-[#4A4A4A] rounded-full font-medium hover:bg-[#4A4A4A] hover:text-white transition-colors">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#E8F0FE] rounded-full flex items-center justify-center mb-4 text-2xl">✈️</div>
              <h4 className="font-bold text-[#4A4A4A] mb-1">Free Worldwide Shipping</h4>
              <p className="text-sm text-gray-500">On all orders over $50</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FCE8E6] rounded-full flex items-center justify-center mb-4 text-2xl">↩️</div>
              <h4 className="font-bold text-[#4A4A4A] mb-1">30 Day Returns</h4>
              <p className="text-sm text-gray-500">Hassle-free return policy</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#E6F4EA] rounded-full flex items-center justify-center mb-4 text-2xl">🔒</div>
              <h4 className="font-bold text-[#4A4A4A] mb-1">Secure Checkout</h4>
              <p className="text-sm text-gray-500">100% secured payment</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FFF8E1] rounded-full flex items-center justify-center mb-4 text-2xl">💖</div>
              <h4 className="font-bold text-[#4A4A4A] mb-1">24/7 Support</h4>
              <p className="text-sm text-gray-500">We're here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram/Community Section Placeholder */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-[#4A4A4A] mb-2">Join the Community</h2>
          <p className="text-gray-500">Tag @prodex in your photos to be featured!</p>
        </div>
        <div className="flex gap-4 min-w-full px-6 overflow-x-auto pb-8 scrollbar-hide">
           {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="min-w-[280px] h-[280px] bg-gray-100 rounded-2xl overflow-hidden relative group cursor-pointer">
               <img 
                 src={`https://images.unsplash.com/photo-${1510000000000 + i * 100000}?auto=format&fit=crop&w=400&q=80`}
                 alt="Community"
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
               />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                 <span className="text-white font-bold">@prodex</span>
               </div>
             </div>
           ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4A4A4A] text-white pt-20 pb-10 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="text-3xl font-serif font-bold tracking-tight mb-6 block">
                Prodex<span className="text-[#BFA2DB]">.</span>
              </Link>
              <p className="text-gray-400 leading-relaxed mb-6">
                Creating moments of calm and creativity through curated stationery and lifestyle goods.
              </p>
              <div className="flex gap-4">
                {['twitter', 'facebook', 'instagram', 'pinterest'].map(social => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#BFA2DB] transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-4 h-4 bg-current rounded-sm"></div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Shop</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link to="/new" className="hover:text-[#BFA2DB] transition-colors">New Arrivals</Link></li>
                <li><Link to="/bestsellers" className="hover:text-[#BFA2DB] transition-colors">Best Sellers</Link></li>
                <li><Link to="/sale" className="hover:text-[#BFA2DB] transition-colors">Sale</Link></li>
                <li><Link to="/gift-guide" className="hover:text-[#BFA2DB] transition-colors">Gift Guide</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Help</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link to="/shipping" className="hover:text-[#BFA2DB] transition-colors">Shipping & Returns</Link></li>
                <li><Link to="/faq" className="hover:text-[#BFA2DB] transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-[#BFA2DB] transition-colors">Contact Us</Link></li>
                <li><Link to="/track" className="hover:text-[#BFA2DB] transition-colors">Track Order</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Stay in the loop</h4>
              <p className="text-gray-400 mb-4">Join our newsletter for 10% off your first order.</p>
              <form className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-[#BFA2DB] text-white placeholder-gray-500"
                />
                <button className="px-4 py-3 bg-[#BFA2DB] text-white rounded-xl font-bold hover:bg-[#9D84B7] transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
            <p>© 2026 Prodex Store. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
