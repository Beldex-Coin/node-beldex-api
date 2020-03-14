const ws = require("socket.io-client");
const pako = require("pako");
const crypto = require("crypto");
class WebsocketClient {
    constructor(websocketURI = 'wss://ws.beldex.io') {
        this.websocketUri = websocketURI;
    }
    connect() {
        if (this.socket) {
            this.socket.close();
        }
        this.socket = new ws(this.websocketUri);
        console.log(`Connecting to ${this.websocketUri}`);
        this.socket.on('connect', () => this.onOpen());
        this.socket.on('disconnect', () => this.onClose());
    }
    login(apiKey, apiSecret, passphrase) {
        const timestamp = new Date().getTime();
        const hmac = crypto.default.createHmac('sha256', apiSecret);
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
    onMessage(cb) {
        return this.socket.on('message',data=>{
            if (data.error) {
                cb(data);
            }
            else if (!(typeof data === 'string')) {
                let response =pako.inflate(data, { to: 'string' });
                cb(response);
    
            };
        });
        
    }
    onClose() {
        console.log(`Websocket connection is closed.`);
        this.socket = undefined;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    close() {
        if (this.socket) {
            console.log(`Closing websocket connection...`);
            this.socket.close();
        }
    }
}
exports.WebsocketClient = WebsocketClient;
