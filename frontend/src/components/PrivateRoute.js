import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";


export default function PrivateRoute({ children }) {
    const { user, guest } = useUser();
    console.log("GUEST?: ", guest);
    console.log("USER?: ", user);
    if (user === undefined) {
        return null;
    }
    else if (user || guest) {
        return children;
    }
    else {
        return <Navigate to="/"/>
    }
}