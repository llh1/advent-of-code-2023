const { loadInput } = require('../utils');

const isSymbol = (char) => char !== '.' && /^[^0-9\w]$/.test(char);

const isNumber = (char) => /^[0-9]$/.test(char);

const GEAR_SYMBOL = '*';

const MOVES = [
  [0, 1], [0, -1], [1, 0], [-1, 0],
  [1, 1], [1, -1], [-1, -1], [-1, 1]
];

const isAdjacentToSymbol = (row, col, engineShematic) => {
  for (let move of MOVES) {
    if (move[0] + row >= 0 && move[0] + row < engineShematic.length 
      && move[1] + col >= 0 && move[1] + col < engineShematic[0].length) {
        const item = engineShematic[move[0] + row][move[1] + col];
        if (isSymbol(item)) return true;
      }
  }
  return false;
};

const getAdjacentGearPositions = (row, col, engineShematic) => {
  const adjacentGearPositions = [];
  for (let move of MOVES) {
    if (move[0] + row >= 0 && move[0] + row < engineShematic.length 
      && move[1] + col >= 0 && move[1] + col < engineShematic[0].length) {
        const item = engineShematic[move[0] + row][move[1] + col];
        if (item === GEAR_SYMBOL) adjacentGearPositions.push([move[0] + row, move[1] + col]);
      }
  }
  return adjacentGearPositions;
};

const findPartNumbers = (engineShematic) => {
  const partNumbers = [];
  for(let row=0; row<engineShematic.length; row++) {
    let adjacent = false;
    let tmpNumber = '';

    for (let col=0; col<engineShematic[0].length; col++) {
      const item = engineShematic[row][col];

      if (isNumber(item)) tmpNumber += item;

      if (!isNumber(item) || col === engineShematic[0].length - 1) {
        if (adjacent) partNumbers.push(tmpNumber);
        tmpNumber = '';
        adjacent = false;
     
      } else {
        if (isAdjacentToSymbol(row, col, engineShematic)) {
          adjacent = true;
        }
      }
    }
  }
  return partNumbers;
};

const findGears = (engineShematic) => {
  const gears = {};

  for(let row=0; row<engineShematic.length; row++) {
    let adjacent = false;
    let tmpNumber = '';
    let gearPositions = new Set();
    
    for (let col=0; col<engineShematic[0].length; col++) {
      const item = engineShematic[row][col];

      if (isNumber(item)) tmpNumber += item;

      if (!isNumber(item) || col === engineShematic[0].length - 1) {
        for (const gearPosition of gearPositions) {
          const gearIndex = `${gearPosition[0]}-${gearPosition[1]}`;
          if (!gears[gearIndex]) gears[gearIndex] = new Set();
          if (tmpNumber) gears[gearIndex].add(tmpNumber);
        }
        tmpNumber = '';
        adjacent = false;
        gearPositions.clear();

      } else {
        const adjacentGearPositions = getAdjacentGearPositions(row, col, engineShematic);
        gearPositions = new Set([...gearPositions, ...adjacentGearPositions]);
        
        if (isAdjacentToSymbol(row, col, engineShematic)) {
          adjacent = true;
        }
      }
    }
  }
  
  return gears;
};

const start = () => {
  const input = loadInput('input.txt');
  const engineShematic = input.map(line => line.split(''));
  const partNumbers = findPartNumbers(engineShematic);
  const result = partNumbers.reduce((acc, number) => acc + parseInt(number), 0);
  console.log(result);

  const gears = findGears(engineShematic);
  let result2 = 0;
  Object.values(gears).forEach(gearSet => {
    if (gearSet.size === 2) {
      result2 += [...gearSet].reduce((acc, gear) => acc * gear, 1);
    }
  });
  console.log(result2)
};

start();
