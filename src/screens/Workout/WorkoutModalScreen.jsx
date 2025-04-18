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
import WorkoutDragList from "./components/WorkoutDragList";
import Footer from "./components/Footer";
import WorkoutTimer from "./components/WorkoutTimer";
import Notes from "./components/Notes";
import RestTimer from "./components/RestTimer";
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
		<SafeAreaView style={styles.container} edges={["top", "left", "right", "bottom"]}>
			<Header navigation={navigation} />
			<TouchableWithoutFeedback onPress={dismissKeyboard}>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.containerContent}
				>
					<View style={styles.userInputButtons}>
						<WorkoutTimer />
						<View style={{ flexDirection: "row" }}>
							<Notes />
							<RestTimer />
						</View>
					</View>
					<WorkoutDragList />
					
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
			<Footer navigation={navigation} />
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
