import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoAddOutline,
  IoImagesOutline,
  IoCloudUploadOutline,
  IoLayersOutline,
  IoSparklesOutline,
  IoCheckmarkCircle,
  IoPencilOutline,
  IoTrashOutline
} from 'react-icons/io5';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import ImageGalleryModal from '../../Components/ImageGalleryModal';
import { getCategories } from '../../Services/Actions/getApis';
import { createCategory, updateCategory, deleteCategory } from '../../Services/Actions/postApis';

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state) => state.product);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState(
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result;
      if (dataUrl) {
        setCatImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddModal = () => {
    setEditingCat(null);
    setCatName('');
    setCatDesc('');
    setCatImage('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');
    setIsModalOpen(true);
  };

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setCatName(cat.name || '');
    setCatDesc(cat.description || '');
    setCatImage(cat.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');
    setIsModalOpen(true);
  };

  const handleDelete = async (catId, catName) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}" from database?`)) {
      try {
        await dispatch(deleteCategory(catId));
        dispatch(getCategories());
      } catch (err) {
        console.error('Delete category error:', err);
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingCat) {
        await dispatch(updateCategory({
          id: editingCat.id,
          name: catName.trim(),
          description: catDesc.trim(),
          image: catImage
        }));
      } else {
        await dispatch(createCategory({
          name: catName.trim(),
          description: catDesc.trim(),
          image: catImage
        }));
      }
      setIsModalOpen(false);
      setEditingCat(null);
      setCatName('');
      setCatDesc('');
      dispatch(getCategories());
    } catch (err) {
      console.error('Failed to save category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="jsr-admin-categories-page">
      <div className="jsr-admin-subbar">
        <div>
          <h3 className="jsr-page-title">Produce Categories</h3>
          <p className="jsr-subbar-subtext">Manage categories saved dynamically in MySQL database.</p>
        </div>
        <Button
          variant="primary"
          icon={<IoAddOutline size={20} />}
          onClick={handleOpenAddModal}
        >
          Add Category
        </Button>
      </div>

      <div className="jsr-admin-categories-grid jsr-mt-4">
        {categories.map((cat) => (
          <div key={cat.id} className="jsr-admin-cat-card">
            <div className="jsr-admin-cat-img-box">
              <img src={cat.image} alt={cat.name} />
            </div>
            <div className="jsr-admin-cat-info">
              <h4 className="jsr-admin-cat-name">{cat.name}</h4>
              <p className="jsr-admin-cat-count">
                {cat.product_count !== undefined ? `${cat.product_count} Products in catalog` : 'Active catalog'}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                <span className="jsr-badge-stock">Active</span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => handleEdit(cat)}
                    className="jsr-address-edit-btn"
                    title="Edit Category"
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#065f46',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}
                  >
                    <IoPencilOutline size={14} />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="jsr-address-del-btn"
                    title="Delete Category"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#b91c1c',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    <IoTrashOutline size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ENHANCED ATTRACTIVE CATEGORY MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCat(null);
        }}
        title={editingCat ? 'Edit Produce Category' : 'Create Produce Category'}
        size="md"
      >
        <form onSubmit={handleAdd} className="jsr-modal-form">
          {/* Live Preview Card */}
          <div className="jsr-cat-preview-banner">
            <div className="jsr-cat-preview-thumb">
              <img src={catImage} alt={catName || 'Preview'} />
            </div>
            <div className="jsr-cat-preview-text">
              <span className="jsr-preview-label">Live Category Preview</span>
              <strong className="jsr-cat-preview-title">{catName || 'Category Name'}</strong>
              <small>{editingCat ? 'Updating in Database' : 'New Database Record'}</small>
            </div>
          </div>

          <div className="jsr-form-group jsr-mt-2">
            <label>Category Title *</label>
            <div className="jsr-input-with-icon">
              <IoLayersOutline className="jsr-field-icon" size={18} />
              <input
                type="text"
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Exotic Herbs &amp; Microgreens"
                className="jsr-input jsr-input-padded"
              />
            </div>
          </div>

          <div className="jsr-form-group jsr-mt-2">
            <label>Category Description (Optional)</label>
            <input
              type="text"
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              placeholder="e.g. Fresh daily farm harvested greens"
              className="jsr-input"
            />
          </div>

          <div className="jsr-form-group jsr-mt-2">
            <label>Category Thumbnail Image</label>
            <div className="jsr-img-action-buttons">
              <button
                type="button"
                className="jsr-btn-gallery-select"
                onClick={() => setIsGalleryOpen(true)}
              >
                <IoImagesOutline size={18} />
                <span>Select from Gallery</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                id="jsr-cat-file-input"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="jsr-hidden-file-input"
                onChange={handleFileUpload}
              />
              <label htmlFor="jsr-cat-file-input" className="jsr-btn-device-upload">
                <IoCloudUploadOutline size={18} />
                <span>Upload from Device</span>
              </label>
            </div>

            <div className="jsr-input-with-icon jsr-mt-2">
              <input
                type="url"
                value={catImage}
                onChange={(e) => setCatImage(e.target.value)}
                placeholder="Or paste image URL https://..."
                className="jsr-input"
              />
            </div>
          </div>

          <div className="jsr-modal-btn-row jsr-mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingCat(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving to Database...' : editingCat ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectImage={(url) => setCatImage(url)}
        currentImage={catImage}
      />
    </div>
  );
};

export default AdminCategories;
