import router from '@system.router';
import cardStore from '../../common/cardStore.js';
import { createCard, validateCardCode } from '../../common/cardManager.js';

export default {
  data: {
    cardId: '',
    viewMode: 'choice',
    editorFormat: '',
    editorCode: '',
    editorTitle: '',
    editorMessage: '',
    editorCanSave: false,
    keypadDigits: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  },

  onInit() {
    let params = router.getParams();
    if (params && params.cardId) {
      this.cardId = params.cardId;
    }
    if (this.cardId) {
      let card = cardStore.find(this.cardId);
      if (card) {
        this.startEditor(card.format, card.code, 'Edit ' + card.name);
      }
    }
  },

  chooseQr() {
    this.startEditor('qr', '', 'New QR card');
  },

  chooseEan() {
    this.startEditor('ean13', '', 'New EAN card');
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

    if (this.cardId) {
      cardStore.update(this.cardId, validation.code);
    } else {
      cardStore.add(createCard(cardStore.getCards(), this.editorFormat, validation.code));
    }
    this.leaveEditor();
  },

  goBack() {
    if (this.viewMode === 'editor' && !this.cardId) {
      this.viewMode = 'choice';
      return;
    }
    this.leaveEditor();
  },

  leaveEditor() {
    if (this.cardId) {
      router.replace({
        url: 'pages/detail/detail',
        params: { cardId: this.cardId }
      });
      return;
    }
    router.replace({ url: 'pages/index/index' });
  },

  onSaveData(savedData) {
    savedData.cards = cardStore.serialize();
    return true;
  },

  onRestoreData(savedData) {
    cardStore.restore(savedData ? savedData.cards : null);
  }
}
