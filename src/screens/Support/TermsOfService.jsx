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

const TermsOfService = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

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
				<Text style={styles.headerTitle}>Terms of Service</Text>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={true}
			>
				<View style={styles.content}>
					<Text style={styles.title}>Exerkin Terms of Service</Text>

					<Text style={styles.sectionTitle}>1. Introduction</Text>
					<Text style={styles.paragraph}>
						Welcome to Exerkin ("we," "our," or "us"). By
						downloading, accessing, or using the Exerkin mobile
						application (the "App"), you agree to be bound by these
						Terms of Service (the "Terms"). If you do not agree to
						these Terms, please do not use the App.
					</Text>

					<Text style={styles.sectionTitle}>
						2. Description of Service
					</Text>
					<Text style={styles.paragraph}>
						Exerkin is a workout tracking application that allows
						users to record, monitor, and analyze their fitness
						activities, create workout templates, track progress,
						and manage personal fitness data.
					</Text>

					<Text style={styles.sectionTitle}>
						3. Account Registration
					</Text>
					<Text style={styles.subSectionTitle}>
						3.1 Account Creation
					</Text>
					<Text style={styles.paragraph}>
						To use certain features of the App, you must create an
						account by providing certain information. You are
						responsible for maintaining the confidentiality of your
						account information and for all activities that occur
						under your account.
					</Text>
					<Text style={styles.subSectionTitle}>
						3.2 Account Accuracy
					</Text>
					<Text style={styles.paragraph}>
						You agree to provide accurate, current, and complete
						information during the registration process and to
						update such information to keep it accurate, current,
						and complete.
					</Text>

					<Text style={styles.sectionTitle}>4. User Content</Text>
					<Text style={styles.subSectionTitle}>
						4.1 Content Ownership
					</Text>
					<Text style={styles.paragraph}>
						You retain all rights to any content you submit, post,
						or display on or through the App ("User Content"). By
						submitting User Content, you grant us a worldwide,
						non-exclusive, royalty-free license to use, copy,
						modify, and display your User Content in connection with
						the operation of the App.
					</Text>
					<Text style={styles.subSectionTitle}>
						4.2 Content Responsibility
					</Text>
					<Text style={styles.paragraph}>
						You are solely responsible for your User Content and the
						consequences of posting or publishing it. We do not
						endorse any User Content or any opinion, recommendation,
						or advice expressed therein.
					</Text>

					<Text style={styles.sectionTitle}>5. Acceptable Use</Text>
					<Text style={styles.subSectionTitle}>
						5.1 Compliance with Laws
					</Text>
					<Text style={styles.paragraph}>
						You agree to use the App in compliance with all
						applicable laws, regulations, and these Terms.
					</Text>
					<Text style={styles.subSectionTitle}>
						5.2 Prohibited Activities
					</Text>
					<Text style={styles.paragraph}>You agree not to:</Text>
					<Text style={styles.bulletPoint}>
						• Use the App for any illegal purpose or to violate any
						laws
					</Text>
					<Text style={styles.bulletPoint}>
						• Impersonate any person or entity or falsely state or
						misrepresent your affiliation with a person or entity
					</Text>
					<Text style={styles.bulletPoint}>
						• Interfere with or disrupt the operation of the App or
						servers
					</Text>
					<Text style={styles.bulletPoint}>
						• Attempt to gain unauthorized access to any portion of
						the App
					</Text>
					<Text style={styles.bulletPoint}>
						• Use the App to transmit any viruses, worms, or other
						malicious code
					</Text>
					<Text style={styles.bulletPoint}>
						• Use any automated means to access the App or collect
						any information from the App
					</Text>
					<Text style={styles.bulletPoint}>
						• Modify, adapt, translate, reverse engineer, decompile,
						or disassemble any portion of the App
					</Text>

					<Text style={styles.sectionTitle}>
						6. Intellectual Property
					</Text>
					<Text style={styles.subSectionTitle}>
						6.1 App Ownership
					</Text>
					<Text style={styles.paragraph}>
						The App, including all of its content, features, and
						functionality, is owned by Exerkin and is protected by
						international copyright, trademark, patent, trade
						secret, and other intellectual property or proprietary
						rights laws.
					</Text>
					<Text style={styles.subSectionTitle}>
						6.2 Limited License
					</Text>
					<Text style={styles.paragraph}>
						Subject to your compliance with these Terms, we grant
						you a limited, non-exclusive, non-transferable,
						revocable license to download, install, and use the App
						for your personal, non-commercial purposes.
					</Text>

					<Text style={styles.sectionTitle}>
						7. Third-Party Links and Content
					</Text>
					<Text style={styles.paragraph}>
						The App may contain links to third-party websites or
						services that are not owned or controlled by Exerkin. We
						have no control over, and assume no responsibility for,
						the content, privacy policies, or practices of any
						third-party websites or services.
					</Text>

					<Text style={styles.sectionTitle}>
						8. Disclaimer of Warranties
					</Text>
					<Text style={styles.paragraph}>
						THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
						WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO
						THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, WE
						DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING
						IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
						PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
					</Text>

					<Text style={styles.sectionTitle}>
						9. Limitation of Liability
					</Text>
					<Text style={styles.paragraph}>
						TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT
						SHALL EXERKIN, ITS DIRECTORS, EMPLOYEES, PARTNERS,
						AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY
						INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
						PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF
						PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE
						LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR
						INABILITY TO ACCESS OR USE THE APP.
					</Text>

					<Text style={styles.sectionTitle}>
						10. Health Disclaimer
					</Text>
					<Text style={styles.paragraph}>
						Exerkin is not a licensed medical care provider and has
						no expertise in diagnosing, examining, or treating
						medical conditions of any kind. The information provided
						by the App is for informational purposes only and is not
						intended to substitute for professional medical advice,
						diagnosis, or treatment.
					</Text>
					<Text style={styles.paragraph}>
						Always seek the advice of your physician or other
						qualified health provider with any questions you may
						have regarding a medical condition. Never disregard
						professional medical advice or delay in seeking it
						because of something you have read on the App.
					</Text>

					<Text style={styles.sectionTitle}>
						11. Term and Termination
					</Text>
					<Text style={styles.subSectionTitle}>11.1 Term</Text>
					<Text style={styles.paragraph}>
						These Terms shall remain in full force and effect while
						you use the App.
					</Text>
					<Text style={styles.subSectionTitle}>11.2 Termination</Text>
					<Text style={styles.paragraph}>
						We may terminate or suspend your account and access to
						the App immediately, without prior notice or liability,
						for any reason, including if you breach the Terms.
					</Text>

					<Text style={styles.sectionTitle}>
						12. Changes to Terms
					</Text>
					<Text style={styles.paragraph}>
						We reserve the right to modify or replace these Terms at
						any time. If a revision is material, we will provide at
						least 30 days' notice prior to any new terms taking
						effect. What constitutes a material change will be
						determined at our sole discretion.
					</Text>

					<Text style={styles.sectionTitle}>13. Governing Law</Text>
					<Text style={styles.paragraph}>
						These Terms shall be governed and construed in
						accordance with the laws of [Your Jurisdiction], without
						regard to its conflict of law provisions.
					</Text>

					<Text style={styles.sectionTitle}>14. Contact Us</Text>
					<Text style={styles.paragraph}>
						If you have any questions about these Terms, please
						contact us at [Your Contact Email].
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

export default TermsOfService;
