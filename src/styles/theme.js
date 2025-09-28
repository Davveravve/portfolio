// Modern color scheme with dark theme
export const theme = {
  colors: {
    // Primary colors
    background: '#0a0a0a',
    backgroundSecondary: '#111111',
    surface: 'rgba(255, 255, 255, 0.03)',
    surfaceHover: 'rgba(255, 255, 255, 0.08)',

    // Text colors
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    textMuted: 'rgba(255, 255, 255, 0.4)',

    // Accent colors
    accent: '#6366f1', // Purple/blue gradient base
    accentLight: '#818cf8',
    accentDark: '#4f46e5',

    // Gradient colors
    gradientStart: '#6366f1',
    gradientMid: '#8b5cf6',
    gradientEnd: '#ec4899',

    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',

    // Glass effect colors
    glassBg: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
  },

  // Modern gradients
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    dark: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
    mesh: `
      radial-gradient(at 40% 20%, hsla(280, 100%, 70%, 0.3) 0px, transparent 50%),
      radial-gradient(at 80% 0%, hsla(250, 100%, 70%, 0.2) 0px, transparent 50%),
      radial-gradient(at 0% 50%, hsla(340, 100%, 70%, 0.2) 0px, transparent 50%),
      radial-gradient(at 80% 100%, hsla(240, 100%, 70%, 0.3) 0px, transparent 50%),
      radial-gradient(at 0% 100%, hsla(200, 100%, 70%, 0.2) 0px, transparent 50%)
    `,
    text: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    card: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
  },

  // Spacing
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
  },

  // Border radius
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
    md: '0 4px 20px rgba(0, 0, 0, 0.15)',
    lg: '0 10px 40px rgba(0, 0, 0, 0.2)',
    xl: '0 20px 60px rgba(0, 0, 0, 0.3)',
    glow: '0 0 40px rgba(99, 102, 241, 0.3)',
  },

  // Transitions
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '350ms ease',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Glass morphism effect
export const glassMorphism = `
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

// Neon glow effect
export const neonGlow = (color = '#6366f1') => `
  text-shadow:
    0 0 10px ${color},
    0 0 20px ${color},
    0 0 30px ${color},
    0 0 40px ${color};
`;