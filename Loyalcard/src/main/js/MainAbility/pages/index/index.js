import router from '@system.router';
import cardRepository from '../../common/cards.js';

export default {
  data: {
    cards: cardRepository.getCards()
  },

  openCard(cardId) {
    router.push({
      uri: 'pages/detail/detail',
      params: {
        cardId: cardId
      }
    });
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
  }
}
