export const DeletedWorkout = {
	name: "DeletedWorkout",
	primaryKey: "deletedId",
	properties: {
		deletedId: "string",
		userId: "string",
		deletedAt: "date",
		syncStatus: "string",
	},
};
