const colors = require('colors');
const readlineSync = require('readline-sync');

const colorsTheme = [colors.green, colors.yellow, colors.red];
let countNumbers = 0;
const primeNumbers = [];

let start = Number(
  readlineSync.question(`enter the beginning of the interval: `),
);
const end = Number(readlineSync.question(`enter the end of the interval: `));

const getPrime = () => {
  if (start < 2) {
    console.log(colors.red(`The initial number cannot be less than 2!`));
    start = 2;
  }

  for (let i = start; i <= end; i++) {
    let prime = true;
    for (let j = 2; j < i; j++) {
      if (i % j === 0) {
        prime = false;
      }
    }
    if (prime) {
      primeNumbers.push(i);
      console.log(colorsTheme[countNumbers % 3](i));
      countNumbers++;
    }
  }

  if (isNaN(start) || isNaN(end)) {
    console.log(
      colors.random(`Dude, it's cool that you're so creative, 
    but the interval always implies numbers. Let try again.`),
    );
  } else if (!primeNumbers.length) {
    console.log(colorsTheme[2](`There are no prime numbers in a given range.`));
  }
};

getPrime();
