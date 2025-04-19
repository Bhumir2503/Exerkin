import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkoutMeta } from "../../../contexts/workout/WorkoutMetaContext";
import { pickImageAsBase64 } from "./imagePicker";

const ImageButton = () => {
	const { themeStyle } = useTheme();
	const { setBase64Image } = useWorkoutMeta();
	const styles = createStyles(themeStyle);

	const handlePickImage = async () => {
		const base64 = await pickImageAsBase64();
		if (base64) {
			setBase64Image(base64);
		} else {
			console.log("No image selected or failed to read base64.");
		}
	};

	return (
		<TouchableOpacity style={styles.button} onPress={handlePickImage}>
			<View style={styles.buttonContent}>
				<Ionicons name="image-outline" size={20} color="#fff" />
			</View>
		</TouchableOpacity>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		button: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: themeStyle.primary,
			borderRadius: 8,
			padding: 10,
			paddingHorizontal: 15,
			marginHorizontal: 10,
			marginRight: 0,
		},
		buttonContent: {
			flexDirection: "row",
			alignItems: "center",
		},
	});

export default ImageButton;
