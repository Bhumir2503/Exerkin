export const UserSchema = {
	name: "User",
	primaryKey: "uid",
	properties: {
		uid: "string",
		username: "string",
		bio: "string?",
        email: "string",
        createdAt: "date",
        updatedAt: "date",
        age: "string?",
        height: "string?",
        weight: "string?",
		setupComplete: "bool",
	},
};
