import router from '@system.router';
import cards from '../../common/cards.js';
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
    barcodeBars: []
  },

  onInit() {
    let selectedCard = null;

    for (let index = 0; index < cards.length; index++) {
      if (cards[index].id === this.cardId) {
        selectedCard = cards[index];
      }
    }

    if (selectedCard) {
      this.cardName = selectedCard.name;
      this.cardType = this.getFormatLabel(selectedCard.format);
      this.cardCode = selectedCard.code;
      this.codePlaceholder = selectedCard.format === 'qr' ? 'QR' : 'CODE';
      this.barcodeBars = createBarcodeBars(selectedCard.format, selectedCard.code);
      this.hasBarcode = this.barcodeBars.length > 0;
    }
  },

  getFormatLabel(format) {
    return getCardFormatLabel(format);
  },

  goBack() {
    router.back();
  }
}
