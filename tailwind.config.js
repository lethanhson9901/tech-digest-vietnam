module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette mapped to CSS variables (works for both light/dark via variable overrides)
        'primary-50': 'var(--color-primary-50)',
        'primary-100': 'var(--color-primary-100)',
        'primary-200': 'var(--color-primary-200)',
        'primary-300': 'var(--color-primary-300)',
        'primary-400': 'var(--color-primary-400)',
        'primary-500': 'var(--color-primary-500)',
        'primary-600': 'var(--color-primary-600)',
        'primary-700': 'var(--color-primary-700)',
        'primary-800': 'var(--color-primary-800)',
        'primary-900': 'var(--color-primary-900)',
        'primary-950': 'var(--color-primary-950)',

        // Secondary palette
        'secondary-50': 'var(--color-secondary-50)',
        'secondary-100': 'var(--color-secondary-100)',
        'secondary-200': 'var(--color-secondary-200)',
        'secondary-300': 'var(--color-secondary-300)',
        'secondary-400': 'var(--color-secondary-400)',
        'secondary-500': 'var(--color-secondary-500)',
        'secondary-600': 'var(--color-secondary-600)',
        'secondary-700': 'var(--color-secondary-700)',
        'secondary-800': 'var(--color-secondary-800)',
        'secondary-900': 'var(--color-secondary-900)',
        'secondary-950': 'var(--color-secondary-950)',

        // Accents (flat tokens used directly in codebase)
        'accent-emerald': 'var(--color-accent-emerald)',
        'accent-emerald-light': 'var(--color-accent-emerald-light)',
        'accent-emerald-dark': 'var(--color-accent-emerald-dark)',
        'accent-rose': 'var(--color-accent-rose)',
        'accent-rose-light': 'var(--color-accent-rose-light)',
        'accent-rose-dark': 'var(--color-accent-rose-dark)',
        'accent-blue': 'var(--color-accent-blue)',
        'accent-blue-light': 'var(--color-accent-blue-light)',
        'accent-blue-dark': 'var(--color-accent-blue-dark)',

        // Neutral palette mapped to variables to keep consistent in dark mode via .dark overrides
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
          950: 'var(--color-neutral-950)'
        }
      },
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
  ],
}
