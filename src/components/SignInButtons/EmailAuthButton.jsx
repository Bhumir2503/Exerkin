import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import PopUp from "../PopUp";
import { Ionicons } from "@expo/vector-icons";

import SignInForm from "../../screens/Auth/components/SignInForm";
import SignUpForm from "../../screens/Auth/components/SignUpForm";
import ForgotPasswordForm from "../../screens/Auth/components/ForgotPasswordForm";

export default function EmailAuthButton() {
	const [modalVisible, setModalVisible] = useState(false);
	const [type, setType] = useState("Log In");

	const handleClose = () => {
		// Reset the type to "Log In" when closing the modal
		setType("Log In");
		// Close the modal
		setModalVisible(false);
	};

	const OpenModal = () => {
		// Reset the type to "Log In" when opening the modal
		setType("Log In");
		// Open the modal
		setModalVisible(true);
	};

	return (
		<>
			<View style={styles.buttonContainer}>
				<Pressable style={styles.emailButton} onPress={OpenModal}>
					<Ionicons
						name="mail"
						size={20}
						color="#fffffe"
						style={styles.buttonIcon}
					/>
					<Text style={styles.buttonText}>Continue with Email</Text>
				</Pressable>
			</View>

			<PopUp
				visible={modalVisible}
				onClose={handleClose}
				animationType="none"
			>
				{type === "Log In" ? (
					<SignInForm setType={setType} />
				) : type === "Sign Up" ? (
					<SignUpForm setType={setType} />
				) : (
					<ForgotPasswordForm setType={setType} />
				)}
			</PopUp>
		</>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
		width: "100%",
		marginVertical: 5,
	},
	emailButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#1e1e24",
		borderRadius: 8,
		height: 50,
		width: "100%",
		borderWidth: 1,
		borderColor: "#383844",
	},
	buttonIcon: {
		marginRight: 12,
	},
	buttonText: {
		color: "#fffffe",
		fontSize: 16,
		fontWeight: "500",
	},
	
});
