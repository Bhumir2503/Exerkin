import { useState, useEffect } from "react";
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TouchableOpacity,
	TextInput,
} from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

import { handleDecimalNumberText } from "../../../services/helpers/textInputFunctions";

export default function MeasurementForm({
	unitSystem,
	gender,
	measurements,
	setMeasurements,
}) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState({
		title: "",
		description: "",
		image: null,
	});

	const showMeasurementHelp = (measurement) => {
		const helpContent = {
			neck: {
				title: "Neck Measurement",
				description:
					"Measure around the middle of your neck, below your Adam's apple, keeping the tape measure level.",
			},
			chest: {
				title: "Chest Measurement",
				description:
					"Measure around the chest at the widest part, typically at the nipple line, keeping the tape measure level.",
			},
			abs: {
				title: "Abdomen Measurement",
				description:
					"Measure around your abdomen at the level of your navel, keeping the tape measure level.",
			},
			waist: {
				title: "Waist Measurement",
				description:
					"Measure around your natural waistline, located above your belly button and below your rib cage.",
			},
			hips: {
				title: "Hips Measurement",
				description:
					"Measure around the widest part of your hips/buttocks, keeping the tape measure level.",
			},
			shoulder: {
				title: "Shoulder Measurement",
				description:
					"Measure from the tip of one shoulder across to the tip of the other shoulder.",
			},
			bicep: {
				title: "Bicep Measurement",
				description:
					"Measure around the widest part of your bicep with your arm relaxed at your side.",
			},
			forearm: {
				title: "Forearm Measurement",
				description:
					"Measure around the widest part of your forearm with your arm relaxed.",
			},
			thigh: {
				title: "Thigh Measurement",
				description:
					"Measure around the widest part of your thigh, typically right below where your thigh meets your buttocks.",
			},
			calf: {
				title: "Calf Measurement",
				description:
					"Measure around the widest part of your calf with your leg relaxed.",
			},
		};

		let content = helpContent[measurement] || {
			title: "Measurement Help",
			description:
				"Take this measurement at the widest point, keeping the tape measure level.",
		};

		setModalContent(content);
		setModalVisible(true);
	};

	const renderMeasurementInput = (data) => {
		return (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					gap: 16,
					marginBottom: 24,
				}}
			>
				{data.map((item, index) => (
					<View style={styles.measurementInputContainer} key={index}>
						<View style={styles.labelContainer}>
							<Text style={styles.label}>{item.label}</Text>
							<TouchableOpacity
								onPress={() =>
									showMeasurementHelp(item.helpType)
								}
							>
								<Ionicons
									name="information-circle-outline"
									size={16}
									color="#94a1b2"
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.statInputWrapper}>
							<TextInput
								style={styles.statInput}
								placeholder="0"
								placeholderTextColor="#72757e"
								value={measurements[item.name]}
								onChangeText={(text) =>
									setMeasurements((prev) => ({
										...prev,
										[item.name]:
											handleDecimalNumberText(text),
									}))
								}
								keyboardType="number-pad"
								maxLength={5}
							/>
							<Text style={styles.statUnit}>
								{unitSystem === "Imperial" ? "in" : "cm"}
							</Text>
						</View>
					</View>
				))}
			</View>
		);
	};

	return (
		<View style={styles.formContainer}>
			<Text style={styles.sectionTitleText}>Primary Measurements</Text>
			<Text style={styles.sectionSubtitle}>
				Required for body fat calculation
			</Text>

			{renderMeasurementInput([
				{
					label: "Neck",
					name: "neck",
					helpType: "neck",
				},
				{
					label: "Waist",
					name: "waist",
					helpType: "waist",
				},
			])}
			{renderMeasurementInput([
				{
					label: "Hips",
					name: "hips",
					helpType: "hips",
				},
				{
					label: "Shoulder",
					name: "shoulder",
					helpType: "shoulder",
				},
			])}

			<View style={styles.bodyFatContainer}>
				<Text style={styles.bodyFatLabel}>Estimated Body Fat</Text>
				<View style={styles.bodyFatResult}>
					<Text style={styles.bodyFatValue}>
						{measurements.bodyFat
							? `${measurements.bodyFat}%`
							: "N/A"}
					</Text>
					<Text style={styles.bodyFatNote}>
						{measurements.bodyFat
							? "Calculated using Navy method"
							: `Enter height, neck${
									gender === "Female" ? ", hips, " : " "
							  }and waist to calculate`}
					</Text>
				</View>
			</View>

			<Text style={styles.sectionTitleText}>Upper Body</Text>
			{renderMeasurementInput([
				{
					label: "Chest",
					name: "chest",
					helpType: "chest",
				},
				{
					label: "Abdomen",
					name: "abdomen",
					helpType: "abs",
				},
			])}
			{renderMeasurementInput([
				{
					label: "Left Bicep",
					name: "leftBicep",
					helpType: "bicep",
				},
				{
					label: "Right Bicep",
					name: "rightBicep",
					helpType: "bicep",
				},
			])}
			{renderMeasurementInput([
				{
					label: "Left Forearm",
					name: "leftForearm",
					helpType: "forearm",
				},
				{
					label: "Right Forearm",
					name: "rightForearm",
					helpType: "forearm",
				},
			])}

			<Text style={styles.sectionTitleText}>Lower Body</Text>
			{renderMeasurementInput([
				{
					label: "Left Thigh",
					name: "leftThigh",
					helpType: "thigh",
				},
				{
					label: "Right Thigh",
					name: "rightThigh",
					helpType: "thigh",
				},
			])}
			{renderMeasurementInput([
				{
					label: "Left Calf",
					name: "leftCalf",
					helpType: "calf",
				},
				{
					label: "Right Calf",
					name: "rightCalf",
					helpType: "calf",
				},
			])}

			<Text style={styles.privacyNote}>
				Your measurements are private by default and only shared when
				you choose to
			</Text>

			<ModalPopUp
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				modalContent={modalContent}
			/>
		</View>
	);
}

function ModalPopUp({ modalVisible, setModalVisible, modalContent }) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => setModalVisible(false)}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>
							{modalContent.title}
						</Text>
						<TouchableOpacity
							onPress={() => setModalVisible(false)}
						>
							<Ionicons name="close" size={24} color="#fffffe" />
						</TouchableOpacity>
					</View>
					<View style={styles.modalBody}>
						<Text style={styles.modalDescription}>
							{modalContent.description}
						</Text>
						{modalContent.image && (
							<View style={styles.modalImageContainer}>
								{/* Placeholder for measurement images if you have them */}
							</View>
						)}
					</View>
					<TouchableOpacity
						style={styles.modalButton}
						onPress={() => setModalVisible(false)}
					>
						<Text style={styles.modalButtonText}>Got it</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

const createStyles = (themeStyle) =>
	StyleSheet.create({
		// Form container styles
		sectionTitleText: {
			fontSize: 18,
			fontWeight: "600",
			color: themeStyle.textColor,
			marginBottom: 8,
		},
		sectionSubtitle: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			marginBottom: 8,
		},

		// Measurement input styles
		measurementInputContainer: {
			flex: 1,
		},
		label: {
			fontSize: 14,
			fontWeight: "500",
			color: themeStyle.textColor,
			marginBottom: 6,
			marginLeft: 6,
		},
		labelContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		statInputWrapper: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: themeStyle.inputBackground,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: themeStyle.inputBorder,
			height: 56,
			paddingLeft: 16,
		},
		statInput: {
			flex: 1,
			color: themeStyle.textColor,
			fontSize: 16,
			textAlign: "center",
		},
		statUnit: {
			color: themeStyle.textColorSecondary,
			fontSize: 16,
			paddingRight: 16,
			width: 40,
			textAlign: "center",
		},

		// Body fat result display
		bodyFatContainer: {
			backgroundColor: themeStyle.inputBackground,
			borderRadius: 8,
			padding: 16,
			marginVertical: 24,
		},
		bodyFatLabel: {
			fontSize: 16,
			fontWeight: "600",
			color: themeStyle.textColor,
			marginBottom: 8,
		},
		bodyFatResult: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
		bodyFatValue: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.primary, // midnightPurple.primary
		},
		bodyFatNote: {
			fontSize: 12,
			color: themeStyle.textColorSecondary, // midnightPurple.textColorSecondary
			flex: 1,
			marginLeft: 12,
			fontStyle: "italic",
		},
		privacyNote: {
			color: themeStyle.textColorSecondary, // midnightPurple.textColorSecondary
			fontSize: 13,
			fontStyle: "italic",
			textAlign: "center",
			marginVertical: 24,
		},

		// Modal styles
		modalOverlay: {
			flex: 1,
			backgroundColor: "rgba(0, 0, 0, 0.7)",
			justifyContent: "center",
			alignItems: "center",
			padding: 24,
		},
		modalContent: {
			backgroundColor: themeStyle.inputBackground,
			borderRadius: 8,
			width: "100%",
			maxWidth: 500,
			padding: 24,
			borderWidth: 1,
			borderColor: themeStyle.inputBorder, // midnightPurple.inputBorder
		},
		modalHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 16,
		},
		modalTitle: {
			fontSize: 20,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
		modalBody: {
			marginBottom: 24,
		},
		modalDescription: {
			fontSize: 16,
			color: themeStyle.textColorSecondary,
			lineHeight: 24,
		},
		modalImageContainer: {
			marginTop: 16,
			alignItems: "center",
		},
		modalButton: {
			backgroundColor: themeStyle.primary,
			borderRadius: 8,
			height: 48,
			alignItems: "center",
			justifyContent: "center",
		},
		modalButtonText: {
			color: themeStyle.textColor,
			fontSize: 16,
			fontWeight: "600",
		},
	});
