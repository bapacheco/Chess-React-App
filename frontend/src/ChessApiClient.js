import axios from "axios";
const EXPRESS_API_URL = process.env.REACT_APP_EXPRESS_API_URL;
const SPRING_API_URL = process.env.REACT_APP_SPRING_API_URL;

export default class ChessApiClient {

    constructor() {
        this.express_url = EXPRESS_API_URL + '/api';
        this.spring_url = SPRING_API_URL + ''; //todo remake this line
    }

    //todo adjust to options.url containing the whole url
    async request(options) {
        let response = await this.requestInternal(options);
        if (response.status === 401 && options.url !== '/login') {
            const refreshResponsive = await this.put('express','/token', {
                access_token: localStorage.getItem('access_token'),
            });
            if (refreshResponsive.ok) {
                localStorage.setItem('access_token', refreshResponsive.data.access_token);
                response = await this.requestInternal(options);
            }
        }

        return response;
    }

    async requestInternal(options) {
        let req = {
            method: options.method,
            url: options.target_url,
            headers: {
                'Content-Type' : 'application/json',
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
            response = {
                ok: false,
                status: 500,
                json: async () => {
                    return {
                        code: 500,
                        message: 'The server is unresponsive',
                        description: error.toString(),
                    };
                }
            }
        }
        //console.log('RESPONSE ACTUAL', response);
        return {
            ok: response.statusText,
            status: response.status,
            data: response.status !== 204 ? await response.data : null
        };
    }


    isAuthenticated() {
        return localStorage.getItem('access_token') !== null;
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

        localStorage.setItem('access_token', response.data.access_token);
        return 'ok';
    }

    async logout() {
        //this would call delete to express
        localStorage.removeItem('access_token');
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
    async get(url, data, options) {
        target_url = this.express_url + url;
        return this.request({method: 'GET', target_url, url, data, ...options});
    }

    //delete goes here
}