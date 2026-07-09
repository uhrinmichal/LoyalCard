import cards from './cards.js';

function findCardById(cardId) {
  for (var index = 0; index < cards.length; index++) {
    if (cards[index].id === cardId) {
      return cards[index];
    }
  }

  return null;
}

function hasQrAsset(card) {
  return !!card && card.format === 'qr' && !!card.qrAsset;
}

export default {
  findCardById: findCardById,
  hasQrAsset: hasQrAsset
};
