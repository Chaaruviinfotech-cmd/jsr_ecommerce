import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoAddOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoSearchOutline,
  IoImagesOutline,
  IoCloudUploadOutline,
  IoStarOutline,
  IoStar,
  IoLayersOutline,
  IoPricetagOutline,
  IoCubeOutline,
  IoScaleOutline,
  IoDocumentTextOutline,
  IoSparklesOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoArrowUndoOutline,
  IoSaveOutline
} from 'react-icons/io5';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Loader from '../../Components/Loader';
import ImageGalleryModal from '../../Components/ImageGalleryModal';
import { getProducts, getCategories } from '../../Services/Actions/getApis';
import { addProduct, updateProduct, deleteProduct } from '../../Services/Actions/postApis';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, categories, isLoading } = useSelector((state) => state.product);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category_id: 1,
    price: '',
    original_price: '',
    unit: '1 kg',
    stock: 100,
    image: '',
    description: '',
    is_best_seller: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      category_id: 1,
      price: '',
      original_price: '',
      unit: '1 kg',
      stock: 100,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      description: '',
      is_best_seller: 0
    });
    setShowManualUrl(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category_id: product.category_id || 1,
      price: product.price,
      original_price: product.original_price || product.price,
      unit: product.unit || '1 kg',
      stock: product.stock !== undefined ? product.stock : 100,
      image: product.image || '',
      description: product.description || '',
      is_best_seller: product.is_best_seller ? 1 : 0
    });
    setShowManualUrl(false);
    setIsEditModalOpen(true);
  };

  // Local file upload for product image
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result;
      if (dataUrl) {
        setFormData((prev) => ({ ...prev, image: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGallerySelect = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleSaveNew = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    await dispatch(addProduct(formData));
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    await dispatch(updateProduct({ ...formData, id: editingId }));
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProduct(id));
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      categoryFilter === 'all' ? true : Number(p.category_id) === Number(categoryFilter);
    return matchesSearch && matchesCat;
  });

  // Calculate discount percentage if original_price is greater than price
  const calculateDiscount = () => {
    const p = parseFloat(formData.price);
    const op = parseFloat(formData.original_price);
    if (op && p && op > p) {
      return Math.round(((op - p) / op) * 100);
    }
    return 0;
  };

  const discountPercent = calculateDiscount();

  // Reusable Product Form Fields for Add & Edit
  const renderProductFormFields = () => (
    <div className="jsr-modern-form-wrapper">
      {/* 1. MEDIA & IMAGE SELECTION (ENHANCED GALLERY) */}
      <div className="jsr-form-section-card jsr-media-section">
        <div className="jsr-section-header-compact">
          <IoImagesOutline size={18} className="text-emerald-700" />
          <span>Product Image &amp; Media</span>
          <span className="jsr-badge-pill-soft">Gallery Supported</span>
        </div>

        <div className="jsr-product-image-picker-box">
          <div className="jsr-product-img-preview-frame">
            {formData.image ? (
              <img
                src={formData.image}
                alt={formData.name || 'Product Preview'}
                className="jsr-product-preview-thumb"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="jsr-product-preview-placeholder">
                <IoImagesOutline size={36} />
                <span>No Image Selected</span>
              </div>
            )}
          </div>

          <div className="jsr-product-img-controls">
            <p className="jsr-img-control-tip">
              Select produce from our high-resolution image gallery, upload directly from your device, or paste a link.
            </p>

            <div className="jsr-img-action-buttons">
              <button
                type="button"
                className="jsr-btn-gallery-select"
                onClick={() => setIsGalleryOpen(true)}
              >
                <IoImagesOutline size={18} />
                <span>Choose from Produce Gallery</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                id="jsr-prod-file-input"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="jsr-hidden-file-input"
                onChange={handleFileUpload}
              />
              <label htmlFor="jsr-prod-file-input" className="jsr-btn-device-upload">
                <IoCloudUploadOutline size={18} />
                <span>Upload from Device</span>
              </label>

              <button
                type="button"
                className="jsr-btn-text-toggle"
                onClick={() => setShowManualUrl(!showManualUrl)}
              >
                {showManualUrl ? 'Hide URL Input' : 'Or Paste Custom URL'}
              </button>
            </div>

            {showManualUrl && (
              <div className="jsr-form-group jsr-mt-2 jsr-animate-fade">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="jsr-input jsr-input-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. BASIC DETAILS */}
      <div className="jsr-form-section-card jsr-mt-3">
        <div className="jsr-section-header-compact">
          <IoDocumentTextOutline size={18} className="text-emerald-700" />
          <span>Basic Information</span>
        </div>

        <div className="jsr-form-grid-2 jsr-mt-2">
          <div className="jsr-form-group">
            <label>Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Fresh Oyster Mushroom"
              className="jsr-input"
            />
          </div>

          <div className="jsr-form-group">
            <label>Category *</label>
            <div className="jsr-select-wrapper">
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                className="jsr-input"
              >
                {categories && categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value={1}>Fresh Vegetables</option>
                    <option value={2}>Fresh Fruits</option>
                    <option value={3}>Fresh Mushroom</option>
                    <option value={4}>Farm Fresh</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="jsr-form-grid-2 jsr-mt-3">
          <div className="jsr-form-group">
            <label>Standard Unit / Packing *</label>
            <div className="jsr-input-with-icon">
              <IoScaleOutline className="jsr-field-icon" size={18} />
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g. 1 kg, 500 gm, 200 gm"
                className="jsr-input jsr-input-padded"
              />
            </div>
            {/* Quick unit pills */}
            <div className="jsr-unit-chips-row">
              {['200 gm', '500 gm', '1 kg', '2 kg', '1 Dozen', '1 piece'].map((u) => (
                <button
                  key={u}
                  type="button"
                  className={`jsr-chip-pill ${formData.unit === u ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, unit: u })}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="jsr-form-group">
            <label>Stock Quantity (Units Available)</label>
            <div className="jsr-input-with-icon">
              <IoCubeOutline className="jsr-field-icon" size={18} />
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                placeholder="100"
                className="jsr-input jsr-input-padded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRICING & BADGES */}
      <div className="jsr-form-section-card jsr-mt-3">
        <div className="jsr-section-header-compact">
          <IoPricetagOutline size={18} className="text-emerald-700" />
          <span>Pricing &amp; Promotion</span>
        </div>

        <div className="jsr-form-grid-3 jsr-mt-2">
          <div className="jsr-form-group">
            <label>Selling Price (₹) *</label>
            <div className="jsr-input-with-icon">
              <span className="jsr-currency-prefix">₹</span>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="60"
                className="jsr-input jsr-input-padded"
              />
            </div>
          </div>

          <div className="jsr-form-group">
            <label>Original / Strike Price (₹)</label>
            <div className="jsr-input-with-icon">
              <span className="jsr-currency-prefix">₹</span>
              <input
                type="number"
                step="any"
                min="1"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                placeholder="67"
                className="jsr-input jsr-input-padded"
              />
            </div>
            {discountPercent > 0 && (
              <span className="jsr-discount-preview-tag">
                🔥 {discountPercent}% OFF Customer Savings
              </span>
            )}
          </div>

          <div className="jsr-form-group">
            <label>Best Seller Status</label>
            <button
              type="button"
              className={`jsr-bestseller-toggle-card ${formData.is_best_seller ? 'is-active' : ''}`}
              onClick={() =>
                setFormData({
                  ...formData,
                  is_best_seller: formData.is_best_seller ? 0 : 1
                })
              }
            >
              {formData.is_best_seller ? (
                <>
                  <IoStar size={20} className="text-amber-500" />
                  <span>★ Marked Best Seller</span>
                </>
              ) : (
                <>
                  <IoStarOutline size={20} className="text-slate-400" />
                  <span>Standard Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. DESCRIPTION */}
      <div className="jsr-form-section-card jsr-mt-3">
        <div className="jsr-section-header-compact">
          <IoDocumentTextOutline size={18} className="text-emerald-700" />
          <span>Product Description</span>
        </div>

        <div className="jsr-form-group jsr-mt-2">
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Fresh farm harvested, organic, pesticide free superfood direct from local growers..."
            className="jsr-input jsr-textarea"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="jsr-admin-products-page">
      {/* Subbar with search and category filters */}
      <div className="jsr-admin-subbar">
        <div className="jsr-subbar-left-controls">
          <div className="jsr-search-input-group jsr-subbar-search">
            <IoSearchOutline size={18} className="jsr-search-input-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search produce name..."
              className="jsr-search-input"
            />
          </div>

          <div className="jsr-category-filter-select">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="jsr-subbar-select"
            >
              <option value="all">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          variant="primary"
          icon={<IoAddOutline size={20} />}
          onClick={handleOpenAdd}
        >
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <Loader text="Loading products inventory..." />
      ) : (
        <div className="jsr-table-card">
          <div className="jsr-table-responsive">
            <table className="jsr-admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Unit</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="jsr-table-prod-cell">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="jsr-table-prod-thumb"
                        />
                        <div className="jsr-table-prod-meta">
                          <strong className="jsr-prod-title">{product.name}</strong>
                          <span className="jsr-prod-id">ID: #{product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="jsr-badge-category">
                        {product.category_name || (product.category_id === 3 ? 'Fresh Mushroom' : 'Vegetables')}
                      </span>
                    </td>
                    <td>
                      <div className="jsr-table-price-col">
                        <strong className="jsr-price-highlight ">₹{product.price} </strong>
                        {product.original_price && Number(product.original_price) > Number(product.price) && (
                          <span className="jsr-table-strike-price"> / ₹{product.original_price}</span>
                        )}
                      </div>
                    </td>
                    <td>{product.unit}</td>
                    <td>
                      <span className="jsr-badge-stock">
                        {product.stock || 100} in stock
                      </span>
                    </td>
                    <td>
                      {product.is_best_seller ? (
                        <span className="jsr-badge-bestseller">
                          ★ Best Seller
                        </span>
                      ) : (
                        <span className="jsr-text-dim">Standard</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="jsr-action-icon-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(product)}
                          className="jsr-action-btn-edit"
                          title="Edit Product"
                          aria-label="Edit product"
                        >
                          <IoPencilOutline size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="jsr-action-btn-del"
                          title="Delete Product"
                          aria-label="Delete product"
                        >
                          <IoTrashOutline size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          ADD PRODUCT MODAL WITH GALLERY INTEGRATION
      -------------------------------------------------------------- */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Produce Product"
        size="lg"
      >
        <form onSubmit={handleSaveNew} className="jsr-modal-form">
          {renderProductFormFields()}

          <div className="jsr-modal-btn-row jsr-mt-4">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<IoSaveOutline size={18} />}>
              Save Product to Catalog
            </Button>
          </div>
        </form>
      </Modal>

      {/* -------------------------------------------------------------
          EDIT PRODUCT MODAL WITH GALLERY INTEGRATION
      -------------------------------------------------------------- */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Product: ${formData.name || ''}`}
        size="lg"
      >
        <form onSubmit={handleSaveEdit} className="jsr-modal-form">
          {renderProductFormFields()}

          <div className="jsr-modal-btn-row jsr-mt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<IoSaveOutline size={18} />}>
              Update Product Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* -------------------------------------------------------------
          IMAGE GALLERY SELECTOR MODAL
      -------------------------------------------------------------- */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectImage={handleGallerySelect}
        currentImage={formData.image}
      />
    </div>
  );
};

export default AdminProducts;
