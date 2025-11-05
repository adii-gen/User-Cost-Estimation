import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";
const config: Config = withUt({
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      screens: {
        'xs': '500px', // custom breakpoint
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        'slide-in': {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        'scale-in': {
          '0%': {
            transform: 'scale(0.95)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        punch: {
          '0%, 100%': {
            transform: 'rotate(0deg)'
          },
          '50%': {
            transform: 'rotate(-45deg)'
          }
        },
        kick: {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-15px)'
          }
        },
        impact: {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.5'
          },
          '50%': {
            transform: 'scale(2)',
            opacity: '1'
          }
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-25px)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        punch: 'punch 1.5s infinite',
        kick: 'kick 1.5s infinite',
        impact: 'impact 1.5s infinite',
        bounce: 'bounce 1.5s infinite'
      },
      colors: {
        // Gold color palette
        gold: {
          50: '#FFF9F0',
          100: '#FFF3E0',
          200: '#FFE0B2',
          300: '#FFCC80',
          400: '#FFB74D',
          500: '#D58829', // Your current gold color
          600: '#B57121',
          700: '#95591A',
          800: '#754212',
          900: '#55300D',
        },
        // Update primary to use gold color
        primary: {
          DEFAULT: '#1e3a8a', // Direct value instead of hsl var for easier migration
          foreground: '#FFFFFF', // White text on gold background
          light: '#FFE0B2',
          dark: '#95591A',
          hover: '#B57121',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        footerBackground: '#161C28',
        dark: '#191A15',
        customGray: '#A6A6A6',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: '#D58829', // Gold as accent
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: '#D58829', // Gold ring for focus states
        chart: {
          '1': '#D58829', // Primary gold
          '2': '#B57121', // Darker gold
          '3': '#FFB74D', // Lighter gold
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        large: '1.875rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"), // <-- Add this line
  ],

});

export default config;