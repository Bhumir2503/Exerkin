import { createContext, useState, useContext, useEffect, use } from "react";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [init, setInit] = useState(true);
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");

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

    function onLogout() {
        auth()
            .signOut()
            .then(() => console.log("User signed out!"));
        setInit(true);
    }

	return (
		<UserContext.Provider
			value={{ user, setUser, init, username, setUsername, bio, setBio, onLogout }}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);

export default UserContext;
