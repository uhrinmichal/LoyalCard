export default {
  data: {
    currentName: '',
    currentCode: ''
  },

  showLidl() {
    this.currentName = 'Lidl Plus';
    this.currentCode = '1234567890123';
  },

  showTesco() {
    this.currentName = 'Tesco Clubcard';
    this.currentCode = '9876543210123';
  },

  showKaufland() {
    this.currentName = 'Kaufland Card';
    this.currentCode = '555666777888';
  },

  showBilla() {
    this.currentName = 'BILLA Bonus';
    this.currentCode = '444333222111';
  }
}