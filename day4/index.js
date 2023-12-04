const { loadInput } = require('../utils');

const parseScratchCards = (input) => {
  const normaliseNumbersSequence = (seq) => seq.split(' ').filter(n => n !== '').map(n => parseInt(n));
  const cards = [];
  input.forEach(card => {
    const matches = [...card.matchAll(/^Card\s+\d+:\s+([\d+\s+]+)\s|\s+([\d+\s+]+)$/g)];
    const winningNumbers = new Set(normaliseNumbersSequence(matches[0][1]));
    const ownNumbers = normaliseNumbersSequence(matches[1][2]);
    cards.push({
      winningNumbers,
      ownNumbers
    });
  });
  return cards;
};

const findCardPoints = (cards) => cards.map(({ winningNumbers, ownNumbers }) => {
  let numberOfPoints = 0;
  ownNumbers.forEach(ownNumber => {
    if (winningNumbers.has(ownNumber)) {
      numberOfPoints++;
    }
  });
  return numberOfPoints !== 0 ? Math.pow(2, numberOfPoints - 1) : 0;
});

const getCardPointNumber = (({ winningNumbers, ownNumbers }) => {
  let numberOfPoints = 0;
  ownNumbers.forEach(ownNumber => {
    if (winningNumbers.has(ownNumber)) {
      numberOfPoints++;
    }
  });
  return numberOfPoints;
});

const getNumbersOfScratchcards = (cards) => {
  const scratchcards = Object.keys(cards).reduce((acc, cardIndex) => {
    acc[cardIndex] = 1;
    return acc;
  }, {});

  cards.forEach((card, cardIndex) => {
    const points = getCardPointNumber(card);
    for (let i=cardIndex+1; i<=cardIndex+points; i++) {
      scratchcards[i] += 1 * scratchcards[cardIndex];
    }
  });

  return scratchcards;
};

const start = () => {
  const input = loadInput('input.txt');
  const cards = parseScratchCards(input);

  const points = findCardPoints(cards);
  const result = points.reduce((acc, point) => acc + point, 0);
  console.log(result);

  const scratchcards = getNumbersOfScratchcards(cards);
  console.log(Object.values(scratchcards).reduce((acc, n) => acc + n, 0));
};

start();