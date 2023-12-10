const { loadInput } = require('../utils');

const log = console.log;

const DIRECTIONS = { N: 'N', W: 'W', S: 'S', E: 'E' };

const crossTube = ([x, y], from, map) => {
  const tube = map[x][y].tile;
  const cross = {
    '|': () => from === DIRECTIONS.N ? { position: [x+1, y], from: DIRECTIONS.N } : { position: [x-1, y], from: DIRECTIONS.S },
    '-': () => from === DIRECTIONS.W ? { position: [x, y+1], from: DIRECTIONS.W } : { position: [x, y-1], from: DIRECTIONS.E },
    'L': () => from === DIRECTIONS.N ? { position: [x, y+1], from: DIRECTIONS.W } : { position: [x-1, y], from: DIRECTIONS.S },
    'J': () => from === DIRECTIONS.N ? { position: [x, y-1], from: DIRECTIONS.E } : { position: [x-1, y], from: DIRECTIONS.S },
    '7': () => from === DIRECTIONS.S ? { position: [x, y-1], from: DIRECTIONS.E } : { position: [x+1, y], from: DIRECTIONS.N },
    'F': () => from === DIRECTIONS.S ? { position: [x, y+1], from: DIRECTIONS.W } : { position: [x+1, y], from: DIRECTIONS.N }
  }[tube];

  if (cross) return cross();
  return null;
};

const parseMap = (input) => input.map(row => row.split('').map(tile => ({ tile, mainLoop: false })));

const findStartingPosition = (map) => {
  for (let i=0; i<map.length; i++) {
    for (let j=0; j<map[i].length; j++) {
      if (map[i][j].tile === 'S') {
        return [i, j];
      }
    }
  }
};

const replaceStartingPipe = (map, startingPosition, initialRoutes) => {
  const initialDirections = initialRoutes.map(r => r.from).sort().join('');
  const initialPipe = { 'NW': 'F', 'NS': '|', 'EN': '7', 'EW': '-', 'ES': 'L', 'SW': 'J' }[initialDirections];
  map[startingPosition[0]][startingPosition[1]].tile = initialPipe;
  map[startingPosition[0]][startingPosition[1]].mainLoop = true;
};

const findInitialRoutes = ([x,y], map) => {
  const positions = [];
  if (x-1 >= 0 && ['|', '7', 'F'].includes(map[x-1][y].tile)) positions.push({ position: [x-1, y], from: DIRECTIONS.S });
  if (x + 1 < map.length && ['|', 'L', 'J'].includes(map[x+1][y].tile)) positions.push({ position: [x+1, y], from: DIRECTIONS.N });
  if (y - 1 >= 0 && ['-', 'L', 'F'].includes(map[x][y-1].tile)) positions.push({ position: [x, y-1], from: DIRECTIONS.E });
  if (y + 1 <= map[0].length && ['-', 'J', '7'].includes(map[x][y+1].tile)) positions.push({ position: [x, y+1], from: DIRECTIONS.W });
  return positions;
};

const findRoute = (map, { position, from }, startingPosition) => {
  let steps = 0;
  map[position[0]][position[1]].mainLoop = true;

  while (position[0] !== startingPosition[0] || position[1] !== startingPosition[1]) {  
    const next = crossTube(position, from, map);
    position = next.position;
    from = next.from;
    map[position[0]][position[1]].mainLoop = true;
    steps++;
  }
  return steps;
};

const countEnclosedTiles = (map) => {
  let tilesCount = 0;

  for (let i=0; i<map.length; i++) {
    let verticalPipeCount = 0;
    const withoutDashes = map[i].filter(t => !(t.tile === '-' && t.mainLoop));
    for (let j=0; j<withoutDashes.length; j++) {
      if (withoutDashes[j].mainLoop && (withoutDashes[j].tile === '|' || 
        (j+1 < withoutDashes.length && withoutDashes[j].tile === 'F' && withoutDashes[j+1].tile === 'J') ||
        (j+1 < withoutDashes.length && withoutDashes[j].tile === 'L' && withoutDashes[j+1].tile === '7'))) {
        verticalPipeCount++;
      } else if(!withoutDashes[j].mainLoop && verticalPipeCount % 2 !== 0) {
        tilesCount++;
      }
    }
  }
  
  return tilesCount;
};

const start = () => {
  const input = loadInput('input.txt');
  const map = parseMap(input);
  const startingPosition = findStartingPosition(map);
  const initialRoutes = findInitialRoutes(startingPosition, map);
  replaceStartingPipe(map, startingPosition, initialRoutes);

  const steps = findRoute(map, initialRoutes[0], startingPosition);
  log(Math.ceil(steps / 2));

  const result = countEnclosedTiles(map, initialRoutes[0]);
  log(result);
};

start();
