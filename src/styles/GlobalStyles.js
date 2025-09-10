import { createGlobalStyle } from 'styled-components';

// export const theme = {
//   colors: {
//     primary: '#6366f1',
//     secondary: '#8b5cf6',
//     accent: '#f59e0b',
//     background: '#0f172a',
//     surface: '#1e293b',
//     card: '#334155',
//     text: '#f8fafc',
//     textSecondary: '#94a3b8',
//     border: '#475569',
//     success: '#10b981',
//     error: '#ef4444',
//     warning: '#f59e0b'
//   },
//   shadows: {
//     small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
//     medium: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
//     large: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
//     glow: '0 0 20px rgba(99, 102, 241, 0.3)'
//   },
//   borderRadius: {
//     small: '8px',
//     medium: '12px',
//     large: '16px',
//     round: '50%'
//   },
//   transitions: {
//     fast: '0.2s ease',
//     medium: '0.3s ease',
//     slow: '0.5s ease'
//   },
//   breakpoints: {
//     mobile: '768px',
//     tablet: '1024px',
//     desktop: '1200px'
//   }
// };

// src/themes/index.js

export const darkTheme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    background: '#0f172a',
    surface: '#1e293b',
    card: '#334155',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#475569',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  },
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    medium: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    large: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    round: '50%',
  },
  transitions: {
    fast: '0.2s ease',
    medium: '0.3s ease',
    slow: '0.5s ease',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
};

export const lightTheme = {
  colors: {
    primary: '#4f46e5',
    secondary: '#a78bfa',
    accent: '#f59e0b',
    background: '#f1f5f9',
    surface: '#ffffff',
    card: '#e2e8f0',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#cbd5e1',
    success: '#16a34a',
    error: '#dc2626',
    warning: '#f59e0b',
  },
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.16)',
    medium: '0 3px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)',
    large: '0 10px 20px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
    glow: '0 0 20px rgba(79, 70, 229, 0.2)',
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    round: '50%',
  },
  transitions: {
    fast: '0.2s ease',
    medium: '0.3s ease',
    slow: '0.5s ease',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
};

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
  }

  html {
    scroll-behavior: smooth;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  ul {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primary};
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }

  /* Selection styles */
  ::selection {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.text};
  }
`; 