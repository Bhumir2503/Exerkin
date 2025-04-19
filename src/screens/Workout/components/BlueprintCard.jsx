import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";

const BlueprintCard = ({ template, onView, onEdit, onDelete }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	// Format creation date
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	// Get the first exercise name for preview
	const getExercisePreview = (exercises) => {
		if (!exercises || exercises.length === 0) return "No exercises";
		if (exercises.length === 1) return exercises[0].name;
		return `${exercises[0].name} and ${exercises.length - 1} more`;
	};

	return (
		<View style={styles.cardContainer}>
			<View style={styles.cardHeader}>
				<View>
					<Text style={styles.templateName}>{template.name}</Text>
					<Text style={styles.dateText}>
						Created: {formatDate(template.createdAt)}
					</Text>
				</View>
				{!template.syncStatus && (
					<Ionicons
						name="cloud-offline-outline"
						size={18}
						color={themeStyle.accent}
						style={{ marginRight: 8, marginTop: 4 }}
					/>
				)}
			</View>

			<View style={styles.contentSection}>
				{template.note && (
					<Text style={styles.noteText} numberOfLines={2}>
						{template.note}
					</Text>
				)}

				<View style={styles.statsRow}>
					<View style={styles.statItem}>
						<Ionicons
							name="barbell-outline"
							size={16}
							color={themeStyle.textColor}
						/>
						<Text style={styles.statText}>
							{template.exercises ? template.exercises.length : 0}{" "}
							exercises
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.buttonContainer}>
				<Pressable
					style={styles.startButton}
					onPress={() => onView(template.templateId)}
				>
					<Text style={styles.startButtonText}>View Blueprint</Text>
				</Pressable>

				<View style={styles.iconButtons}>
					<Pressable
						style={styles.iconButton}
						onPress={() => onEdit(template.templateId)}
					>
						<Ionicons
							name="pencil"
							size={20}
							color={themeStyle.accent}
						/>
					</Pressable>

					<Pressable
						style={styles.iconButton}
						onPress={() => onDelete(template.templateId)}
					>
						<Ionicons
							name="trash-outline"
							size={20}
							color={themeStyle.error}
						/>
					</Pressable>
				</View>
			</View>
		</View>
	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		cardContainer: {
			backgroundColor: theme.card || theme.backgroundColor,
			borderRadius: 8,
			padding: 18,
			marginVertical: 10,
			borderWidth: 1,
			borderColor: theme.borderColor || "rgba(0,0,0,0.08)",
		},
		cardHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginBottom: 12,
		},
		templateName: {
			fontSize: 20,
			fontWeight: "700",
			color: theme.textColor,
			marginBottom: 4,
		},
		dateText: {
			fontSize: 12,
			color: theme.secondaryTextColor || "gray",
		},
		contentSection: {
			marginBottom: 16,
		},
		exercisePreview: {
			fontSize: 16,
			fontWeight: "500",
			color: theme.textColor,
			marginBottom: 8,
		},
		noteText: {
			fontSize: 14,
			color: theme.secondaryTextColor || "gray",
			marginBottom: 12,
			fontStyle: "italic",
		},
		statsRow: {
			flexDirection: "row",
			alignItems: "center",
		},
		statItem: {
			flexDirection: "row",
			alignItems: "center",
			marginRight: 16,
		},
		statText: {
			fontSize: 13,
			color: theme.secondaryTextColor || "gray",
			marginLeft: 5,
		},
		buttonContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginTop: 10,
		},
		startButton: {
			backgroundColor: theme.primary,
			paddingVertical: 10,
			paddingHorizontal: 20,
			borderRadius: 6,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
		},
		startButtonText: {
			color: "#FFFFFF",
			fontSize: 14,
			fontWeight: "600",
			letterSpacing: 0.5,
		},
		iconButtons: {
			flexDirection: "row",
			alignItems: "center",
		},
		iconButton: {
			width: 36,
			height: 36,
			borderRadius: 18,
			justifyContent: "center",
			alignItems: "center",
			marginLeft: 10,
		},
	});
};

export default BlueprintCard;
