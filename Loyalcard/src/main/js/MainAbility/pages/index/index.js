import defaultCards from '../../common/cards.js';
import createBarcodeBars from '../../common/barcodeRenderer.js';
import getCardFormatLabel from '../../common/cardFormats.js';
import createQrRenderData from '../../common/qrRenderer.js';
import {
  cloneCards,
  createCard,
  findCardById,
  removeCard,
  restoreCards,
  updateCardCode,
  validateCardCode
} from '../../common/cardManager.js';

const NORMAL_QR_SIZE = 140;
const SCAN_QR_SIZE = 210;

export default {
  data: {
    viewMode: 'list',
    cards: cloneCards(defaultCards),
    selectedName: '',
    selectedType: '',
    selectedCode: '',
    selectedId: '',
    selectedFormat: '',
    codePlaceholder: 'CODE',
    hasBarcode: false,
    barcodeBars: [],
    hasQrCode: false,
    qrModules: [],
    qrModuleSize: 0,
    qrContentSize: 0,
    qrOuterSize: 0,
    scanQrModuleSize: 0,
    scanQrContentSize: 0,
    scanQrOuterSize: 0,
    isScanMode: false,
    editingCardId: '',
    editorFormat: '',
    editorCode: '',
    editorTitle: '',
    editorMessage: '',
    editorCanSave: false,
    keypadDigits: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  },

  openCard(cardId) {
    let selectedCard = findCardById(this.cards, cardId);
    if (!selectedCard) {
      return;
    }

    this.selectedName = selectedCard.name;
    this.selectedType = getCardFormatLabel(selectedCard.format);
    this.selectedCode = selectedCard.code;
    this.selectedId = selectedCard.id;
    this.selectedFormat = selectedCard.format;
    this.codePlaceholder = selectedCard.format === 'qr' ? 'QR' : 'CODE';
    this.prepareCode(selectedCard);
    this.isScanMode = false;
    this.viewMode = 'detail';
  },

  prepareCode(card) {
    this.barcodeBars = createBarcodeBars(card.format, card.code);
    this.hasBarcode = this.barcodeBars.length > 0;
    this.hasQrCode = card.format === 'qr';

    if (this.hasQrCode) {
      let normalQr = createQrRenderData(card.code, NORMAL_QR_SIZE);
      let scanQr = createQrRenderData(card.code, SCAN_QR_SIZE);
      this.qrModules = normalQr.modules;
      this.qrModuleSize = normalQr.moduleSize;
      this.qrContentSize = normalQr.contentSize;
      this.qrOuterSize = normalQr.outerSize;
      this.scanQrModuleSize = scanQr.moduleSize;
      this.scanQrContentSize = scanQr.contentSize;
      this.scanQrOuterSize = scanQr.outerSize;
    } else {
      this.resetQrData();
    }
  },

  resetQrData() {
    this.qrModules = [];
    this.qrModuleSize = 0;
    this.qrContentSize = 0;
    this.qrOuterSize = 0;
    this.scanQrModuleSize = 0;
    this.scanQrContentSize = 0;
    this.scanQrOuterSize = 0;
  },

  toggleScanMode() {
    this.isScanMode = !this.isScanMode;
  },

  startAdd() {
    this.editingCardId = '';
    this.viewMode = 'addFormat';
  },

  cancelAdd() {
    this.viewMode = 'list';
  },

  chooseQr() {
    this.startEditor('qr', '', 'New QR card');
  },

  chooseEan() {
    this.startEditor('ean13', '', 'New EAN card');
  },

  startEdit() {
    this.editingCardId = this.selectedId;
    this.startEditor(this.selectedFormat, this.selectedCode, 'Edit ' + this.selectedName);
  },

  startEditor(format, code, title) {
    this.editorFormat = format;
    this.editorCode = code;
    this.editorTitle = title;
    this.updateEditorState();
    this.viewMode = 'editor';
  },

  appendDigit(digit) {
    let maximumLength = this.editorFormat === 'ean13' ? 13 : 64;
    if (this.editorCode.length < maximumLength) {
      this.editorCode += digit;
      this.updateEditorState();
    }
  },

  appendZero() {
    this.appendDigit('0');
  },

  removeDigit() {
    if (this.editorCode.length > 0) {
      this.editorCode = this.editorCode.substring(0, this.editorCode.length - 1);
      this.updateEditorState();
    }
  },

  updateEditorState() {
    let validation = validateCardCode(this.editorFormat, this.editorCode);
    this.editorCanSave = validation.valid;
    this.editorMessage = validation.message;
  },

  saveEditor() {
    let validation = validateCardCode(this.editorFormat, this.editorCode);
    if (!validation.valid) {
      this.updateEditorState();
      return;
    }

    let cardId = this.editingCardId;
    if (cardId) {
      this.cards = updateCardCode(this.cards, cardId, validation.code);
    } else {
      let newCard = createCard(this.cards, this.editorFormat, validation.code);
      this.cards = this.cards.concat(newCard);
      cardId = newCard.id;
    }

    this.editingCardId = '';
    this.openCard(cardId);
  },

  cancelEditor() {
    if (this.editingCardId) {
      let cardId = this.editingCardId;
      this.editingCardId = '';
      this.openCard(cardId);
    } else {
      this.viewMode = 'addFormat';
    }
  },

  requestDelete() {
    this.viewMode = 'deleteConfirm';
  },

  cancelDelete() {
    this.viewMode = 'detail';
  },

  confirmDelete() {
    this.cards = removeCard(this.cards, this.selectedId);
    this.clearSelection();
    this.viewMode = 'list';
  },

  goBack() {
    this.clearSelection();
    this.viewMode = 'list';
  },

  clearSelection() {
    this.selectedName = '';
    this.selectedType = '';
    this.selectedCode = '';
    this.selectedId = '';
    this.selectedFormat = '';
    this.codePlaceholder = 'CODE';
    this.hasBarcode = false;
    this.barcodeBars = [];
    this.hasQrCode = false;
    this.resetQrData();
    this.isScanMode = false;
  },

  onSaveData(savedData) {
    savedData.cards = JSON.stringify(this.cards);
    return true;
  },

  onRestoreData(savedData) {
    this.cards = restoreCards(savedData ? savedData.cards : null, defaultCards);
    this.clearSelection();
    this.viewMode = 'list';
  }
}
