import React, { useState, useEffect } from 'react';

const BackToTop = ({ 
  showAfter = 300, 
  scrollDuration = 500,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxScroll) * 100;
      
      setScrollProgress(progress);
      setIsVisible(scrolled > showAfter);
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    // Initial check
    toggleVisibility();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      className={`
        back-to-top fixed bottom-6 right-6 z-50
        w-16 h-16 rounded-2xl
        text-white shadow-2xl
        transition-all duration-500 ease-out
        hover:scale-110 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]
        focus:outline-none focus:ring-4 focus:ring-opacity-50
        group overflow-hidden backdrop-blur-sm
        ${isVisible ? 'animate-scaleIn' : ''}
        ${className}
      `}
      style={{
        background: 'var(--gradient-primary)',
        boxShadow: 'var(--shadow-accent)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
      aria-label="Cuộn lên đầu trang"
      title="Cuộn lên đầu trang"
    >
      {/* Enhanced glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" 
        style={{ background: 'var(--gradient-secondary)' }}
      />
      
      {/* Enhanced progress circle */}
      <svg
        className="absolute inset-0 w-full h-full transform -rotate-90"
        viewBox="0 0 40 40"
      >
        {/* Background circle */}
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="2"
        />
        {/* Progress circle */}
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="2.5"
          strokeDasharray="113"
          strokeDashoffset={113 - (scrollProgress * 113 / 100)}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
          style={{
            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))'
          }}
        />
      </svg>
      
      {/* Enhanced arrow icon */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <svg
          className="w-7 h-7 transform transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </div>
      
      {/* Enhanced ripple effect on click */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 group-active:animate-ping bg-white/30" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute top-2 right-2 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-2 w-0.5 h-0.5 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </button>
  );
};

export default BackToTop;