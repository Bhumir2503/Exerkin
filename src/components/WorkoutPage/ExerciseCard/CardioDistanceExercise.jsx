import { Text, View, StyleSheet, Pressable } from "react-native";
import Header from "./Header";
import UserInputSection from "./UserInputSection";
import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkout } from "../../../contexts/WorkoutContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";

const CardioDistanceExercise = ({ exercise }) => {
const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);
    const { addSetToExercise, updateSetInExercise, removeExerciseFromWorkout } = useWorkout();

    const addSet = () => {
        // Add a new set with null values for time and distance
        addSetToExercise(exercise.id, { time: null, distance: null });

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

    const handleDistanceChange = (text, index) => {
        // Allow decimal points for distance
        const number = text.replace(/[^0-9.]/g, "");

        // Update the distance for the specific set
        updateSetInExercise(exercise.id, index, {
            ...exercise.sets[index],
            distance: number !== "" ? number : null,
        });
    };

    const handleDeleteExercise = () => {
        removeExerciseFromWorkout(exercise.id);
    }

    return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				<Text style={styles.workoutName}>{exercise.name}</Text>
				<Menu style={styles.menu}>
					<MenuTrigger>
						<Ionicons
							name="ellipsis-horizontal"
							size={24}
							color={themeStyle.textColorSecondary}
							style={styles.menuTrigger}
						/>
					</MenuTrigger>
					<MenuOptions
						customStyles={{
							optionsContainer: styles.menuOptions,
							optionsWrapper: styles.menuOptionsWrapper,
						}}
					>
						<MenuOption
							onSelect={handleDeleteExercise}
							style={styles.menuOptionContainer}
						>
							<Ionicons
								name="trash-outline"
								size={18}
								color={themeStyle.error}
							/>
							<Text style={styles.menuOption}>
								Delete Exercise
							</Text>
						</MenuOption>
					</MenuOptions>
				</Menu>
			</View>
			<Header repetitionType={"Round"} metrics={["time", "miles"]} />
			{exercise.sets.map((set, index) => (
				<UserInputSection
					key={index}
					id={exercise.id}
					index={index}
					inputTypes={["numeric", "decimal"]}
					placeholders={["30:00", "1.5"]}
					functions={[handleTimeChange, handleDistanceChange]}
					lengths={[7, 5]}
					values={[set.time, set.distance]}
				/>
			))}
			<Pressable style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</Pressable>
		</View>
	);
}

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
		menuTrigger: {
			padding: 5,
			paddingVertical: 0,
			borderRadius: 6,
		},
		menuOptions: {
			backgroundColor: themeStyle.card,
			padding: 4,
			justifyContent: "center",
			alignItems: "center",
			marginLeft: -25,
			marginTop: 15,
		},
		menuOptionContainer: {
			flexDirection: "row",
			alignItems: "center",
			padding: 12,
			borderRadius: 6,
		},
		menuOption: {
			fontSize: 16,
			color: themeStyle.error,
			marginLeft: 8,
			fontWeight: "500",
		},
	});
};

export default CardioDistanceExercise;