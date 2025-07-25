import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
	View,
	TouchableOpacity,
	Image,
	Text,
	Modal,
	TouchableWithoutFeedback,
	StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWorkoutImage } from "../../../contexts/workout/WorkoutImageContext";

import { useTheme } from "../../../contexts/ThemeContext";

const ImageButton = ({}) => {
	const { setWorkoutImageURL } = useWorkoutImage();

	const [modalVisible, setModalVisible] = useState(false);
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const [errorMessage, setErrorMessage] = useState(null);

	const handleCloseModal = () => {
		setModalVisible(false);
		setErrorMessage(null);
	};

	const chooseImage = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			setErrorMessage(
				"Permission to access camera roll is required!, please enable it in settings."
			);
			return;
		}
		setErrorMessage(null);
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.canceled) {
			// Handle the selected image
			console.log("Image selected:", result.assets[0].uri);
			setWorkoutImageURL(result.assets[0].uri);
			handleCloseModal();
		}
	};

	const takePhoto = async () => {
		const permissionResult =
			await ImagePicker.requestCameraPermissionsAsync();
		if (permissionResult.granted === false) {
			setErrorMessage(
				"Permission to access camera is required!, please enable it in settings."
			);
			return;
		}
		setErrorMessage(null);
		const result = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.canceled) {
			// Handle the captured photo
			console.log("Photo taken:", result.assets[0].uri);
			setWorkoutImageURL(result.assets[0].uri);
			handleCloseModal();
		}
	};

	return (
		<>
			<TouchableOpacity
				style={styles.imageButton}
				onPress={() => setModalVisible(true)}
			>
				<Ionicons name="image" size={20} color="white" />
			</TouchableOpacity>

			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => handleCloseModal()}
				statusBarTranslucent={true}
			>
				<View style={{ flex: 1, alignItems: "center" }}>
					<TouchableWithoutFeedback
						onPress={() => handleCloseModal()}
					>
						<View style={styles.backgroundOverlay}></View>
					</TouchableWithoutFeedback>
					<View style={styles.modalView}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>
								Select Image Source
							</Text>
							<TouchableOpacity
								onPress={() => handleCloseModal()}
								style={styles.closeButton}
							>
								<Ionicons
									name="close"
									size={24}
									color={themeStyle.textColor}
								/>
							</TouchableOpacity>
						</View>
						{errorMessage && (
							<View
								style={{
									marginBottom: 10,
									padding: 15,
									paddingVertical: 0,
								}}
							>
								<Text
									style={{
										color: themeStyle.error,
										fontSize: 14,
										textAlign: "center",
									}}
								>
									{errorMessage}
								</Text>
							</View>
						)}
						<View
							style={{
								padding: 15,
							}}
						>
							<TouchableOpacity
								style={styles.optionButton}
								onPress={chooseImage}
							>
								<Text style={styles.optionText}>
									Choose from Gallery
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.optionButton}
								onPress={takePhoto}
							>
								<Text style={styles.optionText}>
									Take a Photo
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};

const permissionDialog = (message) => {
	return (
		<View style={{ padding: 20 }}>
			<Text style={{ color: "white", fontSize: 16 }}>{message}</Text>
		</View>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		imageButton: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: themeStyle.primary,
			borderRadius: 8,
			padding: 10,
			paddingHorizontal: 15,
			marginLeft: 10,
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
			marginTop: "50%",
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
		},
		modalTitle: {
			color: themeStyle.textColor,
			fontSize: 18,
			fontWeight: "bold",
		},
		closeButton: {
			padding: 5,
		},
		optionButton: {
			backgroundColor: themeStyle.primary,
			borderRadius: 8,
			padding: 10,
			alignItems: "center",
			justifyContent: "center",
			marginBottom: 10,
		},
		optionText: {
			color: "white",
			fontSize: 16,
			fontWeight: "bold",
		},
	});

export default ImageButton;
