import { Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { memo } from "react";

import PrimaryButton from "../../components/PrimaryButton";
import TemplateSection from "../../components/BlueprintPage/TemplateSection";

import { useWorkoutSession } from "../../hooks/useWorkoutSession";
import { useTheme } from "../../contexts/ThemeContext";

const WorkoutScreen = memo(({ navigation }) => {
    const { workoutStart } = useWorkoutSession();
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const startButtonPressed = () => {
		console.log("Start Workout Button Pressed");
        workoutStart();
        navigation.navigate("WorkoutModalScreen");
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Get Started</Text>
			<Text style={styles.description}>Ready to start your workout?</Text>
			<PrimaryButton
				title="Start Workout"
				onPress={startButtonPressed}
				icon="fitness"
			/>
			{/* <ScrollView
				bounces={false}
				showsVerticalScrollIndicator={false}
				style={{
                    marginTop: 20,
					paddingHorizontal: 0,
					flex: 1,
				}}
			>
				<TemplateSection navigation={navigation} />
			</ScrollView> */}
		</SafeAreaView>
	);
});

const createStyles = (theme) => {
	return StyleSheet.create({
		container: {
			backgroundColor: theme.backgroundColor,
            flex: 1,
			marginBottom: 0,
            padding: 20,
            paddingTop: 0,
		},
		title: {
			color: theme.textColor,
			fontSize: 32,
			fontWeight: "bold",
			marginBottom: 10,
		},
		description: {
			color: theme.textColor,
			fontSize: 18,
			marginBottom: 20,
		},
		activeWorkoutBarContainer: {
			position: "absolute",
			bottom: 10,
			left: 0,
			right: 0,
		},
	});
};

export default WorkoutScreen;
