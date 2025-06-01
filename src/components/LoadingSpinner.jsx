import React, { useState, useEffect } from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  variant = 'default',
  text = 'Đang tải...',
  showText = false,
  showProgress = false,
  delay = 0,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(delay === 0);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % 4);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [showProgress]);

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  const loadingSteps = [
    'Đang khởi tạo...',
    'Đang tải dữ liệu...',
    'Đang xử lý...',
    'Sắp hoàn thành...'
  ];

  // Modern tech spinner with gradient
  const TechSpinner = () => (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Background circle */}
      <div 
        className="absolute inset-0 rounded-full border-2 opacity-20"
        style={{ borderColor: 'var(--color-neutral-300)' }}
      />
      
      {/* Primary spinner */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
        style={{
          borderTopColor: 'var(--color-primary-500)',
          borderRightColor: 'var(--color-secondary-500)',
          animation: 'spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
        }}
      />
      
      {/* Secondary spinner */}
      <div 
        className="absolute inset-1 rounded-full border-2 border-transparent animate-spin"
        style={{
          borderTopColor: 'var(--color-accent-orange)',
          animation: 'spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse'
        }}
      />
      
      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          className="w-4 h-4 animate-pulse" 
          style={{ color: 'var(--color-primary-600)' }}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );

  // Pulsing dots spinner
  const DotsSpinner = () => (
    <div className="flex items-center justify-center space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-3 h-3 rounded-full animate-bounce"
          style={{ 
            background: i === 0 ? 'var(--color-primary-500)' : 
                       i === 1 ? 'var(--color-secondary-500)' : 
                       'var(--color-accent-orange)',
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
    </div>
  );

  // Wave animation
  const WaveSpinner = () => (
    <div className="flex items-end justify-center space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-2 rounded-full animate-pulse"
          style={{
            height: `${12 + (i % 2) * 8}px`,
            background: `var(--color-primary-${400 + i * 100})`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.2s'
          }}
        />
      ))}
    </div>
  );

  // Modern minimal spinner
  const MinimalSpinner = () => (
    <div className={`${sizeClasses[size]} relative`}>
      <div 
        className="absolute inset-0 rounded-full border-4 animate-spin"
        style={{
          borderColor: 'var(--color-neutral-200)',
          borderTopColor: 'var(--color-primary-500)',
          animation: 'spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite'
        }}
      />
    </div>
  );

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsSpinner />;
      case 'wave':
        return <WaveSpinner />;
      case 'minimal':
        return <MinimalSpinner />;
      case 'tech':
      default:
        return <TechSpinner />;
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
      role="status" 
      aria-live="polite"
      aria-label={showProgress ? loadingSteps[loadingStep] : text}
    >
      <div className="relative animate-fadeIn">
        {renderSpinner()}
      </div>
      
      {(showText || showProgress) && (
        <div className="text-center space-y-2 animate-fadeIn">
          <div 
            className="text-base font-medium animate-pulse"
            style={{ color: 'var(--color-neutral-700)' }}
          >
            {showProgress ? loadingSteps[loadingStep] : text}
          </div>
          
          {showProgress && (
            <div className="w-32 h-1 rounded-full overflow-hidden"
                 style={{ background: 'var(--color-neutral-200)' }}>
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  background: 'var(--gradient-primary)',
                  width: `${(loadingStep + 1) * 25}%`
                }}
              />
            </div>
          )}
        </div>
      )}
      
      <span className="sr-only">
        {showProgress ? loadingSteps[loadingStep] : text}
      </span>
    </div>
  );
};

// Skeleton components for content loading
export const SkeletonCard = ({ className = '' }) => (
  <div className={`animate-pulse space-y-4 p-6 rounded-xl border ${className}`}
       style={{ 
         background: 'var(--color-neutral-50)',
         borderColor: 'var(--color-neutral-200)'
       }}>
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-full" 
           style={{ background: 'var(--color-neutral-200)' }} />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded w-3/4" 
             style={{ background: 'var(--color-neutral-200)' }} />
        <div className="h-3 rounded w-1/2" 
             style={{ background: 'var(--color-neutral-200)' }} />
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 rounded" 
           style={{ background: 'var(--color-neutral-200)' }} />
      <div className="h-4 rounded w-5/6" 
           style={{ background: 'var(--color-neutral-200)' }} />
      <div className="h-4 rounded w-4/6" 
           style={{ background: 'var(--color-neutral-200)' }} />
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`animate-pulse space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 rounded"
        style={{ 
          background: 'var(--color-neutral-200)',
          width: i === lines - 1 ? '75%' : '100%'
        }}
      />
    ))}
  </div>
);

export const SkeletonHeader = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="h-8 rounded-lg mb-4 w-2/3" 
         style={{ background: 'var(--color-neutral-200)' }} />
    <div className="h-4 rounded w-1/2" 
         style={{ background: 'var(--color-neutral-200)' }} />
  </div>
);

export default LoadingSpinner;
