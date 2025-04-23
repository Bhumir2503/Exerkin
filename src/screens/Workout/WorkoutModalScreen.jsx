import {
	View,
	Platform,
	StyleSheet,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	TouchableOpacity,
	Text,
	Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../contexts/ThemeContext";
import { useWorkoutMeta } from "../../contexts/workout/WorkoutMetaContext";
import { pickImageAsBase64 } from "./components/imagePicker";

import Header from "./components/Header";
import WorkoutDragList from "./components/WorkoutDragList";
import Footer from "./components/Footer";
import WorkoutTimer from "./components/WorkoutTimer";
import Notes from "./components/Notes";
import RestTimer from "./components/RestTimer";
import ImageButton from "./components/ImageButton";
// import WorkoutNotes from "../../components/Modals/WorkoutNotes";
// import RestTimer from "../../components/Modals/RestTimer";
// import ExerciseDragList from "../../components/ExerciseDragList";
// import ExerciseSelector from "../../components/Modals/ExerciseSelector";
// import CancelButton from "../../components/Modals/CancelButton";
// import AddFirstExerciseCard from ../../components/ExerciseCard/AddFirstExerciseCard";

const WorkoutModalScreen = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { base64Image } = useWorkoutMeta();


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
							<ImageButton />
						</View>
					</View>
					{/* <Image source={{ uri: `data:image/jpeg;base64,${base64Image}` }}
									style={{ width: "90%", height: 200, borderRadius: 8 , marginHorizontal: "auto"}}
									resizeMode="cover"/> */}
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
