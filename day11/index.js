const { loadInput } = require('../utils');

const log = console.log;

const GALAXY = '#';
const EMPTY_SPACE = '.';

const parseUniverse = (input) => input.map(row => row.split(''));

const expandUniverse = (universe) => {
  const expandedUniverse = [];
  for (let row of universe) {
    expandedUniverse.push(row);
    if (!row.includes(GALAXY)) {
      expandedUniverse.push(row);
    }
  }
  let expensionCounter = 0;
  for (let col=0; col<universe[0].length; col++) {
    if (!universe.map(row => row[col]).includes(GALAXY)) {
      for (let row=0; row<expandedUniverse.length; row++) {
        expandedUniverse[row] = [
          ...expandedUniverse[row].slice(0, col + expensionCounter),
          EMPTY_SPACE,
          ...expandedUniverse[row].slice(col + expensionCounter)
        ];
      }
      expensionCounter++;
    }
  }
  return expandedUniverse;
};

const getUniverseEmptyRows = (universe) => universe.reduce((acc, row, index) => {
  if (!row.includes(GALAXY)) acc.push(index);
  return acc;
}, []);

const getUniverseEmptyCols = (universe) => universe[0].reduce((acc, col, index) => {
  if (!universe.map(row => row[index]).includes(GALAXY)) acc.push(index);
  return acc;
}, []);

const numberGalaxy = (universe) => {
  let galaxyCounter = 0;
  const galaxyCoordinates = [];
  for (let i=0; i<universe.length; i++) {
    for (let j=0; j<universe[0].length; j++) {
      if (universe[i][j] === GALAXY) {
        universe[i][j] = ++galaxyCounter;
        galaxyCoordinates.push([i,j]);
      }
    }
  }
  return galaxyCoordinates;
};

const createGalaxyPairs = (galaxyCoordinates) => {
  const pairs = [];
  for (let i=0; i<galaxyCoordinates.length; i++) {
    for (let j=i+1; j<galaxyCoordinates.length; j++) {
      pairs.push([galaxyCoordinates[i],galaxyCoordinates[j]]);
    }
  }
  return pairs;
};

const printUniverse = (universe) => {
  for (let row of universe) {
    log(row.join(''));
  }
}

const findShortestPathsOptimized = (pairs, emptyRows, emptyCols, factor) => pairs.map(([galaxy1, galaxy2]) => {
  const rowsExpension = emptyRows.filter(row => {
    if (galaxy1[0] < galaxy2[0]) {
      return galaxy1[0] < row && galaxy2[0] > row;
    } 
    return galaxy1[0] > row && galaxy2[0] < row;
  }).length * (factor - 1);

  const colsExpension = emptyCols.filter(col => {
    if (galaxy1[1] < galaxy2[1]) {
      return galaxy1[1] < col && galaxy2[1] > col;
    }
    return galaxy1[1] > col && galaxy2[1] < col;
  }).length * (factor - 1);

  return Math.abs(galaxy2[0] - galaxy1[0]) + Math.abs(galaxy2[1] - galaxy1[1]) + rowsExpension + colsExpension;
});

const start = () => {
  const input = loadInput('input.txt');
  const universe = parseUniverse(input);

  printUniverse(universe);
  const emptyRows = getUniverseEmptyRows(universe);
  const emptyCols = getUniverseEmptyCols(universe);
  const galaxyCoordinates = numberGalaxy(universe);
  const galaxyPairs = createGalaxyPairs(galaxyCoordinates);
  const paths = findShortestPathsOptimized(galaxyPairs, emptyRows, emptyCols, 1000000);
  log(paths.reduce((acc, p) => acc + p, 0));
};

start();
