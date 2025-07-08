import React, { useState } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity
    });
    setQuantity(1);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
      <div className="bg-gray-200 h-48 flex items-center justify-center">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg">{product.name}</h3>
        <p className="text-gray-600">{product.description}</p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-xl">${product.price.toFixed(2)}</span>
          <span className={`px-2 py-1 rounded ${
            product.stock > 10 ? 'bg-green-100 text-green-800' : 
            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        
        <div className="flex mt-4">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="border rounded-l px-3 py-2 w-20"
          />
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`bg-blue-600 text-white px-4 py-2 rounded-r w-full ${
              product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;