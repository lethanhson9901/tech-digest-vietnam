import React, { useState, useEffect, createContext, useContext } from 'react';

// Toast Context for managing toasts globally
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      duration: 5000,
      position: 'top-right',
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);

    // Auto dismiss
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
    error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
    warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
    info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
    loading: (message, options = {}) => addToast({ type: 'loading', message, duration: 0, ...options })
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const variants = {
    success: {
      bgColor: 'var(--color-accent-emerald)',
      textColor: 'white',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    error: {
      bgColor: 'var(--color-accent-rose)',
      textColor: 'white',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    warning: {
      bgColor: 'var(--color-accent-orange)',
      textColor: 'white',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    info: {
      bgColor: 'var(--color-primary-500)',
      textColor: 'white',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    loading: {
      bgColor: 'var(--color-neutral-800)',
      textColor: 'white',
      icon: (
        <div className="w-6 h-6 relative">
          <div 
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: 'currentColor',
              borderRightColor: 'currentColor'
            }}
          />
        </div>
      )
    }
  };

  const variant = variants[toast.type] || variants.info;

  return (
    <div
      className={`
        relative flex items-center p-4 mb-3 rounded-xl shadow-lg backdrop-blur-sm
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        ${isExiting ? 'translate-x-full opacity-0 scale-95' : ''}
      `}
      style={{
        background: variant.bgColor,
        color: variant.textColor,
        boxShadow: 'var(--shadow-secondary)',
        minWidth: '320px',
        maxWidth: '480px'
      }}
      role="alert"
      aria-live="assertive"
    >
      {/* Progress bar for timed toasts */}
      {toast.duration > 0 && (
        <div 
          className="absolute bottom-0 left-0 h-1 rounded-b-xl transition-all ease-linear"
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
            width: '100%',
            animation: `shrink ${toast.duration}ms linear`
          }}
        />
      )}

      {/* Icon */}
      <div className="flex-shrink-0 mr-3">
        {variant.icon}
      </div>

      {/* Content */}
      <div className="flex-1 mr-3">
        {toast.title && (
          <div className="font-semibold text-base mb-1">
            {toast.title}
          </div>
        )}
        <div className="text-sm leading-relaxed font-medium">
          {toast.message}
        </div>
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-80"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleRemove}
        className="flex-shrink-0 p-1 rounded-full transition-all duration-200 hover:scale-110 hover:bg-white/20"
        aria-label="Đóng thông báo"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Toast Container Component
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  const positions = {
    'top-right': 'fixed top-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50'
  };

  // Group toasts by position
  const groupedToasts = toasts.reduce((acc, toast) => {
    const position = toast.position || 'top-right';
    if (!acc[position]) acc[position] = [];
    acc[position].push(toast);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div key={position} className={positions[position]}>
          {positionToasts.map(toast => (
            <Toast
              key={toast.id}
              toast={toast}
              onRemove={removeToast}
            />
          ))}
        </div>
      ))}
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </>
  );
};

// Hook for programmatic toast management
export const useToastActions = () => {
  const { addToast, removeToast, removeAllToasts } = useToast();
  
  return {
    showSuccess: (message, options) => addToast({ type: 'success', message, ...options }),
    showError: (message, options) => addToast({ type: 'error', message, ...options }),
    showWarning: (message, options) => addToast({ type: 'warning', message, ...options }),
    showInfo: (message, options) => addToast({ type: 'info', message, ...options }),
    showLoading: (message, options) => addToast({ type: 'loading', message, duration: 0, ...options }),
    dismiss: removeToast,
    dismissAll: removeAllToasts
  };
};

export default Toast; 