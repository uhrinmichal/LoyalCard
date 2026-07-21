import cards from '../../common/cards.js';
import storage from '@system.storage';
import cardLookup from '../../common/cardLookup.js';
import createBarcodeBars from '../../common/barcodeRenderer.js';
import getCardFormatLabel from '../../common/cardFormats.js';
import { calculateEan13CheckDigit, isEan13Code } from '../../common/ean13.js';

function isNumericQrCode(code) {
  if (typeof code !== 'string' || code.length < 1 || code.length > 32) {
    return false;
  }
  for (let index = 0; index < code.length; index++) {
    let digit = code.charAt(index);
    if (digit < '0' || digit > '9') {
      return false;
    }
  }
  return true;
}

function isValidCardName(name) {
  return typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 20;
}

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
    hasNativeQr: false,
    isScanMode: false,
    cards: cards,
    editorCode: '',
    editorTitle: 'New EAN card',
    editorMessage: 'Enter 12 or 13 digits',
    editorCanSave: false,
    editorFormat: 'ean13',
    editorName: '',
    nameEditorTitle: 'Card name',
    nameEditorMessage: 'Enter 1 to 20 characters',
    nameCanContinue: false,
    qrPreviewCode: '',
    editingCustomEan: false,
    editingCustomQr: false,
    isCustomEan: false,
    customEanVisible: false,
    customEanCode: '',
    customEanName: 'EAN Card 1',
    customQrVisible: false,
    customQrCode: '',
    customQrName: 'QR Card 1',
    isCustomQr: false
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
    storage.get({
      key: 'custom_qr_code',
      success: function(data) {
        if (isNumericQrCode(data)) {
          page.customQrCode = data;
          page.customQrVisible = true;
        }
      }
    });
    storage.get({
      key: 'custom_ean_name',
      success: function(data) {
        if (isValidCardName(data)) {
          page.customEanName = data.trim();
        }
      }
    });
    storage.get({
      key: 'custom_qr_name',
      success: function(data) {
        if (isValidCardName(data)) {
          page.customQrName = data.trim();
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
      this.hasNativeQr = false;
      this.isCustomEan = false;
      this.isCustomQr = false;
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
    this.selectedName = this.customEanName;
    this.selectedType = getCardFormatLabel('ean13');
    this.selectedCode = this.customEanCode;
    this.selectedId = 'custom-ean-1';
    this.codePlaceholder = 'CODE';
    this.barcodeBars = createBarcodeBars('ean13', this.customEanCode);
    this.hasBarcode = this.barcodeBars.length > 0;
    this.hasQrImage = false;
    this.hasNativeQr = false;
    this.isCustomEan = true;
    this.isCustomQr = false;
    this.isScanMode = false;
    this.viewMode = 'detail';
  },

  openCustomQr() {
    this.selectedName = this.customQrName;
    this.selectedType = getCardFormatLabel('qr');
    this.selectedCode = this.customQrCode;
    this.selectedId = 'custom-qr-1';
    this.codePlaceholder = 'QR';
    this.barcodeBars = [];
    this.hasBarcode = false;
    this.hasQrImage = false;
    this.hasNativeQr = true;
    this.isCustomEan = false;
    this.isCustomQr = true;
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
    this.editingCustomQr = false;
    this.editorFormat = 'ean13';
    this.editorCode = '';
    this.startNameEditor('', 'Name EAN card');
  },

  chooseQr() {
    this.editingCustomEan = false;
    this.editingCustomQr = false;
    this.editorFormat = 'qr';
    this.editorCode = '';
    this.startNameEditor('', 'Name QR card');
  },

  startNameEditor(name, title) {
    this.editorName = name;
    this.nameEditorTitle = title;
    this.updateNameState();
    this.viewMode = 'nameEditor';
  },

  updateNameState() {
    this.nameCanContinue = isValidCardName(this.editorName);
    this.nameEditorMessage = this.nameCanContinue ? 'Name ready' : 'Enter 1 to 20 characters';
  },

  appendNameCharacter(character) {
    if (this.editorName.length < 20) {
      this.editorName = this.editorName + character;
      this.updateNameState();
    }
  },

  appendNameA() { this.appendNameCharacter('A'); },
  appendNameB() { this.appendNameCharacter('B'); },
  appendNameC() { this.appendNameCharacter('C'); },
  appendNameD() { this.appendNameCharacter('D'); },
  appendNameE() { this.appendNameCharacter('E'); },
  appendNameF() { this.appendNameCharacter('F'); },
  appendNameG() { this.appendNameCharacter('G'); },
  appendNameH() { this.appendNameCharacter('H'); },
  appendNameI() { this.appendNameCharacter('I'); },
  appendNameJ() { this.appendNameCharacter('J'); },
  appendNameK() { this.appendNameCharacter('K'); },
  appendNameL() { this.appendNameCharacter('L'); },
  appendNameM() { this.appendNameCharacter('M'); },
  appendNameN() { this.appendNameCharacter('N'); },
  appendNameO() { this.appendNameCharacter('O'); },
  appendNameP() { this.appendNameCharacter('P'); },
  appendNameQ() { this.appendNameCharacter('Q'); },
  appendNameR() { this.appendNameCharacter('R'); },
  appendNameS() { this.appendNameCharacter('S'); },
  appendNameT() { this.appendNameCharacter('T'); },
  appendNameU() { this.appendNameCharacter('U'); },
  appendNameV() { this.appendNameCharacter('V'); },
  appendNameW() { this.appendNameCharacter('W'); },
  appendNameX() { this.appendNameCharacter('X'); },
  appendNameY() { this.appendNameCharacter('Y'); },
  appendNameZ() { this.appendNameCharacter('Z'); },
  appendNameSpace() { this.appendNameCharacter(' '); },

  removeNameCharacter() {
    if (this.editorName.length > 0) {
      this.editorName = this.editorName.substring(0, this.editorName.length - 1);
      this.updateNameState();
    }
  },

  cancelNameEditor() {
    if (this.editingCustomEan) {
      this.editingCustomEan = false;
      this.openCustomEan();
      return;
    }
    if (this.editingCustomQr) {
      this.editingCustomQr = false;
      this.openCustomQr();
      return;
    }
    this.viewMode = 'addFormat';
  },

  confirmCardName() {
    if (!this.nameCanContinue) {
      return;
    }
    this.editorName = this.editorName.trim();
    if (this.editingCustomEan) {
      this.editorCode = this.customEanCode;
    } else if (this.editingCustomQr) {
      this.editorCode = this.customQrCode;
    }
    this.editorTitle = this.editorFormat === 'qr' ? 'Enter QR code' : 'Enter EAN code';
    this.updateEditorState();
    this.viewMode = 'editor';
  },

  closeQrPreview() {
    this.editorCode = this.qrPreviewCode;
    this.updateEditorState();
    this.viewMode = 'editor';
  },

  cancelEditor() {
    this.viewMode = 'nameEditor';
  },

  startEditCustomEan() {
    this.editingCustomEan = true;
    this.editingCustomQr = false;
    this.editorFormat = 'ean13';
    this.editorCode = this.customEanCode;
    this.startNameEditor(this.customEanName, 'Edit card name');
  },

  startEditCustomQr() {
    this.editingCustomEan = false;
    this.editingCustomQr = true;
    this.editorFormat = 'qr';
    this.editorCode = this.customQrCode;
    this.startNameEditor(this.customQrName, 'Edit card name');
  },

  requestDeleteCustomEan() {
    this.viewMode = 'deleteConfirm';
  },

  cancelDeleteCustomEan() {
    this.viewMode = 'detail';
  },

  confirmDeleteCustomEan() {
    storage.delete({ key: 'custom_ean_code' });
    storage.delete({ key: 'custom_ean_name' });
    this.customEanCode = '';
    this.customEanName = 'EAN Card 1';
    this.customEanVisible = false;
    this.isCustomEan = false;
    this.goBack();
  },

  requestDeleteCustomQr() {
    this.viewMode = 'deleteQrConfirm';
  },

  cancelDeleteCustomQr() {
    this.viewMode = 'detail';
  },

  confirmDeleteCustomQr() {
    storage.delete({ key: 'custom_qr_code' });
    storage.delete({ key: 'custom_qr_name' });
    this.customQrCode = '';
    this.customQrName = 'QR Card 1';
    this.customQrVisible = false;
    this.isCustomQr = false;
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
    this.customEanName = this.editorName;
    this.customEanVisible = true;
    storage.set({
      key: 'custom_ean_code',
      value: this.customEanCode
    });
    storage.set({
      key: 'custom_ean_name',
      value: this.customEanName
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
      let wasEditing = this.editingCustomQr;
      if (!this.editorCanSave) {
        return;
      }
      this.qrPreviewCode = this.editorCode;
      this.customQrCode = this.editorCode;
      this.customQrName = this.editorName;
      this.customQrVisible = true;
      storage.set({
        key: 'custom_qr_code',
        value: this.customQrCode
      });
      storage.set({
        key: 'custom_qr_name',
        value: this.customQrName
      });
      this.editorCode = '';
      this.updateEditorState();
      this.editingCustomQr = false;
      if (wasEditing) {
        this.openCustomQr();
      } else {
        this.viewMode = 'list';
      }
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
    this.hasNativeQr = false;
    this.isCustomEan = false;
    this.isCustomQr = false;
    this.isScanMode = false;
  }
}
