import { format } from 'date-fns';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import SocialLinks from './SocialLinks';
import TagComponent from './TagComponent';

// Lazy Loading Hook
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        setHasIntersected(true);
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return [elementRef, isIntersecting, hasIntersected];
};

// Parse Product Hunt content from markdown
const parseProductHuntContent = (content) => {
  if (!content) return [];
  
  // Split by product sections (looking for ## [Number. Product Name])
  const sections = content.split(/(?=##\s+\[\d+\.)/);
  
  return sections
    .filter(section => section.trim())
    .map((section, index) => {
      const lines = section.trim().split('\n');
      
      // Extract product info from the first line
      const titleLine = lines[0];
      const titleMatch = titleLine.match(/##\s+\[(\d+)\.\s+([^\]]+)\]/);
      
      if (!titleMatch) return null;
      
      const [, rank, name] = titleMatch;
      
      // Find other information
      let tagline = '';
      let description = '';
      let website = '';
      let productHunt = '';
      let image = '';
      let keywords = '';
      let votes = '';
      let featured = '';
      let postedTime = '';
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.startsWith('**Tagline**:')) {
          tagline = line.replace('**Tagline**:', '').trim();
        } else if (line.startsWith('**Description**:')) {
          description = line.replace('**Description**:', '').trim();
        } else if (line.startsWith('**Website**:')) {
          website = line.replace('**Website**:', '').trim();
        } else if (line.startsWith('**Product Hunt**:')) {
          productHunt = line.replace('**Product Hunt**:', '').trim();
        } else if (line.startsWith('![')) {
          image = line.match(/!\[.*?\]\((.*?)\)/)?.[1] || '';
        } else if (line.startsWith('**Keywords**:')) {
          keywords = line.replace('**Keywords**:', '').trim();
        } else if (line.startsWith('**Votes**:')) {
          votes = line.replace('**Votes**:', '').trim();
        } else if (line.startsWith('**Featured**:')) {
          featured = line.replace('**Featured**:', '').trim();
        } else if (line.startsWith('**Posted Time**:')) {
          postedTime = line.replace('**Posted Time**:', '').trim();
        }
      }
      
      return {
        rank: parseInt(rank),
        name,
        tagline,
        description,
        website,
        productHunt,
        image,
        keywords,
        votes,
        featured,
        postedTime
      };
    })
    .filter(Boolean);
};

// Lazy Loaded Product Card Component
const LazyProductCard = ({ product, index, onViewDetail }) => {
  const [ref, , hasIntersected] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  if (!hasIntersected) {
    return (
      <div ref={ref} className="p-4 lg:p-6 rounded-2xl bg-gray-800/50 border border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-700 rounded mb-4"></div>
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div ref={ref} className="p-4 lg:p-6 rounded-2xl backdrop-blur-lg border transition-all duration-300 hover:scale-[1.02] bg-white dark:bg-gray-800/50 border-neutral-200 dark:border-gray-700 hover:border-neutral-300 dark:hover:border-gray-600 shadow-sm dark:shadow-gray-900/20">
      {/* Product Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-primary flex items-center">
              <span className="text-orange-500 mr-2">🚀</span>
              {product.name}
            </h2>
            <p className="text-sm text-secondary mt-1">{product.tagline}</p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <span className="text-xs px-2 py-1 rounded-full bg-orange-500 text-white">
              #{product.rank}
            </span>
            {product.featured === 'Có' && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-500 text-white">
                Featured
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product Image */}
      {product.image && (
        <div className="mb-4">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-32 object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="mb-4">
          <p className="text-xs text-muted line-clamp-3">
            {product.description}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="mb-4 flex items-center space-x-4 text-xs text-secondary">
        {product.votes && (
          <div className="flex items-center">
            <span className="mr-1">👍</span>
            {product.votes}
          </div>
        )}
        {product.postedTime && (
          <div className="flex items-center">
            <span className="mr-1">📅</span>
            {product.postedTime}
          </div>
        )}
      </div>

      {/* Keywords */}
      {product.keywords && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {product.keywords.split(',').slice(0, 3).map((keyword, idx) => (
              <TagComponent key={idx} variant="neutral" size="small">
                {keyword.trim()}
              </TagComponent>
            ))}
          </div>
        </div>
      )}

      {/* Action Links */}
      <div className="flex space-x-2">
        {product.website && (
          <a 
            href={product.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 px-3 rounded-lg bg-orange-500 text-white text-xs hover:bg-orange-600 transition-colors"
          >
            Xem trang web
          </a>
        )}
        {product.productHunt && (
          <a 
            href={product.productHunt}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 px-3 rounded-lg border border-orange-500 text-orange-500 text-xs hover:bg-orange-50 transition-colors"
          >
            Product Hunt
          </a>
        )}
      </div>
    </div>
  );
};

const ProductHuntReportView = ({ report, isLoading, error }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('full'); // 'cards' or 'full' - mặc định là full
  const [searchTerm, setSearchTerm] = useState('');
  
  // Parse products from markdown content
  const products = useMemo(() => {
    if (!report?.content) return [];
    return parseProductHuntContent(report.content);
  }, [report?.content]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner 
          size="large" 
          text="Đang tải báo cáo Product Hunt..." 
          showText
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600">Không tìm thấy báo cáo</h2>
          <p className="text-gray-500 mt-2">Báo cáo này có thể đã bị xóa hoặc không tồn tại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Quay lại</span>
            </button>
            <SocialLinks />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl lg:text-4xl font-bold mb-2 animate-slideIn">
              {report.filename || 'Product Hunt Report'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80 animate-slideIn" style={{ animationDelay: '0.1s' }}>
              <span>📅 {formatDate(report.upload_date)}</span>
              <span>🚀 {products.length} sản phẩm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Chế độ thẻ
              </button>
              <button
                onClick={() => setViewMode('full')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'full'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Toàn bộ
              </button>
            </div>
          </div>

          {/* Results count */}
          {searchTerm && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Hiển thị {filteredProducts.length} / {products.length} sản phẩm
            </div>
          )}
        </div>

        {/* Content */}
        <div className="w-full">
          {/* Main Content */}
          <div className="w-full">
            {viewMode === 'cards' ? (
              // Cards View
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <LazyProductCard 
                    key={`${product.rank}-${product.name}`}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              // Full Content View
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-lg">
                <MarkdownRenderer content={report.content} />
              </div>
            )}

            {filteredProducts.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-lg font-medium mb-2">Không tìm thấy sản phẩm nào</h3>
                  <p>Thử thay đổi từ khóa tìm kiếm của bạn</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHuntReportView;
