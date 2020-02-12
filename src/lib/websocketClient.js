"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const ws_1 = __importDefault(require("socket.io-client"));
const pako_1 = __importDefault(require("pako"));
const crypto_1 = __importDefault(require("crypto"));
class WebsocketClient extends events_1.EventEmitter {
    constructor(websocketURI='https://ws.beldex.io') {
        super();
        this.websocketUri = websocketURI;
    }
    connect() {
        if (this.socket) {
            this.socket.close();
        }
        this.socket = new ws_1.default(this.websocketUri);
        console.log(`Connecting to ${this.websocketUri}`);
        this.socket.on('connect', () => this.onOpen());
        this.socket.on('disconnect', () => this.onClose());
        this.socket.on('message', data => this.onMessage(data));
    }
    login(apiKey, apiSecret, passphrase) {
        const timestamp = new Date().getTime();
        const hmac = crypto_1.default.createHmac('sha256', apiSecret);
        const signature = hmac.update(timestamp + 'GET' + '/users/ws/verify').digest('base64');

        const request = {
            method: 'login',
            params: [
                apiKey,
                passphrase,
                timestamp,
                signature
            ]
        };
        this.send(request);
    }
    send(args) {
        return this.request(args);
    }
    request(messageObject) {
        if (!this.socket)
            throw Error('socket is not open');
        this.socket.emit('message', messageObject);
    }
    onOpen() {
        console.log(`Connected to ${this.websocketUri}`);
        this.initTimer();
        this.emit('connection');
    }
    initTimer() {
        this.interval = setInterval(() => {
            if (this.socket) {
                this.socket.send('ping');
            }
        }, 3000);
    }
    resetTimer() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            this.initTimer();
        }
    }
    onMessage(data) {
        this.resetTimer();
        if (data.error) {
            return data;
        }
        if (!(typeof data === 'string')) {
            let response = JSON.parse(pako_1.default.inflate(data, { to: 'string' }));
            console.log(JSON.stringify(response));

        }
        this.emit('message', data);
    }
    onClose() {
        console.log(`Websocket connection is closed.`);
        this.socket = undefined;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.emit('close');
    }
    close() {
        if (this.socket) {
            console.log(`Closing websocket connection...`);
            this.socket.close();
        }
    }
}
exports.WebsocketClient = WebsocketClient;
