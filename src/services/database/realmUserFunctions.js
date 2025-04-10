export const getRealmUser = async (realm, userId) => {
	const user = realm.objects("User").filtered("uid == $0", userId)[0];
	return user;
};

export const setRealmUser = async (realm, userData) => {
try {
	realm.write(() => {
		realm.create(
			"User",
			{
				userId: userData.userId,
				username: userData.username,
				email: userData.email,
				bio: userData.bio || "",
				gender: userData.gender || "male",
				unitSystem: userData.unitSystem || "imperial",
				createdAt: userData.createdAt?.toDate?.() || new Date(),
				updatedAt: userData.updatedAt?.toDate?.() || new Date(),
				setupComplete: userData.setupComplete || false,
			},
			"modified"
		);
		console.log("User Update written to Realm!");
	});
} catch (error) {
	console.error("(setRealmUser) - Realm write failed:", error);
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
