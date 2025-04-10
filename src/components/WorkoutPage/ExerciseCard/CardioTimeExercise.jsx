import { Text, View, StyleSheet, Pressable } from "react-native";
import Header from "./Header";
import UserInputSection from "./UserInputSection";
import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkout } from "../../../contexts/WorkoutContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const CardioTimeExercise = ({ exercise }) => {
    const { themeStyle } = useTheme();
        const styles = createStyles(themeStyle);
        const { addSetToExercise, updateSetInExercise, removeExerciseFromWorkout } = useWorkout();
    
        const addSet = () => {
            // Add a new set with null values for time
            addSetToExercise(exercise.id, { time: null });

        };

        const handleTimeChange = (text, index) => {
            // Store the previous value to compare
            const prevValue = exercise.sets[index]?.time || "";
    
            // If user is trying to delete and the text is shorter
            if (text.length < prevValue.length) {
                // Handle backspace - we'll remove the last character
                // But we need to handle cases where the last character is a colon
                if (prevValue.endsWith(":")) {
                    // If deleting a colon, also remove the digit before it
                    const newValue = prevValue.slice(0, -2);
                    updateSetInExercise(exercise.id, index, {
                        ...exercise.sets[index],
                        time: newValue !== "" ? newValue : null,
                    });
                    return;
                } else {
                    // Normal backspace - just remove the last character
                    const newValue = prevValue.slice(0, -1);
                    updateSetInExercise(exercise.id, index, {
                        ...exercise.sets[index],
                        time: newValue !== "" ? newValue : null,
                    });
                    return;
                }
            }
    
            // For adding characters, keep only numbers and colons
            let number = text.replace(/[^0-9:]/g, "");
    
            // Format time as MM:SS or HH:MM:SS
            if (number) {
                // Remove any existing colons
                const digits = number.replace(/:/g, "");
    
                if (digits.length <= 2) {
                    // If 1-2 digits, treat as seconds only
                    number = digits;
                } else if (digits.length <= 4) {
                    // Format as MM:SS
                    const minutes = digits.slice(0, digits.length - 2);
                    const seconds = digits.slice(digits.length - 2);
                    number = `${minutes}:${seconds}`;
                } else {
                    // Format as HH:MM:SS for longer inputs
                    const seconds = digits.slice(digits.length - 2);
                    const minutes = digits.slice(
                        digits.length - 4,
                        digits.length - 2
                    );
                    const hours = digits.slice(0, digits.length - 4);
                    number = `${hours}:${minutes}:${seconds}`;
                }
            }
    
            // Update the time for the specific set
            updateSetInExercise(exercise.id, index, {
                ...exercise.sets[index],
                time: number !== "" ? number : null,
            });
        };

        const handleDeleteExercise = () => {
            removeExerciseFromWorkout(exercise.id);
        }
    
        return (
            <View style={styles.container}>
                <View style={styles.headerRow}>
				    <Text style={styles.workoutName}>{exercise.name}</Text>
				    <Pressable onPress={handleDeleteExercise}>
					    <Ionicons name="trash-outline" size={20} color={themeStyle.error} />
				    </Pressable>
			    </View>
                <Header repetitionType={"Round"} metrics={["time"]} />
                {exercise.sets.map((set, index) => (
                    <UserInputSection
                        key={index}
                        id={exercise.id}
                        index={index}
                        inputTypes={["numeric"]}
                        placeholders={["10:00"]}
                        functions={[handleTimeChange]}
                        lengths={[7]}
                        values={[set.time]}
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
        headerRow: {
            flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 5,
        },
	});
};

export default CardioTimeExercise;