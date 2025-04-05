import React from "react";
import {
	View,
	Platform,
	StyleSheet,
	KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import TemplateHeader from "./TemplateHeader";
import TemplateNotes from "./Modals/TemplateNotes";
import TemplateExerciseDragList from "./TemplateExerciseDragList";
import AddFirstExerciseCard from "./ExerciseCard/AddFirstExerciseCard";
import ExerciseSelector from "./Modals/ExerciseSelector";
import CancelButton from "./Modals/CancelButton";

const TemplateModal = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<SafeAreaView
			style={styles.modal}
			edges={["top", "right", "left", "bottom"]}
		>
			<TemplateHeader navigation={navigation} />

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.modalContent}
				keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 20}
				
			>
				<View style={{ flex: 1 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "flex-end",
							paddingVertical: 15,
							paddingHorizontal: 20,
						}}
					>
						<TemplateNotes />
					</View>
					<TemplateExerciseDragList />
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
		modalContent: {
			flex: 1,
			width: "100%",
			backgroundColor: "transparent",
		},
		bottomFixed: {
			marginBottom: Platform.OS === "ios" ? 0 : 15,
		},
	});
};

export default TemplateModal;
