export const LIGHT_COLORS = {
  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: '#D1FAE5',
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#4B5563',
  border: '#E5E7EB',
  white: '#FFFFFF',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

export const DARK_COLORS = {
  primary: '#10B981',
  primaryDark: '#34D399',
  primaryLight: '#064E3B',
  background: '#111827',
  card: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  white: '#FFFFFF',
  error: '#F87171',
  success: '#10B981',
  warning: '#FBBF24',
};

// Default export for backward compatibility or initial load
export const COLORS = LIGHT_COLORS;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};
