# Ironfish notes collector


Small CLI app that consolidate many small notes to a big one via a transaction to the account itself.

How this app works?
- get account address of the input account name via rpc call `getPublicKey`
- get spendable notes of this account via rpc call `getNotes`
- select notes whos value are less than 1 IRON
- create a transaction to account itself with notes above via rpc call `createTransaction`
- sign and broadcast transaction to the network via rpc call `postTransaction`

How to use?
- Enable http adapter via `ironfish config:set enableRpcHttp true`, default port is 8021
- Run this app as follows

Usage example:
```bash
git clone git@github.com:hairtail/collect-notes.git
cd collect-notes
npm ci
ACCOUNT=myaccountname ENDPOINT="http://localhost:8021 OUTPUT="/home/ps/ironfish/collect.log" npm start
```

Notes: 
- Node restart needed to enable http adapter if this is the first time.
- This app runs every 20 mins to consolidate small notes.
- Be careful with your money and your key, i'm not responsible for anything if you lost your fund. Read the source code first!
