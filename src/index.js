import express from 'express';
import { Tail } from 'tail';

const logFile = process.env.LOG_FILE;
let logs = [];
const logLimit = 200;

if (!logFile) {
  console.log('log file location is not set');
  console.log('execute this with LOG_FILE env var');
  process.exit(0);
}

const app = express();
const port = 4000;

app.get('/', (req, res) => {
  const content = `<div>${logs.slice().reverse().join('</div><div>')}</div>`;
  res.send(content);
});

app.listen(port);

setInterval(() => {
  logs = [];

  const tail = new Tail(logFile, {
    fromBeginning: true,
  });

  tail.on('line', (data) => {
    logs.push(data);
    if (logs.length > 2 * logLimit) {
      logs = logs.slice(logs.length - logLimit, logs.length - 1);
    }
  });
}, 5000);
