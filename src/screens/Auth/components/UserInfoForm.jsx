import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import TextInputIcon from "../../../components/TextInputIcon";
import TextInputUnit from "../../../components/TextInputUnit";

import {
	handleNumberText,
	handleDecimalNumberText,
} from "../../../services/helpers/textInputFunctions";

export default function UserInfoForm({
	motivation,
	setMotivation,
	measurements,
	setMeasurements,
	gender,
	setGender,
	unitSystem,
	setUnitSystem,
	handleNextPress,
	handlePrevPress,
}) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<View style={styles.formContainer}>
			<Text style={styles.label}>Motivation</Text>
			<TextInputIcon
				value={motivation}
				onChangeText={setMotivation}
				placeholder="Enter your motivation"
				icon="trophy"
				keyboardType="default"
				maxLength={512}
			/>
			<Text style={styles.helperText}>
				Share a bit about yourself, your fitness goals, or what
				motivates you
			</Text>

			<View
				style={{
					flexDirection: "row",
					width: "100%",
					gap: 12,
					marginBottom: 24,
				}}
			>
				<TextInputUnit
					value={measurements.age || ""}
					onChangeText={(e) => {
						setMeasurements((prev) => ({
							...prev,
							age: handleNumberText(e),
						}));
					}}
					placeholder={measurements.age || "0"}
					unit="yrs"
					keyboardType="numeric"
					maxLength={3}
					header="Age"
				/>
				<TextInputUnit
					value={measurements.height || ""}
					onChangeText={(e) => {
						setMeasurements((prev) => ({
							...prev,
							height: handleNumberText(e),
						}));
					}}
					placeholder={measurements.height || "0"}
					unit={unitSystem === "Imperial" ? "in" : "cm"}
					keyboardType="numeric"
					maxLength={3}
					header="Height"
				/>
				<TextInputUnit
					value={measurements.weight || ""}
					onChangeText={(e) => {
						setMeasurements((prev) => ({
							...prev,
							weight: handleDecimalNumberText(e),
						}));
					}}
					placeholder={measurements.weight || "0"}
					unit={unitSystem === "Imperial" ? "lbs" : "kg"}
					keyboardType="numeric"
					maxLength={5}
					header="Weight"
				/>
			</View>

			<Text style={[styles.label]}>Gender</Text>
			<View
				style={{
					flexDirection: "row",
					gap: 12,
				}}
			>
				<ButtonFocus
					onPress={() => setGender("Male")}
					icon={"male"}
					text={"Male"}
					activeTextChoice={gender}
				/>
				<ButtonFocus
					onPress={() => setGender("Female")}
					icon={"female"}
					text={"Female"}
					activeTextChoice={gender}
				/>
			</View>

			<Text style={[styles.label, { marginTop: 24 }]}>Unit System</Text>
			<View
				style={{
					flexDirection: "row",
					gap: 12,
				}}
			>
				<ButtonFocus
					onPress={() => setUnitSystem("Imperial")}
					icon={"american-football"}
					text={"Imperial"}
					activeTextChoice={unitSystem}
				/>
				<ButtonFocus
					onPress={() => setUnitSystem("Metric")}
					icon={"football"}
					text={"Metric"}
					activeTextChoice={unitSystem}
				/>
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={handlePrevPress}
				>
					<Ionicons name="chevron-back" size={20} color="#7f2af0" />
					<Text style={styles.backButtonText}>Back</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.button}
					onPress={handleNextPress}
				>
					<Text style={styles.buttonText}>Continue</Text>
					<Ionicons
						name="chevron-forward"
						size={20}
						color={themeStyle.textColor}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}

function ButtonFocus({ onPress, icon, text, activeTextChoice }) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	return (
		<TouchableOpacity style={styles.radio} onPress={onPress}>
			<Ionicons
				name={icon}
				size={20}
				color={
					activeTextChoice === text
						? themeStyle.primary
						: themeStyle.textColor
				}
				style={styles.radioIcon}
			/>
			<Text
				style={[
					styles.radioText,
					activeTextChoice === text && styles.activeButton,
				]}
			>
				{text}
			</Text>
		</TouchableOpacity>
	);
}

const createStyles = (themeStyles) => {
	return StyleSheet.create({
		formContainer: {
			backgroundColor: themeStyles.backgroundColor,
			borderRadius: 8,
			marginBottom: 20,
		},
		label: {
			fontSize: 16,
			color: themeStyles.textColor,
			marginBottom: 6,
			marginLeft: 6,
		},
		helperText: {
			fontSize: 14,
			color: themeStyles.textColorSecondary,
			marginTop: 6,
			marginLeft: 6,
			marginBottom: 24,
		},
		radio: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: themeStyles.inputBackground,
			borderRadius: 8,
			height: 50,
			paddingHorizontal: 12,
			flex: 1,
		},
		radioIcon: {
			marginRight: 12,
		},
		radioText: {
			color: themeStyles.textColor,
			fontSize: 16,
			fontWeight: "500",
		},
		activeButton: {
			color: themeStyles.primary,
			fontWeight: "bold",
		},
		buttonContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginTop: 24,
		},
		button: {
			backgroundColor: themeStyles.primary, // midnightPurple.primary
			borderRadius: 8,
			height: 56,
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "row",
			paddingHorizontal: 24,
			flex: 1,
		},
		backButton: {
			backgroundColor: "transparent",
			borderWidth: 1,
			borderColor: themeStyles.primary, // midnightPurple.primary
			borderRadius: 8,
			height: 56,
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "row",
			paddingHorizontal: 16,
			marginRight: 12,
			flex: 0.5,
		},
		buttonText: {
			color: themeStyles.textColor, // midnightPurple.textColor
			fontSize: 16,
			fontWeight: "600",
			marginRight: 8,
		},
		backButtonText: {
			color: themeStyles.primary, // midnightPurple.primary
			fontSize: 16,
			fontWeight: "600",
			marginLeft: 8,
		},
	});
};
