import { Text, View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useTemplate } from "../../contexts/TemplateContext";

const TemplateSection = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { storedTemplate, templateStarted } = useTemplate();
	const hasTemplates = storedTemplate.length > 0;

	const startTemplateButton = () => {
		templateStarted();
		navigation.navigate("TemplateModal");
	}

	if (!hasTemplates) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Blueprints</Text>

				<View style={styles.emptyStateCard}>
					<View style={styles.emptyStateIconContainer}>
						<Ionicons
							name="add-outline"
							size={40}
							color={themeStyle.primary}
						/>
					</View>

					<Text style={styles.emptyStateTitle}>
						Add Your First Blueprint
					</Text>

					<Text style={styles.emptyStateDescription}>
						Create your first blueprint to streamline your workflow
					</Text>

					<Pressable
						style={styles.createButton}
						onPress={() => startTemplateButton()}
					>
						<Text style={styles.buttonText}>Create Blueprint</Text>
					</Pressable>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Text style={styles.title}>Blueprints</Text>
				<Pressable
					style={styles.addButton}
					onPress={() => startTemplateButton()}
				>
					<Ionicons name="add" size={24} color={themeStyle.primary} />
				</Pressable>
			</View>

			<View style={styles.templatesContainer}>
				{storedTemplate.map((template) => (
					<Pressable
						key={template.templateId}
						style={styles.templateCard}
						onPress={() =>
							console.log("I can't belive you taught I worked. Try later loser - Bhumir Patel")
						}

					>
						<View style={styles.templateIconContainer}>
							<Ionicons
								name="bookmark"
								size={32}
								color={themeStyle.primary}
							/>
						</View>
						<View style={styles.templateInfo}>
							<Text style={styles.templateTitle}>
								{template.name}
							</Text>
							<Text
								style={styles.templateDescription}
								numberOfLines={2}
							>
								{template.note || "No description"}
							</Text>
						</View>
						<Ionicons
							name="chevron-forward"
							size={20}
							color={themeStyle.textColorSecondary}
						/>
					</Pressable>
				))}
			</View>
		</View>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		container: {
			marginVertical: 10,
		},
		headerContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 12,
		},
		title: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginVertical: 16,
		},
		addButton: {
			padding: 8,
			borderRadius: 8,
			backgroundColor: `${themeStyle.primary}15`,
		},
		emptyStateCard: {
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 28,
			alignItems: "center",
			justifyContent: "center",
		},
		emptyStateIconContainer: {
			backgroundColor: `${themeStyle.primary}20`,
			width: 85,
			height: 85,
			borderRadius: 42.5,
			justifyContent: "center",
			alignItems: "center",
			marginBottom: 18,
		},
		emptyStateTitle: {
			fontSize: 22,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 12,
		},
		emptyStateDescription: {
			fontSize: 16,
			color: themeStyle.textColorSecondary,
			textAlign: "center",
			lineHeight: 24,
			marginBottom: 20,
		},
		createButton: {
			backgroundColor: themeStyle.primary,
			paddingVertical: 12,
			paddingHorizontal: 24,
			borderRadius: 6,
		},
		buttonText: {
			color: "#FFF",
			fontWeight: "bold",
			fontSize: 16,
		},
		templatesContainer: {
			marginTop: 4,
		},
		templateCard: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 16,
			marginBottom: 12,

		},
		templateIconContainer: {
			borderRadius: 6,
			marginRight: 14,
		},
		templateInfo: {
			flex: 1,
		},
		templateTitle: {
			fontSize: 16,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 4,
		},
		templateDescription: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
		},
	});
};

export default TemplateSection;
