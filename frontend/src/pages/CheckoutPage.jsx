import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const [deliveryType, setDeliveryType] = useState('SELF_PICKUP');
  const [address, setAddress] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [qrData, setQrData] = useState('');
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryType === 'DELIVERY' ? 4.0 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
          })),
          deliveryType,
          address
        })
      });
      
      const data = await response.json();
      
      if (deliveryType === 'SELF_PICKUP') {
        setQrData(data.qrData);
      }
      
      setOrderStatus('SUCCESS');
      clearCart();
    } catch (error) {
      console.error('Order failed:', error);
      setOrderStatus('ERROR');
    }
  };

  if (cart.length === 0 && !orderStatus) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <button 
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          onClick={() => window.location.href = '/'}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (orderStatus === 'SUCCESS') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Order Successful!</h1>
        
        {deliveryType === 'SELF_PICKUP' ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md inline-block">
              <QRCode 
                value={qrData} 
                size={256} 
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="mt-6 text-xl">
              Show this QR code at our store to pick up your items
            </p>
            <p className="mt-2 text-green-600 font-semibold">
              Payment approved, see you later!
            </p>
          </>
        ) : (
          <p className="text-xl mt-4 text-green-600 font-semibold">
            Payment approved, your order will be delivered soon!
          </p>
        )}
        
        <button 
          className="mt-8 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          onClick={() => window.location.href = '/'}
        >
          Back to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          {cart.map(item => (
            <div key={item.id} className="flex justify-between py-2 border-b">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-600 ml-2">x {item.quantity}</span>
              </div>
              <div>${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Delivery:</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 font-bold text-lg mt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Delivery Options */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Delivery Options</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <input
                  type="radio"
                  id="selfPickup"
                  name="deliveryType"
                  value="SELF_PICKUP"
                  checked={deliveryType === 'SELF_PICKUP'}
                  onChange={() => setDeliveryType('SELF_PICKUP')}
                  className="mr-2"
                />
                <label htmlFor="selfPickup" className="font-medium">
                  Pick up by self
                </label>
              </div>
              
              <div className="flex items-center mb-3">
                <input
                  type="radio"
                  id="delivery"
                  name="deliveryType"
                  value="DELIVERY"
                  checked={deliveryType === 'DELIVERY'}
                  onChange={() => setDeliveryType('DELIVERY')}
                  className="mr-2"
                />
                <label htmlFor="delivery" className="font-medium">
                  Delivery (+$4.00)
                </label>
              </div>
            </div>
            
            {deliveryType === 'DELIVERY' && (
              <div className="mb-6">
                <label 
                  htmlFor="address" 
                  className="block text-gray-700 font-medium mb-2"
                >
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Payment Method</h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="font-bold text-blue-600">PayNow</p>
                <p className="text-sm text-gray-600 mt-1">
                  You'll be redirected to PayNow payment gateway after order confirmation
                </p>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition"
            >
              Confirm Order & Pay
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;