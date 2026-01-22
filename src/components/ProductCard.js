
import React from 'react';
import { Link } from 'react-router-dom';


const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="category">{product.category}</p>
        <div className="product-actions">
          <Link to={`/product/${product.id}`} className="btn btn-view">
            View Details
          </Link>
          <button 
            className="btn btn-add" 
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;