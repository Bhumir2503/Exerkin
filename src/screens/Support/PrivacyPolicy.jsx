import React from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

const PrivacyPolicy = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
				>
					<Ionicons
						name="chevron-back-outline"
						size={24}
						color={themeStyle.textColor}
					/>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Privacy Policy</Text>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={true}
			>
				<View style={styles.content}>
					<Text style={styles.title}>Exerkin Privacy Policy</Text>

					<Text style={styles.sectionTitle}>1. Introduction</Text>
					<Text style={styles.paragraph}>
						This Privacy Policy describes how Exerkin ("we," "our,"
						or "us") collects, uses, and discloses your information
						when you use our mobile application (the "App").
					</Text>

					<Text style={styles.sectionTitle}>
						2. Information We Collect
					</Text>
					<Text style={styles.subSectionTitle}>
						2.1 Information You Provide
					</Text>
					<Text style={styles.paragraph}>
						We collect information you provide directly to us when
						you:
					</Text>
					<Text style={styles.bulletPoint}>
						• Create an account (email address, username, password)
					</Text>
					<Text style={styles.bulletPoint}>
						• Complete your profile (name, height, weight, fitness
						goals)
					</Text>
					<Text style={styles.bulletPoint}>
						• Record workout data (exercises, sets, reps, weights,
						duration)
					</Text>
					<Text style={styles.bulletPoint}>
						• Create workout templates
					</Text>
					<Text style={styles.bulletPoint}>
						• Add notes about your workouts
					</Text>

					<Text style={styles.subSectionTitle}>
						2.2 Information Automatically Collected
					</Text>
					<Text style={styles.paragraph}>
						When you use our App, we automatically collect certain
						information, including:
					</Text>
					<Text style={styles.bulletPoint}>
						• Device information (model, operating system version,
						unique device identifiers)
					</Text>
					<Text style={styles.bulletPoint}>
						• Log information (time and duration of use, features
						you use)
					</Text>
					<Text style={styles.bulletPoint}>
						• Location information (with your permission)
					</Text>

					<Text style={styles.sectionTitle}>
						3. How We Use Your Information
					</Text>
					<Text style={styles.paragraph}>
						We use the information we collect to:
					</Text>
					<Text style={styles.bulletPoint}>
						• Provide, maintain, and improve the App
					</Text>
					<Text style={styles.bulletPoint}>
						• Create and update your account
					</Text>
					<Text style={styles.bulletPoint}>
						• Process and track your workout data
					</Text>
					<Text style={styles.bulletPoint}>
						• Provide customer support
					</Text>
					<Text style={styles.bulletPoint}>
						• Send important notifications about the App
					</Text>
					<Text style={styles.bulletPoint}>
						• Analyze usage patterns to improve the App
					</Text>

					<Text style={styles.sectionTitle}>
						4. How We Share Your Information
					</Text>
					<Text style={styles.paragraph}>
						We may share your information in the following
						circumstances:
					</Text>
					<Text style={styles.bulletPoint}>
						• With service providers who perform services on our
						behalf
					</Text>
					<Text style={styles.bulletPoint}>
						• If required by law or to protect rights and safety
					</Text>
					<Text style={styles.bulletPoint}>
						• In connection with a merger, sale, or acquisition
					</Text>

					<Text style={styles.sectionTitle}>
						5. Data Storage and Security
					</Text>
					<Text style={styles.paragraph}>
						Your workout data is stored on Firebase, a secure cloud
						database service provided by Google. We implement
						appropriate technical and organizational measures to
						protect your personal information against unauthorized
						access, loss, or damage.
					</Text>

					<Text style={styles.sectionTitle}>6. Your Choices</Text>
					<Text style={styles.subSectionTitle}>
						6.1 Account Information
					</Text>
					<Text style={styles.paragraph}>
						You can review and update your account information by
						logging into your account settings.
					</Text>

					<Text style={styles.subSectionTitle}>
						6.2 Data Deletion
					</Text>
					<Text style={styles.paragraph}>
						You can request deletion of your account and data by
						contacting us at [Your Contact Email].
					</Text>

					<Text style={styles.subSectionTitle}>
						6.3 Location Permissions
					</Text>
					<Text style={styles.paragraph}>
						You can control location permissions through your
						device's settings.
					</Text>

					<Text style={styles.sectionTitle}>
						7. Children's Privacy
					</Text>
					<Text style={styles.paragraph}>
						The App is not directed to children under 13 years of
						age. We do not knowingly collect personal information
						from children under 13. If you are a parent or guardian
						and believe your child has provided us with personal
						information, please contact us.
					</Text>

					<Text style={styles.sectionTitle}>
						8. Changes to This Privacy Policy
					</Text>
					<Text style={styles.paragraph}>
						We may update this Privacy Policy from time to time. We
						will notify you of any changes by posting the new
						Privacy Policy on this page and updating the "Last
						Updated" date.
					</Text>

					<Text style={styles.sectionTitle}>9. Contact Us</Text>
					<Text style={styles.paragraph}>
						If you have any questions about this Privacy Policy,
						please contact us at [Your Contact Email].
					</Text>

					<Text style={styles.lastUpdated}>
						Last Updated: March 22, 2025
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: themeStyle.backgroundColor,
		},
		header: {
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 16,
			paddingVertical: 12,
			borderBottomWidth: 1,
			borderBottomColor: themeStyle.borderColor,
		},
		backButton: {
			padding: 4,
		},
		headerTitle: {
			fontSize: 20,
			fontWeight: "600",
			color: themeStyle.textColor,
			marginLeft: 12,
		},
		scrollView: {
			flex: 1,
		},
		content: {
			padding: 16,
			paddingBottom: 40,
		},
		title: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 24,
			textAlign: "center",
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginTop: 24,
			marginBottom: 12,
		},
		subSectionTitle: {
			fontSize: 16,
			fontWeight: "600",
			color: themeStyle.textColor,
			marginTop: 16,
			marginBottom: 8,
		},
		paragraph: {
			fontSize: 15,
			lineHeight: 22,
			color: themeStyle.textColor,
			marginBottom: 12,
		},
		bulletPoint: {
			fontSize: 15,
			lineHeight: 22,
			color: themeStyle.textColor,
			marginBottom: 8,
			marginLeft: 16,
		},
		lastUpdated: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			marginTop: 40,
			textAlign: "center",
		},
	});

export default PrivacyPolicy;
