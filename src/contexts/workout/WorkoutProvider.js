import { WorkoutTitleProvider } from "./WorkoutTitleContext";
import { WorkoutNotesProvider } from "./WorkoutNotesContext";
import { WorkoutExercisesProvider } from "./WorkoutExercisesContext";
import { WorkoutMetaProvider } from "./WorkoutMetaContext";
import { WorkoutTimerProvider } from "./WorkoutTimerContext";
import { WorkoutHistoryProvider } from "./WorkoutHistoryContext";
import { WorkoutErrorProvider } from "./WorkoutErrorContext";
import { WorkoutImageProvider } from "./WorkoutImageContext";

const WorkoutProvider = ({ children }) => {
	return (
		<WorkoutMetaProvider>
			<WorkoutTimerProvider>
				<WorkoutTitleProvider>
					<WorkoutNotesProvider>
						<WorkoutExercisesProvider>
							<WorkoutHistoryProvider>
								<WorkoutImageProvider>
									<WorkoutErrorProvider>
										{children}
									</WorkoutErrorProvider>
								</WorkoutImageProvider>
							</WorkoutHistoryProvider>
						</WorkoutExercisesProvider>
					</WorkoutNotesProvider>
				</WorkoutTitleProvider>
			</WorkoutTimerProvider>
		</WorkoutMetaProvider>
	);
};

export default WorkoutProvider;
