import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        orbitron: ['Orbitron', 'monospace'],
        sans: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))'
        },
        chart: {
          1: 'oklch(var(--chart-1))',
          2: 'oklch(var(--chart-2))',
          3: 'oklch(var(--chart-3))',
          4: 'oklch(var(--chart-4))',
          5: 'oklch(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'oklch(var(--sidebar))',
          foreground: 'oklch(var(--sidebar-foreground))',
          primary: 'oklch(var(--sidebar-primary))',
          'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
          accent: 'oklch(var(--sidebar-accent))',
          'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
          border: 'oklch(var(--sidebar-border))',
          ring: 'oklch(var(--sidebar-ring))'
        },
        // Biometric theme colors
        bio: {
          cyan: 'oklch(0.85 0.18 195)',
          'cyan-dim': 'oklch(0.65 0.14 195)',
          'cyan-dark': 'oklch(0.35 0.08 195)',
          green: 'oklch(0.82 0.2 155)',
          'green-dim': 'oklch(0.62 0.16 155)',
          'green-dark': 'oklch(0.32 0.08 155)',
          surface1: 'oklch(0.08 0.01 240)',
          surface2: 'oklch(0.11 0.015 235)',
          surface3: 'oklch(0.15 0.02 230)',
          surface4: 'oklch(0.2 0.025 225)',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
        'glow-cyan': '0 0 15px oklch(0.85 0.18 195 / 0.4), 0 0 30px oklch(0.85 0.18 195 / 0.2)',
        'glow-cyan-sm': '0 0 8px oklch(0.85 0.18 195 / 0.5), 0 0 16px oklch(0.85 0.18 195 / 0.25)',
        'glow-cyan-lg': '0 0 25px oklch(0.85 0.18 195 / 0.6), 0 0 50px oklch(0.85 0.18 195 / 0.3)',
        'glow-green': '0 0 15px oklch(0.82 0.2 155 / 0.4), 0 0 30px oklch(0.82 0.2 155 / 0.2)',
        'glow-green-sm': '0 0 8px oklch(0.82 0.2 155 / 0.5), 0 0 16px oklch(0.82 0.2 155 / 0.25)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px oklch(0.85 0.18 195 / 0.4), 0 0 30px oklch(0.85 0.18 195 / 0.2)' },
          '50%': { boxShadow: '0 0 25px oklch(0.85 0.18 195 / 0.7), 0 0 50px oklch(0.85 0.18 195 / 0.35)' }
        },
        'scan-sweep': {
          '0%': { top: '0%' },
          '100%': { top: '100%' }
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'scan-sweep': 'scan-sweep 2s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'spin-slow': 'spin-slow 8s linear infinite',
      }
    }
  },
  plugins: [typography, containerQueries, animate]
};
