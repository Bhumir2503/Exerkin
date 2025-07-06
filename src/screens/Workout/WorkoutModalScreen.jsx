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
	Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";

const WorkoutModalScreen = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { base64Image } = useWorkoutMeta();
	const [showPreview, setShowPreview] = useState(false);

	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	return (
		<SafeAreaView
			style={styles.container}
			edges={["top", "left", "right", "bottom"]}
		>
			<Header navigation={navigation} screen={"workout"} />
			<TouchableWithoutFeedback onPress={dismissKeyboard}>
				<View style={{ flex: 1 }}>
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

						{base64Image ? (
							<View style={styles.imageConfirmation}>
								<TouchableOpacity
									onPress={() => setShowPreview(true)}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<Ionicons
											name="image"
											size={20}
											color={themeStyle.primary}
											style={{ marginRight: 6 }}
										/>
										<Text style={styles.imageUploadedText}>
											Image uploaded! Click to preview.
										</Text>
									</View>
								</TouchableOpacity>
							</View>
						) : (
							<View style={styles.imageConfirmation}>
								<Text style={styles.imageUploadedText}>
									No image has been chosen yet.
								</Text>
							</View>
						)}

						<WorkoutDragList />
					</KeyboardAvoidingView>

					<Footer navigation={navigation} screen={"workout"} />
					{base64Image && (
						<Modal
							visible={showPreview}
							transparent={true}
							animationType="fade"
							onRequestClose={() => setShowPreview(false)}
						>
							<TouchableWithoutFeedback
								onPress={() => setShowPreview(false)}
							>
								<View style={styles.modalOverlay}>
									<View style={styles.imageWrapper}>
										<Image
											source={{
												uri: `data:image/jpeg;base64,${base64Image}`,
											}}
											style={styles.fullScreenImage}
											resizeMode="contain"
										/>
									</View>
								</View>
							</TouchableWithoutFeedback>
						</Modal>
					)}
				</View>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		container: {
			backgroundColor: themeStyle.backgroundColor,
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
		imageConfirmation: {
			margin: "auto",
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 16,
			marginBottom: 10,
			marginTop: 10,
			width: "90%",
			alignItems: "center",
			display: "flex",
		},
		imageUploadedText: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			lineHeight: 20,
			textAlign: "center",
		},
		modalOverlay: {
			flex: 1,
			backgroundColor: "rgba(0, 0, 0, 0.8)",
			justifyContent: "center",
			alignItems: "center",
		},
		imageWrapper: {
			width: "90%",
			height: "90%",
			justifyContent: "center",
			alignItems: "center",
		},

		fullScreenImage: {
			width: "100%",
			height: "100%",
			borderRadius: 10,
		},
	});
};

export default WorkoutModalScreen;
