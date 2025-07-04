export function formatPrice(price: number): string {
  const subscriptDigits = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];

  if (price >= 0.01) return `$${price.toFixed(3)}`;
  if (price >= 0.00001) return `$${price.toFixed(6)}`;

  const fullStr = price.toFixed(30); // ensures full precision
  const match = fullStr.match(/^0\.0*(\d+)/);

  if (!match) return `$${price.toFixed(8)}`;

  const zeroMatch = fullStr.match(/^0\.0*/);
  const leadingZeros = zeroMatch ? zeroMatch[0].length - 2 : 0;

  const significant = match[1].substring(0, 2); // only first 2 significant digits

  const subscript = leadingZeros
    .toString()
    .split('')
    .map(d => subscriptDigits[+d])
    .join('');

  return `$0.0${subscript}${significant}`;
} 