// ==============================================================================
// DISHNEX DESIGN SYSTEM — COLOR TOKENS (Visual Authority Specification)
// Premium Luxury Obsidian Emerald Palette with Signature Chartreuse Accents
// ==============================================================================

export const colors = {
  // Background System (Deep Obsidian Emerald)
  background: '#06130F',          // Deep obsidian emerald
  backgroundSecondary: '#0B1D15', // Rich dark forest emerald
  backgroundElevated: '#10271D',  // Elevated section container background

  // Surface System (Rich Dimensional Emerald)
  surface: '#10271D',             // Elevated card & module surface
  surfaceSecondary: '#193629',    // Secondary component surface & pill container
  surfaceElevated: '#244D3A',     // Elevated surface / high-contrast cards
  surfaceGlass: 'rgba(16, 39, 29, 0.85)',       // Elegant glassmorphism backdrop
  surfaceGlassLight: 'rgba(25, 54, 41, 0.65)', // Subtle transparent container
  surfaceHighlight: 'rgba(216, 240, 107, 0.08)', // Luminous lime wash

  // Hospitality Tactile Surfaces
  warmIvory: '#F4F0E7',           // Part 3.2 warm ivory tactile surface
  surfaceIvory: '#F4F0E7',        // Tactile hospitality paper surface
  surfaceIvorySubtle: '#EDE8DD',  // Muted ivory card container

  // Primary Accent System (Signature Chartreuse/Lime & Emerald)
  accent: '#D8F06B',              // Vibrant signature chartreuse/lime
  accentSecondary: '#B7E44F',     // Slightly deeper active lime for gradients
  accentDark: '#244D3A',          // Forest green badge/accent
  accentHighlight: '#D8F06B',     // Luminous accent highlight
  accentBrightGreen: '#36B66D',   // Vibrant emerald green

  // Luminous Glows
  accentGlow: 'rgba(216, 240, 107, 0.25)',
  emeraldGlow: 'rgba(36, 77, 58, 0.35)',
  goldGlow: 'rgba(245, 192, 66, 0.30)',

  // Supporting Warm Tones
  gold: '#F5C042',                // Warm flame gold & star ratings
  orange: '#F08A4B',              // Flame amber & spicy indicator
  softWhite: '#F5F5EE',

  // Typography System (Maximum Readability on Dark Emerald)
  textPrimary: '#F5F5EE',         // Crisp warm ivory for titles & headlines
  textSecondary: '#A8B6AA',       // Soft sage for descriptions & subtitles
  textMuted: '#79877D',           // Muted olive for timestamps & secondary hints
  textDark: '#06130F',            // High-contrast deep obsidian text inside lime buttons
  textIvory: '#F4F0E7',           // Warm editorial headlines

  // Borders & Dividers
  border: '#355344',              // Prominent border
  borderSubtle: '#1E3A2B',        // Card outline stroke
  borderLight: '#2A4E3B',         // Subtle card border highlight
  borderGlass: 'rgba(53, 83, 68, 0.60)', // Subtle translucent edge
  borderAccent: '#D8F06B',        // Active lime focus border

  // Semantic Status Tokens
  success: '#9BD94C',             // Positive green status
  warning: '#F1B75A',             // Warning amber
  error: '#E86C63',               // Error & negative status
  info: '#64B5F6',                // Information cyan

  // Food Dietary Badges
  veg: '#4CAF50',
  nonVeg: '#E53935',

  // Overlays & Scrims
  overlay: 'rgba(6, 19, 15, 0.85)',
  scrim: 'rgba(0, 0, 0, 0.60)',
} as const;

export type ColorToken = keyof typeof colors;
