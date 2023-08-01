import express from 'express';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    let account = req.body;

    if(!account.name || !account.balance) {
      throw new Error("Formato invalido")
    }

    const data = JSON.parse(await readFile(global.fileName));

    account = { id: data.nextId++, ...account };
    data.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(data));

    res.send(account);
    logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err)
  }
});

router.get('/', async (req, res, next) => {
  try {
    let account = req.body;
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextId;
    res.send(data);
    logger.info(`GET /account `);
  } catch (err) {
    next(err)
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const account = data.accounts.find(
      account => account.id === parseInt(req.params.id)
    );
    logger.info(`GET /account/:id `);
    res.send(account);
  } catch (err) {
    next(err)
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    data.accounts = data.accounts.filter(
      account => account.id !== parseInt(req.params.id)
    );
    await writeFile(global.fileName, JSON.stringify(data));(data, null, 2);
    logger.info(`DELETE /account/:id - ${req.params.id}`);
    res.end();
  } catch (err) {
    next(err)
  }
});

router.put('/', async (req, res, next) => {
  try{
      let account = req.body
      const data = JSON.parse(await readFile(Dlobal.fileName));
      const index = data.accounts.findIndex(item => item.id === account.id);
      data.accounts[index] = account;

      await writeFile(global.fileName, JSON.stringify(data));
      logger.info(`PUT /account - ${JSON.stringify(account)}`);
      res.send(account);
  } catch (err) {
    next(err)
  }
});

router.patch("/updateBalance", async (req, res, next) => {
  try{
    let account = req.body
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex(item => item.id === account.id);
    data.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data));
    logger.info(`PATCH /account/updateBalance - ${JSON.stringify(account)}`);
    res.send(data.accounts[index]);
} catch (err) {
  next(err)
}
});

router.use((err, req, res, next)=> {
  global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
