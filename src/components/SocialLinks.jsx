import React from 'react';

const SocialLinks = ({ className = "", compact = false }) => {
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/lethanhson9901',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
      color: 'hover:text-blue-600 hover:bg-blue-50'
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/LThnhSn655052',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: 'hover:text-primary hover:bg-primary-50'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/sonle9901/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
        </svg>
      ),
      color: 'hover:text-blue-700 hover:bg-blue-50'
    }
  ];

  const handleSocialClick = (event, url) => {
    event.preventDefault();
    event.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (compact) {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            onClick={(e) => handleSocialClick(e, social.url)}
            className={`
              p-1.5 rounded-full text-muted transition-all duration-200 
              ${social.color} transform hover:scale-110 cursor-pointer
            `}
            aria-label={`Theo dõi trên ${social.name}`}
            title={`Theo dõi trên ${social.name}`}
          >
            <div className="w-4 h-4">
              {social.icon}
            </div>
          </a>
        ))}
      </div>
    );
  }

  return (
      <div className={`flex items-center space-x-4 ${className}`}>
      <span className="text-sm font-medium text-secondary">Kết nối với tôi:</span>
      <div className="flex space-x-2">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            onClick={(e) => handleSocialClick(e, social.url)}
            className={`
              p-2.5 rounded-full text-muted transition-all duration-200 
              ${social.color} transform hover:scale-110 hover:shadow-md cursor-pointer
            `}
            aria-label={`Theo dõi trên ${social.name}`}
            title={`Theo dõi trên ${social.name}`}
          >
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks; 