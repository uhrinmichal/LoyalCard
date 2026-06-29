export default {
  data: {
    viewMode: 'list',
    selectedName: '',
    selectedType: '',
    selectedCode: '',

    cards: [
      {
        id: 'lidl',
        name: 'Lidl Plus',
        type: 'QR karta',
        code: '1234567890123'
      },
      {
        id: 'tesco',
        name: 'Tesco Clubcard',
        type: 'Ciarovy kod',
        code: '9876543210123'
      },
      {
        id: 'kaufland',
        name: 'Kaufland Card',
        type: 'QR karta',
        code: '555666777888'
      },
      {
        id: 'billa',
        name: 'BILLA Bonus',
        type: 'Ciarovy kod',
        code: '444333222111'
      }
    ]
  },

  openCard(index) {
    const card = this.cards[index];
    this.selectedName = card.name;
    this.selectedType = card.type;
    this.selectedCode = card.code;
    this.viewMode = 'detail';
  },

  openLidl() {
    this.openCard(0);
  },

  openTesco() {
    this.openCard(1);
  },

  openKaufland() {
    this.openCard(2);
  },

  openBilla() {
    this.openCard(3);
  },

  goBack() {
    this.viewMode = 'list';
  }
}
