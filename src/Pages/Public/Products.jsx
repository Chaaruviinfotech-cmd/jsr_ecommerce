import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoSearchOutline, IoFilterOutline } from 'react-icons/io5';
import { getProducts, getCategories } from '../../Services/Actions/getApis';
import { addToCart } from '../../Services/Actions/postApis';
import Loader from '../../Components/Loader';

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, categories, isLoading } = useSelector((state) => state.product);

  const initialCat = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
    if (searchParams.get('search')) {
      setSearchTerm(searchParams.get('search'));
    }
  }, [searchParams]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart(product, 1, product.unit));
  };

  const filtered = products.filter((p) => {
    const matchesCat =
      selectedCategory === 'all' ||
      p.category_slug === selectedCategory ||
      (selectedCategory === 'vegetables' && (p.category_id === 1 || p.category_slug === 'vegetables')) ||
      (selectedCategory === 'fruits' && (p.category_id === 2 || p.category_slug === 'fruits')) ||
      (selectedCategory === 'mushroom' && (p.category_id === 3 || p.category_slug === 'mushroom')) ||
      (selectedCategory === 'farm-fresh' && (p.category_id === 4 || p.category_slug === 'farm-fresh'));

    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCat && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="jsr-products-page py-6">
      <div className="jsr-container">
        {/* Breadcrumb */}
        <div className="jsr-breadcrumb mb-2">Home &gt; Catalog</div>
        <h1 className="jsr-products-title mb-4">Our Fresh Farm Collection</h1>

        {/* Round Circular Categories Row */}
        <div className="jsr-round-categories-row jsr-mb-6">
          <div
            className={`jsr-round-cat-item ${selectedCategory === 'all' ? 'jsr-round-cat-active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <div className="jsr-round-cat-avatar-wrap jsr-round-cat-all-wrap">
              <span className="jsr-all-icon">🧺</span>
              {selectedCategory === 'all' && <span className="jsr-round-cat-indicator">✓</span>}
            </div>
            <span className="jsr-round-cat-label">All Items</span>
            <small className="jsr-round-cat-count">{products.length} Products</small>
          </div>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <div
                key={cat.id}
                className={`jsr-round-cat-item ${isSelected ? 'jsr-round-cat-active' : ''}`}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                <div className="jsr-round-cat-avatar-wrap">
                  <img src={cat.image} alt={cat.name} className="jsr-round-cat-avatar" />
                  {isSelected && <span className="jsr-round-cat-indicator">✓</span>}
                </div>
                <span className="jsr-round-cat-label">{cat.name}</span>
                <small className="jsr-round-cat-count">{cat.product_count || 6}+ Items</small>
              </div>
            );
          })}
        </div>

        {/* Filter bar */}
        <div className="jsr-catalog-filter-bar">
          <div className="jsr-search-input-group flex-1">
            <IoSearchOutline size={18} className="jsr-search-input-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name..."
              className="jsr-search-input"
            />
          </div>

          <div className="jsr-products-filters">
            <button
              type="button"
              className={`jsr-filter-pill ${selectedCategory === 'all' ? 'jsr-pill-active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`jsr-filter-pill ${selectedCategory === cat.slug ? 'jsr-pill-active' : ''}`}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                {cat.name}
              </button>
            ))}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="jsr-filter-select"
            >
              <option value="default">Sort By ▾</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <Loader text="Loading fresh catalog..." />
        ) : (
          <div className="jsr-products-grid mt-6">
            {sorted.map((product) => (
              <div
                key={product.id}
                className="jsr-product-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {product.original_price > product.price && (
                  <span className="jsr-discount-pill">
                    {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                  </span>
                )}

                <div className="jsr-product-img-box">
                  <img src={product.image} alt={product.name} loading="lazy" />
                </div>

                <div className="jsr-product-info">
                  <h4 className="jsr-product-name">{product.name}</h4>
                  <div className="jsr-product-pricing">
                    <span className="jsr-product-price">₹{product.price}</span>
                    <span className="jsr-product-unit">/ {product.unit}</span>
                  </div>

                  <button
                    type="button"
                    className="jsr-add-to-cart-btn"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {sorted.length === 0 && !isLoading && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No products found matching your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
