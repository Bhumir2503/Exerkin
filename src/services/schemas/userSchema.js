export const UserSchema = {
	name: "User",
	primaryKey: "userId",
	properties: {
		userId: "string",
		username: "string",
        email: "string",
		bio: "string?",
        createdAt: "date",
        updatedAt: "date",
		setupComplete: "bool",
	},
};
