// services/database/realmConfig.js
import Realm from "realm";
import { realmSchemas } from "../schemas/realmSchemas";

const realmConfig = {
	path: "default.realm", // keep consistent
	schema: realmSchemas,
	schemaVersion: 1,
};

export const getRealm = async () => {
	return Realm.open(realmConfig);
};
