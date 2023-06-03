import * as fs from 'fs/promises';
import { CreateTransactionRequest } from './interface';
import RpcService from './service/rpcService';
import * as moment from 'moment';

const sleep = (msec: number) =>
  new Promise(resolve => setTimeout(resolve, msec));
const account = process.env.ACCOUNT;
const rpcUrl = process.env.ENDPOINT;
const output = process.env.OUTPUT;

if (!account) {
  console.error(
    'Specify `ACCOUNT` environment variable pointing to your ironfish address',
  );
  process.exit(1);
}

if (!rpcUrl) {
  console.error(
    'Specify `ENDPOINT` environment variable pointing to your ironfish node http endpoint',
  );
  process.exit(1);
}

if (!output) {
  console.error(
    'Specify `OUTPUT` environment variable with path to CSV file where results should be written',
  );
  process.exit(2);
}

async function main(account: string, rpcUrl: string, output: string) {
  const file = await fs.open(output, 'w');
  file.appendFile(`Account,Date,TransactionHash\n`);
  while (true) {
    try {
      await main_loop(account, rpcUrl, file);
      await sleep(20 * 60 * 1000);
    } catch (e) {
      // there should be an error if all note.value > 1 IRON, stop here
      console.error(e);
      break;
    }
  }
  await file.close();
  process.exit(0);
}

async function main_loop(account: string, rpcUrl: string, file: fs.FileHandle) {
  console.log('Start collecting now');
  const rpcService = new RpcService(rpcUrl);

  /**
   * 1. get address for this account
   */
  const address = (await rpcService.getAddress(account)).publicKey;
  console.log(address);

  /**
   * 2. get 100 spendable notes for this account
   */
  const spendableNotes = await rpcService.getNotes(account);

  /**
   * 3. create a new transaction to itself, with note.value < 1 IRON
   */
  let amount = 0n;
  const createTx: CreateTransactionRequest = {
    account,
    outputs: [
      {
        publicAddress: address,
        amount: '0',
        memo: '',
      },
    ],
    fee: '10',
    expirationDelta: 50, //50 is enough with at least 100 notes
    notes: [],
  };
  for (const note of spendableNotes.notes) {
    if (BigInt(note.value) <= 10000000000n && !note.spent) {
      createTx.notes?.push(note.noteHash);
      amount += BigInt(note.value);
    }
  }
  if (amount === 0n || createTx.notes?.length === 0) {
    console.log('No spendable notes whos value are less than 100 IRON');
    return;
  }

  createTx.outputs[0].amount = (amount - 10n).toString();
  console.log(`Transaction output ${JSON.stringify(createTx.outputs)}`);
  const rawTx = await rpcService.createTx(createTx);

  /**
   * 4. post transaction created above
   */
  const { hash } = await rpcService.postTx({
    account,
    transaction: rawTx.transaction,
  });
  console.log(`Transaction sent successfully, hash: ${hash}`);
  await file.appendFile(`${account},${moment(Date.now()).format()},${hash}\n`);
}

main(account, rpcUrl, output);
