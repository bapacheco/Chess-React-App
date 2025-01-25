import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useApi } from './ApiProvider';
import { useLocation } from 'react-router-dom';

const SPRING_API_URL = process.env.REACT_APP_SPRING_API_URL;
const UserContext = createContext();

export default function UserProvider({ children }) {
    const [user, setUser] = useState();
    const api = useApi();

    const location = useLocation();
    const current_url = location.pathname;

    const guest_login = useCallback(async () => {
        const result = await api.guest_register();
        return result;

    }, [api]);

    useEffect(() => {
        //console.log("=================================");
        //console.log(current_url);
        (async () => {
            if (api.isAuthenticated()) {
                //get stats from express
                const response = await api.get('/info/my-stats');
                //set user to stats
                setUser(response.ok ? response.data : null);
            }
            else {
                setUser(null);
                console.log('Not authenticated')
                //perhaps move guest login to here
                if (current_url === '/') {
                    if (await guest_login() !== 'ok') {
                        //flash error
                    }
                }
            }
        }) ();

    }, [guest_login, api]);



    
    const login = useCallback(async (username, password) => {
        const result = await api.login(username, password);
        if (result === 'ok') {
            //get stats from express
            const response = await api.get('/info/my-stats');
            //set user to stats
            setUser(response.ok ? response.data : null);
        }
        console.log(result + " login status");
        return result;
    }, [api]);



    
    const logout = useCallback(async () => {
        await api.logout();
        setUser(null);
    }, [api]);
    

    return (
        <UserContext.Provider value={{ user, setUser, guest_login, login, logout}}>
            { children }
        </UserContext.Provider>
    );
}



export function useUser() {
    return useContext(UserContext);
}