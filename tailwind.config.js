module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'Noto Sans', 'Roboto', 'Open Sans', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'serif': ['Noto Serif', 'Merriweather', 'Georgia', 'Times New Roman', 'serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Courier New', 'monospace'],
        'vietnamese': ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'vietnamese-body': ['1.0625rem', { lineHeight: '1.65', letterSpacing: '0.01em' }],
        'vietnamese-lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0.005em' }],
      },
      lineHeight: {
        'vietnamese': '1.65',
        'vietnamese-relaxed': '1.75',
      },
      letterSpacing: {
        'vietnamese': '0.01em',
        'vietnamese-tight': '0.005em',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            fontFamily: 'Inter, Noto Sans, system-ui, sans-serif',
            fontSize: '1rem',
            lineHeight: '1.6',
            letterSpacing: '0.01em',
            a: {
              color: '#4f46e5',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: '#4338ca',
              },
            },
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: 'Inter, Noto Sans, system-ui, sans-serif',
              fontWeight: '600',
              letterSpacing: '-0.025em',
              lineHeight: '1.25',
            },
            h1: {
              fontSize: '2.25rem',
              fontWeight: '700',
              lineHeight: '1.2',
            },
            h2: {
              fontSize: '1.875rem',
              lineHeight: '1.3',
            },
            h3: {
              fontSize: '1.5rem',
            },
            p: {
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '1.25rem',
            },
            strong: {
              fontWeight: '600',
            },
            code: {
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
              fontSize: '0.875rem',
              backgroundColor: '#f3f4f6',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
            },
            pre: {
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              backgroundColor: '#1f2937',
              color: '#f9fafb',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
            },
            blockquote: {
              fontFamily: 'Noto Serif, Merriweather, serif',
              fontSize: '1.125rem',
              fontStyle: 'italic',
              lineHeight: '1.75',
              borderLeft: '4px solid #4f46e5',
              paddingLeft: '1rem',
              marginLeft: '0',
              color: '#6b7280',
            },
          },
        },
        vietnamese: {
          css: {
            fontSize: '1.0625rem',
            lineHeight: '1.65',
            letterSpacing: '0.01em',
            fontFamily: 'Inter, Noto Sans, system-ui, sans-serif',
            p: {
              fontSize: '1.0625rem',
              lineHeight: '1.65',
              letterSpacing: '0.01em',
            },
            'h1, h2, h3, h4, h5, h6': {
              lineHeight: '1.3',
              letterSpacing: '-0.02em',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
}
