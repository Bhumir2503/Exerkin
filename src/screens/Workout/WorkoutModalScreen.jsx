import { View, Platform, StyleSheet, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../contexts/ThemeContext";

import Header from "./components/Header";
// import WorkoutTimer from "../../components/WorkoutTimer";
// import WorkoutNotes from "../../components/Modals/WorkoutNotes";
// import RestTimer from "../../components/Modals/RestTimer";
// import ExerciseDragList from "../../components/ExerciseDragList";
// import ExerciseSelector from "../../components/Modals/ExerciseSelector";
// import CancelButton from "../../components/Modals/CancelButton";
// import AddFirstExerciseCard from "../../components/ExerciseCard/AddFirstExerciseCard";

const WorkoutModalScreen = ({navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<SafeAreaView
			style={styles.container}
		>
			<Header navigation={navigation} />
{/* 
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.containerContent}
				keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 20}
			>
				<View style={{ flex: 1 }}>
					<View style={styles.timerStyle}>
						<WorkoutTimer/>
						<View style={{ flexDirection: "row" }}>
							<WorkoutNotes />
							<RestTimer />
						</View>
					</View>

					<ExerciseDragList />
					<AddFirstExerciseCard />
				</View>
			</KeyboardAvoidingView>
			<View style={styles.bottomFixed}>
				<ExerciseSelector />
				<CancelButton navigation={navigation} />
			</View> */}
		</SafeAreaView>
	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		container: {
			backgroundColor: theme.backgroundColor,
			flex: 1,
		},
		contentContainer: {
			flex: 1,
		},
		containerContent: {
			flex: 1,
			width: "100%",
		},
		scrollView: {
			width: "100%",
			alignItems: "center",
		},
		timerStyle: {
			paddingVertical: 15,
			paddingHorizontal: 20,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
		bottomFixed: {
			marginBottom: Platform.OS === "ios" ? 0 : 15,
		},
	});
};

export default WorkoutModalScreen;
