import cards from '../../common/cards.js';
import cardLookup from '../../common/cardLookup.js';
import createBarcodeBars from '../../common/barcodeRenderer.js';
import getCardFormatLabel from '../../common/cardFormats.js';

export default {
  data: {
    viewMode: 'list',
    selectedName: '',
    selectedType: '',
    selectedCode: '',
    selectedId: '',
    codePlaceholder: 'CODE',
    hasBarcode: false,
    barcodeBars: [],
    hasQrImage: false,
    isScanMode: false,
    cards: cards,
    editorCode: ''
  },

  openCard(cardId) {
    let selectedCard = cardLookup.findCardById(cardId);

    if (selectedCard) {
      this.selectedName = selectedCard.name;
      this.selectedType = this.getFormatLabel(selectedCard.format);
      this.selectedCode = selectedCard.code;
      this.selectedId = selectedCard.id;
      this.codePlaceholder = selectedCard.format === 'qr' ? 'QR' : 'CODE';
      this.barcodeBars = createBarcodeBars(selectedCard.format, selectedCard.code);
      this.hasBarcode = this.barcodeBars.length > 0;
      this.hasQrImage = cardLookup.hasQrAsset(selectedCard);
      this.isScanMode = false;
      this.viewMode = 'detail';
    }
  },

  getFormatLabel(format) {
    return getCardFormatLabel(format);
  },

  openLidl() {
    this.openCard('lidl');
  },

  openTesco() {
    this.openCard('tesco');
  },

  openKaufland() {
    this.openCard('kaufland');
  },

  openBilla() {
    this.openCard('billa');
  },

  toggleScanMode() {
    this.isScanMode = !this.isScanMode;
  },

  startAdd() {
    this.viewMode = 'addFormat';
  },

  cancelAdd() {
    this.viewMode = 'list';
  },

  chooseEan() {
    this.editorCode = '';
    this.viewMode = 'editor';
  },

  cancelEditor() {
    this.editorCode = '';
    this.viewMode = 'addFormat';
  },

  appendDigit(digit) {
    if (this.editorCode.length < 13) {
      this.editorCode = this.editorCode + digit;
    }
  },

  appendOne() { this.appendDigit('1'); },
  appendTwo() { this.appendDigit('2'); },
  appendThree() { this.appendDigit('3'); },
  appendFour() { this.appendDigit('4'); },
  appendFive() { this.appendDigit('5'); },
  appendSix() { this.appendDigit('6'); },
  appendSeven() { this.appendDigit('7'); },
  appendEight() { this.appendDigit('8'); },
  appendNine() { this.appendDigit('9'); },
  appendZero() { this.appendDigit('0'); },

  removeDigit() {
    if (this.editorCode.length > 0) {
      this.editorCode = this.editorCode.substring(0, this.editorCode.length - 1);
    }
  },

  goBack() {
    this.viewMode = 'list';
    this.selectedName = '';
    this.selectedType = '';
    this.selectedCode = '';
    this.selectedId = '';
    this.codePlaceholder = 'CODE';
    this.hasBarcode = false;
    this.barcodeBars = [];
    this.hasQrImage = false;
    this.isScanMode = false;
  }
}
