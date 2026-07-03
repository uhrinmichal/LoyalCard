function containsOnlyDigits(value) {
  for (var index = 0; index < value.length; index++) {
    var digit = value.charAt(index);

    if (digit < '0' || digit > '9') {
      return false;
    }
  }

  return true;
}

function calculateEan13CheckDigit(firstTwelveDigits) {
  var sum = 0;

  for (var index = 0; index < firstTwelveDigits.length; index++) {
    var digit = Number(firstTwelveDigits.charAt(index));
    var weight = index % 2 === 0 ? 1 : 3;
    sum += digit * weight;
  }

  return String((10 - (sum % 10)) % 10);
}

function isEan13Code(code) {
  if (!code || code.length !== 13 || !containsOnlyDigits(code)) {
    return false;
  }

  var expectedCheckDigit = calculateEan13CheckDigit(code.substring(0, 12));
  var actualCheckDigit = code.substring(12, 13);

  return actualCheckDigit === expectedCheckDigit;
}

function getLeftOddPattern(digit) {
  if (digit === 0) {
    return '0001101';
  }
  if (digit === 1) {
    return '0011001';
  }
  if (digit === 2) {
    return '0010011';
  }
  if (digit === 3) {
    return '0111101';
  }
  if (digit === 4) {
    return '0100011';
  }
  if (digit === 5) {
    return '0110001';
  }
  if (digit === 6) {
    return '0101111';
  }
  if (digit === 7) {
    return '0111011';
  }
  if (digit === 8) {
    return '0110111';
  }

  return '0001011';
}

function getLeftEvenPattern(digit) {
  if (digit === 0) {
    return '0100111';
  }
  if (digit === 1) {
    return '0110011';
  }
  if (digit === 2) {
    return '0011011';
  }
  if (digit === 3) {
    return '0100001';
  }
  if (digit === 4) {
    return '0011101';
  }
  if (digit === 5) {
    return '0111001';
  }
  if (digit === 6) {
    return '0000101';
  }
  if (digit === 7) {
    return '0010001';
  }
  if (digit === 8) {
    return '0001001';
  }

  return '0010111';
}

function getRightPattern(digit) {
  if (digit === 0) {
    return '1110010';
  }
  if (digit === 1) {
    return '1100110';
  }
  if (digit === 2) {
    return '1101100';
  }
  if (digit === 3) {
    return '1000010';
  }
  if (digit === 4) {
    return '1011100';
  }
  if (digit === 5) {
    return '1001110';
  }
  if (digit === 6) {
    return '1010000';
  }
  if (digit === 7) {
    return '1000100';
  }
  if (digit === 8) {
    return '1001000';
  }

  return '1110100';
}

function getLeftParityPattern(firstDigit) {
  if (firstDigit === 0) {
    return 'LLLLLL';
  }
  if (firstDigit === 1) {
    return 'LLGLGG';
  }
  if (firstDigit === 2) {
    return 'LLGGLG';
  }
  if (firstDigit === 3) {
    return 'LLGGGL';
  }
  if (firstDigit === 4) {
    return 'LGLLGG';
  }
  if (firstDigit === 5) {
    return 'LGGLLG';
  }
  if (firstDigit === 6) {
    return 'LGGGLL';
  }
  if (firstDigit === 7) {
    return 'LGLGLG';
  }
  if (firstDigit === 8) {
    return 'LGLGGL';
  }

  return 'LGGLGL';
}

function getLeftDigitPattern(digit, parity) {
  if (parity === 'L') {
    return getLeftOddPattern(digit);
  }

  return getLeftEvenPattern(digit);
}

function encodeEan13(code) {
  if (!isEan13Code(code)) {
    return '';
  }

  var pattern = '101';
  var firstDigit = Number(code.charAt(0));
  var leftParityPattern = getLeftParityPattern(firstDigit);

  for (var index = 1; index <= 6; index++) {
    var leftDigit = Number(code.charAt(index));
    var parity = leftParityPattern.charAt(index - 1);
    pattern += getLeftDigitPattern(leftDigit, parity);
  }

  pattern += '01010';

  for (var rightIndex = 7; rightIndex <= 12; rightIndex++) {
    var rightDigit = Number(code.charAt(rightIndex));
    pattern += getRightPattern(rightDigit);
  }

  pattern += '101';

  return pattern;
}

export default encodeEan13;
