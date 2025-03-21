// src/components/Sidebar.js
import React, { useEffect, useRef } from 'react';

function Sidebar({ tocItems }) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const setupTOCHighlighting = () => {
      if (!sidebarRef.current) return;
      
      const tocLinks = sidebarRef.current.querySelectorAll('.toc a');
      const sections = document.querySelectorAll('.section-container');
      
      if (sections.length === 0) return;
      
      const handleScroll = () => {
        let current = '';
        
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          if (window.scrollY >= sectionTop - 100) {
            const idElement = section.querySelector('h2');
            if (idElement) {
              // Lấy original ID từ data attribute để so sánh với URL hash
              const originalId = idElement.getAttribute('data-original-id');
              current = `#${originalId}`;
            }
          }
        });
        
        tocLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === current) {
            link.classList.add('active');
          }
        });
      };
      
      window.addEventListener('scroll', handleScroll);
      
      tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          
          const originalId = this.getAttribute('href').substring(1);
          // Tìm phần tử dựa trên data-original-id
          const targetElement = document.querySelector(`[data-original-id="${originalId}"]`);
          
          if (targetElement) {
            const sectionContainer = targetElement.closest('.section-container');
            window.scrollTo({
              top: sectionContainer.offsetTop - 80,
              behavior: 'smooth'
            });
            
            window.history.pushState(null, null, this.getAttribute('href'));
          }
        });
      });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    };
    
    if (tocItems.length > 0) {
      // Sử dụng timeout nhỏ để đảm bảo DOM đã được render đầy đủ
      const timer = setTimeout(() => {
        setupTOCHighlighting();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [tocItems]);

  return (
    <aside className="sidebar" ref={sidebarRef}>
      <div className="toc">
        <h2>Mục lục</h2>
        <ol id="table-of-contents">
          {tocItems.map((item, index) => (
            <li key={index}>
              <a href={item.link}>{item.title}</a>
              {item.description && (
                <span className="toc-description">{item.description}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

export default Sidebar;
