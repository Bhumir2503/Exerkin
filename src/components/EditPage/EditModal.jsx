import React from "react";
import {
	View,
	Platform,
	StyleSheet,
	StatusBar,
	
	KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";

import WorkoutHeaderButtons from "./WorkoutHeaderButtons";
import EditNotes from "./Modals/EditNotes";
import ExerciseDragList from "../WorkoutPage/ExerciseDragList";
import ExerciseSelector from "../WorkoutPage/Modals/ExerciseSelector";
import CancelButton from "./Modals/CancelButton";
import AddFirstExerciseCard from "../WorkoutPage/ExerciseCard/AddFirstExerciseCard";

const EditModal = ({ visible, setModalVisible, navigation }) => {
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
				keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 20}
			>
				<View style={{ flex: 1, }}>
					<View style={styles.timerStyle}>
						<View></View>
						<View style={{ flexDirection: "row" }}>
							<EditNotes />
						</View>
					</View>

					<ExerciseDragList />
					<AddFirstExerciseCard />
				</View>
			</KeyboardAvoidingView>
			<View style={styles.bottomFixed}>
				<ExerciseSelector />
				<CancelButton navigation={navigation} />
			</View>
		</SafeAreaView>
	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		modal: {
			flex: 1,
			backgroundColor: theme.backgroundColor,
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
		bottomFixed: {
			marginBottom: Platform.OS === "ios" ? 0 : 15,
		},
	});
};

export default EditModal;
