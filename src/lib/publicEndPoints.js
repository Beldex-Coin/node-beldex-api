"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios = __importDefault(require("axios"));
const querystring = __importStar(require("querystring"));


function PublicClient(apiUri = `https://api.beldex.io`, timeout = 3000, axiosConfig = {}) {
    const axiosInstance = axios.default.create(Object.assign({ baseURL: apiUri, timeout }));
    async function get(url) {
        return axiosInstance.get(url)
            .then((res) => res.data)
            .catch(error => {
                console.log(error.response && error.response !== undefined
                    ? JSON.stringify(error.response.data)
                    : error);
                console.log(error.message ? error.message : `${url} error`);
                throw error;
            });
    }
    async function post(url, body) {
        const bodyJson = JSON.stringify(body);
        return axiosInstance
            .post(url, body, {
            headers: Object.assign({ 'content-type': 'application/json; charset=utf-8' })
        })
            .then(res => res.data)
            .catch(error => {
            console.log(error.response && error.response !== undefined && error.response.data
                ? JSON.stringify(error.response.data)
                : error);
            console.log(error.message ? error.message : `${url} error`);
            throw error;
        });
    }
    return {
        server() {
            return {
                async getTime() {
                    return get('/api/v1/time');
                }
            };
        },
        market() {
            return {
                async list() {
                    return get('/api/v1/market/list');
                },
                async summary(params) {
                    return get(`/api/v1/market/summary?pairs=${params ? params : ''}`);
                },
                async status(market, period) {
                    return get(`/api/v1/market/status/${market}?period=${period}`);
                },
                async totalVolume() {
                    return get('/api/v1/market/total-volume')
                },
                async ticker(market) {
                    return get(`/api/v1/market/ticker/${market}`);
                },
                async kline(payload) {
                    return post('/api/v1/market/kline', payload);
                },
                async last(market) {
                   return get(`/api/v1/market/last/${market}`);
                },
                async deals(payload) {
                    return post('/api/v1/market/deals',payload);
                }
            };
        },
        asset() {
            return {
                async list(asset_name) {
                    return get(`/api/v1/asset/${asset_name ? asset_name : ''}`);
                }
            };
        },
        trade() {
            return {
                orderBook(payload) {
                    return post('/api/v1/order/book',payload);
                },
                orderDepth(payload) {
                    return post('/api/v1/order/depth',payload);
                }
            };
        }
    };
}
exports.PublicClient = PublicClient;