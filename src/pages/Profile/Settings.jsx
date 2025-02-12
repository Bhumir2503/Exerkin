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
import auth from "@react-native-firebase/auth";
import { useTheme } from "../../contexts/ThemeContext";

export default function Settings({ navigation }) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						alignContent: "center",
						marginBottom: 15,
					}}
				>
					<Ionicons
						name="chevron-back-outline"
						size={24}
						color={themeStyle.textColor}
						style={{ marginLeft: 5, marginTop: 2 }}
						onPress={() => navigation.goBack()}
					/>
					<Text style={styles.title}>Settings</Text>
				</View>
				<View style={{ marginBottom: 20 }}>
					<Text style={styles.subTitle}>Your Account</Text>
					<View>
						<ButtonSelector
							name="Account"
							location=""
							navigation={navigation}
							themeStyle={themeStyle}
						/>
						<ButtonSelector
							name="Edit Profile"
							location=""
							navigation={navigation}
							themeStyle={themeStyle}
						/>
					</View>
				</View>
				<View style={{ marginBottom: 20 }}>
					<Text style={styles.subTitle}>Preference</Text>
					<View>
						<ButtonSelector
							name="Edit Theme"
							location="EditTheme"
							navigation={navigation}
							themeStyle={themeStyle}
						/>
						<ButtonSelector
							name="Notification Settings"
							location=""
							navigation={navigation}
							themeStyle={themeStyle}
						/>
						<ButtonSelector
							name="Privacy Settings"
							location=""
							navigation={navigation}
							themeStyle={themeStyle}
						/>
					</View>
				</View>
				<View style={{ marginBottom: 20 }}>
					<Text style={styles.subTitle}>General</Text>
					<View>
						<ButtonSelector
							name="Terms of Service"
							location=""
							navigation={navigation}
							themeStyle={themeStyle}
						/>
						<ButtonSelector
							name="Privacy Policy"
							location=""
							navigation={navigation}
							themeStyle={themeStyle}
						/>
					</View>
				</View>
			</ScrollView>
			<Text style={styles.logout} onPress={() => auth().signOut()}>
				Log Out
			</Text>
		</SafeAreaView>
	);
}

function ButtonSelector({ navigation, themeStyle, name, location }) {
	const styles = createStyles(themeStyle);
	return (
		<TouchableOpacity
			onPress={() => navigation.navigate(location)}
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				paddingHorizontal: 10,
			}}
		>
			<Text style={styles.category}>{name}</Text>
			<Ionicons
				name="chevron-forward-outline"
				size={24}
				color={themeStyle.textColor}
			/>
		</TouchableOpacity>
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
			color: themeStyle.textColor,
			marginLeft: 5,
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
