const { loadInput } = require('../utils');

const log = console.log;

const parseInitialSeeds = (rawSeeds) => rawSeeds.replace('seeds: ', '').split(' ');

const getMapNameRanges = (input, mapName) => {
  const ranges = [];
  const mapNameIndex = input.indexOf(`${mapName} map:`);
  let index = mapNameIndex + 1;
  while (input[index] !== '') {
    const values = input[index].split(' ').map(v => parseInt(v));
    ranges.push({
      destinationRangeStart: values[0],
      sourceRangeStart: values[1],
      rangeLength: values[2]
    });
    index++;
  }
  return ranges;
};

const findDestination = (input, mapName) => (source) => {
  const ranges = getMapNameRanges(input, mapName);

  for (let { destinationRangeStart, sourceRangeStart, rangeLength } of ranges) {
    if (source >= sourceRangeStart && source <= sourceRangeStart + rangeLength - 1) {
      return (source - sourceRangeStart) + destinationRangeStart;
    }
  }

  return source;
};

const parseAlmanac = (input) => ({
  initialSeeds: parseInitialSeeds(input[0]),
  seedToSoil: findDestination(input, 'seed-to-soil'),
  soilToFertilizer: findDestination(input, 'soil-to-fertilizer'),
  fertilizerToWater: findDestination(input, 'fertilizer-to-water'),
  waterToLight: findDestination(input, 'water-to-light'),
  lightToTemperature: findDestination(input, 'light-to-temperature'),
  temperatureToHumidity: findDestination(input, 'temperature-to-humidity'),
  humidityToLocation: findDestination(input, 'humidity-to-location')
});

const seedToLocation = (seed, almanac) => {
  const { seedToSoil, soilToFertilizer, fertilizerToWater, waterToLight, lightToTemperature, temperatureToHumidity, humidityToLocation } = almanac;
  const path = [seedToSoil, soilToFertilizer, fertilizerToWater, waterToLight, lightToTemperature, temperatureToHumidity, humidityToLocation];
  return path.reduce((result, fn) => fn(result), seed);
};

const start = () => {
  const input = loadInput('sample-input.txt');
  const almanac = parseAlmanac(input);

  const initialSeedLocations = almanac.initialSeeds.map(seed => seedToLocation(seed, almanac));
  const lowestLocation = Math.min(...initialSeedLocations);
  log(lowestLocation);
};

start();
