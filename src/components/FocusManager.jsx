import React, { useEffect, useRef, useState, createContext, useContext } from 'react';

// Focus management context
const FocusContext = createContext();

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};

// Focus Provider Component
export const FocusProvider = ({ children }) => {
  const [focusHistory, setFocusHistory] = useState([]);
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false);

  useEffect(() => {
    // Detect keyboard usage
    const handleKeyDown = (e) => {
      if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        setIsUsingKeyboard(true);
      }
    };

    const handleMouseDown = () => {
      setIsUsingKeyboard(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const pushFocus = (elementRef) => {
    if (elementRef.current) {
      setFocusHistory(prev => [...prev, document.activeElement]);
      elementRef.current.focus();
    }
  };

  const popFocus = () => {
    const lastElement = focusHistory[focusHistory.length - 1];
    if (lastElement) {
      lastElement.focus();
      setFocusHistory(prev => prev.slice(0, -1));
    }
  };

  const clearFocusHistory = () => {
    setFocusHistory([]);
  };

  const value = {
    isUsingKeyboard,
    focusHistory,
    pushFocus,
    popFocus,
    clearFocusHistory
  };

  return (
    <FocusContext.Provider value={value}>
      <div className={isUsingKeyboard ? 'using-keyboard' : 'using-mouse'}>
        {children}
      </div>
    </FocusContext.Provider>
  );
};

// Skip to main content component
export const SkipToMain = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
      style={{
        background: 'var(--color-primary-600)',
        color: 'white',
        boxShadow: 'var(--shadow-secondary)'
      }}
    >
      Bỏ qua đến nội dung chính
    </a>
  );
};

// Focus trap component for modals/dropdowns
export const FocusTrap = ({ children, active = true, onEscape }) => {
  const containerRef = useRef();
  const firstFocusableRef = useRef();
  const lastFocusableRef = useRef();

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    firstFocusableRef.current = focusableElements[0];
    lastFocusableRef.current = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstFocusableRef.current.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableRef.current) {
          e.preventDefault();
          lastFocusableRef.current.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableRef.current) {
          e.preventDefault();
          firstFocusableRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, onEscape]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};

// Auto-focus component
export const AutoFocus = ({ children, delay = 0 }) => {
  const elementRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (elementRef.current) {
        elementRef.current.focus();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return React.cloneElement(children, { ref: elementRef });
};

// Focus visible only component (shows outline only on keyboard focus)
export const FocusVisible = ({ children, className = '' }) => {
  const { isUsingKeyboard } = useFocus();
  
  return React.cloneElement(children, {
    className: `${className} ${isUsingKeyboard ? 'focus-visible-keyboard' : 'focus-visible-mouse'}`.trim()
  });
};

// Enhanced button with better focus handling
export const FocusButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props 
}) => {
  const { isUsingKeyboard } = useFocus();
  
  const variants = {
    primary: {
      base: 'text-white font-medium transition-all duration-200',
      bg: 'var(--gradient-primary)',
      hover: 'transform hover:scale-105 hover:shadow-lg',
      focus: 'focus:ring-4 focus:ring-offset-2',
      focusColor: 'var(--color-primary-300)',
      disabled: 'opacity-50 cursor-not-allowed'
    },
    secondary: {
      base: 'font-medium transition-all duration-200',
      bg: 'var(--color-neutral-100)',
      color: 'var(--color-neutral-700)',
      border: '1px solid var(--color-neutral-300)',
      hover: 'hover:bg-neutral-50 transform hover:scale-105',
      focus: 'focus:ring-4 focus:ring-offset-2',
      focusColor: 'var(--color-neutral-300)',
      disabled: 'opacity-50 cursor-not-allowed'
    },
    ghost: {
      base: 'font-medium transition-all duration-200',
      bg: 'transparent',
      color: 'var(--color-primary-600)',
      hover: 'hover:bg-primary-50 transform hover:scale-105',
      focus: 'focus:ring-4 focus:ring-offset-2',
      focusColor: 'var(--color-primary-300)',
      disabled: 'opacity-50 cursor-not-allowed'
    }
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm rounded-lg',
    medium: 'px-4 py-2 text-base rounded-xl',
    large: 'px-6 py-3 text-lg rounded-xl'
  };

  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.medium;

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onClick?.(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`
        ${variantStyle.base}
        ${sizeStyle}
        ${disabled ? variantStyle.disabled : variantStyle.hover}
        ${isUsingKeyboard ? variantStyle.focus : ''}
        focus:outline-none
        ${className}
      `}
      style={{
        background: variantStyle.bg,
        color: variantStyle.color,
        border: variantStyle.border,
        ...(isUsingKeyboard && {
          '--tw-ring-color': variantStyle.focusColor
        })
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Enhanced link with better accessibility
export const FocusLink = ({ 
  children, 
  href, 
  external = false,
  className = '',
  ...props 
}) => {
  const { isUsingKeyboard } = useFocus();

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`
        inline-flex items-center font-medium transition-all duration-200
        hover:opacity-80 hover:transform hover:translateY(-1px)
        ${isUsingKeyboard ? 'focus:ring-4 focus:ring-offset-2 focus:ring-primary-300' : ''}
        focus:outline-none rounded-lg px-1 py-0.5
        ${className}
      `}
      style={{ color: 'var(--color-primary-600)' }}
      {...props}
    >
      {children}
      {external && (
        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )}
    </a>
  );
};

// Keyboard shortcut component
export const KeyboardShortcut = ({ keys, onActivate, description }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyCombo = keys.toLowerCase();
      const pressedKeys = [];
      
      if (e.ctrlKey || e.metaKey) pressedKeys.push('ctrl');
      if (e.shiftKey) pressedKeys.push('shift');
      if (e.altKey) pressedKeys.push('alt');
      pressedKeys.push(e.key.toLowerCase());
      
      const pressed = pressedKeys.join('+');
      
      if (pressed === keyCombo || pressed.replace('ctrl', 'meta') === keyCombo) {
        e.preventDefault();
        onActivate();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keys, onActivate]);

  return null; // This component doesn't render anything
};

// Landmark component for better screen reader navigation
export const Landmark = ({ children, role, label, id }) => {
  return (
    <div
      role={role}
      aria-label={label}
      id={id}
      tabIndex={-1}
    >
      {children}
    </div>
  );
};

export default FocusProvider; 