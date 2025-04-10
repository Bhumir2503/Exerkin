// services/database/realmConfig.js
import Realm from "realm";
import { realmSchemas } from "../schemas/realmSchemas";

const realmConfig = {
	path: "default.realm", // keep consistent
	schema: realmSchemas,
	schemaVersion: 2,
	migration: (oldRealm, newRealm) => {
	
	}
};

export const getRealm = async () => {
	return Realm.open(realmConfig);
};
