const { loadInput } = require('../utils');

const log = console.log;

const parseRaces = (input) => {
  const timesMatches = [...input[0].replace('Time:', '').matchAll(/\s+(\d+)/g)];
  const distanceMatches = [...input[1].replace('Distance:', '').matchAll(/\s+(\d+)/g)];

  const races = [];
  for (let i=0; i<timesMatches.length; i++) {
    races.push({ raceDuration: parseInt(timesMatches[i][1]), recordDistance: parseInt(distanceMatches[i][1]) });
  }
  return races;
};

const parseSingleRace = (input) => {
  const raceDuration = input[0].replace('Time:', '').replaceAll(' ', '');
  const recordDistance = input[1].replace('Distance:', '').replaceAll(' ', '');
  return {
    raceDuration: parseInt(raceDuration),
    recordDistance: parseInt(recordDistance)
  };
};

const getNumberOfWaysToBeatRecord = ({ raceDuration, recordDistance }, holdTime = 0, ways = 0) => {
  if (holdTime > raceDuration) return ways;

  const availableTime = raceDuration - holdTime;
  const distance = holdTime * availableTime;
  if (distance > recordDistance) ways++;

  return getNumberOfWaysToBeatRecord({ raceDuration, recordDistance }, ++holdTime, ways);
};

const lowerValidHoldTime = ({ raceDuration, recordDistance }) => {
  for (let holdTime=0; holdTime<=raceDuration; holdTime++) {
    const availableTime = raceDuration - holdTime;
    const distance = holdTime * availableTime;
    if (distance > recordDistance) return holdTime;
  }
};

const higherValidHoldTime = ({ raceDuration, recordDistance }) => {
  for (let holdTime=raceDuration; holdTime>=0; holdTime--) {
    const availableTime = raceDuration - holdTime;
    const distance = holdTime * availableTime;
    if (distance > recordDistance) return holdTime;
  }
};

const start = () => {
  const input = loadInput('input.txt');
  const races = parseRaces(input);

  const ways = races.map(race => getNumberOfWaysToBeatRecord(race));
  const result = ways.reduce((acc, way) => acc * way, 1);
  log(result);

  const singleRace = parseSingleRace(input);
  const lowerHoldTime = lowerValidHoldTime(singleRace);
  const higherHoldTime = higherValidHoldTime(singleRace);
  log(higherHoldTime - lowerHoldTime + 1);
};

start();
