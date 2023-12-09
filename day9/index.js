const { loadInput } = require('../utils');

const log = console.log;

const parseHistories = (input) => input.map(history => history.split(' ').map(n => parseInt(n)));

const extrapolateHistory = (history) => {
  const nextHistory = [];
  let sumHistory = 0;

  for (let i=1; i<history.length; i++) {
    const diff = history[i] - history[i-1];
    sumHistory += diff;
    nextHistory.push(diff);
  }

  if (sumHistory === 0) return history[history.length - 1];
  return extrapolateHistory(nextHistory) + history[history.length - 1];
};

const extrapolateHistoryBackward = (history) => {
  const nextHistory = [];
  let sumHistory = 0;

  for (let i=1; i<history.length; i++) {
    const diff = history[i] - history[i-1];
    sumHistory += diff;
    nextHistory.push(diff);
  }

  if (sumHistory === 0) return history[0];
  return history[0] - extrapolateHistoryBackward(nextHistory);
};

const start = () => {
  const input = loadInput('input.txt');
  const histories = parseHistories(input);
  const result = histories.reduce((acc, history) => acc + extrapolateHistory(history), 0);
  log(result);

  const resultPart2 = histories.reduce((acc, history) => acc + extrapolateHistoryBackward(history), 0);
  log(resultPart2);
};

start();
