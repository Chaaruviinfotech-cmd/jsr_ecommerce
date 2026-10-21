import React from 'react';

/**
 * Reusable Button Component
 * Variants: 'primary' (solid green), 'outline' (green outline), 'whatsapp' (whatsapp green), 'danger', 'ghost'
 * Sizes: 'sm', 'md', 'lg'
 */
const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none select-none cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-[#15803d] hover:bg-[#166534] text-white shadow-sm hover:shadow active:scale-[0.98]',
    outline: 'border border-[#15803d] text-[#15803d] hover:bg-[#f0fdf4] active:scale-[0.98]',
    whatsapp: 'bg-[#25D366] hover:bg-[#20ba59] text-white shadow-sm hover:shadow active:scale-[0.98]',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm active:scale-[0.98]',
    ghost: 'text-gray-700 hover:bg-gray-100'
  };

  const disabledStyles = 'opacity-55 cursor-not-allowed pointer-events-none';
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`jsr-btn jsr-btn-${variant} jsr-btn-${size} ${widthStyles} ${className} ${disabled || isLoading ? disabledStyles : ''}`}
      {...props}
    >
      {isLoading ? (
        <span className="jsr-btn-spinner" aria-hidden="true" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="jsr-btn-icon">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="jsr-btn-icon">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
