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
    customCardList: [],
    hasFreeCustomSlot: true,
    sharedCardsLoaded: false,
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
    customEan2Visible: false,
    customEan2Code: '',
    customEan2Name: 'EAN Card 2',
    activeEanSlot: 1,
    targetEanSlot: 1,
    customQrVisible: false,
    customQrCode: '',
    customQrName: 'QR Card 1',
    customQr2Visible: false,
    customQr2Code: '',
    customQr2Name: 'QR Card 2',
    activeQrSlot: 1,
    targetQrSlot: 1,
    isCustomQr: false
  },

  onInit() {
    let page = this;
    storage.get({
      key: 'custom_cards_v2',
      success: function(data) {
        page.restoreSharedCards(data);
      }
    });
    storage.get({
      key: 'custom_ean_code',
      success: function(data) {
        if (typeof data === 'string' && isEan13Code(data)) {
          page.customEanCode = data;
          page.customEanVisible = true;
          page.refreshCustomCardList();
        }
      }
    });
    storage.get({
      key: 'custom_qr_code',
      success: function(data) {
        if (isNumericQrCode(data)) {
          page.customQrCode = data;
          page.customQrVisible = true;
          page.refreshCustomCardList();
        }
      }
    });
    storage.get({
      key: 'custom_ean_name',
      success: function(data) {
        if (isValidCardName(data)) {
          page.customEanName = data.trim();
          page.refreshCustomCardList();
        }
      }
    });
    storage.get({
      key: 'custom_qr_name',
      success: function(data) {
        if (isValidCardName(data)) {
          page.customQrName = data.trim();
          page.refreshCustomCardList();
        }
      }
    });
    storage.get({
      key: 'custom_ean_2_code',
      success: function(data) {
        if (typeof data === 'string' && isEan13Code(data)) {
          page.customEan2Code = data;
          page.customEan2Visible = true;
          page.refreshCustomCardList();
        }
      }
    });
    storage.get({
      key: 'custom_ean_2_name',
      success: function(data) {
        if (isValidCardName(data)) {
          page.customEan2Name = data.trim();
          page.refreshCustomCardList();
        }
      }
    });
    storage.get({
      key: 'custom_qr_2_code',
      success: function(data) {
        if (isNumericQrCode(data)) {
          page.customQr2Code = data;
          page.customQr2Visible = true;
          page.refreshCustomCardList();
        }
      }
    });
    storage.get({
      key: 'custom_qr_2_name',
      success: function(data) {
        if (isValidCardName(data)) {
          page.customQr2Name = data.trim();
          page.refreshCustomCardList();
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

  openKaufland() {
    this.openCard('kaufland');
  },

  openCustomEan() {
    this.activeEanSlot = 1;
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

  refreshCustomCardList() {
    if (this.sharedCardsLoaded) {
      return;
    }
    let customCards = [];
    if (this.customEanVisible) {
      customCards.push({ slot: '1', format: 'ean13', name: this.customEanName, code: this.customEanCode });
    }
    if (this.customEan2Visible) {
      customCards.push({ slot: '2', format: 'ean13', name: this.customEan2Name, code: this.customEan2Code });
    }
    if (this.customQrVisible) {
      customCards.push({ slot: '3', format: 'qr', name: this.customQrName, code: this.customQrCode });
    }
    if (this.customQr2Visible) {
      customCards.push({ slot: '4', format: 'qr', name: this.customQr2Name, code: this.customQr2Code });
    }
    this.customCardList = customCards;
    this.updateSlotAvailability();
  },

  openCustomCard(slot) {
    let card = this.findCustomCard(slot);
    if (!card) {
      return;
    }
    this.selectedName = card.name;
    this.selectedType = getCardFormatLabel(card.format);
    this.selectedCode = card.code;
    this.selectedId = 'custom-' + card.slot;
    this.codePlaceholder = card.format === 'qr' ? 'QR' : 'CODE';
    this.barcodeBars = createBarcodeBars(card.format, card.code);
    this.hasBarcode = this.barcodeBars.length > 0;
    this.hasQrImage = false;
    this.hasNativeQr = card.format === 'qr';
    this.isCustomEan = card.format === 'ean13';
    this.isCustomQr = card.format === 'qr';
    if (this.isCustomEan) {
      this.activeEanSlot = Number(card.slot);
    } else {
      this.activeQrSlot = Number(card.slot);
    }
    this.isScanMode = false;
    this.viewMode = 'detail';
  },

  findCustomCard(slot) {
    let slotId = String(slot);
    for (let index = 0; index < this.customCardList.length; index++) {
      if (String(this.customCardList[index].slot) === slotId) {
        return this.customCardList[index];
      }
    }
    return null;
  },

  findFirstFreeSlot() {
    for (let slot = 1; slot <= 10; slot++) {
      if (!this.findCustomCard(slot)) {
        return slot;
      }
    }
    return 0;
  },

  updateSlotAvailability() {
    this.hasFreeCustomSlot = this.findFirstFreeSlot() > 0;
  },

  setCustomCards(cardsToSet) {
    let orderedCards = [];
    for (let slot = 1; slot <= 10; slot++) {
      for (let index = 0; index < cardsToSet.length; index++) {
        if (String(cardsToSet[index].slot) === String(slot)) {
          orderedCards.push(cardsToSet[index]);
          break;
        }
      }
    }
    this.customCardList = orderedCards;
    this.sharedCardsLoaded = true;
    this.updateSlotAvailability();
  },

  upsertCustomCard(slot, format, name, code) {
    let updatedCards = [];
    let replaced = false;
    for (let index = 0; index < this.customCardList.length; index++) {
      let card = this.customCardList[index];
      if (String(card.slot) === String(slot)) {
        updatedCards.push({ slot: String(slot), format: format, name: name, code: code });
        replaced = true;
      } else {
        updatedCards.push(card);
      }
    }
    if (!replaced) {
      updatedCards.push({ slot: String(slot), format: format, name: name, code: code });
    }
    this.setCustomCards(updatedCards);
    this.persistCustomCards();
  },

  removeCustomCard(slot) {
    let remainingCards = [];
    for (let index = 0; index < this.customCardList.length; index++) {
      if (String(this.customCardList[index].slot) !== String(slot)) {
        remainingCards.push(this.customCardList[index]);
      }
    }
    this.setCustomCards(remainingCards);
    this.persistCustomCards();
  },

  persistCustomCards() {
    storage.set({ key: 'custom_cards_v2', value: JSON.stringify(this.customCardList) });
    storage.delete({ key: 'custom_ean_code' });
    storage.delete({ key: 'custom_ean_name' });
    storage.delete({ key: 'custom_ean_2_code' });
    storage.delete({ key: 'custom_ean_2_name' });
    storage.delete({ key: 'custom_qr_code' });
    storage.delete({ key: 'custom_qr_name' });
    storage.delete({ key: 'custom_qr_2_code' });
    storage.delete({ key: 'custom_qr_2_name' });
  },

  restoreSharedCards(serializedCards) {
    if (typeof serializedCards !== 'string') {
      return;
    }
    try {
      let parsedCards = JSON.parse(serializedCards);
      if (!parsedCards || typeof parsedCards.length !== 'number') {
        return;
      }
      let restoredCards = [];
      for (let index = 0; index < parsedCards.length && restoredCards.length < 10; index++) {
        let card = parsedCards[index];
        let slot = Number(card.slot);
        let validFormat = card.format === 'ean13' || card.format === 'qr';
        let validCode = card.format === 'ean13' ? isEan13Code(card.code) : isNumericQrCode(card.code);
        if (slot >= 1 && slot <= 10 && validFormat && validCode && isValidCardName(card.name)) {
          restoredCards.push({
            slot: String(slot),
            format: card.format,
            name: card.name.trim(),
            code: card.code
          });
        }
      }
      this.setCustomCards(restoredCards);
    } catch (error) {
      console.error('Unable to restore custom cards');
    }
  },

  openCustomEan2() {
    this.activeEanSlot = 2;
    this.selectedName = this.customEan2Name;
    this.selectedType = getCardFormatLabel('ean13');
    this.selectedCode = this.customEan2Code;
    this.selectedId = 'custom-ean-2';
    this.codePlaceholder = 'CODE';
    this.barcodeBars = createBarcodeBars('ean13', this.customEan2Code);
    this.hasBarcode = this.barcodeBars.length > 0;
    this.hasQrImage = false;
    this.hasNativeQr = false;
    this.isCustomEan = true;
    this.isCustomQr = false;
    this.isScanMode = false;
    this.viewMode = 'detail';
  },

  openActiveCustomEan() {
    if (this.activeEanSlot === 2) {
      this.openCustomEan2();
    } else {
      this.openCustomEan();
    }
  },

  openCustomQr() {
    this.activeQrSlot = 1;
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

  openCustomQr2() {
    this.activeQrSlot = 2;
    this.selectedName = this.customQr2Name;
    this.selectedType = getCardFormatLabel('qr');
    this.selectedCode = this.customQr2Code;
    this.selectedId = 'custom-qr-2';
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

  openActiveCustomQr() {
    if (this.activeQrSlot === 2) {
      this.openCustomQr2();
    } else {
      this.openCustomQr();
    }
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
    this.targetEanSlot = this.findFirstFreeSlot();
    if (this.targetEanSlot === 0) {
      return;
    }
    this.activeEanSlot = this.targetEanSlot;
    this.editorCode = '';
    this.startNameEditor('', 'Name EAN card');
  },

  chooseQr() {
    this.editingCustomEan = false;
    this.editingCustomQr = false;
    this.editorFormat = 'qr';
    this.targetQrSlot = this.findFirstFreeSlot();
    if (this.targetQrSlot === 0) {
      return;
    }
    this.activeQrSlot = this.targetQrSlot;
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
      this.openCustomCard(this.activeEanSlot);
      return;
    }
    if (this.editingCustomQr) {
      this.editingCustomQr = false;
      this.openCustomCard(this.activeQrSlot);
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
      let eanCard = this.findCustomCard(this.targetEanSlot);
      this.editorCode = eanCard ? eanCard.code : '';
    } else if (this.editingCustomQr) {
      let qrCard = this.findCustomCard(this.targetQrSlot);
      this.editorCode = qrCard ? qrCard.code : '';
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
    this.targetEanSlot = this.activeEanSlot;
    let card = this.findCustomCard(this.targetEanSlot);
    if (!card) {
      return;
    }
    this.editorCode = card.code;
    this.startNameEditor(card.name, 'Edit card name');
  },

  startEditCustomQr() {
    this.editingCustomEan = false;
    this.editingCustomQr = true;
    this.editorFormat = 'qr';
    this.targetQrSlot = this.activeQrSlot;
    let card = this.findCustomCard(this.targetQrSlot);
    if (!card) {
      return;
    }
    this.editorCode = card.code;
    this.startNameEditor(card.name, 'Edit card name');
  },

  requestDeleteCustomEan() {
    this.viewMode = 'deleteConfirm';
  },

  cancelDeleteCustomEan() {
    this.viewMode = 'detail';
  },

  confirmDeleteCustomEan() {
    this.removeCustomCard(this.activeEanSlot);
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
    this.removeCustomCard(this.activeQrSlot);
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

    this.upsertCustomCard(this.targetEanSlot, 'ean13', this.editorName, this.editorCode);
    this.editorCode = '';
    this.updateEditorState();
    this.editingCustomEan = false;
    if (wasEditing) {
      this.openCustomCard(this.activeEanSlot);
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
      this.upsertCustomCard(this.targetQrSlot, 'qr', this.editorName, this.editorCode);
      this.editorCode = '';
      this.updateEditorState();
      this.editingCustomQr = false;
      if (wasEditing) {
        this.openCustomCard(this.activeQrSlot);
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
