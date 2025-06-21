import { createContext, useContext, useEffect, useRef, useState } from "react";
import Realm from "realm";
import { realmSchemas } from "../services/schemas/realmSchemas";
import { ActivityIndicator, View } from "react-native";

const RealmContext = createContext(null);

const realmConfig = {
	path: "ExerkinDBTest5.realm",
	schema: realmSchemas,
	schemaVersion: 2,
};

export const RealmProvider = ({ children }) => {
	const [realm, setRealm] = useState(null);
	const [loading, setLoading] = useState(true);
	const realmRef = useRef(null);

	useEffect(() => {
		const openRealm = async () => {
			try {
				if (!realmRef.current || realmRef.current.isClosed) {
					const openedRealm = await Realm.open(realmConfig);
					console.log("Realm File Path:", openedRealm.path);
					realmRef.current = openedRealm;
					setRealm(openedRealm);
				}
			} catch (err) {
				console.error("Error opening Realm:", err);
			} finally {
				setLoading(false);
			}
		};

		openRealm();

		return () => {
			if (realmRef.current && !realmRef.current.isClosed) {
				console.log("RealmProvider: Closing Realm...");
				realmRef.current.close();
				realmRef.current = null;
			}
		};
	}, []);

	if (loading || !realm) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#16161a",
				}}
			>
				<ActivityIndicator size="large" color="#fff" />
			</View>
		);
	}

	return (
		<RealmContext.Provider value={realm}>{children}</RealmContext.Provider>
	);
};

export const useRealm = () => {
	const context = useContext(RealmContext);
	if (!context) throw new Error("useRealm must be used within RealmProvider");
	return context;
};
