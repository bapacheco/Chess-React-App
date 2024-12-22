import { createContext, useContext, useMemo } from 'react';
import ChessApiClient from "../ChessApiClient";

const ApiContext = createContext();

export default function ApiProvider({ children }) {

    const api = useMemo(() => new ChessApiClient())

    return (
        <ApiContext.Provider value={api}>
            {children}
        </ApiContext.Provider>
    );
}

export function useApi() {
    return useContext(ApiContext);
}