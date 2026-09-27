/**
 * Tokens de 09_BRAND_AND_ART_DIRECTION. Tema oscuro primero: `mist` solo es legible
 * sobre `ink`, nunca sobre `cloud`.
 */
export const color = {
  ink: '#0B1020',
  inkRaised: '#151B31',
  inkLine: '#252D4A',
  cloud: '#F5F7FC',
  iris: '#7C5CFF',
  pulse: '#FF5FA2',
  aqua: '#37D6C8',
  mist: '#AAB3C8',
  danger: '#FF8A8A',
} as const;

export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { control: 8, card: 16, sheet: 24, pill: 999 } as const;
export const type = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '600' as const },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24 },
  support: { fontSize: 14, lineHeight: 20 },
  micro: { fontSize: 12, lineHeight: 16 },
} as const;
