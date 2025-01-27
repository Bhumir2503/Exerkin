import auth from "@react-native-firebase/auth";
import React, { useState } from "react";
import {
	Text,
	View,
	TextInput,
	Button,
	Modal,
	StyleSheet,
	TouchableOpacity,
} from "react-native";

export default function ForgotPassword({
	visible,
	setVisible,
	setModalVisible,
}) {

	const styles = createStyles();
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");

	const handleClose = () => {
		setModalVisible(true);
		setVisible(false);
		setEmail("");
		setError("");
	};

	const handleSubmit = () => {
		setError("");
		//check if email is valid
		if (!email.includes("@") || !email.includes(".")) {
			setError("Invalid email");
			console.log("Invalid email");
			return;
		}

		auth()
			.sendPasswordResetEmail(email)
			.then(() => {
				console.log("Reset email sent");
				handleClose();
			})
			.catch((error) => {
				console.error(error);
				setError("Error sending reset email");
			});
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="formSheet"
		>
			<View
				style={{ flexDirection: "row", justifyContent: "flex-start" }}
			>
				<Text style={styles.close} onPress={() => handleClose()}>
					Close
				</Text>
			</View>
			<Text style={styles.title}>Forgot Password</Text>
			<Text style={styles.subText}>Your Email</Text>
			<View style={{ alignItems: "center" }}>
				<TextInput
					style={styles.input}
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
				/>
			</View>

			<View
				style={{
					alignContent: "center",
					alignItems: "center",
					marginBottom: 20,
				}}
			>
				<TouchableOpacity
					style={styles.button}
					onPress={() => handleSubmit()}
				>
					<Text style={{ fontWeight: "bold", fontSize: 15 }}>
						Send Reset Email
					</Text>
				</TouchableOpacity>
			</View>

			<Text style={styles.error}>{error}</Text>
		</Modal>
	);
}

const createStyles = () =>
	StyleSheet.create({
		close: {
			padding: 10,
			borderRadius: 5,
			marginTop: 10,
			color: "#407BFF",
			fontWeight: "bold",
		},
		title: {
			fontSize: 20,
			fontWeight: "bold",
			padding: 10,
			paddingBottom: 0,
		},
		subText: {
			fontSize: 14,
			padding: 10,
			paddingLeft: "7%",
			paddingBottom: 0,
			borderColor: "gray",
		},
		input: {
			justifyContent: "center",
			alignContent: "center",
			alignItems: "center",
			width: "90%",
			fontSize: 14,
			padding: 10,
			paddingLeft: 20,
			borderRadius: 5,
			backgroundColor: "#f0f0f0",
			marginBottom: 20,
		},
		button: {
			justifyContent: "center",
			alignContent: "center",
			alignItems: "center",
			width: "90%",
			fontSize: 14,
			padding: 10,
			paddingLeft: 20,
			borderRadius: 5,
			backgroundColor: "#407BFF",
			color: "#000",
		},
		error: {
			color: "red",
			textAlign: "center",
			margin: 10,
		},
	});
