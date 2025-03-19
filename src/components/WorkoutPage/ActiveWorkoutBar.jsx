import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import WorkoutTimer from "./WorkoutTimer";

const ActiveWorkoutBar = ({ onPress, exerciseCount, timeRef, title, visible, startTimeStamp }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

    if(!visible && !startTimeStamp) return null;

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
				<Text style={styles.title}>{title || "Active Workout"}</Text>
				<Text style={styles.subtitle}>
					{exerciseCount}{" "}
					{exerciseCount === 1 ? "exercise" : "exercises"}
				</Text>
			</View>
			<View style={styles.timerContainer}>
				<WorkoutTimer timeRef={timeRef} visible={visible} startTimeStamp={startTimeStamp} />
			</View>
		</Pressable>
	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		container: {
			flexDirection: "row",
			backgroundColor: theme.card,
			borderRadius: 10,
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
