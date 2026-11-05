// ==============================================================================
// DISHNEX DESIGN SYSTEM — ADVANCED COLOR TOKENS (Part 04 Specification)
// Premium Luxury Emerald Hospitality Palette with Vibrant Lime Accents
// ==============================================================================

export const colors = {
  // Background System (Deep Obsidian & Forest Emerald)
  background: '#071A14',          // Primary dark background
  backgroundSecondary: '#0B2118', // Secondary deeper emerald
  backgroundElevated: '#10291D',  // Elevated section container background

  // Surface System (Rich Dimensional Emerald)
  surface: '#153A2A',             // Primary card & module surface
  surfaceSecondary: '#1C4934',    // Secondary component surface & pill container
  surfaceElevated: '#24563B',     // Elevated surface / high-contrast cards
  surfaceGlass: 'rgba(38, 94, 63, 0.40)',       // Elegant glassmorphism backdrop
  surfaceGlassLight: 'rgba(46, 110, 75, 0.25)', // Subtle transparent container
  surfaceHighlight: 'rgba(223, 255, 99, 0.12)', // Luminous lime wash

  // Hospitality Tactile Surfaces
  warmIvory: '#FFF8EA',           // Warm ivory surface
  surfaceIvory: '#FFF8EA',        // Tactile address & delivery container
  surfaceIvorySubtle: '#F4EEE1',  // Subtle ivory card

  // Primary Accent System (Luminous Signature Chartreuse & Emerald)
  accent: '#DFFF63',              // Primary vibrant signature bright lime
  accentSecondary: '#C5F15C',     // Secondary lime for gradients & hover states
  accentDark: '#24563B',          // Deep forest green accent
  accentHighlight: '#48C783',     // Emerald highlight & glowing edges
  accentBrightGreen: '#36B66D',   // Vibrant emerald green

  // Luminous Glows
  accentGlow: 'rgba(223, 255, 99, 0.35)',
  emeraldGlow: 'rgba(72, 199, 131, 0.25)',
  goldGlow: 'rgba(255, 198, 107, 0.30)',

  // Supporting Warm Tones
  gold: '#FFC66B',                // Warm flame gold & star ratings
  orange: '#F08A4B',              // Flame amber & spicy indicator
  softWhite: '#FFFFFF',

  // Typography System (Maximum Readability on Dark Emerald)
  textPrimary: '#FFFFFF',         // Crisp editorial titles & headlines
  textSecondary: '#C3D1C6',       // Soft sage for descriptions & subtitles
  textMuted: '#91A397',           // Muted olive for timestamps & secondary hints
  textDark: '#071A14',            // High-contrast deep obsidian text inside lime buttons
  textIvory: '#FFF8EA',           // Editorial serif headlines

  // Borders & Dividers
  border: '#2E5F46',              // Prominent emerald border
  borderSubtle: '#1E4231',        // Card outline stroke
  borderLight: '#3D785A',         // Luminous card border highlight
  borderGlass: 'rgba(72, 199, 131, 0.20)', // Subtle translucent edge
  borderAccent: '#DFFF63',        // Active lime focus border

  // Semantic Status Tokens
  success: '#A4E96A',             // Positive green status
  warning: '#FFC66B',             // Warning amber
  error: '#FF7770',               // Error & negative status
  info: '#5CE1E6',                // Information cyan

  // Food Dietary Badges
  veg: '#A4E96A',
  nonVeg: '#FF7770',

  // Overlays & Scrims
  overlay: 'rgba(7, 26, 20, 0.88)',
  scrim: 'rgba(0, 0, 0, 0.65)',
} as const;

export type ColorToken = keyof typeof colors;
