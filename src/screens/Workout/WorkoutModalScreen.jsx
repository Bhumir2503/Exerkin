import {
	View,
	Platform,
	StyleSheet,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../contexts/ThemeContext";

import Header from "./components/Header";
import InfoCard from "../../components/InfoCard";
import Footer from "./components/Footer";
import WorkoutTimer from "./components/WorkoutTimer";
import Notes from "./components/Notes";
// import WorkoutNotes from "../../components/Modals/WorkoutNotes";
// import RestTimer from "../../components/Modals/RestTimer";
// import ExerciseDragList from "../../components/ExerciseDragList";
// import ExerciseSelector from "../../components/Modals/ExerciseSelector";
// import CancelButton from "../../components/Modals/CancelButton";
// import AddFirstExerciseCard from ../../components/ExerciseCard/AddFirstExerciseCard";

const WorkoutModalScreen = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header navigation={navigation} />
			{/* 
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.containerContent}
				keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 20}
			>
				<View style={{ flex: 1 }}>
					<View style={styles.timerStyle}>
						<View style={{ flexDirection: "row" }}>
							<WorkoutNotes />
							<RestTimer />
						</View>
					</View>

					<ExerciseDragList />
					<AddFirstExerciseCard />
				</View>
			</KeyboardAvoidingView>} */}
			<TouchableWithoutFeedback onPress={dismissKeyboard}>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.containerContent}
				>
					<View style={styles.userInputButtons}>
						<WorkoutTimer />
						<View style={{ flexDirection: "row" }}>
							<Notes />
						</View>
					</View>

					<InfoCard
						icon={"barbell-outline"}
						title={"Get Started With Your Workout"}
						message={
							"Click the button below to select your first exercise. You can add multiple sets for each exercise and track your progress."
						}
					/>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
			<Footer />
		</SafeAreaView>
	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		container: {
			backgroundColor: theme.backgroundColor,
			flex: 1,
		},
		containerContent: {
			flex: 1,
			marginTop: 10,
		},
		userInputButtons: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			padding: 20,
			paddingVertical: 10,
		},
	});
};

export default WorkoutModalScreen;
