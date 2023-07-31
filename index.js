import express from 'express';
import accountsRouter from './routes/accounts.js';
import { promises as fs, write } from 'fs';

const { readFile, writeFile } = fs;

global.fileName = "accounts.json";

const app = express();
app.use(express.json());

app.use('/account', accountsRouter);

app.listen(3000, async () => {
  try {
    await readFile(global.fileName);
    console.log("API started read");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    writeFile(global.fileName, JSON.stringify(initialJson)).then(()=> {
        console.log("APQ started and file created");
    }).catch(err => {
        console.log(err)
    })
  }
});
