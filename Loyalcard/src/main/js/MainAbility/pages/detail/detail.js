import router from '@system.router';
import cards from '../../common/cards.js';
import getCardFormatLabel from '../../common/cardFormats.js';

export default {
  data: {
    cardId: '',
    cardName: '',
    cardType: '',
    cardCode: ''
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
    }
  },

  getFormatLabel(format) {
    return getCardFormatLabel(format);
  },

  goBack() {
    router.back();
  }
}
