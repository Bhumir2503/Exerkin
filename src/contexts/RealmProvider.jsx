import React, { createContext, useContext, useEffect, useState } from "react";
import Realm from "realm";
import { realmSchemas } from "../services/schemas/realmSchemas";
import { ActivityIndicator, View } from "react-native";

const RealmContext = createContext(null);

const realmConfig = {
	path: "exerkinDB.realm",
	schema: realmSchemas,
	schemaVersion: 1,
};

let realmInstance;

export const RealmProvider = ({ children }) => {
	const [realm, setRealm] = useState(null);
	const [loading, setLoading] = useState(true); // 🔐 add loading state

	useEffect(() => {
		const openRealm = async () => {
			try {
				if (!realmInstance || realmInstance.isClosed) {
					realmInstance = await Realm.open(realmConfig);
				}

				console.log("Realm File Path:", realmInstance.path);
				setRealm(realmInstance);
			} catch (error) {
				// Handle any errors that occurred during opening the Realm

				// TODO: Change this to a full migration 
				//erase all data in the realm
				Realm.deleteFile(realmConfig);

				realmInstance = await Realm.open(realmConfig);
				console.error("Error opening Realm:", error);
			} finally {
				setLoading(false); // ✅ done initializing
			}
		};

		openRealm();

		return () => {
			if (realmInstance && !realmInstance.isClosed) {
				realmInstance.close();
				realmInstance = null;
			}
		};
	}, []);

	// 🔒 Block everything until Realm is ready
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
