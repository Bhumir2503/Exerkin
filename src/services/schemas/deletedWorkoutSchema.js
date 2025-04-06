export const DeletedWorkout = {
	name: "DeletedWorkout",
	primaryKey: "id",
	properties: {
		id: "string",
		userId: "string",
		deletedAt: "date",
		syncStatus: "string",
	},
};
