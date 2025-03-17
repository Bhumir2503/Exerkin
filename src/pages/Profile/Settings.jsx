import React from "react";
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	TouchableOpacity,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import { useWorkout } from "../../contexts/WorkoutContext";

export default function Settings({ navigation }) {
	const { themeStyle } = useTheme();
	const { onLogout } = useUser();
	const { clearWorkoutHistory, clearTemplates } = useWorkout();
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
						style={{ marginLeft: 10, marginTop: 2 }}
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
							location="EditProfile"
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
				<View style={{ marginBottom: 20 }}>
					<Text style={styles.subTitle}>Developer Tools</Text>
					<View>
						<DevToolButton
							name="Clear Workout History"
							onPress={clearWorkoutHistory}
							themeStyle={themeStyle}
							iconName="trash-outline"
							dangerAction={true}
						/>
						<DevToolButton
							name="Clear Templates"
							onPress={clearTemplates}
							themeStyle={themeStyle}
							iconName="trash-outline"
							dangerAction={true}
						/>
					</View>
				</View>
			</ScrollView>
			<Text style={styles.logout} onPress={onLogout}>
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
				marginLeft: 20,
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

function DevToolButton({ themeStyle, name, onPress, iconName, dangerAction }) {
	const styles = createStyles(themeStyle);
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				paddingHorizontal: 10,
				marginLeft: 20,
			}}
		>
			<Text style={[styles.category, dangerAction && styles.dangerText]}>
				{name}
			</Text>
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
			marginLeft: 20,
			color: themeStyle.textColorSecondary,
		},
		category: {
			fontSize: 16,
			color: themeStyle.textColor,
			padding: 10,
		},
		dangerText: {
			color: themeStyle.error,
		},
		logout: {
			fontWeight: "bold",
			fontSize: 18,
			color: "#FF0000",
			textAlign: "center",
			padding: 20,
		},
	});
