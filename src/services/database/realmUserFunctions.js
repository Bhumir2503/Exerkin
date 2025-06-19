export const getRealmUser = async (realm, userId) => {
	const user = realm.objects("User").filtered("uid == $0", userId)[0];
	return user;
};

/*
 * Function to set user data in Realm database
 *
 * @param {Realm} realm - The Realm instance
 * @param {Object} userData - The user data object containing user details
 * @returns {Promise<void>} - A promise that resolves when the user data is set
 */
export const setRealmUser = async (realm, userData) => {
	try {
		realm.write(() => {
			realm.create(
				"User",
				{
					userId: userData.userId,
					username: userData.username,
					email: userData.email,
					gender: userData.gender,
					motivation: userData.motivation,
					unitSystem: userData.unitSystem,
					createdAt: userData.createdAt?.toDate?.(),
					updatedAt: userData.updatedAt?.toDate?.(),
				},
				"modified"
			);
		});
	} catch (error) {
		throw new Error("Failed to set user in Realm");
	}
};

export const removeRealmUser = async (realm, userId) => {
	realm.write(() => {
		const user = realm.objects("User").filtered("uid == $0", userId)[0];
		if (user) {
			realm.delete(user);
		}
	});
};

export const getLastUserSyncTime = async (realm) => {
	const status = realm.objectsForPrimaryKey("SyncStatus", "user");
	return status ? status.lastSyncTime : null;
};

export const updateLastUserSyncTime = async (realm) => {
	realm.create(
		"SyncStatus",
		{
			type: "user",
			lastSyncTime: new Date(),
		},
		"modified"
	);
};
