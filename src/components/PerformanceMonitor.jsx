import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';

// Performance Context
const PerformanceContext = createContext();

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

// Performance Provider Component
export const PerformanceProvider = ({ children, enableDevMode = false }) => {
  const [metrics, setMetrics] = useState({
    navigationTiming: null,
    resourceTiming: [],
    customMetrics: {},
    vitals: {}
  });
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    // Check connection speed
    if ('connection' in navigator) {
      const connection = navigator.connection;
      setIsSlowConnection(connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    }

    // Collect navigation timing
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      setMetrics(prev => ({
        ...prev,
        navigationTiming: {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          connection: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          domProcessing: navigation.domContentLoadedEventStart - navigation.responseEnd,
          domReady: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          pageLoad: navigation.loadEventEnd - navigation.navigationStart
        }
      }));
    }

    // Collect resource timing
    const collectResourceTiming = () => {
      const resources = performance.getEntriesByType('resource');
      const processedResources = resources.map(resource => ({
        name: resource.name,
        type: resource.initiatorType,
        size: resource.transferSize,
        duration: resource.duration,
        cached: resource.transferSize === 0
      }));
      
      setMetrics(prev => ({
        ...prev,
        resourceTiming: processedResources
      }));
    };

    collectResourceTiming();

    // Collect Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => ({
          ...prev,
          vitals: { ...prev.vitals, lcp: lastEntry.startTime }
        }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          setMetrics(prev => ({
            ...prev,
            vitals: { ...prev.vitals, fid: entry.processingStart - entry.startTime }
          }));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        setMetrics(prev => ({
          ...prev,
          vitals: { ...prev.vitals, cls: clsValue }
        }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  const recordCustomMetric = useCallback((name, value, unit = 'ms') => {
    setMetrics(prev => ({
      ...prev,
      customMetrics: {
        ...prev.customMetrics,
        [name]: { value, unit, timestamp: Date.now() }
      }
    }));
  }, []);

  const measureFunction = useCallback((fn, name) => {
    return async (...args) => {
      const start = performance.now();
      const result = await fn(...args);
      const end = performance.now();
      recordCustomMetric(name, end - start);
      return result;
    };
  }, [recordCustomMetric]);

  const getOptimizationTips = useCallback(() => {
    const tips = [];
    
    if (metrics.vitals.lcp > 2500) {
      tips.push({
        type: 'warning',
        message: 'Largest Contentful Paint (LCP) is slow. Consider optimizing images and critical resources.',
        priority: 'high'
      });
    }

    if (metrics.vitals.fid > 100) {
      tips.push({
        type: 'warning',
        message: 'First Input Delay (FID) is high. Consider reducing JavaScript execution time.',
        priority: 'medium'
      });
    }

    if (metrics.vitals.cls > 0.1) {
      tips.push({
        type: 'warning',
        message: 'Cumulative Layout Shift (CLS) is high. Ensure images have dimensions and avoid dynamic content insertion.',
        priority: 'high'
      });
    }

    if (isSlowConnection) {
      tips.push({
        type: 'info',
        message: 'User has slow connection. Consider showing optimized content.',
        priority: 'medium'
      });
    }

    return tips;
  }, [metrics, isSlowConnection]);

  const value = {
    metrics,
    isSlowConnection,
    recordCustomMetric,
    measureFunction,
    getOptimizationTips
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
      {enableDevMode && <PerformanceDevPanel />}
    </PerformanceContext.Provider>
  );
};

// Performance monitoring hook for components
export const useComponentPerformance = (componentName) => {
  const { recordCustomMetric } = usePerformance();
  
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      recordCustomMetric(`${componentName}_render`, endTime - startTime);
    };
  }, [componentName, recordCustomMetric]);
};

// Lazy loading component with performance tracking
export const LazyComponent = ({ 
  children, 
  fallback = null, 
  threshold = 0.1,
  trackPerformance = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { recordCustomMetric } = usePerformance();
  const elementRef = React.useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const startTime = performance.now();
          setIsVisible(true);
          
          if (trackPerformance) {
            requestAnimationFrame(() => {
              const endTime = performance.now();
              recordCustomMetric('lazy_load_time', endTime - startTime);
            });
          }
          
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, trackPerformance, recordCustomMetric]);

  return (
    <div ref={elementRef}>
      {isVisible ? children : fallback}
    </div>
  );
};

// Image component with performance optimization
export const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  lazy = true,
  quality = 'high',
  className = '',
  ...props 
}) => {
  const { isSlowConnection, recordCustomMetric } = usePerformance();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Determine image quality based on connection
  const getOptimizedSrc = (originalSrc) => {
    if (isSlowConnection && quality === 'auto') {
      // Return lower quality version for slow connections
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return originalSrc;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    const loadTime = performance.now();
    recordCustomMetric('image_load', loadTime);
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={{ 
            background: 'var(--color-neutral-200)',
            width: width || '100%',
            height: height || '200px'
          }}
        />
      )}
      
      <img
        src={getOptimizedSrc(src)}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
      
      {error && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            background: 'var(--color-neutral-100)',
            color: 'var(--color-neutral-500)'
          }}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
};

// Performance Dev Panel
const PerformanceDevPanel = () => {
  const { metrics, getOptimizationTips } = usePerformance();
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (time) => {
    if (time < 1000) return `${Math.round(time)}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  };

  const getScoreColor = (metric, value) => {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    };

    if (!thresholds[metric]) return 'var(--color-neutral-500)';
    
    if (value <= thresholds[metric].good) return 'var(--color-accent-emerald)';
    if (value <= thresholds[metric].poor) return 'var(--color-accent-orange)';
    return 'var(--color-accent-rose)';
  };

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full shadow-lg transition-all duration-200"
        style={{
          background: 'var(--color-neutral-800)',
          color: 'white'
        }}
      >
        📊
      </button>

      {isOpen && (
        <div 
          className="absolute bottom-16 left-0 w-80 p-4 rounded-xl shadow-2xl max-h-96 overflow-y-auto"
          style={{
            background: 'var(--color-neutral-900)',
            color: 'white',
            border: '1px solid var(--color-neutral-700)'
          }}
        >
          <h3 className="text-lg font-bold mb-4">Performance Metrics</h3>
          
          {/* Core Web Vitals */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Core Web Vitals</h4>
            {Object.entries(metrics.vitals).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center mb-1">
                <span className="text-sm">{key.toUpperCase()}:</span>
                <span 
                  className="text-sm font-mono"
                  style={{ color: getScoreColor(key, value) }}
                >
                  {formatTime(value)}
                </span>
              </div>
            ))}
          </div>

          {/* Navigation Timing */}
          {metrics.navigationTiming && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Navigation Timing</h4>
              {Object.entries(metrics.navigationTiming).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center mb-1">
                  <span className="text-sm">{key}:</span>
                  <span className="text-sm font-mono">{formatTime(value)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Custom Metrics */}
          {Object.keys(metrics.customMetrics).length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Custom Metrics</h4>
              {Object.entries(metrics.customMetrics).map(([key, metric]) => (
                <div key={key} className="flex justify-between items-center mb-1">
                  <span className="text-sm">{key}:</span>
                  <span className="text-sm font-mono">
                    {formatTime(metric.value)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Optimization Tips */}
          <div>
            <h4 className="font-semibold mb-2">Optimization Tips</h4>
            {getOptimizationTips().map((tip, index) => (
              <div 
                key={index} 
                className="text-xs p-2 rounded mb-2"
                style={{
                  background: tip.type === 'warning' ? 'var(--color-accent-orange)/20' : 'var(--color-primary-500)/20'
                }}
              >
                {tip.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceProvider; 