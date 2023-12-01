const { loadInput } = require('../utils');
const { Trie } = require('../utils');

const SPELLED_OUT_NUMBERS = {
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9
};

const buildNumberTrie = () => {
  const trie = new Trie();
  Object.keys(SPELLED_OUT_NUMBERS).forEach(number => {
    trie.insert(number);
  });
  return trie;
};

const makeTwoDigitsNumber = (str, trie) => {
  const first = getFirstDigit(str, trie);
  const last = getLastDigit(str, trie);
  return parseInt(`${first}${last}`);
};

const getFirstDigit = (str, trie) => {
  for (let i=0; i<str.length; i++) {
    if (/^\d$/.test(str[i])) return str[i];

    const substr = str.substring(i);
    const number = trie.findPrefix(substr);
    if (number) return SPELLED_OUT_NUMBERS[number];
  }
};

const getLastDigit = (str, trie) => {
  for (let i=str.length - 1; i >= 0; i--) {
    if (/^\d$/.test(str[i])) return str[i];

    const substr = str.substring(str.length, i);
    const number = trie.findPrefix(substr);
    if (number) return SPELLED_OUT_NUMBERS[number];
  }
};

const start = () => {
  const trie = buildNumberTrie();
  const input = loadInput('./input.txt');
  const twoDigitsNumbers = input.map(line => makeTwoDigitsNumber(line, trie));
  const result = twoDigitsNumbers.reduce((acc, n) => acc + n, 0);
  console.log(result);
};

start();
