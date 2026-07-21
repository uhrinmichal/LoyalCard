const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const commonPath = path.join(
  __dirname,
  '..',
  'Loyalcard',
  'src',
  'main',
  'js',
  'MainAbility',
  'common'
);
const mainAbilityPath = path.dirname(commonPath);

function readCommonFile(fileName) {
  return fs.readFileSync(path.join(commonPath, fileName), 'utf8');
}

function loadEan13() {
  let source = readCommonFile('ean13.js')
    .replace('export default encodeEan13;', '')
    .replace(/export \{[\s\S]*?\};\s*$/, '')
    .concat('\nreturn { encodeEan13, calculateEan13CheckDigit, isEan13Code };');
  return new Function(source)();
}

function loadDefaultCards() {
  let source = readCommonFile('cards.js')
    .replace('export default cards;', 'return cards;');
  return new Function(source)();
}

function loadBarcodeRenderer(encodeEan13) {
  let source = readCommonFile('barcodeRenderer.js')
    .replace("import encodeEan13 from './ean13.js';", '')
    .replace('export default createBarcodeBars;', 'return createBarcodeBars;');
  return new Function('encodeEan13', source)(encodeEan13);
}

function loadInputValidators() {
  let source = fs.readFileSync(
    path.join(mainAbilityPath, 'pages', 'index', 'index.js'),
    'utf8'
  );
  let start = source.indexOf('function isNumericQrCode');
  let end = source.indexOf('export default', start);
  let validatorSource = source.substring(start, end)
    .concat('\nreturn { isNumericQrCode, isValidCardName };');
  return new Function(validatorSource)();
}

const ean13 = loadEan13();
const defaultCards = loadDefaultCards();
const createBarcodeBars = loadBarcodeRenderer(ean13.encodeEan13);
const inputValidators = loadInputValidators();

test('EAN-13 accepts 12 digits and calculates the check digit', () => {
  assert.equal(ean13.calculateEan13CheckDigit('590123412345'), '7');
  assert.equal(ean13.isEan13Code('5901234123457'), true);
});

test('EAN-13 rejects an invalid check digit', () => {
  assert.equal(ean13.isEan13Code('5901234123458'), false);
});

test('QR input accepts digits and enforces its limit', () => {
  assert.equal(inputValidators.isNumericQrCode('1234567890'), true);
  assert.equal(inputValidators.isNumericQrCode('123ABC'), false);
  assert.equal(inputValidators.isNumericQrCode(''), false);
  assert.equal(inputValidators.isNumericQrCode('1'.repeat(33)), false);
});

test('card names accept visible text up to 20 characters', () => {
  assert.equal(inputValidators.isValidCardName('My Card'), true);
  assert.equal(inputValidators.isValidCardName('  '), false);
  assert.equal(inputValidators.isValidCardName('A'.repeat(21)), false);
});

test('EAN-13 renderer creates the expected 95 modules', () => {
  let bars = createBarcodeBars('ean13', '5901234123457');
  assert.equal(bars.length, 95);
  assert.equal(bars[0].type, 'darkGuard');
  assert.equal(bars[94].type, 'darkGuard');
});

test('custom cards use native QR and wearable storage', () => {
  let indexHml = fs.readFileSync(
    path.join(mainAbilityPath, 'pages', 'index', 'index.hml'),
    'utf8'
  );
  let indexJs = fs.readFileSync(
    path.join(mainAbilityPath, 'pages', 'index', 'index.js'),
    'utf8'
  );
  assert.match(indexHml, /<qrcode[^>]+value="\{\{ selectedCode \}\}"/);
  assert.match(indexJs, /key: 'custom_ean_code'/);
  assert.match(indexJs, /key: 'custom_qr_code'/);
  assert.match(indexJs, /key: 'custom_ean_name'/);
  assert.match(indexJs, /key: 'custom_qr_name'/);
});

test('all four default cards provide their expected code source', () => {
  for (let card of defaultCards) {
    if (card.format === 'ean13') {
      assert.equal(createBarcodeBars(card.format, card.code).length, 95, card.id);
    } else {
      assert.match(card.qrAsset, /^\/common\/qr_.+\.png$/, card.id);
    }
  }
});
