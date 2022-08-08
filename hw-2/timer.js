const moment = require('moment');
require('moment-precise-range-plugin');
const EventEmitter = require('events');
const DATE_PATTERN = 'YYYY-MM-DD HH:mm:ss';

const deadline = new Date(2022, 07, 25, 17);

function timer() {
  const dateNow = new Date();
  if (dateNow >= deadline) {
    emitter.emit('timerEnd');
  } else {
    const futureDateFormatted = moment(deadline, DATE_PATTERN);
    const nowDateFormatted = moment(dateNow, DATE_PATTERN);
    const diff = moment.preciseDiff(nowDateFormatted, futureDateFormatted);

    console.clear();
    console.log(`Remaining before vacation ${diff}!`);
  }
}

const timerDone = (timerId) => {
  clearInterval(timerId);
  console.clear();
  console.log('Vacation!');
};

const emitter = new EventEmitter();
const timerId = setInterval(() => {
  emitter.emit('timerOn', timer);
}, 1000);

emitter.on('timerOn', timer);
emitter.on('timerEnd', () => {
  timerDone(timerId);
});

timer();
