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
    cards: cards
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
