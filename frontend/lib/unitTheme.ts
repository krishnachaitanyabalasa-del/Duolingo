export interface UnitTheme {
  id: number;
  bg: string;
  border: string;
  shadow: string;
  ring: string;
  headerBg: string;
  headerBorder: string;
  textColor: string;
}

export const UNIT_THEMES: Record<number, UnitTheme> = {
  1: {
    id: 1,
    bg: 'bg-[#58cc02]',
    border: 'border-[#46a302]',
    shadow: 'shadow-[0_4px_0_0_#46a302]',
    ring: 'ring-[#58cc02]/40',
    headerBg: 'bg-[#58cc02]',
    headerBorder: 'border-[#46a302]',
    textColor: 'text-[#58cc02]',
  },
  2: {
    id: 2,
    bg: 'bg-[#ff9600]',
    border: 'border-[#e07300]',
    shadow: 'shadow-[0_4px_0_0_#e07300]',
    ring: 'ring-[#ff9600]/40',
    headerBg: 'bg-[#ff9600]',
    headerBorder: 'border-[#e07300]',
    textColor: 'text-[#ff9600]',
  },
  3: {
    id: 3,
    bg: 'bg-[#1cb0f6]',
    border: 'border-[#1899d6]',
    shadow: 'shadow-[0_4px_0_0_#1899d6]',
    ring: 'ring-[#1cb0f6]/40',
    headerBg: 'bg-[#1cb0f6]',
    headerBorder: 'border-[#1899d6]',
    textColor: 'text-[#1cb0f6]',
  },
  4: {
    id: 4,
    bg: 'bg-[#ce82ff]',
    border: 'border-[#a55eea]',
    shadow: 'shadow-[0_4px_0_0_#a55eea]',
    ring: 'ring-[#ce82ff]/40',
    headerBg: 'bg-[#ce82ff]',
    headerBorder: 'border-[#a55eea]',
    textColor: 'text-[#ce82ff]',
  },
  5: {
    id: 5,
    bg: 'bg-[#ff4b4b]',
    border: 'border-[#ea2b2b]',
    shadow: 'shadow-[0_4px_0_0_#ea2b2b]',
    ring: 'ring-[#ff4b4b]/40',
    headerBg: 'bg-[#ff4b4b]',
    headerBorder: 'border-[#ea2b2b]',
    textColor: 'text-[#ff4b4b]',
  },
};

export function getUnitTheme(unitNumber: number): UnitTheme {
  const normalizedIndex = ((unitNumber - 1) % 5) + 1;
  return UNIT_THEMES[normalizedIndex] || UNIT_THEMES[1];
}
