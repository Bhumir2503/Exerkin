import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { useTheme } from "../../contexts/ThemeContext";

export default function Profile() {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<Text style={styles.title}>Settings</Text>
				<View style={{ marginBottom: 20 }}>
					<Text style={styles.subTitle}>Your Account</Text>
					<View>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								paddingHorizontal: 10,
							}}
						>
							<Text style={styles.category}>Account</Text>
							<Ionicons
								name="chevron-forward-outline"
								size={24}
								color="white"
							/>
						</View>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								paddingHorizontal: 10,
							}}
						>
							<Text style={styles.category}>Edit Profile</Text>
							<Ionicons
								name="chevron-forward-outline"
								size={24}
								color="white"
							/>
						</View>
					</View>
				</View>
				<View style={{ marginBottom: 20 }}>
					<Text style={styles.subTitle}>Preference</Text>
					<View>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								paddingHorizontal: 10,
							}}
						>
							<Text style={styles.category}>Change Theme</Text>
							<Ionicons
								name="chevron-forward-outline"
								size={24}
								color="white"
							/>
						</View>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								paddingHorizontal: 10,
							}}
						>
							<Text style={styles.category}>
								Notification Settings
							</Text>
							<Ionicons
								name="chevron-forward-outline"
								size={24}
								color="white"
							/>
						</View>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								paddingHorizontal: 10,
							}}
						>
							<Text style={styles.category}>
								Privacy Settings
							</Text>
							<Ionicons
								name="chevron-forward-outline"
								size={24}
								color="white"
							/>
						</View>
					</View>
				</View>
				<View style={{ marginBottom: 20 }}>
					<Text style={styles.subTitle}>General</Text>
					<View>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								paddingHorizontal: 10,
							}}
						>
							<Text style={styles.category}>
								Terms of Service
							</Text>
							<Ionicons
								name="chevron-forward-outline"
								size={24}
								color="white"
							/>
						</View>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								paddingHorizontal: 10,
							}}
						>
							<Text style={styles.category}>Privacy Policy</Text>
							<Ionicons
								name="chevron-forward-outline"
								size={24}
								color="white"
							/>
						</View>
					</View>
				</View>
			</ScrollView>
			<Text style={styles.logout} onPress={() => auth().signOut()}>
				Log Out
			</Text>
		</SafeAreaView>
	);
}

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: themeStyle.backgroundColor,
		},
		title: {
			fontSize: 24,
			fontWeight: "bold",
			padding: 20,
			paddingHorizontal: 10,
			color: themeStyle.textColor,
		},
		subTitle: {
			fontSize: 14,
			fontWeight: "bold",
			marginBottom: 10,
			marginLeft: 10,
			color: themeStyle.textColorSecondary,
		},
		category: {
			fontSize: 16,
			color: themeStyle.textColor,
			padding: 10,
		},
		logout: {
			fontWeight: "bold",
			fontSize: 18,
			color: "#FF0000",
			textAlign: "center",
			padding: 20,
		},
	});
