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

# Example

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

// Private endpoints

// get balance
authClient.asset().getBalance(['ETH', 'BTC', 'USDT']);
// balance history
authClient.asset().balanceHistory({ 'asset': "ETH", 'start_time': 1576750273, 'end_time': 1577095873, 'offset': 0, 'limit': 10, 'type': 'deposit' });
// place limit order
authClient.trade().putLimit({ "market": "BDXBTC", "side": 1, "amount": "100", "price": "0.05", "source": "beldex exchange" });
// plca marker order
authClient.trade().putMarket({ "market": "BDXBTC", "side": 1, "amount": "100", "source": "beldex exchange" });
// order cancel
authClient.trade().orderCancel({ "market": "BDXBTC", "order_id": 84 });
// order pending asset
authClient.trade().orderPending({ "market": "BDXBTC", "offset": 0, "limit": 2, "user_id": 84 });
// order pending details
authClient.trade().orderPendingDetails({ "market": "BDXBTC", "order_id": 84 });
// order deals
authClient.trade().orderDeals({ "order_id": 84, "offset": 0, "limit": 3 });
// finished orders
authClient.trade().orderFinished({ "offset": 0, "limit": 3, "market": "BDXBTC", "start_time": 0, "end_time": 0 });
// finished order details
authClient.trade().finishedOrderDetails({ "order_id": 84 });
```

#### WebSocket

```javascript
const { WebsocketClient } = require('@bdxi/node-beldex-api');
const wss = new WebsocketClient();

wss.connect();
wss.login(api-key, secret, passphrase);

// State subscription
wss.send({ "method": "state.subscribe", params: ["BDXBTC"] });
// deals subscription
wss.send({ "method": "deals.subscribe", params: ["BDXBTC"] });
// kline subscription
wss.send({ "method": "kline.subscribe", params: ["BDXBTC", 60] });
// depth subscription
wss.send({ "method": "depth.subscribe", "params": ["BDXUSDT", 50, '0'] });
// depth query
wss.send({ "method": "depth.query", params: ["BDXBTC", 50, '0'] });
// kline query
wss.send({ "method": "kline.query", "params": ["BDXBTC", 1575539107, 1580723167, 3600] });
// order query
wss.send({ "method": "order.query", params: ["BTCUSDT", 0, 50] });
// order history
wss.send({ "method": "order.history", "params": ["BDXBTC", 1580636703, 1580723103, 0, 50] });
// order subscription
wss.send({ "method": "order.subscribe", "params": ["BDXUSDT"] });
// asset query
wss.send({ "method": "asset.query", "params": ["BDX", "BTC"] });
// asset subscription
wss.send({ "method": "asset.subscribe", "params": ["BDX", "BTC"] });
```

##### Listen to subscription

All the subscriptions can be handled using `onMessage` function. The subscription can be differentiated using the `method` value from the response data.

```javascript
wss.onMessage(data => {
    console.log(data);
});
```