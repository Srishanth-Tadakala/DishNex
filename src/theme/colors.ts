// ==============================================================================
// EMBER DESIGN SYSTEM — COLOR TOKENS (Part 3.2 Specification)
// ==============================================================================

export const colors = {
  // Backgrounds
  background: '#06130F',          // Deep obsidian emerald
  backgroundSecondary: '#0B1D15', // Rich dark forest
  
  // Surfaces & Glassmorphism
  surface: '#10271D',             // Elevated card surface
  surfaceSecondary: '#193629',    // Secondary component surface
  surfaceGlass: 'rgba(16, 39, 29, 0.85)',
  surfaceGlassLight: 'rgba(25, 54, 41, 0.65)',
  surfaceHighlight: 'rgba(216, 240, 107, 0.08)',
  warmIvory: '#F4F0E7',           // Part 3.2 warm ivory tactile surface
  surfaceIvory: '#F4F0E7',        // Tactile hospitality paper surface
  surfaceIvorySubtle: '#EDE8DD',  // Muted ivory card container
  
  // Accents & Actions
  accent: '#D8F06B',              // Vibrant signature chartreuse/lime
  accentSecondary: '#B7E44F',     // Slightly deeper active lime
  accentDark: '#244D3A',          // Forest green badge/accent
  accentGlow: 'rgba(216, 240, 107, 0.25)',

  // Typography
  textPrimary: '#F5F5EE',         // Crisp warm ivory for titles
  textSecondary: '#A8B6AA',       // Soft sage for descriptions
  textMuted: '#79877D',           // Muted olive for hints & timestamps
  textDark: '#06130F',            // High contrast text inside lime buttons
  textIvory: '#F4F0E7',           // Warm editorial headlines

  // Borders & Dividers
  border: '#355344',              // Prominent border
  borderSubtle: '#1E3A2B',        // Card outline stroke
  borderGlass: 'rgba(53, 83, 68, 0.6)',
  borderAccent: '#D8F06B',

  // Semantic Status
  success: '#9BD94C',
  warning: '#F1B75A',
  error: '#E86C63',
  info: '#64B5F6',

  // Food Dietary Badges
  veg: '#4CAF50',
  nonVeg: '#E53935',

  // Overlays
  overlay: 'rgba(6, 19, 15, 0.85)',
  scrim: 'rgba(0, 0, 0, 0.6)',
} as const;

export type ColorToken = keyof typeof colors;

