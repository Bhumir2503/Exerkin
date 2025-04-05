import { Text, View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

const TemplateSection = ({navigation}) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<View>
			<Text style={styles.title}>Blueprints: </Text>
			<Pressable style={styles.emptyStateCard} onPress={() => navigation.navigate("TemplateModal")}>
				<View style={styles.emptyStateIconContainer}>
					<Ionicons
						name="construct-outline"
						size={40}
						color={themeStyle.primary}
					/>
				</View>
				<Text style={styles.emptyStateTitle}>Under Construction</Text>
				<Text style={styles.emptyStateDescription}>
                    We are working on bringing "Blueprints" to you soon. Stay tuned!
				</Text>
			</Pressable>
		</View>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		title: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginVertical: 20,
            marginBottom: 10,
		},
		emptyStateCard: {
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 25,
			alignItems: "center",
			justifyContent: "center",
		},
		emptyStateIconContainer: {
			backgroundColor: `${themeStyle.primary}20`, // 20% opacity of primary color
			width: 80,
			height: 80,
			borderRadius: 40,
			justifyContent: "center",
			alignItems: "center",
			marginBottom: 15,
		},
		emptyStateTitle: {
			fontSize: 20,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 10,
		},
		emptyStateDescription: {
			fontSize: 16,
			color: themeStyle.textColorSecondary,
			textAlign: "center",
			marginBottom: 20,
			lineHeight: 22,
		},
	});
};

export default TemplateSection;
