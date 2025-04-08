import { getLastUserSyncTime, updateLastUserSyncTime } from "../database/realmUserFunctions";

export const syncUserFromFirestore = async (realm, userId) => {
	try {
		const lastSyncTime = await getLastUserSyncTime(realm);
		const updatedUser = await fetchUserData(userId, lastSyncTime);

        realm.write(() => {
            if (updatedUser.length > 0) {
                console.log(
                    "(Sync) User data updated successfully",
                    updatedUser.username
                );
                setRealmUser(realm, userId, updatedUser);
            }
            updateLastUserSyncTime(realm);
        });

        
	} catch (error) {
		console.error("(Sync) Error syncing user data:", error);
	}
};
