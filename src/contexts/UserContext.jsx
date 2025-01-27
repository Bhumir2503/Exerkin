import { createContext, useState, useContext, useEffect } from "react";
import auth from "@react-native-firebase/auth";


const UserContext = createContext();

export const UserProvider = ({ children }) => { 
    const [user, setUser] = useState(null);
    const [init, setInit] = useState(true);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    function onAuthStateChanged(user) {
        setUser(user);
        if (init) {
            setInit(false);
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, init }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);

export default UserContext;
