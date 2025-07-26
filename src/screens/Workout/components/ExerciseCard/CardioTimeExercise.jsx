import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import Header from "./Header";
import UserInputSection from "./UserInputSection";
import { useTheme } from "../../../../contexts/ThemeContext";
import {
	Menu,
	MenuTrigger,
	MenuOptions,
	MenuOption,
} from "react-native-popup-menu";
import { Ionicons } from "@expo/vector-icons";

import { buildSetObject } from "../../../../services/helpers/objectBuilder";
import { useWorkoutExercises } from "../../../../contexts/workout/WorkoutExercisesContext";

const CardioTimeExercise = ({ exercise }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise, removeExercise } =
		useWorkoutExercises();

	const addSet = () => {
		addSetToExercise(exercise.exerciseId, buildSetObject());
	};

	const formatTime = (digits) => {
		if (digits.length <= 2) return digits;
		if (digits.length <= 4)
			return `${digits.slice(0, -2)}:${digits.slice(-2)}`;
		return `${digits.slice(0, -4)}:${digits.slice(-4, -2)}:${digits.slice(
			-2
		)}`;
	};

	const handleTimeChange = (text, index) => {
		const prevDigits = (exercise.sets[index]?.time || "").replace(
			/[^0-9]/g,
			""
		);
		const newDigits = text.replace(/[^0-9]/g, "");

		let digitsToUse;

		if (newDigits.length < prevDigits.length) {
			// Deletion occurred — remove last digit
			digitsToUse = prevDigits.slice(0, -1);
		} else {
			// Addition — add valid digits only
			digitsToUse = newDigits;
		}

		const formatted = formatTime(digitsToUse);

		updateSetInExercise(exercise.exerciseId, index, {
			...exercise.sets[index],
			time: formatted !== "" ? formatted : null,
		});
	};

	const handleDeleteExercise = () => {
		removeExercise(exercise.exerciseId);
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
			<Header repetitionType={"Round"} metrics={["time"]} />
			{exercise.sets.map((set, index) => (
				<UserInputSection
					key={index}
					id={exercise.exerciseId}
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
			marginBottom: 10,
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

export default CardioTimeExercise;
