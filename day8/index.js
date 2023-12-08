const { loadInput } = require('../utils');

const log = console.log;

const parseMap = (input) => {
  const directions = input[0].split('');

  const nodes = {};
  for (let i=2; i<input.length; i++) {
    const matches = input[i].split(' = ');
    const nextNodes = [...matches[1].matchAll(/\w+/g)];
    nodes[matches[0]] = {
      L: nextNodes[0][0],
      R: nextNodes[1][0],
      end: matches[0].endsWith('Z')
    };
  }

  return { directions, nodes };
};

const findRouteToZZZ = ({ directions, nodes }) => {
  let currentNode = nodes.AAA;
  let steps = 0;

  while (currentNode !== nodes.ZZZ) {
    const nextDirection = directions[steps % directions.length];
    currentNode = nodes[currentNode[nextDirection]];
    steps++;
  }

  return steps;
};

const getStartingNodes = (nodes) => Object.keys(nodes).reduce((acc, node) => {
  if (node.endsWith('A')) {
    acc.push(nodes[node]);
  }
  return acc;
}, []);

const getNumberOfStepsToEndInZ = ({ directions, nodes }) => {
  const startingNodes = getStartingNodes(nodes);
  const steps = [];

  for (let i=0; i<startingNodes.length; i++) {
    let currentSteps = 0;
    let currentNode = startingNodes[i];
    
    while (!currentNode.end) {
      const nextDirection = directions[currentSteps % directions.length];
      currentNode = nodes[currentNode[nextDirection]];
      currentSteps++;
    }
    
    steps.push(currentSteps);
  }

  return steps;
};

const getGreatestCommonDenominator = (val1, val2) => 
  val2 === 0 ? val1 : getGreatestCommonDenominator(val2, val1 % val2);

const getLowestCommonMultiple = (val1, val2) => 
  (val1 * val2) / getGreatestCommonDenominator(val1, val2);

const getLowestCommonMultipleForArray = (values) => {
  let lcm = values[0];
  for (let i=1; i<values.length; i++) {
    lcm = getLowestCommonMultiple(lcm, values[i]);
  }
  return lcm;
};

const start = () => {
  const input = loadInput('input.txt');
  const map = parseMap(input);
  const steps = findRouteToZZZ(map);
  log(steps);

  const stepsPart2 = getNumberOfStepsToEndInZ(map);
  log(stepsPart2);
  log(getLowestCommonMultipleForArray(stepsPart2));
};

start();