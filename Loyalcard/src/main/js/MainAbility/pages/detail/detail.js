import router from '@system.router';
import cardLookup from '../../common/cardLookup.js';
import createBarcodeBars from '../../common/barcodeRenderer.js';
import getCardFormatLabel from '../../common/cardFormats.js';

export default {
  data: {
    cardId: '',
    cardName: '',
    cardType: '',
    cardCode: '',
    codePlaceholder: 'CODE',
    hasBarcode: false,
    barcodeBars: [],
    hasQrImage: false,
    isScanMode: false
  },

  onInit() {
    let selectedCard = cardLookup.findCardById(this.cardId);

    if (selectedCard) {
      this.cardName = selectedCard.name;
      this.cardType = this.getFormatLabel(selectedCard.format);
      this.cardCode = selectedCard.code;
      this.codePlaceholder = selectedCard.format === 'qr' ? 'QR' : 'CODE';
      this.barcodeBars = createBarcodeBars(selectedCard.format, selectedCard.code);
      this.hasBarcode = this.barcodeBars.length > 0;
      this.hasQrImage = cardLookup.hasQrAsset(selectedCard);
    }
  },

  getFormatLabel(format) {
    return getCardFormatLabel(format);
  },

  toggleScanMode() {
    this.isScanMode = !this.isScanMode;
  },

  goBack() {
    router.back();
  }
}
