import { calculateEan13CheckDigit, isEan13Code } from './ean13.js';

const QR_MAX_LENGTH = 64;
const BADGE_COLORS = ['yellow', 'blue', 'orange', 'red'];

function containsOnlyDigits(value) {
  return /^\d+$/.test(value);
}

function validateCardCode(format, value) {
  let code = value || '';

  if (format === 'qr') {
    if (!code) {
      return { valid: false, code: code, message: 'Enter at least one digit' };
    }
    if (!containsOnlyDigits(code)) {
      return { valid: false, code: code, message: 'QR code must contain digits only' };
    }
    if (code.length > QR_MAX_LENGTH) {
      return { valid: false, code: code, message: 'Maximum is 64 digits' };
    }
    return { valid: true, code: code, message: '' };
  }

  if (format === 'ean13') {
    if (!containsOnlyDigits(code) || (code.length !== 12 && code.length !== 13)) {
      return { valid: false, code: code, message: 'Enter 12 or 13 digits' };
    }

    if (code.length === 12) {
      code += calculateEan13CheckDigit(code);
    }

    if (!isEan13Code(code)) {
      return { valid: false, code: code, message: 'Invalid EAN-13 check digit' };
    }

    return { valid: true, code: code, message: '' };
  }

  return { valid: false, code: code, message: 'Unsupported card type' };
}

function cloneCard(card) {
  let clonedCard = {
    id: card.id,
    name: card.name,
    format: card.format,
    code: card.code,
    badge: card.badge,
    badgeColor: card.badgeColor
  };

  if (card.qrAsset) {
    clonedCard.qrAsset = card.qrAsset;
  }
  return clonedCard;
}

function cloneCards(cards) {
  return cards.map(function(card) {
    return cloneCard(card);
  });
}

function findCardById(cards, cardId) {
  for (let index = 0; index < cards.length; index++) {
    if (cards[index].id === cardId) {
      return cards[index];
    }
  }
  return null;
}

function getNextCustomNumber(cards, format) {
  let prefix = format === 'qr' ? 'QR Card ' : 'EAN Card ';
  let highest = 0;

  for (let index = 0; index < cards.length; index++) {
    if (cards[index].name.indexOf(prefix) === 0) {
      highest = Math.max(highest, Number(cards[index].name.substring(prefix.length)) || 0);
    }
  }

  return highest + 1;
}

function createCard(cards, format, code) {
  let number = getNextCustomNumber(cards, format);
  let card = {
    id: 'custom-' + format + '-' + String(Date.now()),
    name: (format === 'qr' ? 'QR Card ' : 'EAN Card ') + String(number),
    format: format,
    code: code,
    badge: format === 'qr' ? 'Q' : 'E',
    badgeColor: BADGE_COLORS[cards.length % BADGE_COLORS.length]
  };

  return card;
}

function updateCardCode(cards, cardId, code) {
  return cards.map(function(card) {
    let updatedCard = cloneCard(card);
    if (card.id === cardId) {
      updatedCard.code = code;
    }
    return updatedCard;
  });
}

function removeCard(cards, cardId) {
  return cards.filter(function(card) {
    return card.id !== cardId;
  }).map(function(card) {
    return cloneCard(card);
  });
}

function restoreCards(serializedCards, fallbackCards) {
  if (typeof serializedCards !== 'string') {
    return cloneCards(fallbackCards);
  }

  try {
    let parsedCards = JSON.parse(serializedCards);
    if (!Array.isArray(parsedCards)) {
      return cloneCards(fallbackCards);
    }

    for (let index = 0; index < parsedCards.length; index++) {
      let card = parsedCards[index];
      if (!card || !card.id || !card.name) {
        return cloneCards(fallbackCards);
      }
      let validation = validateCardCode(card.format, card.code);
      if (!validation.valid) {
        return cloneCards(fallbackCards);
      }
      card.code = validation.code;
    }

    return cloneCards(parsedCards);
  } catch (error) {
    return cloneCards(fallbackCards);
  }
}

export {
  cloneCards,
  createCard,
  findCardById,
  removeCard,
  restoreCards,
  updateCardCode,
  validateCardCode
};
