import encodeEan13 from './ean13.js';

function isEan13GuardModule(index) {
  return index < 3 || (index >= 45 && index < 50) || index >= 92;
}

function getModuleType(bit, isGuardModule) {
  if (bit === '1') {
    return isGuardModule ? 'darkGuard' : 'dark';
  }

  return isGuardModule ? 'lightGuard' : 'light';
}

function createEan13BarcodeBars(code) {
  var pattern = encodeEan13(code);
  var bars = [];

  for (var index = 0; index < pattern.length; index++) {
    bars.push({
      id: String(index),
      type: getModuleType(pattern.charAt(index), isEan13GuardModule(index))
    });
  }

  return bars;
}

function createBarcodeBars(format, code) {
  if (format === 'ean13') {
    return createEan13BarcodeBars(code);
  }

  return [];
}

export default createBarcodeBars;
