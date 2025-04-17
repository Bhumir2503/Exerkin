import DynamicBottomBar from "../../../components/DynamicBottomBar";
import { useWorkoutSession } from "../../../hooks/useWorkoutSession";
import { View } from "react-native";

const ActiveWorkoutBar = ({ navigate }) => {
    const { workoutExercises, workoutTitle, workoutIdRef } = useWorkoutSession();

    const handlePress = () => {
        navigate("WorkoutModalScreen");
    };

    if (!workoutIdRef.current) return null;


    return (
        <View style={{position: "absolute", bottom: 0, left: 0, right: 0}}>
            <DynamicBottomBar
                onPress={handlePress}
                title={workoutTitle || "Active Workout"}
                subtitle={`${workoutExercises.length} ${workoutExercises.length === 1 ? "exercise" : "exercises"}`}
                iconName="pulse-sharp"
            />
        </View>
    );
}
export default ActiveWorkoutBar;