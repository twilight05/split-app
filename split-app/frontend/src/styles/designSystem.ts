// Design System Constants
export const spacing = {
  // Standard spacing scale
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '5rem',   // 80px
  '5xl': '6rem',   // 96px
} as const;

export const borderRadius = {
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  '3xl': '2.5rem', // 40px
} as const;

export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main primary (sky blue)
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f3d4ff',
    300: '#e9b3ff',
    400: '#d946ef', // Vibrant purple accent
    500: '#c026d3',
    600: '#a21caf',
    700: '#86198f',
    800: '#701a75',
    900: '#581c87',
    950: '#3b0764',
  }
} as const;

// Component spacing standards
export const componentSpacing = {
  page: {
    padding: 'px-4 py-6 sm:px-6 sm:py-8',
    container: 'max-w-7xl mx-auto',
  },
  card: {
    padding: 'p-6 sm:p-8',
    gap: 'space-y-6',
  },
  form: {
    gap: 'space-y-6',
    fieldGap: 'space-y-2',
    inputPadding: 'px-4 py-3.5',
    buttonPadding: 'px-6 py-3.5',
  },
  modal: {
    padding: 'p-6 sm:p-8',
    gap: 'space-y-6',
    maxWidth: 'max-w-md',
  },
  header: {
    height: 'h-16 sm:h-20',
    padding: 'px-4 sm:px-6',
  },
  section: {
    marginBottom: 'mb-8',
    marginTop: 'mt-8',
  }
} as const;

// Theme-aware class generators
export const getThemeClasses = (theme: 'light' | 'dark') => ({
  background: {
    primary: theme === 'dark' ? 'bg-secondary-900' : 'bg-white',
    secondary: theme === 'dark' ? 'bg-secondary-800' : 'bg-secondary-50',
    card: theme === 'dark' ? 'bg-secondary-800/90' : 'bg-white/95',
    modal: theme === 'dark' ? 'bg-secondary-800' : 'bg-white',
    page: theme === 'dark' ? 'bg-secondary-900' : 'bg-gray-50',
  },
  text: {
    primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
    secondary: theme === 'dark' ? 'text-secondary-300' : 'text-gray-700',
    muted: theme === 'dark' ? 'text-secondary-400' : 'text-gray-600',
    accent: theme === 'dark' ? 'text-primary-300' : 'text-primary-600',
    onPrimary: 'text-white',
  },
  border: {
    primary: theme === 'dark' ? 'border-secondary-700' : 'border-secondary-200',
    secondary: theme === 'dark' ? 'border-secondary-600' : 'border-secondary-300',
  },
  input: {
    background: theme === 'dark' ? 'bg-secondary-700' : 'bg-white',
    border: theme === 'dark' ? 'border-secondary-600' : 'border-gray-300',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    placeholder: theme === 'dark' ? 'placeholder-secondary-400' : 'placeholder-gray-500',
    focus: 'focus:border-primary-500 focus:ring-primary-500',
  },
  button: {
    primary: `bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white border border-primary-600 hover:border-primary-700`,
    secondary: theme === 'dark' 
      ? 'bg-secondary-700 hover:bg-secondary-600 text-white border border-secondary-600'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
    outline: theme === 'dark'
      ? 'bg-transparent hover:bg-primary-900 text-primary-300 border border-primary-600 hover:border-primary-500'
      : 'bg-transparent hover:bg-primary-50 text-primary-600 border border-primary-600 hover:border-primary-700',
  },
  card: {
    background: theme === 'dark' ? 'bg-secondary-800' : 'bg-white',
    border: theme === 'dark' ? 'border-secondary-700' : 'border-gray-200',
    shadow: theme === 'dark' ? 'shadow-lg shadow-black/25' : 'shadow-lg shadow-gray-200/50',
  }
});

// Button variants
export const buttonVariants = {
  primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 border-0',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600',
  outline: 'border border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950/50',
  ghost: 'hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-300 border-0',
  danger: 'bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/25',
} as const;