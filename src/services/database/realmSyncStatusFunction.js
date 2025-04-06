
export const getLastSynced = async (realm, type) => {
    const syncStatus = realm.objectForPrimaryKey("SyncStatus", type);
    if (syncStatus) {
        return syncStatus.lastSynced;
    } else {
        return new Date(); // or a default date
    }
}

export const updateLastSynced = async (realm, type, lastSynced) => {
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

export const clearSyncStatus = async (realm) => {
    realm.write(() => {
        realm.deleteAll();
    });
}

