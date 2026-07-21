import cards from '../../common/cards.js';
import storage from '@system.storage';
import cardLookup from '../../common/cardLookup.js';
import createBarcodeBars from '../../common/barcodeRenderer.js';
import getCardFormatLabel from '../../common/cardFormats.js';
import { calculateEan13CheckDigit, isEan13Code } from '../../common/ean13.js';

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
    editorCode: '',
    editorTitle: 'New EAN card',
    editorMessage: 'Enter 12 or 13 digits',
    editorCanSave: false,
    editorFormat: 'ean13',
    qrPreviewCode: '',
    editingCustomEan: false,
    isCustomEan: false,
    customEanVisible: false,
    customEanCode: ''
  },

  onInit() {
    let page = this;
    storage.get({
      key: 'custom_ean_code',
      success: function(data) {
        if (typeof data === 'string' && isEan13Code(data)) {
          page.customEanCode = data;
          page.customEanVisible = true;
        }
      }
    });
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
      this.isCustomEan = false;
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

  openCustomEan() {
    this.selectedName = 'EAN Card 1';
    this.selectedType = getCardFormatLabel('ean13');
    this.selectedCode = this.customEanCode;
    this.selectedId = 'custom-ean-1';
    this.codePlaceholder = 'CODE';
    this.barcodeBars = createBarcodeBars('ean13', this.customEanCode);
    this.hasBarcode = this.barcodeBars.length > 0;
    this.hasQrImage = false;
    this.isCustomEan = true;
    this.isScanMode = false;
    this.viewMode = 'detail';
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
    this.editingCustomEan = false;
    this.editorFormat = 'ean13';
    this.editorTitle = 'New EAN card';
    this.editorCode = '';
    this.updateEditorState();
    this.viewMode = 'editor';
  },

  chooseQr() {
    this.editingCustomEan = false;
    this.editorFormat = 'qr';
    this.editorTitle = 'New QR card';
    this.editorCode = '';
    this.updateEditorState();
    this.viewMode = 'editor';
  },

  closeQrPreview() {
    this.editorCode = this.qrPreviewCode;
    this.updateEditorState();
    this.viewMode = 'editor';
  },

  cancelEditor() {
    if (this.editingCustomEan) {
      this.editingCustomEan = false;
      this.openCustomEan();
      return;
    }
    this.editorCode = '';
    this.viewMode = 'addFormat';
  },

  startEditCustomEan() {
    this.editingCustomEan = true;
    this.editorFormat = 'ean13';
    this.editorTitle = 'Edit EAN Card 1';
    this.editorCode = this.customEanCode;
    this.updateEditorState();
    this.viewMode = 'editor';
  },

  requestDeleteCustomEan() {
    this.viewMode = 'deleteConfirm';
  },

  cancelDeleteCustomEan() {
    this.viewMode = 'detail';
  },

  confirmDeleteCustomEan() {
    storage.delete({ key: 'custom_ean_code' });
    this.customEanCode = '';
    this.customEanVisible = false;
    this.isCustomEan = false;
    this.goBack();
  },

  appendDigit(digit) {
    let maxLength = this.editorFormat === 'qr' ? 32 : 13;
    if (this.editorCode.length < maxLength) {
      this.editorCode = this.editorCode + digit;
      this.updateEditorState();
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
      this.updateEditorState();
    }
  },

  updateEditorState() {
    if (this.editorFormat === 'qr') {
      this.editorCanSave = this.editorCode.length > 0 && this.editorCode.length <= 32;
      this.editorMessage = this.editorCanSave ? 'Numeric QR code' : 'Enter 1 to 32 digits';
      return;
    }

    if (this.editorCode.length === 12) {
      this.editorCanSave = true;
      this.editorMessage = 'Check digit will be added';
      return;
    }

    if (this.editorCode.length === 13) {
      this.editorCanSave = isEan13Code(this.editorCode);
      this.editorMessage = this.editorCanSave ? 'Valid EAN-13' : 'Invalid check digit';
      return;
    }

    this.editorCanSave = false;
    this.editorMessage = 'Enter 12 or 13 digits';
  },

  confirmEan() {
    let wasEditing = this.editingCustomEan;
    if (this.editorCode.length === 12) {
      this.editorCode = this.editorCode + calculateEan13CheckDigit(this.editorCode);
    }
    this.updateEditorState();
    if (!this.editorCanSave) {
      return;
    }

    this.customEanCode = this.editorCode;
    this.customEanVisible = true;
    storage.set({
      key: 'custom_ean_code',
      value: this.customEanCode
    });
    this.editorCode = '';
    this.updateEditorState();
    this.editingCustomEan = false;
    if (wasEditing) {
      this.openCustomEan();
    } else {
      this.viewMode = 'list';
    }
  },

  confirmEditor() {
    if (this.editorFormat === 'qr') {
      if (!this.editorCanSave) {
        return;
      }
      this.qrPreviewCode = this.editorCode;
      this.viewMode = 'qrPreview';
      return;
    }
    this.confirmEan();
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
    this.isCustomEan = false;
    this.isScanMode = false;
  }
}
