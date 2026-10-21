import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

/**
 * Reusable Modal Component
 * Supports custom header, body, footer, smooth animation, backdrop blur, ESC close
 */
const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  footer = null,
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  hideCloseButton = false,
  className = ''
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="jsr-modal-overlay" onClick={onClose}>
      <div
        className={`jsr-modal-container jsr-modal-${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="jsr-modal-header">
          {title && <h3 className="jsr-modal-title">{title}</h3>}
          {!hideCloseButton && (
            <button
              type="button"
              className="jsr-modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <IoClose size={22} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="jsr-modal-body">{children}</div>

        {/* Footer */}
        {footer && <div className="jsr-modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
