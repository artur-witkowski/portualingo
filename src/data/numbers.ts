import type { Category } from './types';

const ONES = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
const TEENS = [
  'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze',
  'dezasseis', 'dezassete', 'dezoito', 'dezanove',
];
const TENS = [
  '', '', 'vinte', 'trinta', 'quarenta', 'cinquenta',
  'sessenta', 'setenta', 'oitenta', 'noventa',
];

function numberToPt(n: number): string {
  if (n === 100) return 'cem';
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  const ten = Math.floor(n / 10);
  const one = n % 10;
  return one === 0 ? TENS[ten] : `${TENS[ten]} e ${ONES[one]}`;
}

export const numbers: Category = {
  id: 'numbers',
  name: 'Liczby / Números',
  icon: '🔢',
  weight: 0.2,
  words: Array.from({ length: 100 }, (_, i) => ({
    pt: numberToPt(i + 1),
    pl: String(i + 1),
  })),
};
