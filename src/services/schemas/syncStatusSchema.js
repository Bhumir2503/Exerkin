export const SyncStatusSchema = {
	name: "SyncStatus",
	primaryKey: "type",
	properties: {
		type: "string", // e.g., "workouts"
		lastSynced: "date",
	},
};
