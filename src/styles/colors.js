// Centrala färger för hela webbplatsen
export const colors = {
  // Palettfärger
  lightPink: '#F2E0DF',
  mediumPink: '#E3B8B8',
  orange: '#FF8128',
  lightTeal: '#BDCDCF',
  darkGreen: '#034C36',
  darkestGreen: '#003332',
};

// Gradient-kombinationer
export const gradients = {
  // Gradient 1: Varm (för hero)
  hero: `linear-gradient(135deg, ${colors.lightPink} 0%, ${colors.mediumPink} 50%, ${colors.orange} 100%)`,

  // Gradient 2: Kall (för cards/projects)
  cards: `linear-gradient(135deg, ${colors.lightTeal} 0%, ${colors.darkGreen} 50%, ${colors.darkestGreen} 100%)`,

  // Gradient 3: Medium (för sections)
  sections: `linear-gradient(135deg, ${colors.mediumPink} 0%, ${colors.darkGreen} 100%)`,

  // Gradient 4: Mörk (för main background)
  background: `linear-gradient(135deg, ${colors.darkGreen} 0%, ${colors.darkestGreen} 100%)`,
};

// Text-färger för olika bakgrunder
export const textColors = {
  onLight: colors.darkestGreen,
  onDark: colors.lightPink,
  onMedium: colors.lightPink,
  primary: colors.darkGreen,
};