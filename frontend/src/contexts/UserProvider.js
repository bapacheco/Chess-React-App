import { createContext, useContext, useState, useEffect, useCallback} from 'react';
import { useLocation } from 'react-router-dom';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const UserContext = createContext();

export default function UserProvider({ children }) {
    const [user, setUser] = useState();
    const location = useLocation();
    const current_url = location.pathname;

    const guest_login = useCallback(async () => {
        let response;
        try {
            response = await fetch(BASE_API_URL + '/api/session/token', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                credentials: 'include',
            });
        } catch(error) {
            console.error("FAILEEEEED");
            response = {
                ok: false,
                status: 500,
                json: async() => { return {
                    code:500,
                    message: 'The server is unresponsive',
                    description: error.toString(),
                }; }
            };
        }

        return {
            ok: response.ok,
            status: response.status,
            body: response.status !== 204 ? await response.json() : null
        };

    }, []);

    useEffect(() => {
        //console.log("=================================");
        //console.log(current_url);

        //took out current === '/play'
        if (current_url === '/') {
            (async () => {
                if (await guest_login() !== 'ok') {
                    //flash error
                    console.log("NOOOOOOOO MUSSSSSSSTARRD");
                }
                //console.log("MUSSTTAARD 2 IN USERPROVIDER");
            }) ();
        }

    }, [current_url, guest_login]);



    /*
    const login = useCallback(async (username, password) => {
        const result = await api.login(username, password);
        if (result === 'ok') {
            const response = await api.get('/me');
            setUser(response.ok ? response.body : null);
        }
        return result;
    }, [api]);

    const logout = useCallback(async () => {
        await api.logout();
        setUser(null);
    }, [api]);
    */
    return (
        <UserContext.Provider value={{ user, setUser, guest_login}}>
            { children }
        </UserContext.Provider>
    );
}



export function useUser() {
    return useContext(UserContext);
}