# Introduction

A light weight package written in javascript for beldex exchange api and websocket. You can also write your own code to connect to the beldex API. Refer [Beldex API Documentation](https://apidoc.beldex.io). 

# Prerequisite

- API Key
- Secret
- Passphrase

You can create the API Key, Secret and Passphrase from the `My Accounts` page of Beldex exchange

# Installation

```
npm install @bdxi/node-beldex-api
```

# Usage

#### API

```javascript
const { PublicClient } = require('@bdxi/node-beldex-api');
const { Authenticate } = require('@bdxi/node-beldex-api');
const pClient = new PublicClient();
const authClient = new Authenticate(api-key, secret, passphrase);

// get time
pClient.server().getTime();
// market list
pClient.market().list();
// market summary
pClient.market().summary(['BTCUSDT', 'ETHUSDT', 'BDXBTC']);
// market status
pClient.market().status('ETHBTC', 86400);
// market volume
pClient.market().getVolume();
// market 24hrs-tickers
pClient.market().ticker('ETHBTC');
// market kline
pClient.market().kline({ market: "ETHBTC", start: 1577750400, end: 1577923200, interval: 86400 });
// market last
pClient.market().last('ETHBTC');
// market deals
pClient.market().deals({ "market": "BDXBTC", "limit": 10 });
// get asset
pClient.asset().list('BTC');
// orderBook
pClient.trade().orderBook({ "market": "BDXBTC", "side": 2, "offset": 0, "limit": 2 });
// orderDepth
pClient.trade().orderDepth({ "market": "BDXBTC", "limit": 10, "interval": "1" });

```

#### WebSocket

```javascript
const { WebsocketClient } = require('bdxi/node-beldex-api');
const wss = new WebsocketClient();

wss.connect();
wss.login(api-key,secret,passphrase);
wss.send({ method: "state.subscribe", params: ["BDXBTC"] });

```