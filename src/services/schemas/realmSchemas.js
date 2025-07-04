
import { SyncStatusSchema } from "./syncStatusSchema";

import {
	BlueprintSchema,
	BlueprintExerciseSchema,
	BlueprintExerciseSetSchema,
} from "./blueprintSchema";

export const realmSchemas = [
	SyncStatusSchema,
	BlueprintSchema,
	BlueprintExerciseSchema,
	BlueprintExerciseSetSchema,
	// add more here if needed
];
