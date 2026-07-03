import cards from '../../common/cards.js';

export default {
  data: {
    viewMode: 'list',
    selectedName: '',
    selectedType: '',
    selectedCode: '',
    cards: cards
  },

  openCard(cardId) {
    let selectedCard = null;

    for (let index = 0; index < this.cards.length; index++) {
      if (this.cards[index].id === cardId) {
        selectedCard = this.cards[index];
      }
    }

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
