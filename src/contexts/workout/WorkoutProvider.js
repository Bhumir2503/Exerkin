// WorkoutProvider.js
import React from "react";
import { WorkoutTitleProvider } from "./WorkoutTitleContext";
import { WorkoutNotesProvider } from "./WorkoutNotesContext";
import { WorkoutExercisesProvider } from "./WorkoutExercisesContext";
import { WorkoutHistoryProvider } from "./WorkoutHistoryContext";
import { WorkoutTimerProvider } from "./WorkoutTimerContext";
import { WorkoutMetaProvider } from "./WorkoutMetaContext";
import { WorkoutErrorProvider } from "./WorkoutErrorContext";

const WorkoutProvider = ({ children }) => (
	<WorkoutTitleProvider>
		<WorkoutNotesProvider>
			<WorkoutExercisesProvider>
				<WorkoutHistoryProvider>
					<WorkoutMetaProvider>
						<WorkoutErrorProvider>
							<WorkoutTimerProvider>{children}</WorkoutTimerProvider>
						</WorkoutErrorProvider>
					</WorkoutMetaProvider>
				</WorkoutHistoryProvider>
			</WorkoutExercisesProvider>
		</WorkoutNotesProvider>
	</WorkoutTitleProvider>
);
export default WorkoutProvider;
