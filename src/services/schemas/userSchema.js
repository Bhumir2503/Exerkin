export const UserSchema = {
	name: "User",
	primaryKey: "userId",
	properties: {
		userId: "string",
		username: "string",
        email: "string",
		bio: "string?",
		gender: "string?",
		unitSystem: "string?",
        createdAt: "date",
        updatedAt: "date",
		setupComplete: "bool",
	},
};
