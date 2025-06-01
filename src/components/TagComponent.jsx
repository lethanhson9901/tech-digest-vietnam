import React from 'react';
import PropTypes from 'prop-types';

const TagComponent = ({
  children,
  variant = 'default',
  size = 'medium',
  closable = false,
  onClose,
  className = '',
  onClick,
  ...props
}) => {
  const sizeClasses = {
    small: 'tag-sm',
    medium: '',
    large: 'tag-lg',
    xlarge: 'tag-xl'
  };

  const variantClasses = {
    default: '',
    primary: 'tag-primary',
    secondary: 'tag-secondary',
    success: 'tag-success',
    warning: 'tag-warning',
    danger: 'tag-danger',
    info: 'tag-info'
  };

  const baseClasses = [
    'tag',
    sizeClasses[size],
    variantClasses[variant],
    closable ? 'tag-closable' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (onClick && !closable) {
      onClick(e);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose(e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick && !closable) {
        onClick(e);
      }
    }
    if (e.key === 'Escape' && closable && onClose) {
      onClose(e);
    }
  };

  return (
    <span
      className={baseClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : 'text'}
      tabIndex={onClick ? 0 : -1}
      aria-label={typeof children === 'string' ? children : 'Tag'}
      {...props}
    >
      {children}
      {closable && (
        <button
          className="tag-close"
          onClick={handleClose}
          aria-label={`Remove ${typeof children === 'string' ? children : 'tag'}`}
          tabIndex={-1}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 3L3 9M3 3L9 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

TagComponent.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'info']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default TagComponent; 