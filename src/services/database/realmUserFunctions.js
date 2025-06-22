/*
 * Function to get a user from the Realm database
 *
 * @param {Realm} realm - The Realm instance
 * @param {string} userId - The ID of the user to be retrieved
 * @returns {Promise<Object|null>} - A promise that resolves to the user object or null if not found
 * @throws {Error} - Throws an error if the user cannot be retrieved
 */
export const getUserFromRealm = async (realm, userId) => {
	try {
		const user = realm.objects("User").filtered("userId == $0", userId)[0];
		if (!user) {
			console.log(`No user found with ID ${userId} in Realm.`);
			return null;
		}
		return user;
	} catch (error) {
		throw new Error(`Failed to retrieve user from Realm: ${error.message}`);
	}
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
						theme: userData.preferences?.theme || "midnightPurple",
						gender: userData.preferences?.gender || "male",
						unitSystem:
							userData.preferences?.unitSystem || "imperial",
						notificationEnabled:
							userData.preferences?.notificationsEnabled || false,
					},
					createdAt: userData.createdAt.toDate(),
					updatedAt: userData.updatedAt.toDate(),
				},
				"modified"
			);
		});
		await updateLastUserSyncTime(realm);
	} catch (error) {
		throw new Error(`Failed to save user in Realm: ${error.message}`);
	}
};

/*
 * Function to remove a user from the Realm database
 *
 * @param {Realm} realm - The Realm instance
 * @param {string} userId - The ID of the user to be removed
 * @returns {Promise<void>} - A promise that resolves when the user is removed
 */
export const removeUserFromRealm = async (realm, userId) => {
	try {
		realm.write(() => {
			const user = realm
				.objects("User")
				.filtered("userId == $0", userId)[0];
			if (user) {
				realm.delete(user);
				console.log(`User with ID ${userId} removed from Realm.`);
			} else {
				console.log(`No user found with ID ${userId} in Realm.`);
			}
		});
	} catch (error) {
		throw new Error(`Failed to remove user from Realm: ${error.message}`);
	}
};

/*
 * Function to get the last sync time for user data
 *
 * @param {Realm} realm - The Realm instance
 * @returns {Promise<Date|null>} - A promise that resolves to the last sync time or null if not found
 */
export const getLastUserSyncTime = async (realm) => {
	try {
		const syncStatus = realm
			.objects("SyncStatus")
			.filtered("type == 'user'")[0];
		if (syncStatus) {
			return syncStatus.lastSynced;
		}
		console.log("No sync status found for user.");
		return null;
	} catch (error) {
		throw new Error(
			`Failed to retrieve last user sync time: ${error.message}`
		);
	}
};

/*
 * Function to update the last sync time for user data
 *
 * @param {Realm} realm - The Realm instance
 * @returns {Promise<void>} - A promise that resolves when the last sync time is updated
 */
export const updateLastUserSyncTime = async (realm) => {
	realm.write(() => {
		realm.create(
			"SyncStatus",
			{
				type: "user",
				lastSynced: new Date(),
			},
			"modified"
		);
	});
};
