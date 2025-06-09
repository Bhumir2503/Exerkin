import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import PopUp from "../../../../components/PopUp";
import { Ionicons } from "@expo/vector-icons";

import SignInForm from "../SignInForm";
import SignUpForm from "../SignUpForm";
import ForgotPasswordForm from "../ForgotPasswordForm";

export default function EmailAuthButton() {
	const [modalVisible, setModalVisible] = useState(false);
	const [type, setType] = useState("Log In");

	const CloseModal = () => {
		setType("Log In");
		setModalVisible(false);
	};

	const OpenModal = () => {
		setType("Log In");
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
				onClose={CloseModal}
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
