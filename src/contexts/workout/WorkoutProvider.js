import { WorkoutTitleProvider } from "./WorkoutTitleContext";
import { WorkoutNotesProvider } from "./WorkoutNotesContext";
import { WorkoutExercisesProvider } from "./WorkoutExercisesContext";
import { WorkoutMetaProvider } from "./WorkoutMetaContext";
import { WorkoutTimerProvider } from "./WorkoutTimerContext";
import { WorkoutHistoryProvider } from "./WorkoutHistoryContext";
import { WorkoutErrorProvider } from "./WorkoutErrorContext";

const WorkoutProvider = ({ children }) => {
	return (
		<WorkoutMetaProvider>
			<WorkoutTimerProvider>
				<WorkoutTitleProvider>
					<WorkoutNotesProvider>
						<WorkoutExercisesProvider>
							<WorkoutHistoryProvider>
								<WorkoutErrorProvider>{children}</WorkoutErrorProvider>
							</WorkoutHistoryProvider>
						</WorkoutExercisesProvider>
					</WorkoutNotesProvider>
				</WorkoutTitleProvider>
			</WorkoutTimerProvider>
		</WorkoutMetaProvider>
	);
};

export default WorkoutProvider;
