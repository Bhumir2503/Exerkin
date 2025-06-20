export const UserSchema = {
	name: "User",
	primaryKey: "userId",
	properties: {
		userId: "string",
		username: "string",
		email: "string",
		motivation: "string?",
		preferences: "UserPreferences",
		createdAt: "date",
		updatedAt: "date",
	},
};

export const UserPreferencesSchema = {
	name: "UserPreferences",
	embedded: true,
	properties: {
		theme: "string?",
		gender: "string?",
		unitSystem: "string?",
		notificationsEnabled: "bool?",
	},
};
