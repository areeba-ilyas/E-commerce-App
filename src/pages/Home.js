// src/pages/Home.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import products from '../data/products';

const Home = ({ addToCart }) => {
  const [featuredProducts] = useState(products.slice(0, 3));

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to ShopEasy</h1>
          <p>Find the best products at amazing prices</p>
          <Link to="/products" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">${product.price.toFixed(2)}</p>
                <div className="product-actions">
                  <button 
                    className="btn btn-add" 
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <Link 
                    to={`/product/${product.id}`} 
                    className="btn btn-view"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;