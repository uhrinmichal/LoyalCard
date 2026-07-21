import defaultCards from './cards.js';
import {
  cloneCards,
  findCardById,
  removeCard,
  restoreCards,
  updateCardCode
} from './cardManager.js';

let cards = cloneCards(defaultCards);

function getCards() {
  return cloneCards(cards);
}

function find(cardId) {
  return findCardById(cards, cardId);
}

function add(card) {
  cards = cards.concat(card);
}

function update(cardId, code) {
  cards = updateCardCode(cards, cardId, code);
}

function remove(cardId) {
  cards = removeCard(cards, cardId);
}

function serialize() {
  return JSON.stringify(cards);
}

function restore(serializedCards) {
  cards = restoreCards(serializedCards, defaultCards);
}

export default {
  getCards,
  find,
  add,
  update,
  remove,
  serialize,
  restore
};
