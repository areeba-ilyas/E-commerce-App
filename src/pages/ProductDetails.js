// src/pages/ProductDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import products from '../data/products';

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/products');
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`${quantity} ${product.name}(s) added to cart!`);
    setQuantity(1);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Back
      </button>
      
      <div className="product-details-container">
        <div className="product-image-large">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-info-large">
          <h1>{product.name}</h1>
          <p className="price">${product.price.toFixed(2)}</p>
          <p className="category">Category: {product.category}</p>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
            </div>
          </div>
          
          <div className="product-actions">
            <button 
              className="btn btn-add-to-cart"
              onClick={handleAddToCart}
            >
              Add {quantity} to Cart - ${(product.price * quantity).toFixed(2)}
            </button>
            
            <button 
              className="btn btn-buy-now"
              onClick={() => {
                handleAddToCart();
                navigate('/cart');
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;