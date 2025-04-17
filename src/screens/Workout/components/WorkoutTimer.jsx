import { View } from "react-native";
import Timer from "../../../components/Timer";
import { useWorkoutTimer } from "../../../contexts/workout/WorkoutTimerContext";
import { useWorkoutMeta } from "../../../contexts/workout/WorkoutMetaContext";

const WorkoutTimer = () => {
	const { workoutTimer } = useWorkoutTimer();
	const { workoutStartTimeRef } = useWorkoutMeta();
	return (
		<View style={{}}>
			<Timer
				initialSeconds={workoutTimer}
				startTime={workoutStartTimeRef.current}
			/>
		</View>
	);
};

export default WorkoutTimer;
