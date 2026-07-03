import cards from '../../common/cards.js';
import getCardFormatLabel from '../../common/cardFormats.js';
import ean13 from '../../common/ean13.js';

export default {
  data: {
    viewMode: 'list',
    selectedName: '',
    selectedType: '',
    selectedCode: '',
    selectedCodeWarning: '',
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
      this.selectedType = this.getFormatLabel(selectedCard.format);
      this.selectedCode = selectedCard.code;
      this.selectedCodeWarning = this.getCodeWarning(selectedCard);
      this.viewMode = 'detail';
    }
  },

  getFormatLabel(format) {
    return getCardFormatLabel(format);
  },

  getCodeWarning(card) {
    if (card.format === 'ean13' && !ean13.isValid(card.code)) {
      return 'Invalid barcode';
    }

    return '';
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
    this.selectedCodeWarning = '';
  }
}
