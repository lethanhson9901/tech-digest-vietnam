import React, { useState } from 'react';

const ErrorMessage = ({ 
  message, 
  type = 'error',
  title,
  showRetry = false,
  onRetry,
  dismissible = false,
  onDismiss,
  className = '',
  children
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const handleRetry = () => {
    onRetry?.();
  };

  if (isDismissed) {
    return null;
  }

  const variants = {
    error: {
      bgColor: 'var(--color-accent-rose-light)/10',
      borderColor: 'var(--color-accent-rose)',
      iconColor: 'var(--color-accent-rose)',
      textColor: 'var(--color-accent-rose-dark)',
      titleColor: 'var(--color-accent-rose-dark)',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    warning: {
      bgColor: 'var(--color-accent-orange-light)/10',
      borderColor: 'var(--color-accent-orange)',
      iconColor: 'var(--color-accent-orange)',
      textColor: 'var(--color-accent-orange-dark)',
      titleColor: 'var(--color-accent-orange-dark)',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    info: {
      bgColor: 'var(--color-primary-50)',
      borderColor: 'var(--color-primary-400)',
      iconColor: 'var(--color-primary-500)',
      textColor: 'var(--color-primary-700)',
      titleColor: 'var(--color-primary-800)',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    success: {
      bgColor: 'var(--color-accent-emerald-light)/10',
      borderColor: 'var(--color-accent-emerald)',
      iconColor: 'var(--color-accent-emerald)',
      textColor: 'var(--color-accent-emerald-dark)',
      titleColor: 'var(--color-accent-emerald-dark)',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    network: {
      bgColor: 'var(--color-neutral-50)',
      borderColor: 'var(--color-neutral-400)',
      iconColor: 'var(--color-neutral-600)',
      textColor: 'var(--color-neutral-700)',
      titleColor: 'var(--color-neutral-800)',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      )
    }
  };

  const variant = variants[type] || variants.error;

  const getDefaultTitle = () => {
    switch (type) {
      case 'warning':
        return 'Cảnh báo';
      case 'info':
        return 'Thông tin';
      case 'success':
        return 'Thành công';
      case 'network':
        return 'Lỗi kết nối';
      default:
        return 'Có lỗi xảy ra';
    }
  };

  return (
    <div 
      className={`rounded-xl border-l-4 p-6 shadow-lg transition-all duration-300 animate-fadeIn ${className}`}
      style={{
        background: variant.bgColor,
        borderLeftColor: variant.borderColor,
        boxShadow: 'var(--shadow-primary)'
      }}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <div 
          className="flex-shrink-0 transition-transform duration-200 hover:scale-110"
          style={{ color: variant.iconColor }}
        >
          {variant.icon}
        </div>
        
        <div className="ml-4 flex-1">
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: variant.titleColor }}
          >
            {title || getDefaultTitle()}
          </h3>
          
          <div 
            className="text-base leading-relaxed"
            style={{ color: variant.textColor }}
          >
            {message}
          </div>

          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
          
          {showRetry && onRetry && (
            <div className="mt-4 flex items-center space-x-3">
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  background: variant.borderColor,
                  color: 'white',
                  focusRingColor: variant.borderColor
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Thử lại
              </button>
              
              {type === 'network' && (
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-80"
                  style={{
                    background: 'transparent',
                    color: variant.textColor,
                    border: `1px solid ${variant.borderColor}`
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Tải lại trang
                </button>
              )}
            </div>
          )}
        </div>
        
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-4 flex-shrink-0 p-1 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ 
              color: variant.iconColor,
              focusRingColor: variant.borderColor
            }}
            aria-label="Đóng thông báo"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Specialized error components
export const NetworkError = ({ onRetry, ...props }) => (
  <ErrorMessage
    type="network"
    title="Không thể kết nối"
    message="Vui lòng kiểm tra kết nối internet và thử lại."
    showRetry={true}
    onRetry={onRetry}
    {...props}
  />
);

export const NotFoundError = ({ message = "Không tìm thấy nội dung bạn đang tìm kiếm.", ...props }) => (
  <ErrorMessage
    type="warning"
    title="Không tìm thấy"
    message={message}
    {...props}
  />
);

export const ValidationError = ({ message, ...props }) => (
  <ErrorMessage
    type="warning"
    title="Dữ liệu không hợp lệ"
    message={message}
    {...props}
  />
);

export const SuccessMessage = ({ message, ...props }) => (
  <ErrorMessage
    type="success"
    title="Thành công"
    message={message}
    dismissible={true}
    {...props}
  />
);

export default ErrorMessage;
