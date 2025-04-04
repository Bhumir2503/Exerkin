import React from "react";
import {
	View,
	Platform,
	StyleSheet,
	StatusBar,
	SafeAreaView,
	KeyboardAvoidingView,

} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

import WorkoutHeaderButtons from "./WorkoutHeaderButtons";
import WorkoutTimer from "./WorkoutTimer";
import WorkoutNotes from "./Modals/WorkoutNotes";
import RestTimer from "./Modals/RestTimer";
import ExerciseDragList from "./ExerciseDragList";
import ExerciseSelector from "./Modals/ExerciseSelector";
import CancelButton from "./Modals/CancelButton";
import AddFirstExerciseCard from "./ExerciseCard/AddFirstExerciseCard";

const WorkoutModal = ({ visible, setModalVisible, navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
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
				<View>
					<View style={styles.timerStyle}>
						<WorkoutTimer visible={visible} />
						<View style={{ flexDirection: "row" }}>
							<WorkoutNotes />
							<RestTimer />
						</View>
					</View>

					<ExerciseDragList />
					<AddFirstExerciseCard />
					<View style={styles.bottomFixed}>
						<ExerciseSelector />
						<CancelButton navigation={navigation} />
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
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
		contentContainer: {
			flex: 1,
			// Manually apply padding if SafeAreaView still isn't working
			// paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
		},
		modalContent: {
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
		// bottomFixed: {
		// 	position: "absolute",
		// 	bottom: 0,
		// 	width: "100%",
		// 	paddingBottom: 20,
		// 	paddingHorizontal: 20,
		// 	backgroundColor: theme.backgroundColor,
		// },
	});
};

export default WorkoutModal;
