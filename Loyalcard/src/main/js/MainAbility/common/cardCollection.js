function normalizeCustomCards(cards) {
  var normalizedCards = [];
  if (!cards || typeof cards.length !== 'number') {
    return normalizedCards;
  }

  for (var index = 0; index < cards.length && normalizedCards.length < 5; index++) {
    var card = cards[index];
    var alreadyAdded = false;
    for (var addedIndex = 0; addedIndex < normalizedCards.length; addedIndex++) {
      if (String(normalizedCards[addedIndex].slot) === String(card.slot)) {
        alreadyAdded = true;
        break;
      }
    }
    if (!alreadyAdded) {
      normalizedCards.push(card);
    }
  }

  return normalizedCards;
}

function findCustomCardBySlot(cards, slot) {
  var slotId = String(slot);
  for (var index = 0; index < cards.length; index++) {
    if (String(cards[index].slot) === slotId) {
      return cards[index];
    }
  }
  return null;
}

function upsertCustomCardInList(cards, slot, format, name, code) {
  var updatedCards = [];
  var replaced = false;
  for (var index = 0; index < cards.length; index++) {
    var card = cards[index];
    if (String(card.slot) === String(slot)) {
      updatedCards.push({ slot: String(slot), format: format, name: name, code: code });
      replaced = true;
    } else {
      updatedCards.push(card);
    }
  }
  if (!replaced) {
    updatedCards.push({ slot: String(slot), format: format, name: name, code: code });
  }
  return normalizeCustomCards(updatedCards);
}

function removeCustomCardFromList(cards, slot) {
  var remainingCards = [];
  for (var index = 0; index < cards.length; index++) {
    if (String(cards[index].slot) !== String(slot)) {
      remainingCards.push(cards[index]);
    }
  }
  return normalizeCustomCards(remainingCards);
}

function moveCustomCardFirst(cards, slot) {
  var normalizedCards = normalizeCustomCards(cards);
  var selectedCard = findCustomCardBySlot(normalizedCards, slot);
  if (!selectedCard || normalizedCards.length < 2) {
    return normalizedCards;
  }

  var reorderedCards = [selectedCard];
  for (var index = 0; index < normalizedCards.length; index++) {
    if (String(normalizedCards[index].slot) !== String(slot)) {
      reorderedCards.push(normalizedCards[index]);
    }
  }
  return reorderedCards;
}

export {
  normalizeCustomCards,
  findCustomCardBySlot,
  upsertCustomCardInList,
  removeCustomCardFromList,
  moveCustomCardFirst
};
