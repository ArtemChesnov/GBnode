const readline = require('readline');
const colors = require('colors');
const fs = require('fs');
const path = require('path');

const readStream = fs.createReadStream('access.log', 'utf8');
const fileName = 'access.log';
let fileSize = 0;
const totalSize = 104857600;

const getRandomInt = (min, max) => {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

const getRandomIp = () => {
  return Array(4)
    .fill(0)
    .map((_, i) => Math.floor(Math.random() * 255) + (i === 0 ? 1 : 0))
    .join('.');
};

const getRandomTime = () => {
  const hour = getRandomInt(0, 23);
  const minute = getRandomInt(0, 59);
  const second = getRandomInt(0, 59);

  return `${hour <= 9 ? `0${hour}` : hour}:${
    minute <= 9 ? `0${minute}` : minute
  }:${second <= 9 ? `0${second}` : second}`;
};

const getRandomMask = () => {
  const methods = ['GET', 'POST', 'DELETE', 'PUT'];
  return `- - [25/May/2021:${getRandomTime()} +0000] "${
    methods[getRandomInt(0, methods.length - 1)]
  } /baz HTTP/1.1" 200 0 "-" "curl/7.47.0"`;
};

const getMaskWithIp = (ip) => `${ip} ${getRandomMask()}`;

const printProgressBar = (progress, total) => {
  const percent = Math.round((progress / total) * 100);
  const index = Math.floor(percent / 10);
  let bar = '[';
  for (let i = 0; i < index; i++) {
    bar += colors.bgGreen('*');
  }
  for (let i = index; i < 10; i++) {
    bar += '-';
  }
  bar += ']';
  console.log(bar);
};

if (fs.existsSync(path.join(__dirname, fileName))) {
  fs.unlinkSync(path.join(__dirname, fileName));
}

fs.appendFileSync(
  path.join(__dirname, fileName),
  `${getMaskWithIp('192.14.19.1')}\n`,
);

while (fileSize < totalSize) {
  fileSize = fs.statSync(path.join(__dirname, fileName)).size;
  console.clear();
  console.log('Генерируем файл 100 мб');
  printProgressBar(fileSize, totalSize);
  fs.appendFileSync(
    path.join(__dirname, fileName),
    `${getRandomIp() + getRandomMask()}\n`,
  );
}

console.log(colors.green('Файл сгенерерирован!'));

const rl = readline.createInterface({
  input: readStream,
  terminal: true,
});

rl.on('line', (line) => {
  if (line.includes('89.123.1.41')) {
    const writeStream1 = fs.createWriteStream('89.123.1.41_requests.log');
    writeStream1.write(line + '\n');
    console.log('Записи с ip-адресом 89.123.1.41 найдены');
  }

  if (line.includes('34.48.240.111')) {
    const writeStream2 = fs.createWriteStream('34.48.240.111_requests.log');
    writeStream2.write(line + '\n');
    console.log('Записи с ip-адресом 34.48.240.111 найдены');
  }
});
