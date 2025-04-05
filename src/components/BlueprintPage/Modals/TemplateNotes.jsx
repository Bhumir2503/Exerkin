import React, { useState, useEffect } from "react";
import {
	View,
	TextInput,
	Text,
	StyleSheet,
	Modal,
	Pressable,
	TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTemplate } from "../../../contexts/TemplateContext";
import { Ionicons } from "@expo/vector-icons";

const MAX_CHARACTERS = 256;

const TemplateNotes = () => {
    const { TemplateNote } = useTemplate();
	const [workoutNotes, setWorkoutNotes] = useState(TemplateNote.current);
	const [modalVisible, setModalVisible] = useState(false);
	const [tempNotes, setTempNotes] = useState("");
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	// Initialize tempNotes when modal opens
	useEffect(() => {
		if (modalVisible) {
			setTempNotes(workoutNotes);
		}
	}, [modalVisible]);

	const handleWorkoutNotesChange = (text) => {
		setTempNotes(text);
	};

	const saveNotes = () => {
		setWorkoutNotes(tempNotes);
		TemplateNote.current = tempNotes;
		setModalVisible(false);
	};

	const cancelNotes = () => {
		setTempNotes(workoutNotes);
		setModalVisible(false);
	};

	return (
		<>
			{/* Notes Button */}
			<Pressable
				style={styles.noteButton}
				onPress={() => setModalVisible(true)}
			>
				<Ionicons name="pencil" size={20} color={"#fff"} />
			</Pressable>

			{/* Notes Modal */}
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={cancelNotes}
				statusBarTranslucent={true}
			>
				<View style={{ flex: 1, alignItems: "center" }}>
					<TouchableWithoutFeedback onPress={cancelNotes}>
						<View style={styles.backgroundOverlay}></View>
					</TouchableWithoutFeedback>

					<View style={styles.modalView}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Notes</Text>
							<Pressable
								onPress={cancelNotes}
								style={styles.closeButton}
							>
								<Ionicons
									name="close"
									size={24}
									color={themeStyle.textColor}
								/>
							</Pressable>
						</View>

						<View style={styles.inputContainer}>
							<TextInput
								style={styles.textInput}
								placeholder="Add notes..."
								placeholderTextColor={
									themeStyle.textColorSecondary
								}
								value={tempNotes}
								onChangeText={handleWorkoutNotesChange}
								multiline
								maxLength={MAX_CHARACTERS}
								autoFocus
							/>
							<Text style={styles.charCount}>
								{MAX_CHARACTERS - tempNotes.length} /{" "}
								{MAX_CHARACTERS}
							</Text>
						</View>

						<View style={styles.buttonContainer}>
							<Pressable
								style={[styles.button, styles.saveButton]}
								onPress={saveNotes}
							>
								<Text style={styles.saveButtonText}>
									Save Notes
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		noteButton: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: themeStyle.primary,
			borderRadius: 8,
			padding: 10,
			paddingHorizontal: 15,
			marginRight: 10,
		},
		buttonText: {
			color: themeStyle.textColorSecondary,
			marginLeft: 8,
			fontSize: 15,
		},
		backgroundOverlay: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(0, 0, 0, 0.75)",
		},
		modalView: {
			zIndex: 2,
			marginTop: "35%",
			width: "90%",
			backgroundColor: themeStyle.backgroundColor,
			borderRadius: 8,
			overflow: "hidden",
		},
		modalHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			padding: 15,
			// borderBottomWidth: 1,
			// borderBottomColor: themeStyle.textColorSecondary,
		},
		modalTitle: {
			color: themeStyle.textColor,
			fontSize: 18,
			fontWeight: "bold",
		},
		closeButton: {
			padding: 5,
		},
		inputContainer: {
			padding: 15,
			position: "relative",
		},
		textInput: {
			color: themeStyle.textColor,
			fontSize: 16,
			minHeight: 150,
			textAlignVertical: "top",
			paddingBottom: 25,
		},
		charCount: {
			position: "absolute",
			bottom: 10,
			right: 15,
			fontSize: 12,
			color: themeStyle.textColorSecondary,
		},
		buttonContainer: {
			flexDirection: "row",
			borderTopWidth: 1,
			borderTopColor: themeStyle.backgroundSecondary || themeStyle.card,
		},
		button: {
			flex: 1,
			padding: 15,
			alignItems: "center",
		},
		saveButton: {
			backgroundColor: themeStyle.primary,
		},
		cancelButton: {
			borderRightWidth: 1,
			borderRightColor: themeStyle.backgroundSecondary || themeStyle.card,
		},
		saveButtonText: {
			color: "#FFFFFF",
			fontWeight: "bold",
			fontSize: 16,
		},
		cancelButtonText: {
			color: themeStyle.textColor,
			fontSize: 16,
		},
	});

export default TemplateNotes;
