import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from "@react-native-firebase/auth";
import { useTheme } from "../../contexts/ThemeContext";

export default function Profile() {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	return (
		<SafeAreaView style={styles.container}>
			<View>
				<Text style={styles.title}>Settings</Text>
				<Text onPress={() => auth().signOut()}>Sign Out</Text>
			</View>
		</SafeAreaView>
	);
}

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: themeStyle.backgroundColor,
		},
		title: {
			fontSize: 48,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
	});
