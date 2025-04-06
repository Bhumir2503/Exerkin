import Realm from "realm";
import { SyncStatusSchema } from "../schemas/syncStatusSchema";

const realmConfig = {
	schema: [SyncStatusSchema],
	schemaVersion: 1,
};

export const getRealmSyncStatus = async () => {
	const realm = await Realm.open(realmConfig);
	return realm;
};

export const getLastSynced = async (type) => {
    const realm = await getRealmSyncStatus();
    const syncStatus = realm.objectForPrimaryKey("SyncStatus", type);
    if (syncStatus) {
        return syncStatus.lastSynced;
    } else {
        return new Date(); // or a default date
    }
}

export const updateLastSynced = async (type, lastSynced) => {
    const realm = await getRealmSyncStatus();
    realm.write(() => {
        const syncStatus = realm.objectForPrimaryKey("SyncStatus", type);
        if (syncStatus) {
            syncStatus.lastSynced = lastSynced;
        } else {
            realm.create("SyncStatus", {
                type: type,
                lastSynced: lastSynced,
            });
        }
    });
}

export const clearSyncStatus = async () => {
    const realm = await getRealmSyncStatus();
    realm.write(() => {
        realm.deleteAll();
    });
}

