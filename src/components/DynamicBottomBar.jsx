import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../contexts/ThemeContext";
import { useWorkoutTimer } from "../contexts/workout/WorkoutTimerContext";
import { useWorkoutMeta } from "../contexts/workout/WorkoutMetaContext";
import Timer from "./Timer";

import { trigger } from "react-native-haptic-feedback";

const DynamicBottomBar = ({ onPress, title, subtitle, iconName }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const { workoutTimer } = useWorkoutTimer();
	const { workoutStartTimeRef } = useWorkoutMeta();

	const handlePress = () => {
		trigger("impactLight");
		onPress();
	};

	return (
		<Pressable style={styles.container} onPress={handlePress}>
			<View style={styles.iconContainer}>
				<Ionicons
					name={iconName}
					size={24}
					color={themeStyle.primary}
				/>
			</View>
			<View style={styles.infoContainer}>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.subtitle}>{subtitle}</Text>
			</View>
			<View style={styles.timerContainer}>
				<Timer
					initialSeconds={workoutTimer}
					startTime={workoutStartTimeRef.current}
				/>
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

export default DynamicBottomBar;
