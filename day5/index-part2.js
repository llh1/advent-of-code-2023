const { loadInput } = require('../utils');

const log = console.log;

const parseInitialSeeds = (rawSeeds) => {
  const values = rawSeeds.replace('seeds: ', '').split(' ').map(v => parseInt(v));
  const seedRanges = [];
  for (let i=0; i<values.length; i+=2) {
    seedRanges.push([values[i], values[i] + values[i+1] - 1]);
  }
  return seedRanges;
};

const getSortedCategoryRanges = (input, mapName) => {
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
  return ranges.sort((a,b) => a.sourceRangeStart - b.sourceRangeStart);
};

const findDestinationRanges = (input, categoryName) => (range) => {
  const categoryRanges = getSortedCategoryRanges(input, categoryName);
  const ranges = [];

  for (let { destinationRangeStart, sourceRangeStart, rangeLength } of categoryRanges) {
    if (range[1] < sourceRangeStart) {
      ranges.push([range[0], range[1]]);
      range = null;
      break;
    }

    // range[1] >= sourceRangeStart
    if (range[0] < sourceRangeStart) {
      ranges.push([range[0], sourceRangeStart - 1]);

      if (range[1] <= sourceRangeStart + rangeLength) {
        ranges.push([destinationRangeStart, range[1] + destinationRangeStart - sourceRangeStart]);
        range = null;
        break;

      } else {
        ranges.push([destinationRangeStart, destinationRangeStart + rangeLength - 1]);
        range = [destinationRangeStart + rangeLength, range[1]];
      }
    }

    if (range[0] >= sourceRangeStart && range[0] <= sourceRangeStart + rangeLength - 1) {
      if (range[1] <= sourceRangeStart + rangeLength - 1) {
        ranges.push([range[0] + destinationRangeStart - sourceRangeStart, range[1] + destinationRangeStart - sourceRangeStart]);
        range = null;
        break;

      } else {
        ranges.push([range[0] + destinationRangeStart - sourceRangeStart, destinationRangeStart + rangeLength - 1]);
        range = [sourceRangeStart + rangeLength, range[1]];
      }
    }
  }

  if (range) {
    ranges.push(range);
  }
  
  return ranges;
};

const parseAlmanac = (input) => ({
  initialSeedRanges: parseInitialSeeds(input[0]),
  seedToSoil: findDestinationRanges(input, 'seed-to-soil'),
  soilToFertilizer: findDestinationRanges(input, 'soil-to-fertilizer'),
  fertilizerToWater: findDestinationRanges(input, 'fertilizer-to-water'),
  waterToLight: findDestinationRanges(input, 'water-to-light'),
  lightToTemperature: findDestinationRanges(input, 'light-to-temperature'),
  temperatureToHumidity: findDestinationRanges(input, 'temperature-to-humidity'),
  humidityToLocation: findDestinationRanges(input, 'humidity-to-location')
});

const seedRangeToLocationRanges = (seedRange, almanac) => {
  const { seedToSoil, soilToFertilizer, fertilizerToWater, waterToLight, lightToTemperature, temperatureToHumidity, humidityToLocation } = almanac;
  const path = [seedToSoil, soilToFertilizer, fertilizerToWater, waterToLight, lightToTemperature, temperatureToHumidity, humidityToLocation];
  return path.reduce((result, fn) => {
    return result.reduce((acc, r) => {
      acc.push(...fn(r));
      return acc;
    }, []);
  }, [seedRange]);
};

const start = () => {
  const input = loadInput('input.txt');
  const almanac = parseAlmanac(input);

  const locationRanges = almanac.initialSeedRanges.reduce((result, seedRange) => {
    result.push(...seedRangeToLocationRanges(seedRange, almanac));
    return result;
  }, []);

  const lowestLocation = Math.min(...locationRanges.map(r => r[0]));
  log(lowestLocation);
};

start();
