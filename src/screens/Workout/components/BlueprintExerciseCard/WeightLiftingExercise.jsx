import { Text, View, StyleSheet, Pressable } from "react-native";
import Header from "./Header";
import UserInputSection from "./UserInputSection";
import { useTheme } from "../../../../contexts/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
	Menu,
	MenuTrigger,
	MenuOptions,
	MenuOption,
} from "react-native-popup-menu";

import { buildSetObject } from "../../../../services/helpers/objectBuilder";
import { useBlueprintExercises } from "../../../../contexts/blueprint/BlueprintExercisesContext";
const WeightLiftingExercise = ({ exercise, dragEnabled }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const {
		addSetToExercise,
		updateSetInExercise,
		removeExercise,
		updateUnitSystemInExercise,
	} = useBlueprintExercises();

	const addSet = () => {
		// Add a new set with null values for weight and reps
		addSetToExercise(exercise.exerciseId, buildSetObject());
	};

	const handleWeightChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the weight for the specific set by using the index of the set
		updateSetInExercise(exercise.exerciseId, index, {
			...exercise.sets[index],
			weight: number !== "" ? number : null,
		});
	};

	const handleRepsChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the reps for the specific set by using the index of the set
		updateSetInExercise(exercise.exerciseId, index, {
			...exercise.sets[index],
			reps: number !== "" ? number : null,
		});
	};

	const handleDeleteExercise = () => {
		removeExercise(exercise.exerciseId);
	};

	const handleUnitChange = () => {
		const newUnitSystem =
			exercise.unitSystem === "imperial" ? "metric" : "imperial";
		updateUnitSystemInExercise(exercise.exerciseId, newUnitSystem);
	};

	const getMetrics = () => {
		if (exercise.unitSystem === "imperial") {
			return ["lbs", "reps"];
		}
		return ["kg", "reps"];
	};

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
							onSelect={handleUnitChange}
							style={styles.menuOptionContainer}
						>
							<Ionicons
								name="scale-outline"
								size={18}
								color={themeStyle.textColorSecondary}
							/>
							<Text
								style={[
									styles.menuOption,
									{ color: themeStyle.textColorSecondary },
								]}
							>
								Change Unit System
							</Text>
						</MenuOption>
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
			<Header repetitionType={"Set"} metrics={getMetrics()} />
			{exercise.sets.map((set, index) => (
				<UserInputSection
					key={index}
					id={exercise.exerciseId}
					index={index}
					inputTypes={["decimal", "numeric"]}
					placeholders={["", ""]}
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
			borderRadius: 8,
			borderWidth: 1,
			borderColor: themeStyle.textColorSecondary,
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

export default WeightLiftingExercise;
