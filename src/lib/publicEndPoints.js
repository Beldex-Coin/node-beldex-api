const axios = require("axios");

function PublicClient(apiUri = `https://api.beldex.io`, timeout = 3000) {
    const axiosInstance = axios.create(Object.assign({ baseURL: apiUri, timeout }));
    async function get(url) {
        return axiosInstance.get(url)
            .then((res) => res.data)
            .catch(error => {
                console.log(error.response && error.response !== undefined
                    ? JSON.stringify(error.response.data)
                    : error);
            });
    }
    async function post(url, body) {
        return axiosInstance
            .post(url, body, {
                headers: Object.assign({ 'content-type': 'application/json; charset=utf-8' })
            })
            .then(res => res.data)
            .catch(error => {
                console.log(error.response && error.response !== undefined && error.response.data
                    ? JSON.stringify(error.response.data)
                    : error);

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
                    return get(`/api/v1/market/ticker/${(market) ? market : ''}`);
                },
                async kline(payload) {
                    return post('/api/v1/market/kline', payload);
                },
                async last(market) {
                    return get(`/api/v1/market/last/${market}`);
                },
                async deals(market,limit) {
                    return get(`/api/v1/market/deals/${market}?limit=${limit}`);
                }
            };
        },
        asset() {
            return {
                async list(asset_name) {
                    return get(`/api/v1/assets/${asset_name ? asset_name : ''}`);
                }
            };
        },
        trade() {
            return {
                orderBook(payload) {
                    return post('/api/v1/order/book', payload);
                },
                orderDepth(payload) {
                    return post('/api/v1/order/depth', payload);
                }
            };
        }
    };
}
exports.PublicClient = PublicClient;