import React, { useRef } from "react";
import {
	Modal,
	View,
	Platform,
	StyleSheet,
	StatusBar,
	SafeAreaView,
	KeyboardAvoidingView,
	ScrollView,
	FlatList,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

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

	const scrollViewRef = useRef(null);

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

					<FlatList
						ref={scrollViewRef}
						nestedScrollEnabled={true}
						scrollEnabled={true}
						activationDistance={1}
						data={[
							<ExerciseForm />,
							<AddFirstExerciseCard />,
							<ExerciseSelector />,
							<CancelButton
								setMainModalVisible={setModalVisible}
								navigation={navigation}
							/>,
						]}
						renderItem={({ item }) => item}
						keyExtractor={(item, index) => index}
					/>
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
	});
};

export default WorkoutModal;
