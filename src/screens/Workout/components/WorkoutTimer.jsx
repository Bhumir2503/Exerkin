import { View } from "react-native";
import Timer from "../../../components/Timer";
import { useWorkoutTimer } from "../../../contexts/workout/WorkoutTimerContext";
import { useWorkoutMeta } from "../../../contexts/workout/WorkoutMetaContext";

const WorkoutTimer = () => {
	const { workoutTimer } = useWorkoutTimer();
	const { workoutStartTimeRef, formTypeRef } = useWorkoutMeta();
	return (
		<View style={{}}>
			{formTypeRef.current === "workout" ? (
				<Timer
					initialSeconds={workoutTimer}
					startTime={workoutStartTimeRef.current}
				/>
			) : null}
		</View>
	);
};

export default WorkoutTimer;
