import React, { useState, useMemo, useRef } from 'react';
import {
  IoSearchOutline,
  IoCheckmarkCircle,
  IoCloudUploadOutline,
  IoImageOutline,
  IoCloseOutline,
  IoSparklesOutline,
  IoLinkOutline
} from 'react-icons/io5';
import Modal from './Modal';
import Button from './Button';
import { PRODUCE_GALLERY, GALLERY_CATEGORIES } from '../Services/Helper/ProduceGalleryService';

const ImageGalleryModal = ({ isOpen, onClose, onSelectImage, currentImage }) => {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [previewUpload, setPreviewUpload] = useState(null);
  const fileInputRef = useRef(null);

  // Filter gallery items by category and search query
  const filteredGallery = useMemo(() => {
    let list = PRODUCE_GALLERY;
    if (selectedCat !== 'all') {
      list = list.filter((item) => item.category === selectedCat);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCat, searchQuery]);

  // Handle local file upload
  const handleLocalFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      const dataUrl = uploadEvt.target?.result;
      if (dataUrl) {
        setPreviewUpload(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUpload = () => {
    if (previewUpload) {
      onSelectImage(previewUpload);
      onClose();
    }
  };

  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onSelectImage(customUrl.trim());
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Produce Image Gallery & Selector"
      size="lg"
    >
      <div className="jsr-gallery-modal-container">
        {/* Top Header info */}
        <div className="jsr-gallery-header-sub">
          <p>
            Choose a high-resolution farm produce image from our curated gallery, upload directly from your device, or paste a link.
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="jsr-gallery-toolbar">
          <div className="jsr-gallery-search-box">
            <IoSearchOutline size={18} className="jsr-gallery-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search produce (e.g. Tomato, Mushroom, Apple, Palak)..."
              className="jsr-gallery-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="jsr-gallery-clear-search"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <IoCloseOutline size={18} />
              </button>
            )}
          </div>

          <div className="jsr-gallery-cat-tabs">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`jsr-gallery-tab-btn ${selectedCat === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Image Grid */}
        <div className="jsr-gallery-scroll-area">
          {filteredGallery.length > 0 ? (
            <div className="jsr-gallery-grid">
              {filteredGallery.map((item) => {
                const isSelected = currentImage === item.url;
                return (
                  <div
                    key={item.id}
                    className={`jsr-gallery-card ${isSelected ? 'jsr-gallery-card-selected' : ''}`}
                    onClick={() => {
                      onSelectImage(item.url);
                      onClose();
                    }}
                  >
                    <div className="jsr-gallery-img-wrapper">
                      <img
                        src={item.url}
                        alt={item.title}
                        loading="lazy"
                        className="jsr-gallery-thumbnail"
                      />
                      {isSelected && (
                        <div className="jsr-gallery-selected-badge">
                          <IoCheckmarkCircle size={22} />
                        </div>
                      )}
                      <div className="jsr-gallery-hover-overlay">
                        <span>Select Image</span>
                      </div>
                    </div>
                    <div className="jsr-gallery-card-info">
                      <strong className="jsr-gallery-item-title">{item.title}</strong>
                      <span className="jsr-gallery-item-tag">{item.categoryLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="jsr-gallery-empty-state">
              <IoImageOutline size={42} className="jsr-gallery-empty-icon" />
              <h5>No produce found matching "{searchQuery}"</h5>
              <p>Try searching for a different item or upload your custom image below.</p>
              <button
                type="button"
                className="jsr-btn-link-action"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCat('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Bottom Upload & Direct Link Bar */}
        <div className="jsr-gallery-footer-bar">
          <div className="jsr-gallery-upload-col">
            <span className="jsr-gallery-foot-label">
              <IoCloudUploadOutline size={16} /> Or Upload From Computer:
            </span>
            <input
              ref={fileInputRef}
              type="file"
              id="jsr-gallery-file-input"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="jsr-hidden-file-input"
              onChange={handleLocalFileSelect}
            />
            <div className="jsr-gallery-upload-row">
              <label htmlFor="jsr-gallery-file-input" className="jsr-gallery-pick-file-btn">
                <span>Choose Image File</span>
              </label>
              {previewUpload && (
                <div className="jsr-gallery-preview-chip">
                  <img src={previewUpload} alt="Uploaded preview" />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleApplyCustomUpload}
                  >
                    Use This Upload
                  </Button>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleApplyCustomUrl} className="jsr-gallery-url-col">
            <span className="jsr-gallery-foot-label">
              <IoLinkOutline size={16} /> Or Paste Image URL:
            </span>
            <div className="jsr-gallery-url-input-wrap">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="jsr-input jsr-gallery-url-input"
              />
              <Button type="submit" variant="primary" size="sm" disabled={!customUrl.trim()}>
                Apply URL
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ImageGalleryModal;
