import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useWorkout } from "../../contexts/WorkoutContext";
import WorkoutTimer from "./WorkoutTimer";

const ActiveWorkoutBar = ({ onPress, visible }) => {
	const { themeStyle } = useTheme();
	const {
		workoutExercises,
		WorkoutTimer: WorkoutTimerRef,
		WorkoutTitle,
		WorkoutStartTime,
	} = useWorkout();
	const styles = createStyles(themeStyle);

    if(!visible && !WorkoutStartTime.current) return null;


	return (
		<Pressable style={styles.container} onPress={onPress}>
			<View style={styles.iconContainer}>
				<Ionicons
					name="pulse-sharp"
					size={24}
					color={themeStyle.primary}
				/>
			</View>
			<View style={styles.infoContainer}>
				<Text style={styles.title}>{WorkoutTitle.current || "Active Workout"}</Text>
				<Text style={styles.subtitle}>
					{workoutExercises.length}{" "}
					{workoutExercises.length === 1 ? "exercise" : "exercises"}
				</Text>
			</View>
			<View style={styles.timerContainer}>
				<WorkoutTimer timeRef={WorkoutTimerRef} visible={visible} startTimeStamp={WorkoutStartTime.current} />
			</View>
		</Pressable>
	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		container: {
			flexDirection: "row",
			backgroundColor: theme.card,
			borderRadius: 8,
			padding: 10,
			marginHorizontal: 10,
			marginVertical: 5,
			alignItems: "center",
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.1,
			shadowRadius: 3,
			elevation: 3,
		},
		iconContainer: {
			marginRight: 10,
			padding: 5,
		},
		infoContainer: {
			flex: 1,
		},
		title: {
			color: theme.textColor,
			fontWeight: "bold",
			fontSize: 16,
		},
		subtitle: {
			color: theme.textColorSecondary,
			fontSize: 14,
		},
		timerContainer: {
			alignItems: "flex-end",
			paddingRight: 5,
		},
	});
};

export default ActiveWorkoutBar;
