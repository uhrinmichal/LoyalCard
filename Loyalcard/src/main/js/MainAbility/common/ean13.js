const LEFT_ODD_PATTERNS = [
  '0001101',
  '0011001',
  '0010011',
  '0111101',
  '0100011',
  '0110001',
  '0101111',
  '0111011',
  '0110111',
  '0001011'
];

const LEFT_EVEN_PATTERNS = [
  '0100111',
  '0110011',
  '0011011',
  '0100001',
  '0011101',
  '0111001',
  '0000101',
  '0010001',
  '0001001',
  '0010111'
];

const RIGHT_PATTERNS = [
  '1110010',
  '1100110',
  '1101100',
  '1000010',
  '1011100',
  '1001110',
  '1010000',
  '1000100',
  '1001000',
  '1110100'
];

const LEFT_PARITY_PATTERNS = [
  'LLLLLL',
  'LLGLGG',
  'LLGGLG',
  'LLGGGL',
  'LGLLGG',
  'LGGLLG',
  'LGGGLL',
  'LGLGLG',
  'LGLGGL',
  'LGGLGL'
];

function containsOnlyDigits(value) {
  return /^[0-9]+$/.test(value);
}

function calculateEan13CheckDigit(firstTwelveDigits) {
  let sum = 0;

  for (let index = 0; index < firstTwelveDigits.length; index++) {
    const digit = Number(firstTwelveDigits.charAt(index));
    const weight = index % 2 === 0 ? 1 : 3;
    sum += digit * weight;
  }

  return String((10 - (sum % 10)) % 10);
}

function isEan13Code(code) {
  if (!code || code.length !== 13 || !containsOnlyDigits(code)) {
    return false;
  }

  const expectedCheckDigit = calculateEan13CheckDigit(code.substring(0, 12));
  const actualCheckDigit = code.substring(12, 13);

  return actualCheckDigit === expectedCheckDigit;
}

function getLeftDigitPattern(digit, parity) {
  if (parity === 'L') {
    return LEFT_ODD_PATTERNS[digit];
  }

  return LEFT_EVEN_PATTERNS[digit];
}

function encodeEan13(code) {
  if (!isEan13Code(code)) {
    return '';
  }

  let pattern = '101';
  const firstDigit = Number(code.charAt(0));
  const leftParityPattern = LEFT_PARITY_PATTERNS[firstDigit];

  for (let index = 1; index <= 6; index++) {
    const digit = Number(code.charAt(index));
    const parity = leftParityPattern.charAt(index - 1);
    pattern += getLeftDigitPattern(digit, parity);
  }

  pattern += '01010';

  for (let index = 7; index <= 12; index++) {
    const digit = Number(code.charAt(index));
    pattern += RIGHT_PATTERNS[digit];
  }

  pattern += '101';

  return pattern;
}

export default {
  calculateCheckDigit: calculateEan13CheckDigit,
  encode: encodeEan13,
  isValid: isEan13Code
};
