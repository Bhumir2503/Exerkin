import { Text, StyleSheet, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { memo } from "react";

import PrimaryButton from "../../components/PrimaryButton";
import InfoCard from "../../components/InfoCard";
import ActiveWorkoutBar from "./components/ActiveWorkoutBar";

import { useWorkoutSession } from "../../hooks/useWorkoutSession";
import { useTheme } from "../../contexts/ThemeContext";

const WorkoutScreen = memo(({ navigation }) => {
	const { workoutStart, workoutIdRef } = useWorkoutSession();
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const startButtonPressed = () => {
		console.log("Start Workout Button Pressed");
		workoutStart();
		navigation.navigate("WorkoutModalScreen");
	};

	return (
		<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
			<Text style={styles.title}>Get Started</Text>
			<Text style={styles.description}>Ready to start your workout?</Text>
			<PrimaryButton
				title="Start Workout"
				onPress={startButtonPressed}
				icon="fitness"
				disable={workoutIdRef.current ? true : false}
			/>
			<View style={styles.coach}>
				<Text style={styles.subTitle}>AI Coach</Text>
				<InfoCard
					icon={"sparkles-outline"}
					title={"AI Workout Suggestions"}
					message={
						"Get personalized workout suggestions based on your goals. Coming soon!"
					}
					width={"100%"}
				/>
			</View>
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
			<ActiveWorkoutBar navigate={navigation.navigate} />
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
		coach: {
			marginTop: 20,
			flex: 1,
		},
		subTitle: {
			color: theme.textColor,
			fontSize: 24,
			fontWeight: "bold",
		},
	});
};

export default WorkoutScreen;
