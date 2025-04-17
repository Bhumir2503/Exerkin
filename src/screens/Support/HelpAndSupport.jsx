import React from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

const HelpAndSupport = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const handleEmailPress = () => {
		Linking.openURL("mailto:support@exerkin.com");
	};

	const handleWebsitePress = () => {
		Linking.openURL("https://exerkin.com/support");
	};

	return (
		<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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
				<Text style={styles.headerTitle}>Help & Support</Text>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={true}
			>
				<View style={styles.content}>


					<Text style={styles.paragraph}>
						We're here to help make your fitness journey smoother.
						If you have any questions, issues, or feedback, please
						don't hesitate to reach out to us.
					</Text>

					<Text style={styles.sectionTitle}>
						1. Frequently Asked Questions
					</Text>
					<Text style={styles.paragraph}>
						Before contacting us, you might find answers to common
						questions in our FAQ section:
					</Text>

					<Text style={styles.subSectionTitle}>Account Issues</Text>
					<Text style={styles.bulletPoint}>
						• How do I reset my password?
					</Text>
					<Text style={styles.bulletPoint}>
						• Why can't I log into my account?
					</Text>
					<Text style={styles.bulletPoint}>
						• How do I change my email address?
					</Text>

					<Text style={styles.subSectionTitle}>Workout Features</Text>
					<Text style={styles.bulletPoint}>
						• How do I create a custom workout template?
					</Text>
					<Text style={styles.bulletPoint}>
						• Can I export my workout data?
					</Text>
					<Text style={styles.bulletPoint}>
						• How do I track my progress over time?
					</Text>

					<Text style={styles.sectionTitle}>2. Contact Us</Text>
					<Text style={styles.paragraph}>
						If you couldn't find an answer to your question, please
						contact us using one of the following methods:
					</Text>

					<View style={styles.contactCard}>
						<Ionicons
							name="mail-outline"
							size={28}
							color={themeStyle.primary}
						/>
						<View style={styles.contactDetails}>
							<Text style={styles.contactTitle}>
								Email Support
							</Text>
							<Text style={styles.paragraph}>
								For general inquiries and support requests:
							</Text>
							<TouchableOpacity onPress={handleEmailPress}>
								<Text style={styles.contactLink}>
									support@exerkin.com
								</Text>
							</TouchableOpacity>
							<Text style={styles.responseTime}>
								Response time: Within 24 hours
							</Text>
						</View>
					</View>

					<View style={styles.contactCard}>
						<Ionicons
							name="globe-outline"
							size={28}
							color={themeStyle.primary}
						/>
						<View style={styles.contactDetails}>
							<Text style={styles.contactTitle}>
								Support Website
							</Text>
							<Text style={styles.paragraph}>
								Visit our knowledge base for comprehensive
								guides:
							</Text>
							<TouchableOpacity onPress={handleWebsitePress}>
								<Text style={styles.contactLink}>
									exerkin.com/support
								</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.contactCard}>
						<Ionicons
							name="chatbubbles-outline"
							size={28}
							color={themeStyle.primary}
						/>
						<View style={styles.contactDetails}>
							<Text style={styles.contactTitle}>In-App Chat</Text>
							<Text style={styles.paragraph}>
								Tap the chat icon in the bottom right corner of
								the home screen for instant support during
								business hours.
							</Text>
							<Text style={styles.responseTime}>
								Available: Monday-Friday, 9AM-5PM EST
							</Text>
						</View>
					</View>

					<Text style={styles.sectionTitle}>
						3. Feedback & Suggestions
					</Text>
					<Text style={styles.paragraph}>
						We're constantly working to improve Exerkin based on
						your feedback. If you have suggestions for new features
						or improvements, please let us know:
					</Text>
					<TouchableOpacity onPress={handleEmailPress}>
						<Text style={styles.contactLink}>
							feedback@exerkin.com
						</Text>
					</TouchableOpacity>

					<Text style={styles.sectionTitle}>4. Report a Bug</Text>
					<Text style={styles.paragraph}>
						If you encounter any technical issues or bugs, please
						help us by providing the following information:
					</Text>
					<Text style={styles.bulletPoint}>
						• Description of the issue
					</Text>
					<Text style={styles.bulletPoint}>
						• Steps to reproduce the problem
					</Text>
					<Text style={styles.bulletPoint}>
						• Your device model and operating system version
					</Text>
					<Text style={styles.bulletPoint}>
						• Screenshots (if applicable)
					</Text>

					<TouchableOpacity onPress={handleEmailPress}>
						<Text style={styles.contactLink}>bugs@exerkin.com</Text>
					</TouchableOpacity>

					<Text style={styles.sectionTitle}>5. Social Media</Text>
					<Text style={styles.paragraph}>
						Connect with us and join our fitness community:
					</Text>
					<View style={styles.socialIcons}>
						<TouchableOpacity style={styles.socialIcon}>
							<Ionicons
								name="logo-instagram"
								size={24}
								color={themeStyle.primary}
							/>
						</TouchableOpacity>
						<TouchableOpacity style={styles.socialIcon}>
							<Ionicons
								name="logo-twitter"
								size={24}
								color={themeStyle.primary}
							/>
						</TouchableOpacity>
						<TouchableOpacity style={styles.socialIcon}>
							<Ionicons
								name="logo-facebook"
								size={24}
								color={themeStyle.primary}
							/>
						</TouchableOpacity>
						<TouchableOpacity style={styles.socialIcon}>
							<Ionicons
								name="logo-youtube"
								size={24}
								color={themeStyle.primary}
							/>
						</TouchableOpacity>
					</View>

					<Text style={styles.lastUpdated}>
						Last Updated: April 15, 2025
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
			paddingVertical: 0,
			paddingTop: 0,

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
		contactCard: {
			flexDirection: "row",
			backgroundColor: themeStyle.card || themeStyle.backgroundColor,
			borderRadius: 12,
			padding: 16,
			marginVertical: 8,
			borderWidth: 1,
			borderColor: themeStyle.borderColor,
		},
		contactDetails: {
			flex: 1,
			marginLeft: 16,
		},
		contactTitle: {
			fontSize: 16,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 8,
		},
		contactLink: {
			fontSize: 15,
			color: themeStyle.primary,
			marginBottom: 8,
			textDecorationLine: "underline",
		},
		responseTime: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			fontStyle: "italic",
		},
		socialIcons: {
			flexDirection: "row",
			justifyContent: "center",
			marginVertical: 16,
		},
		socialIcon: {
			padding: 12,
			marginHorizontal: 8,
			backgroundColor:
				themeStyle.backgroundColorSecondary || themeStyle.borderColor,
			borderRadius: 50,
		},
		lastUpdated: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			marginTop: 40,
			textAlign: "center",
		},
	});

export default HelpAndSupport;
