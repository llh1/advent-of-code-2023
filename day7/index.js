const { loadInput } = require('../utils');

const log = console.log;

const CARDS = {
  'A': 14,
  'K': 13,
  'Q': 12,
  'J': 1,
  'T': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2
};

const TYPES = {
  FIVE_OF_A_KIND: 7,
  FOUR_OF_A_KIND: 6,
  FULL_HOUSE: 5,
  THREE_OF_A_KIND: 4,
  TWO_PAIR: 3,
  ONE_PAIR: 2,
  HIGH_CARD: 1
};

const getType = (hand) => {
  log(hand);
  const cards = hand.split('');
  const cardCounts = cards.reduce((acc, card) => {
    if (!acc[card]) acc[card] = 0;
    acc[card]++;
    return acc;
  }, {});

  let jokers = cardCounts['J'] || 0;
  if (jokers !== 5) delete cardCounts['J'];
  const counts = Object.values(cardCounts).sort((a, b) => b - a);

  let i = 0;
  while (jokers !== 5 && jokers > 0) {
    if (counts[i] < 5) {
      counts[i]++;
      jokers--;
    } else {
      i++;
    }
  }

  if(counts[0] === 5) return TYPES.FIVE_OF_A_KIND;
  else if(counts[0] === 4) return TYPES.FOUR_OF_A_KIND;
  else if(counts[0] === 3 && counts[1] === 2) return TYPES.FULL_HOUSE;
  else if(counts[0] === 3 && counts[1] === 1) return TYPES.THREE_OF_A_KIND;
  else if(counts[0] === 2 && counts[1] === 2) return TYPES.TWO_PAIR;
  else if(counts[0] === 2 && counts[1] === 1) return TYPES.ONE_PAIR;
  else return TYPES.HIGH_CARD;
};

const parseHands = (input) => input.map(line => {
  const matches = line.split(' ');
  return {
    hand: matches[0],
    type: getType(matches[0]),
    bid: parseInt(matches[1])
  };
});

const sortIdenticalTypeHands = (hand1, hand2) => {
  for (let i=0; i<hand1.length; i++) {
    if (CARDS[hand1[i]] === CARDS[hand2[i]]) continue;
    return CARDS[hand1[i]] > CARDS[hand2[i]] ? -1 : 1;
  }
};

const sortHands = (hands) => hands.sort((a, b) => {
  if (a.type > b.type) return -1;
  else if (a.type === b.type) return sortIdenticalTypeHands(a.hand, b.hand);
  else return 1;
});

const getTotalWinning = (hands) => hands.reverse().reduce((acc, hand, index) => hand.bid * (index + 1) + acc, 0);

const start = () => {
  const input = loadInput('input.txt');
  const hands = parseHands(input);
  const sortedHands = sortHands(hands);
  const totalWinning = getTotalWinning(sortedHands);
  log(totalWinning);
};

start();
