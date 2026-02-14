import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi, orderApi, type CartItem, getStoredToken } from '../services/api';

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    paymentMethod: 'credit_card',
  });

  useEffect(() => {
    cartApi.getCart().then(storedCart => {
      if (storedCart.length === 0 && !orderPlaced) {
        navigate('/cart');
        return;
      }
      setCart(storedCart);
    });

    const token = getStoredToken();
    if (token) {
      const storedCustomer = localStorage.getItem('customer');
      if (storedCustomer) {
        const cust = JSON.parse(storedCustomer);
        setFormData(prev => ({
          ...prev,
          name: cust.name || '',
          email: cust.email || '',
          phone: cust.phone || '',
          address: cust.address || '',
          city: cust.city || '',
          country: cust.country || '',
        }));
      }
    }
  }, [navigate, orderPlaced]);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderNum = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      await orderApi.createOrder({
        order_number: orderNum,
        customer_name: formData.name,
        customer_email: formData.email,
        total_amount: total,
        status: 'pending',
      });

      cartApi.clearCart();
      setOrderNumber(orderNum);
      setOrderPlaced(true);
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#EBEBEE]">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link to="/" className="text-2xl font-bold text-[#3D48E8]">Prodex</Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-xl p-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-[#151515] mb-4">Order Placed Successfully!</h2>
            <p className="text-[#5B5A59] mb-2">Thank you for your purchase</p>
            <p className="text-lg font-semibold text-[#3D48E8] mb-6">Order Number: {orderNumber}</p>
            <p className="text-[#5B5A59] mb-6">
              We've sent a confirmation email to {formData.email}
            </p>
            <Link 
              to="/" 
              className="inline-block px-6 py-3 bg-[#3D48E8] text-white rounded-lg hover:bg-blue-600"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBEBEE]">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="text-2xl font-bold text-[#3D48E8]">Prodex</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#151515] mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#151515] mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#151515] font-medium mb-2">Full Name *</label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3D48E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#151515] font-medium mb-2">Email *</label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3D48E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#151515] font-medium mb-2">Phone</label>
                    <input 
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3D48E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#151515] font-medium mb-2">City</label>
                    <input 
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3D48E8]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#151515] font-medium mb-2">Address</label>
                    <input 
                      type="text"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3D48E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#151515] font-medium mb-2">Country</label>
                    <input 
                      type="text"
                      value={formData.country}
                      onChange={e => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3D48E8]"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#151515] mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <span className="font-medium">Credit / Debit Card</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <span className="font-medium">PayPal</span>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === 'cash_on_delivery'}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <span className="font-medium">Cash on Delivery</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 h-fit">
              <h2 className="text-xl font-bold text-[#151515] mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-[#5B5A59]">{item.product.name} x{item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2 text-[#5B5A59]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-[#151515] font-bold text-xl">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 bg-[#3D48E8] text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>

              <Link 
                to="/cart" 
                className="block text-center mt-4 text-[#5B5A59] hover:text-[#3D48E8]"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
