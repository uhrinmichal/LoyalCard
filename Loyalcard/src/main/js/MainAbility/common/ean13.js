function containsOnlyDigits(value) {
  return /^[0-9]+$/.test(value);
}

function calculateEan13CheckDigit(firstTwelveDigits) {
  let sum = 0;

  for (let index = 0; index < firstTwelveDigits.length; index++) {
    const digit = Number(firstTwelveDigits[index]);
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

export default {
  calculateCheckDigit: calculateEan13CheckDigit,
  isValid: isEan13Code
};
