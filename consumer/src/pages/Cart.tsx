import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cartApi, getProxyImageUrl, type CartItem } from '../services/api';

export default function CartPage() {
  const { customer, logout } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    cartApi.getCart().then(setCart);
  }, []);

  const updateCart = async () => {
    const updatedCart = await cartApi.getCart();
    setCart(updatedCart);
  };

  const handleQuantityChange = async (productId: number, quantity: number) => {
    await cartApi.updateQuantity(productId, quantity);
    updateCart();
  };

  const handleRemove = async (productId: number) => {
    await cartApi.removeFromCart(productId);
    updateCart();
  };

  const handleClearCart = async () => {
    await cartApi.clearCart();
    updateCart();
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#EBEBEE]">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-[#3D48E8]">Prodex</Link>
            <div className="flex items-center gap-4">
              {customer ? (
                <>
                  <Link to="/profile" className="px-4 py-2 text-[#5B5A59] hover:text-[#3D48E8]">Profile</Link>
                  <button onClick={logout} className="px-4 py-2 text-[#5B5A59] hover:text-[#3D48E8]">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="px-4 py-2 text-[#5B5A59] hover:text-[#3D48E8]">Sign In</Link>
                  <Link to="/signup" className="px-4 py-2 bg-[#3D48E8] text-white rounded-lg hover:bg-blue-600">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-[#151515] mb-4">Your cart is empty</h2>
          <p className="text-[#5B5A59] mb-8">Looks like you haven't added any items yet</p>
          <Link to="/" className="px-6 py-3 bg-[#3D48E8] text-white rounded-lg hover:bg-blue-600">
            Continue Shopping
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBEBEE]">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-[#3D48E8]">Prodex</Link>
          <div className="flex items-center gap-4">
            {customer ? (
              <>
                <Link to="/profile" className="px-4 py-2 text-[#5B5A59] hover:text-[#3D48E8]">Profile</Link>
                <button onClick={logout} className="px-4 py-2 text-[#5B5A59] hover:text-[#3D48E8]">Logout</button>
              </>
            ) : (
              <>
                <Link to="/signin" className="px-4 py-2 text-[#5B5A59] hover:text-[#3D48E8]">Sign In</Link>
                <Link to="/signup" className="px-4 py-2 bg-[#3D48E8] text-white rounded-lg hover:bg-blue-600">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#151515] mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.product.id} className="bg-white rounded-xl p-6 flex gap-6">
                <Link to={`/product/${item.product.id}`}>
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    {item.product.image_url ? (
                      <img src={getProxyImageUrl(item.product.thumbnail || item.product.image_url)} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-3xl">📱</span>
                    )}
                  </div>
                </Link>
                
                <div className="flex-1">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-semibold text-[#151515] hover:text-[#3D48E8]">{item.product.name}</h3>
                  </Link>
                  <p className="text-[#5B5A59] text-sm mb-2">{item.product.category}</p>
                  <div className="text-xl font-bold text-[#3D48E8]">
                    ${item.product.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button 
                    onClick={() => handleRemove(item.product.id)}
                    className="text-[#5B5A59] hover:text-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={handleClearCart}
              className="text-[#5B5A59] hover:text-red-600 text-sm"
            >
              Clear Cart
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 h-fit">
            <h2 className="text-xl font-bold text-[#151515] mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-[#5B5A59]">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-sm text-green-600">Add ${(500 - subtotal).toLocaleString()} more for free shipping</p>
              )}
              <div className="border-t pt-3 flex justify-between text-[#151515] font-bold text-xl">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full mt-6 py-3 bg-[#3D48E8] text-white rounded-lg font-semibold hover:bg-blue-600"
            >
              Proceed to Checkout
            </button>

            <Link 
              to="/" 
              className="block text-center mt-4 text-[#5B5A59] hover:text-[#3D48E8]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
