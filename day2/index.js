const { loadInput } = require('../utils');

const RED = 12;
const GREEN = 13;
const BLUE = 14;

const parseGames = (rawGames) => rawGames.reduce((games, rawGame) => {
  const split = rawGame.split(': ');
  const gameNumber = [...split[0].matchAll(/(\d+)/g)][0][1];
  games[gameNumber] = [];

  const splitRandom = split[1].split('; ');
  for (const random of splitRandom) {
    const colors = random.split(', ');
    const amountColors = colors.reduce((acc, color) => {
      const splitColor = color.split(' ');
      acc[splitColor[1]] = parseInt(splitColor[0]);
      return acc;
    }, {});
    games[gameNumber].push(amountColors);
  }

  return games;
}, {});

const filterPossibleGameIds = (games) => Object.keys(games).reduce((res, gameId) => {
  const game = games[gameId];
  const possible = game.every(combination => {
    return (!combination.blue || combination.blue <= BLUE) 
      && (!combination.red || combination.red <= RED) 
      && (!combination.green || combination.green <= GREEN);
  });
  if (possible) res.push(parseInt(gameId));
  return res;
}, []);

const findSumOfPowerOfFewestCubeSet = (games) => Object.keys(games).reduce((acc, id) => {
  const game = games[id];
  const fewestRed = Math.max(...game.map(c => c.red).filter(c => c));
  const fewestBlue = Math.max(...game.map(c => c.blue).filter(c => c));
  const fewestGreen = Math.max(...game.map(c => c.green).filter(c => c));

  return acc + fewestBlue * fewestGreen * fewestRed;
}, 0);

const start = () => {
  const input = loadInput('./input.txt');
  const games = parseGames(input);
  console.log(games);

  const possibleGameIds = filterPossibleGameIds(games);
  const result = possibleGameIds.reduce((acc, id) => acc + id, 0);
  console.log(result);

  const result2 = findSumOfPowerOfFewestCubeSet(games);
  console.log(result2);
};

start();
