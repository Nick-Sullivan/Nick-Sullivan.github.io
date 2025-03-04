const verbs = [
  "Baking",
  "Bowling",
  "Boxing",
  "Climbing",
  "Cooking",
  "Cycling",
  "Dancing",
  "Diving",
  "Drawing",
  "Fishing",
  "Fencing",
  "Flying",
  "Golfing",
  "Hiking",
  "Hockey",
  "Jogging",
  "Jumping",
  "Knitting",
  "Painting",
  "Reading",
  "Rowing",
  "Running",
  "Sailing",
  "Sewing",
  "Singing",
  "Skating",
  "Skiing",
  "Surfing",
  "Swimming",
  "Walking",
  "Writing",
  "Wrestling",
];

const nouns = [
  "Bat",
  "Bear",
  "Beaver",
  "Bison",
  "Buffalo",
  "Deer",
  "Dolphin",
  "Eagle",
  "Elk",
  "Falcon",
  "Fox",
  "Frog",
  "Giraffe",
  "Hawk",
  "Hippo",
  "Horse",
  "Leopard",
  "Lion",
  "Lizard",
  "Lobster",
  "Moose",
  "Mouse",
  "Octopus",
  "Owl",
  "Panther",
  "Penguin",
  "Rabbit",
  "Rat",
  "Rhino",
  "Seal",
  "Shark",
  "Snake",
  "Tiger",
  "Toad",
  "Turtle",
  "Walrus",
  "Whale",
  "Wolf",
  "Zebra",
];

export const getRandomElement = (arr: string[]): string => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const generateRandomName = (): string => {
  const verb = getRandomElement(verbs);
  const noun = getRandomElement(nouns);
  return `${verb}${noun}`;
};
