import { createContext, useState, useContext, useEffect } from "react";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { useRealm } from "./RealmProvider";
import {
	getRealmUser,
	setRealmUser,
} from "../services/database/realmUserFunctions";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [init, setInit] = useState(true);
	const [isNewUser, setIsNewUser] = useState(false);
	const [setupComplete, setSetupComplete] = useState(false);

	const [user, setUser] = useState(null);
	const [username, setUsername] = useState("");
	const [motivation, setMotivation] = useState("");
	const [gender, setGender] = useState("male");
	const [unitSystem, setUnitSystem] = useState("imperial");

	const realm = useRealm();

    //
};
