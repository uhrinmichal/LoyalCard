import cardRepository from '../../common/cards.js';

export default {
  data: {
    viewMode: 'list',
    selectedName: '',
    selectedType: '',
    selectedCode: '',
    cards: cardRepository.getCards()
  },

  openCard(cardId) {
    const selectedCard = cardRepository.getCardById(cardId);

    if (selectedCard) {
      this.selectedName = selectedCard.name;
      this.selectedType = selectedCard.type;
      this.selectedCode = selectedCard.code;
      this.viewMode = 'detail';
    }
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

  goBack() {
    this.viewMode = 'list';
    this.selectedName = '';
    this.selectedType = '';
    this.selectedCode = '';
  }
}
