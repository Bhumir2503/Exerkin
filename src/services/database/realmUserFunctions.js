export const getRealmUser = async (realm, userId) => {
	const user = realm.objects("User").filtered("userId == $0", userId)[0];
	return user;
};

/*
 * Function to set user data in Realm database
 *
 * @param {Realm} realm - The Realm instance
 * @param {Object} userData - The user data object containing user details
 * @returns {Promise<void>} - A promise that resolves when the user data is set
 * @throws {Error} - Throws an error if the user data cannot be set
 */
export const saveUserInRealm = async (realm, userData) => {
	try {
		realm.write(() => {
			realm.create(
				"User",
				{
					userId: userData.userId,
					username: userData.username,
					email: userData.email,
					motivation: userData.motivation,
					preferences: {
						theme: userData.preferences.theme,
						gender: userData.preferences.gender,
						unitSystem: userData.preferences.unitSystem,
						notificationEnabled:
							userData.preferences.notificationsEnabled,
					},
					createdAt: userData.createdAt,
					updatedAt: userData.updatedAt,
				},
				"modified"
			);
		});
		console.log("User set in Realm successfully");
	} catch (error) {
		throw new Error("Failed to set user in Realm");
	}
};

/*
 * Function to remove a user from the Realm database
 *
 * @param {Realm} realm - The Realm instance
 * @param {string} userId - The ID of the user to be removed
 * @returns {Promise<void>} - A promise that resolves when the user is removed
 */
export const removeRealmUser = async (realm, userId) => {
	realm.write(() => {
		const user = realm.objects("User").filtered("userId == $0", userId)[0];
		if (user) {
			realm.delete(user);
			console.log(`User with ID ${userId} removed from Realm.`);
		} else {
			console.warn(`No user found with ID ${userId} in Realm.`);
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
