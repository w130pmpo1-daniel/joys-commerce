import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productApi, cartApi, getProxyImageUrl, type Product } from '../services/api';

const categoryImages: Record<string, string> = {
  'Refrigerators': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=1600&q=80',
  'Washing Machines': 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=1600&q=80',
  'Air Conditioners': 'https://images.unsplash.com/photo-1614631247854-3e913a483a9e?w=1600&q=80',
  'Microwaves': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=1600&q=80',
  'Dishwashers': 'https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?w=1600&q=80',
  'TVs': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1600&q=80',
  'Vacuum Cleaners': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1600&q=80',
};

const categoryDescriptions: Record<string, string> = {
  'Refrigerators': 'Keep your food fresh with our advanced cooling technology. Smart, energy-efficient, and spacious.',
  'Washing Machines': 'Experience powerful cleaning with gentle care. Advanced washing cycles for every fabric type.',
  'Air Conditioners': 'Create the perfect climate in your home. Energy-efficient cooling for ultimate comfort.',
  'Microwaves': 'Quick, even heating for delicious meals. Smart sensors ensure perfect results every time.',
  'Dishwashers': 'Sparkling clean dishes with every cycle. Quiet operation and water-efficient technology.',
  'TVs': 'Immerse yourself in stunning picture quality. Smart TVs with 4K resolution and vivid colors.',
  'Vacuum Cleaners': 'Powerful suction for a spotless home. Lightweight designs for easy maneuvering.',
};

type SortOption = 'newest' | 'price-low-high' | 'price-high-low';
type ViewMode = 'grid' | 'list';

export default function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const { customer, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  const decodedName = decodeURIComponent(name || '');
  const categoryImage = categoryImages[decodedName] || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=80';
  const categoryDesc = categoryDescriptions[decodedName] || 'Discover our premium selection of products designed to enhance your lifestyle.';

  useEffect(() => {
    if (name) {
      productApi.getProducts(decodeURIComponent(name)).then(res => setProducts(res.data));
    }
    updateCartCount();
  }, [name]);

  const handleLogout = () => {
    logout();
  };

  const updateCartCount = async () => {
    const cart = await cartApi.getCart();
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low-high':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
      default:
        return sorted.sort((a, b) => b.id - a.id);
    }
  }, [products, sortBy]);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header - Kept consistent */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">Prodex</Link>
          
          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A50034] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            {customer ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Profile</Link>
                <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 text-sm font-medium">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/signin" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Sign In</Link>
                <Link to="/signup" className="px-6 py-2 bg-[#A50034] text-white rounded-full text-sm font-medium hover:bg-[#8a002b] transition-colors shadow-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* LG.com Style Hero Banner */}
      <section className="relative h-[450px] overflow-hidden group">
        <div className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-700"></div>
        <img 
          src={categoryImage} 
          alt={decodedName}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2s] ease-out"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl animate-fade-in-up">
              <nav className="mb-4 text-white/70 text-sm font-medium tracking-wide">
                <Link to="/" className="hover:text-white transition-colors">HOME</Link>
                <span className="mx-3">/</span>
                <span className="text-white uppercase">{decodedName}</span>
              </nav>
              <h1 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight">
                {decodedName}
              </h1>
              <p className="text-lg text-white/90 leading-relaxed font-light max-w-xl border-l-2 border-[#A50034] pl-6">
                {categoryDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter/Sort Toolbar */}
      <div className="sticky top-[73px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 font-medium">
            <span className="text-gray-900 font-bold">{products.length}</span> Products Found
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-500 font-medium hidden sm:block">Sort by:</label>
              <select 
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#A50034] focus:border-[#A50034] block w-full p-2.5 outline-none cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>

            <div className="flex bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-[#A50034] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                title="Grid View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-[#A50034] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                title="List View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-1">Try checking another category.</p>
          </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
              : 'flex flex-col gap-6'
            }
          `}>
            {sortedProducts.map(product => (
              <div 
                key={product.id} 
                className={`
                  bg-white rounded-2xl overflow-hidden transition-all duration-300 border border-gray-100 group
                  ${viewMode === 'grid' 
                    ? 'hover:shadow-xl hover:-translate-y-1 flex flex-col h-full' 
                    : 'flex flex-col sm:flex-row hover:shadow-lg h-auto sm:h-56'
                  }
                `}
              >
                {/* Image Section */}
                <Link 
                  to={`/product/${product.id}`}
                  className={`
                    relative overflow-hidden bg-[#f8f8f8] flex items-center justify-center
                    ${viewMode === 'grid' ? 'h-64 w-full' : 'h-56 w-full sm:w-64 shrink-0'}
                  `}
                >
                  {(product.thumbnail || product.image_url) ? (
                    <img 
                      src={getProxyImageUrl(product.thumbnail || product.image_url)} 
                      alt={product.name} 
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500 ease-in-out mix-blend-multiply" 
                    />
                  ) : (
                    <span className="text-6xl grayscale opacity-30">📱</span>
                  )}
                  {/* Quick Overlay - Optional touch */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#A50034] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className={`text-gray-500 text-sm mb-4 line-clamp-2 ${viewMode === 'list' && 'sm:line-clamp-3'}`}>
                      {product.description}
                    </p>
                  </div>
                  
                  <div className={`
                    mt-4 flex items-center justify-between
                    ${viewMode === 'list' ? 'sm:justify-start sm:gap-8' : ''}
                  `}>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Price</span>
                      <span className="text-2xl font-bold text-gray-900">${product.price.toLocaleString()}</span>
                    </div>
                    
                    <button 
                      onClick={async (e) => {
                        e.preventDefault();
                        await cartApi.addToCart(product, 1);
                        updateCartCount();
                      }}
                      className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-[#A50034] transition-colors shadow-sm active:transform active:scale-95 flex items-center gap-2"
                    >
                      <span>Add to Cart</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Simple Footer just to close off the page visually */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Prodex. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
