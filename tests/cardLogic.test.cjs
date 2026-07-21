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

function loadCardManager(ean13) {
  let source = readCommonFile('cardManager.js')
    .replace(/import \{[\s\S]*?\} from '.\/ean13\.js';/, '')
    .replace(/export \{[\s\S]*?\};\s*$/, '')
    .concat('\nreturn { cloneCards, createCard, findCardById, removeCard, restoreCards, updateCardCode, validateCardCode };');
  return new Function('calculateEan13CheckDigit', 'isEan13Code', source)(
    ean13.calculateEan13CheckDigit,
    ean13.isEan13Code
  );
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

async function loadQrRenderer() {
  let vendorSource = readCommonFile(path.join('vendor', 'lean-qr-nano.min.js'));
  let vendorModule = await import('data:text/javascript;base64,' + Buffer.from(vendorSource).toString('base64'));
  let source = readCommonFile('qrRenderer.js')
    .replace("import { generate } from './vendor/lean-qr-nano.min.js';", '')
    .replace('export default createQrRenderData;', 'return createQrRenderData;');
  return new Function('generate', source)(vendorModule.generate);
}

const ean13 = loadEan13();
const cardManager = loadCardManager(ean13);
const defaultCards = loadDefaultCards();
const createBarcodeBars = loadBarcodeRenderer(ean13.encodeEan13);

test('EAN-13 accepts 12 digits and calculates the check digit', () => {
  assert.deepEqual(cardManager.validateCardCode('ean13', '590123412345'), {
    valid: true,
    code: '5901234123457',
    message: ''
  });
});

test('EAN-13 rejects an invalid check digit', () => {
  assert.equal(cardManager.validateCardCode('ean13', '5901234123458').valid, false);
});

test('QR input accepts digits and enforces its limit', () => {
  assert.equal(cardManager.validateCardCode('qr', '1234567890').valid, true);
  assert.equal(cardManager.validateCardCode('qr', '123ABC').valid, false);
  assert.equal(cardManager.validateCardCode('qr', '1'.repeat(65)).valid, false);
});

test('card collection supports create, update, remove, and restore', () => {
  let cards = [];
  let card = cardManager.createCard(cards, 'qr', '1234');
  cards = cards.concat(card);
  assert.equal(cards[0].name, 'QR Card 1');

  cards = cardManager.updateCardCode(cards, card.id, '5678');
  assert.equal(cards[0].code, '5678');
  assert.deepEqual(cardManager.restoreCards(JSON.stringify(cards), []), cards);
  assert.deepEqual(cardManager.removeCard(cards, card.id), []);
  assert.deepEqual(cardManager.restoreCards('[]', [{ id: 'fallback' }]), []);
});

test('QR renderer creates a bounded square module matrix', async () => {
  let createQrRenderData = await loadQrRenderer();
  let renderData = createQrRenderData('1234567890123', 210);
  let side = Math.sqrt(renderData.modules.length);

  assert.equal(Number.isInteger(side), true);
  assert.equal(renderData.contentSize, side * renderData.moduleSize);
  assert.equal(renderData.outerSize <= 210, true);
  assert.equal(renderData.modules.some(module => module.dark), true);
  assert.equal(renderData.modules.some(module => !module.dark), true);
});

test('all four default cards still produce their expected code type', async () => {
  let createQrRenderData = await loadQrRenderer();

  for (let card of defaultCards) {
    if (card.format === 'ean13') {
      assert.equal(createBarcodeBars(card.format, card.code).length, 95, card.id);
    } else {
      assert.equal(createQrRenderData(card.code, 210).modules.length > 0, true, card.id);
    }
  }
});
