
import type { Config } from "tailwindcss";

export default {
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
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
        // Trading semantic tokens (HSL via CSS variables)
        bullish: {
          DEFAULT: 'hsl(var(--bullish))',
          foreground: 'hsl(var(--bullish-foreground))'
        },
        bearish: {
          DEFAULT: 'hsl(var(--bearish))',
          foreground: 'hsl(var(--bearish-foreground))'
        },
        profit: {
          DEFAULT: 'hsl(var(--profit))',
          foreground: 'hsl(var(--profit-foreground))'
        },
        loss: {
          DEFAULT: 'hsl(var(--loss))',
          foreground: 'hsl(var(--loss-foreground))'
        },
        'neutral-trade': {
          DEFAULT: 'hsl(var(--neutral-trade))',
          foreground: 'hsl(var(--neutral-trade-foreground))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))'
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))'
        },
        'mode-scalp': {
          DEFAULT: 'hsl(var(--mode-scalp))',
          foreground: 'hsl(var(--mode-scalp-foreground))'
        },
        'mode-day': {
          DEFAULT: 'hsl(var(--mode-day))',
          foreground: 'hsl(var(--mode-day-foreground))'
        },
        'mode-night': {
          DEFAULT: 'hsl(var(--mode-night))',
          foreground: 'hsl(var(--mode-night-foreground))'
        },
        surface: {
          1: 'hsl(var(--surface-1))',
          2: 'hsl(var(--surface-2))',
          3: 'hsl(var(--surface-3))',
          foreground: 'hsl(var(--surface-foreground))'
        },
        chart: {
          bg: 'hsl(var(--chart-bg))',
          grid: 'hsl(var(--chart-grid))',
          line: 'hsl(var(--chart-line))',
          up: 'hsl(var(--chart-up))',
          down: 'hsl(var(--chart-down))'
        }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'glow': {
          '0%, 100%': { 
            opacity: '1',
            filter: 'brightness(1)'
          },
          '50%': { 
            opacity: '0.8',
            filter: 'brightness(1.2)'
          }
        },
        'bounce-subtle': {
          '0%, 100%': { 
            transform: 'translateY(0)'
          },
          '50%': { 
            transform: 'translateY(-4px)'
          }
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' }
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'glow': 'glow 1.5s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'slide-down': 'slide-down 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
