import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useApi } from './ApiProvider';
import { useLocation } from 'react-router-dom';

const SPRING_API_URL = process.env.REACT_APP_SPRING_API_URL;
const UserContext = createContext();

//todo: resetting page resets state variables, calls guest register and gets new guest token everytime.
//decide to whether or not drop guest support
//if keeping guest support, consider getting cookie package to destroy cookies 
export default function UserProvider({ children }) {
    const [user, setUser] = useState();
    const [guest, setGuest] = useState(false);

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
                console.log('Not authenticated')
                setUser(null);
                //perhaps move guest login to here

                //check if cookie exists then proceed here
                if (current_url === '/') {
                    if (!guest) {
                        const result = await guest_login();
                        if (result !== 'ok') {
                            //flash error
                            setGuest(false);
                        } else {
                            setGuest(true);
                        }
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
            setGuest(false);
            //call to destroy guest token here
        }
        console.log(result + " login status");
        return result;
    }, [api]);



    
    const logout = useCallback(async () => {
        await api.logout();
        setUser(null);
    }, [api]);
    

    return (
        <UserContext.Provider value={{ user, setUser, guest_login, login, logout, guest, setGuest}}>
            { children }
        </UserContext.Provider>
    );
}



export function useUser() {
    return useContext(UserContext);
}