const readline = require('readline');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const directory = process.cwd();

const file = 'access.log';
let fileSize = 0;
const totalSize = 10485;

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

const printProgressBar = (progress, total) => {
  const percent = Math.round((progress / total) * 100);
  const index = Math.floor(percent / 10);
  let bar = '[';
  for (let i = 0; i < index; i++) {
    bar += colors.bgGreen('#');
  }
  for (let i = index; i < 10; i++) {
    bar += '-';
  }
  bar += ']';
  console.log(bar);
};

const searchFile = () => {
  const filterForFiles = (fileOnDir) => fs.lstatSync(fileOnDir).isFile();
  const list = fs.readdirSync('./').filter(filterForFiles);

  inquirer
    .prompt([
      {
        name: 'file',
        type: 'list',
        message: 'Выберете файл для чтения',
        choices: list,
      },
      {
        name: 'ip',
        message: 'Введите искомый Ip-адрес',
      },
    ])
    .then(({ file, ip }) => {
      const filePath = path.join(directory, file);
      const readStream = fs.createReadStream(filePath, {
        encoding: 'utf-8',
      });
      const writeFilteredStream = fs.createWriteStream(`${ip}_requests.log`, {
        encoding: 'utf-8',
        flags: 'a',
      });
      const readInterface = readline.createInterface({
        input: readStream,
      });
      readInterface.on('line', (line) => {
        const regExp = `([0-9]{1,3}[\.]){3}[0-9]{1,3}`;
        if (line.match(regExp)[0] == ip) {
          writeFilteredStream.write(line + '\n');
        }
      });
      console.log(`Файл ${ip}_requests.log создан`);
    });
};

const action = ['Сгенерировать файл', 'Поиск файла', 'Выход'];

inquirer
  .prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Выберете файл для чтения',
      choices: action,
    },
  ])
  .then(({ action }) => {
    switch (action) {
      case 'Сгенерировать файл':
        fs.writeFileSync(path.join(__dirname, file), ``);
        while (fileSize < totalSize) {
          fileSize = fs.statSync(path.join(__dirname, file)).size;
          console.clear();
          console.log('Генерируем файл');
          printProgressBar(fileSize, totalSize);
          fs.appendFileSync(
            path.join(__dirname, file),
            `${getRandomIp() + getRandomMask()}\n`,
          );
        }
        console.log(colors.green('Файл сгенерерирован!'));
        action;

      case 'Поиск файла':
        searchFile();
        break;

      case 'Выход':
        console.log(colors.red('Приложение закрыто'));
        break;
    }
  });
