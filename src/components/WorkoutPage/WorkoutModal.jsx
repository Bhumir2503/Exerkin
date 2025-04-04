import React, { useRef } from "react";
import {
	Modal,
	View,
	Platform,
	StyleSheet,
	StatusBar,
	SafeAreaView,
	KeyboardAvoidingView,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import WorkoutHeaderButtons from "./WorkoutHeaderButtons";
import WorkoutTimer from "./WorkoutTimer";
import WorkoutNotes from "./WorkoutNotes";
import RestTimer from "./RestTimer";
import ExerciseForm from "./ExerciseForm";
import ExerciseSelector from "./ExerciseSelector";
import CancelButton from "./CancelButton";
import AddFirstExerciseCard from "./AddFirstExerciseCard";
import ActiveWorkoutBar from "./ActiveWorkoutBar";

const WorkoutModal = ({ visible, setModalVisible, navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView
				style={styles.modal}
				edges={["top", "right", "left", "bottom"]}
			>
				<WorkoutHeaderButtons navigation={navigation} />

				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.modalContent}
					keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
				>
					<View style={styles.timerStyle}>
						<WorkoutTimer visible={visible} />
						<View style={{ flexDirection: "row" }}>
							<WorkoutNotes />
							<RestTimer />
						</View>
					</View>

					{/* ExerciseForm already contains a draggable FlatList */}
					<ExerciseForm navigation={navigation}/>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</GestureHandlerRootView>
	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		modal: {
			flex: 1,
			backgroundColor: theme.backgroundColor,
			paddingTop:
				Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
		},
		modalContent: {
			flex: 1,
			width: "100%",
		},
		timerStyle: {
			paddingVertical: 15,
			paddingHorizontal: 20,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
	});
};

export default WorkoutModal;
