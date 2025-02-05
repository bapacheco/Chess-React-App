import axios from "axios";
import SockJS from "sockjs-client";
const EXPRESS_API_URL = process.env.REACT_APP_EXPRESS_API_URL;
const SPRING_API_URL = process.env.REACT_APP_SPRING_API_URL;

export default class ChessApiClient {

    constructor() {
        this.express_url = EXPRESS_API_URL + '/api';
        this.spring_url = SPRING_API_URL + '/api/chess'; //todo remake this line
        this.websocket_url = SPRING_API_URL + "/ws-chess";
    }

    //todo adjust to options.url containing the whole url
    async request(options) {
        let response = await this.requestInternal(options);
        console.log("response IN APICLIENTJS: ", response.status);
        if (response.status === 401 && (options.url !== '/auth/login' || options.url !== '/auth/anonymous-register')) {
            console.log("ENTERED RE-AUTH BRANCH");

            let refreshResponsive;
            if (options.url === '/auth/anon-token') {
                refreshResponsive = await this.put('express', '/auth/anon-token', null);
                if (refreshResponsive.ok) {
                    response = await this.requestInternal(options);
                }
            }
            else {
                refreshResponsive = await this.put('express','/auth/token', {
                    access_token: localStorage.getItem('access_token'),
                });

                if (refreshResponsive.ok) {
                    localStorage.setItem('access_token', refreshResponsive.data.access_token);
                    response = await this.requestInternal(options);
                }
            }
            console.log(refreshResponsive);

        }

        return response;
    }
    //todo: adjust for /token (accessToken is sent in header and body withcredentials true)
    async requestInternal(options) {
        let req = {
            method: options.method,
            url: options.target_url,
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                ...options.headers,
            },
            withCredentials: true,
            data: {
                ...options.data,
            }
            
        };
        //console.log('in requestInternal', req);

        let response; 
        try {

            response = await axios(req);

        } catch (error) {
            //todo adjust this catch clause for axios
            response = {
                ok: false,
                status: error.response?.status,
                json: async () => {
                    return {
                        code: error.response?.status,
                        message: 'The server is unresponsive',
                        description: error.toString(),
                    };
                }
            }
            //console.log('RESPONSE ERROR', response);
        }
        //console.log('RESPONSE ACTUAL', response);
        return {
            ok: true,
            status: response.status,
            data: response.status !== 204 ? await response.data : null
        };
    }


    isAuthenticated() {
        return localStorage.getItem('access_token') !== null;
    }

    getWebsocket() {
        return new SockJS(this.websocket_url);
    }

    async login(username, password) {
        const response = await this.post('express','/auth/login', null, {
            headers: {
                Authorization: 'Basic ' + btoa(username + ':' + password)
            }
        });
        //console.log('response? ', response.ok);

        if (!response.ok) {
            return response.status === 401 ? 'fail' : 'error';
        }

        //console.log('access_token', response.data.access_token);
        if (response.data.spring_notify) {
            //flash message
        }

        localStorage.setItem('access_token', response.data.access_token);
        return 'ok';
    }

    async guest_register() {
        const response = await this.post('express', '/auth/anonymous-register', null);

        if (!response.ok) {
            return response.status === 401 ? 'fail' : 'error';
        }

        return 'ok';
    }

    async logout() {
        //this would call delete to express
        localStorage.removeItem('access_token');
        localStorage.removeItem('fen');
        localStorage.removeItem('turn');
        localStorage.removeItem('local_game_id');
    }

    async post(service, url, data, options) {
        let target_url;
        switch (service) {
            case 'express':
                target_url = this.express_url + url;
                break;
            case 'spring':
                target_url = this.spring_url + url;
                break;
        }
        
        return this.request({method: 'POST', target_url, url, data, ...options});
    }

    async put(service, url, data, options) {
        let target_url;
        switch (service) {
            case 'express':
                target_url = this.express_url + url;
                break;
            case 'spring':
                target_url = this.spring_url + url;
                break;
        }
        return this.request({method: 'PUT', target_url, url, data, ...options});
    }

    //replace data with query in future updates (get info on other users);
    async get(service, url, data, options) {
        let target_url;
        switch (service) {
            case 'express':
                target_url = this.express_url + url;
                break;
            case 'spring':
                target_url = this.spring_url + url;
                break;
        }

        return this.request({method: 'GET', target_url, url, data, ...options});
    }

    //delete goes here
}