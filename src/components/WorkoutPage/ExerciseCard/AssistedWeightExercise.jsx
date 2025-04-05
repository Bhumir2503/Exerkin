import {Text, View, StyleSheet, Pressable} from "react-native";
import Header from "./Header";
import UserInputSection from "./UserInputSection";
import {useTheme} from "../../../contexts/ThemeContext";
import {useWorkout} from "../../../contexts/WorkoutContext";

const AssistedWeightExercise = ({ exercise }) => {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);
    const { addSetToExercise, updateSetInExercise } = useWorkout();

    const addSet = () => {
        // Add a new set with null values for weight and reps
        addSetToExercise(exercise.id, { weight: null, reps: null });
    };

    const handleWeightChange = (text, index) => {
        // make sure only number are accepted
        const number = text.replace(/[^0-9]/g, "");

        // Update the weight for the specific set by using the index of the set
        updateSetInExercise(exercise.id, index, {
            ...exercise.sets[index],
            weight: number !== "" ? number : null,
        });
    };

    const handleRepsChange = (text, index) => {
        // make sure only number are accepted
        const number = text.replace(/[^0-9]/g, "");

        // Update the reps for the specific set by using the index of the set
        updateSetInExercise(exercise.id, index, {
            ...exercise.sets[index],
            reps: number !== "" ? number : null,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.workoutName}>{exercise.name}</Text>
            <Header repetitionType={"Set"} metrics={["-lbs", "reps"]} />
            {exercise.sets.map((set, index) => (
                <UserInputSection
                    key={index}
                    id={exercise.id}
                    index={index}
                    inputTypes={["decimal", "numeric"]}
                    placeholders={["135", "12"]}
                    functions={[handleWeightChange, handleRepsChange]}
                    lengths={[4, 3]}
                    values={[set.weight, set.reps]}
                />
            ))}
            <Pressable style={styles.setButton} onPress={addSet}>
                <Text style={styles.setButtonText}>Add Set</Text>
            </Pressable>
        </View>
    );
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		container: {
			backgroundColor: themeStyle.card,
			margin: "auto",
			padding: "3%",
			width: "90%",
			marginBottom: "5%",
			borderRadius: 8,
		},
		workoutName: {
			color: themeStyle.primary,
			fontWeight: "bold",
			fontSize: 18,
			marginBottom: 5,
		},
		setButton: {
			backgroundColor: themeStyle.inputBackground,
			width: "100%",
			padding: "2%",
			borderRadius: 6,
			marginTop: "5%",
			alignItems: "center",
		},
		setButtonText: {
			color: themeStyle.textColor,
			fontWeight: "700",
			fontSize: 16,
		},
	});
};

export default AssistedWeightExercise;