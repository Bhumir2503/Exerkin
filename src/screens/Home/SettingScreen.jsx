import React from "react";
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";

const CARD_PADDING = 16;

const SettingScreen = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const { user, onLogout, username } = useUser();

	const styles = createStyles(themeStyle);

	// Get the first letter of the username for the avatar
	const getInitial = () => {
		if (username && username.length > 0) {
			return username.charAt(0).toUpperCase();
		}
		return "U"; // Default if no name is available
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
				<Text style={styles.headerTitle}>Settings</Text>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Profile Section */}
				<View style={styles.profileSection}>
					<View style={styles.avatarContainer}>
						<Text style={styles.avatarText}>{getInitial()}</Text>
					</View>
					<Text style={styles.profileName}>{username || "User"}</Text>
					<Text style={styles.profileEmail}>
						{user?.email || "email@example.com"}
					</Text>
				</View>

				{/* Settings Categories */}
				<SettingsCategory
					title="Your Account"
					themeStyle={themeStyle}
					items={[
						{
							name: "Update Email",
							icon: "mail-outline",
							location: "UpdateEmail",
						},
						{
							name: "Change Password",
							icon: "lock-closed-outline",
							location: "ChangePassword",
						},
						{
							name: "Edit Username",
							icon: "create-outline",
							location: "EditUsername",
						},
					]}
					navigation={navigation}
				/>

				<SettingsCategory
					title="Preferences"
					themeStyle={themeStyle}
					items={[
						{
							name: "Edit Theme",
							icon: "color-palette-outline",
							location: "ThemeScreen",
						},
						{
							name: "Change Unit System",
							icon: "scale-outline",
							location: "ChangeUnitSystem",
						},
						{
							name: "Notification Settings",
							icon: "notifications-outline",
							location: "",
						},
						{
							name: "Privacy Settings",
							icon: "shield-outline",
							location: "",
						},
					]}
					navigation={navigation}
				/>

				<SettingsCategory
					title="General"
					themeStyle={themeStyle}
					items={[
						{
							name: "Terms of Service",
							icon: "document-text-outline",
							location: "TermsOfService",
						},
						{
							name: "Privacy Policy",
							icon: "lock-closed-outline",
							location: "PrivacyPolicy",
						},
						{
							name: "Help & Support",
							icon: "help-circle-outline",
							location: "HelpAndSupport",
						},
					]}
					navigation={navigation}
				/>

				{/* Logout Section */}
				<View style={styles.logoutSection}>
					<TouchableOpacity
						style={styles.logoutButton}
						onPress={onLogout}
					>
						<Ionicons
							name="log-out-outline"
							size={22}
							color="#fff"
							style={styles.logoutIcon}
						/>
						<Text style={styles.logoutText}>Log Out</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

function SettingsCategory({ title, items, navigation, themeStyle }) {
	const styles = createStyles(themeStyle);

	return (
		<View style={styles.categoryContainer}>
			<Text style={styles.categoryTitle}>{title}</Text>
			<View style={styles.cardContainer}>
				{items.map((item, index) => (
					<SettingsItem
						key={index}
						item={item}
						navigation={navigation}
						themeStyle={themeStyle}
						isLast={index === items.length - 1}
					/>
				))}
			</View>
		</View>
	);
}

function SettingsItem({ item, navigation, themeStyle, isLast }) {
	const styles = createStyles(themeStyle);

	const handlePress = () => {
		if (item.onPress) {
			item.onPress();
		} else if (item.location) {
			navigation.navigate(item.location);
		}
	};

	return (
		<TouchableOpacity
			onPress={handlePress}
			style={[
				styles.settingsItem,
				isLast ? null : styles.settingsItemBorder,
			]}
		>
			<View style={styles.settingsItemContent}>
				<View style={styles.settingsItemLeft}>
					<Ionicons
						name={item.icon}
						size={22}
						color={
							item.dangerAction
								? themeStyle.error
								: themeStyle.primary
						}
						style={styles.settingsItemIcon}
					/>
					<Text
						style={[
							styles.settingsItemText,
							item.dangerAction && styles.dangerText,
						]}
					>
						{item.name}
					</Text>
				</View>
				{!item.onPress && (
					<Ionicons
						name="chevron-forward-outline"
						size={20}
						color={themeStyle.textColorSecondary}
					/>
				)}
			</View>
		</TouchableOpacity>
	);
}

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
		},
		backButton: {
			padding: 4,
		},
		headerTitle: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginLeft: 12,
		},
		scrollContent: {
			paddingBottom: 50,
		},
		profileSection: {
			alignItems: "center",
			paddingVertical: 24,
		},
		avatarContainer: {
			width: 80,
			height: 80,
			borderRadius: 40,
			backgroundColor: themeStyle.primary,
			justifyContent: "center",
			alignItems: "center",
			marginBottom: 12,
		},
		avatarText: {
			fontSize: 32,
			fontWeight: "600",
			color: "#FFFFFF",
		},
		profileName: {
			fontSize: 18,
			fontWeight: "600",
			color: themeStyle.textColor,
			marginBottom: 4,
		},
		profileEmail: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
		},
		categoryContainer: {
			marginTop: 16,
			paddingHorizontal: 16,
			marginBottom: 8,
		},
		categoryTitle: {
			fontSize: 16,
			fontWeight: "600",
			color: themeStyle.primary,
			marginBottom: 8,
			marginLeft: 4,
		},
		cardContainer: {
			backgroundColor: themeStyle.card,
			borderRadius: 8,
		},
		settingsItem: {
			paddingVertical: 14,
			paddingHorizontal: CARD_PADDING,
		},
		settingsItemBorder: {
			borderBottomWidth: 1,
			borderBottomColor: themeStyle.borderColor,
		},
		settingsItemContent: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		settingsItemLeft: {
			flexDirection: "row",
			alignItems: "center",
		},
		settingsItemIcon: {
			marginRight: 12,
		},
		settingsItemText: {
			fontSize: 16,
			color: themeStyle.textColor,
		},
		dangerText: {
			color: themeStyle.error,
		},
		logoutSection: {
			marginTop: 24,
			paddingHorizontal: 16,
			marginBottom: 24,
		},
		logoutButton: {
			backgroundColor: themeStyle.error,
			borderRadius: 8,
			paddingVertical: 14,
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
		},
		logoutIcon: {
			marginRight: 8,
		},
		logoutText: {
			color: "#FFFFFF",
			fontWeight: "600",
			fontSize: 16,
		},
	});

export default SettingScreen;
