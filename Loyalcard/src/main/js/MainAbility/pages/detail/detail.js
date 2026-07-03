import router from '@system.router';
import cardRepository from '../../common/cards.js';

export default {
  data: {
    cardId: '',
    cardName: '',
    cardType: '',
    cardCode: ''
  },

  onInit() {
    const selectedCard = cardRepository.getCardById(this.cardId);

    if (selectedCard) {
      this.cardName = selectedCard.name;
      this.cardType = selectedCard.type;
      this.cardCode = selectedCard.code;
    }
  },

  goBack() {
    router.back();
  }
}
