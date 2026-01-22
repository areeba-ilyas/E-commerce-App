// src/App.js
import React, { useState, useEffect } from 'react';
import productsData from './data/products';
import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productsPerPage = 12;
  
  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  
  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Categories
  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Gaming'];

  // Get products by category
  const getProductsByCategory = (category) => {
    if (category === 'All') return productsData;
    return productsData.filter(p => p.category === category);
  };

  // Filter products
  const filteredProducts = getProductsByCategory(selectedCategory).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    return matchesSearch && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'new': return b.id - a.id;
      default: return b.featured - a.featured;
    }
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Calculate price range for category
  const getPriceRangeForCategory = (category) => {
    const productsInCategory = getProductsByCategory(category);
    const prices = productsInCategory.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  // Update price range when category changes
  useEffect(() => {
    const range = getPriceRangeForCategory(selectedCategory);
    setMinPrice(Math.floor(range.min));
    setMaxPrice(Math.ceil(range.max));
    setCurrentPage(1); // Reset to first page
  }, [selectedCategory]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    alert(`✅ ${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setPage('products');
    setSearchTerm('');
  };

  // Render current page
  const renderPage = () => {
    switch(page) {
      case 'home':
        return (
          <div className="page home-page">
            {/* Hero Banner */}
            <div className="hero-banner">
              <div className="hero-content">
                <h1>Welcome to ShopEasy</h1>
                <p>Discover amazing products at unbeatable prices</p>
                <button className="btn-shop" onClick={() => setPage('products')}>
                  Start Shopping →
                </button>
              </div>
            </div>

            {/* Categories Section */}
            <div className="categories-section">
              <h2>Shop by Category</h2>
              <div className="categories-grid">
                <div className="category-card" onClick={() => handleCategorySelect('Electronics')}>
                  <div className="category-icon">📱</div>
                  <h3>Electronics</h3>
                  <p>Smartphones, Laptops, Headphones</p>
                </div>
                <div className="category-card" onClick={() => handleCategorySelect('Fashion')}>
                  <div className="category-icon">👕</div>
                  <h3>Fashion</h3>
                  <p>Clothing, Shoes, Accessories</p>
                </div>
                <div className="category-card" onClick={() => handleCategorySelect('Home')}>
                  <div className="category-icon">🏠</div>
                  <h3>Home & Kitchen</h3>
                  <p>Appliances, Furniture, Decor</p>
                </div>
                <div className="category-card" onClick={() => handleCategorySelect('Gaming')}>
                  <div className="category-icon">🎮</div>
                  <h3>Gaming</h3>
                  <p>Consoles, Games, Accessories</p>
                </div>
              </div>
            </div>

            {/* Featured Products */}
            <div className="featured-section">
              <h2>🔥 Featured Products</h2>
              <div className="products-grid">
                {productsData.filter(p => p.featured).slice(0, 8).map(product => (
                  <div key={product.id} className="product-card">
                    {product.discount > 0 && (
                      <div className="discount-badge">{product.discount}% OFF</div>
                    )}
                    <div className="product-img">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-rating">
                        <span className="stars">{renderStars(product.rating)}</span>
                        <span className="rating-count">({product.reviews})</span>
                      </div>
                      <div className="product-price">
                        <span className="current-price">${product.price.toFixed(2)}</span>
                        {product.originalPrice > product.price && (
                          <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <button className="btn-add" onClick={() => addToCart(product)}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="page products-page">
            <div className="page-header">
              <h1>{selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Products`}</h1>
              <p>{sortedProducts.length} products found</p>
            </div>

            <div className="products-container">
              {/* Filters */}
              <div className="filters-panel">
                <div className="filter-section">
                  <h3>Search</h3>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-box"
                  />
                </div>

                <div className="filter-section">
                  <h3>Categories</h3>
                  <div className="category-list">
                    {categories.map(category => (
                      <div 
                        key={category}
                        className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                        <span className="count">({getProductsByCategory(category).length})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="filter-section">
                  <h3>Price Range</h3>
                  <div className="price-range">
                    <div className="price-inputs">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        min="0"
                      />
                      <span>to</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        max="5000"
                      />
                    </div>
                    <div className="price-display">
                      ${minPrice} - ${maxPrice}
                    </div>
                  </div>
                </div>

                <div className="filter-section">
                  <h3>Sort By</h3>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="new">Newest First</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="products-content">
                {currentProducts.length > 0 ? (
                  <>
                    <div className="products-grid">
                      {currentProducts.map(product => (
                        <div key={product.id} className="product-card">
                          {product.discount > 0 && (
                            <div className="discount-badge">{product.discount}% OFF</div>
                          )}
                          <div className="product-img">
                            <img src={product.image} alt={product.name} />
                          </div>
                          <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <div className="product-rating">
                              <span className="stars">{renderStars(product.rating)}</span>
                              <span className="rating-count">({product.reviews})</span>
                            </div>
                            <div className="product-price">
                              <span className="current-price">${product.price.toFixed(2)}</span>
                              {product.originalPrice > product.price && (
                                <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                              )}
                            </div>
                            <div className="product-actions">
                              <button className="btn-add" onClick={() => addToCart(product)}>
                                Add to Cart
                              </button>
                              <button className="btn-view" onClick={() => {
                                setSelectedProduct(product);
                                setPage('product-detail');
                              }}>
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="pagination">
                        <button 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="page-btn"
                        >
                          ← Previous
                        </button>
                        
                        <div className="page-numbers">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                            <button
                              key={num}
                              onClick={() => setCurrentPage(num)}
                              className={`page-number ${currentPage === num ? 'active' : ''}`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                        
                        <button 
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="page-btn"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="no-products">
                    <p>No products found. Try changing your filters.</p>
                    <button 
                      className="btn-reset"
                      onClick={() => {
                        setSelectedCategory('All');
                        setSearchTerm('');
                        setMinPrice(0);
                        setMaxPrice(5000);
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'product-detail':
        if (!selectedProduct) return null;
        
        return (
          <div className="page product-detail-page">
            <button className="btn-back" onClick={() => setPage('products')}>
              ← Back to Products
            </button>
            
            <div className="product-detail-container">
              <div className="product-images">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              
              <div className="product-detail-info">
                <h1>{selectedProduct.name}</h1>
                <div className="product-meta">
                  <div className="rating">
                    {renderStars(selectedProduct.rating)} ({selectedProduct.reviews} reviews)
                  </div>
                  <div className="category-tag">{selectedProduct.category}</div>
                </div>
                
                <div className="price-section">
                  {selectedProduct.discount > 0 && (
                    <div className="discount-tag">{selectedProduct.discount}% OFF</div>
                  )}
                  <div className="current-price">${selectedProduct.price.toFixed(2)}</div>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <div className="original-price">${selectedProduct.originalPrice.toFixed(2)}</div>
                  )}
                </div>
                
                <div className="product-description">
                  <h3>Description</h3>
                  <p>{selectedProduct.description}</p>
                </div>
                
                <div className="product-stock">
                  {selectedProduct.stock > 10 ? (
                    <span className="in-stock">✅ In Stock ({selectedProduct.stock} available)</span>
                  ) : selectedProduct.stock > 0 ? (
                    <span className="low-stock">⚠️ Only {selectedProduct.stock} left!</span>
                  ) : (
                    <span className="out-of-stock">❌ Out of Stock</span>
                  )}
                </div>
                
                <div className="product-actions-detail">
                  <button 
                    className="btn-add-cart" 
                    onClick={() => addToCart(selectedProduct)}
                    disabled={selectedProduct.stock === 0}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="btn-buy-now"
                    onClick={() => {
                      addToCart(selectedProduct);
                      setPage('cart');
                    }}
                    disabled={selectedProduct.stock === 0}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'cart':
        return (
          <div className="page cart-page">
            <h1>🛒 Your Shopping Cart</h1>
            
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <button className="btn-primary" onClick={() => setPage('products')}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p>{item.category}</p>
                        <div className="cart-item-price">${item.price.toFixed(2)}</div>
                      </div>
                      <div className="cart-item-quantity">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className="cart-item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button 
                        className="btn-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="cart-summary">
                  <h2>Order Summary</h2>
                  <div className="summary-row">
                    <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>$5.00</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>${(calculateTotal() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${(calculateTotal() + 5 + calculateTotal() * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <button className="btn-checkout" onClick={() => setPage('checkout')}>
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        );

      case 'checkout':
        return (
          <div className="page checkout-page">
            <h1>✅ Checkout</h1>
            <div className="checkout-form">
              <h2>Shipping Information</h2>
              <input type="text" placeholder="Full Name" />
              <input type="email" placeholder="Email" />
              <input type="text" placeholder="Address" />
              <input type="text" placeholder="City" />
              <input type="text" placeholder="Zip Code" />
              
              <h2>Payment Information</h2>
              <input type="text" placeholder="Card Number" />
              <input type="text" placeholder="Expiry Date" />
              <input type="text" placeholder="CVV" />
              
              <button className="btn-place-order" onClick={() => {
                alert('Order placed successfully!');
                setCart([]);
                setPage('home');
              }}>
                Place Order
              </button>
            </div>
          </div>
        );

      default:
        return <div>Home Page</div>;
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo" onClick={() => setPage('home')}>
            🛍️ ShopEasy
          </div>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchTerm) {
                  setPage('products');
                }
              }}
            />
            <button onClick={() => setPage('products')}>🔍</button>
          </div>
          
          <nav className="nav">
            <button onClick={() => setPage('home')}>Home</button>
            <button onClick={() => setPage('products')}>Products</button>
            <button onClick={() => setPage('cart')} className="cart-btn">
              Cart {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ShopEasy</h3>
            <p>Your trusted online shopping destination</p>
          </div>
          <div className="footer-section">
            <h3>Categories</h3>
            <div className="footer-categories">
              <button onClick={() => handleCategorySelect('Electronics')}>Electronics</button>
              <button onClick={() => handleCategorySelect('Fashion')}>Fashion</button>
              <button onClick={() => handleCategorySelect('Home')}>Home</button>
              <button onClick={() => handleCategorySelect('Gaming')}>Gaming</button>
            </div>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@shopeasy.com</p>
            <p>Phone: +1 234 567 890</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 ShopEasy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;