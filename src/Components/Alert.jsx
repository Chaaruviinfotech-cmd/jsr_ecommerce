import React, { useEffect } from 'react';
import { IoCheckmarkCircle, IoWarning, IoAlertCircle, IoInformationCircle, IoClose } from 'react-icons/io5';

/**
 * Reusable Alert Component
 * Supports 'success', 'error', 'warning', 'info'
 * Inline banner or toast with auto-dismiss
 */
const Alert = ({
  type = 'info', // 'success', 'error', 'warning', 'info'
  title = '',
  message = '',
  onClose = null,
  autoClose = false,
  autoCloseDuration = 4000,
  className = ''
}) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDuration, onClose]);

  const config = {
    success: {
      icon: <IoCheckmarkCircle className="jsr-alert-icon text-emerald-600" size={20} />,
      bgClass: 'jsr-alert-success',
      borderClass: 'border-emerald-300',
      title: title || 'Success'
    },
    error: {
      icon: <IoAlertCircle className="jsr-alert-icon text-rose-600" size={20} />,
      bgClass: 'jsr-alert-error',
      borderClass: 'border-rose-300',
      title: title || 'Error'
    },
    warning: {
      icon: <IoWarning className="jsr-alert-icon text-amber-600" size={20} />,
      bgClass: 'jsr-alert-warning',
      borderClass: 'border-amber-300',
      title: title || 'Attention'
    },
    info: {
      icon: <IoInformationCircle className="jsr-alert-icon text-blue-600" size={20} />,
      bgClass: 'jsr-alert-info',
      borderClass: 'border-blue-300',
      title: title || 'Information'
    }
  };

  const current = config[type] || config.info;

  return (
    <div className={`jsr-alert ${current.bgClass} ${current.borderClass} ${className}`} role="alert">
      <div className="jsr-alert-left">
        <span className="jsr-alert-icon-wrap">{current.icon}</span>
        <div className="jsr-alert-content">
          {current.title && <span className="jsr-alert-title">{current.title}</span>}
          {message && <p className="jsr-alert-message">{message}</p>}
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="jsr-alert-close-btn"
          aria-label="Close alert"
        >
          <IoClose size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
