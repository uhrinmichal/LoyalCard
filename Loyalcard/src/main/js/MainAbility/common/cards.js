const cards = [
  {
    id: 'lidl',
    name: 'Lidl Plus',
    format: 'qr',
    code: '1234567890123',
    qrAsset: '/common/qr_lidl.png',
    badge: 'L',
    badgeColor: 'yellow'
  },
  {
    id: 'tesco',
    name: 'Tesco Clubcard',
    format: 'ean13',
    code: '5901234123457',
    badge: 'T',
    badgeColor: 'blue'
  },
  {
    id: 'kaufland',
    name: 'Kaufland Card',
    format: 'qr',
    code: '555666777888',
    qrAsset: '/common/qr_kaufland.png',
    badge: 'K',
    badgeColor: 'orange'
  },
  {
    id: 'billa',
    name: 'BILLA Bonus',
    format: 'ean13',
    code: '4006381333931',
    badge: 'B',
    badgeColor: 'red'
  }
];

export default cards;
