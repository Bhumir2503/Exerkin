import React from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from "@react-native-firebase/auth";
import { useTheme } from "../../contexts/ThemeContext";
/*DISCLAIMER: Unsure whether or not this component will receive or pass props, so we will need to communicate properly on what data will be passed to where */
//TODO: Get the bottomsheet to appear after pressing the "start workout" button. The bottomsheet we are using is the component WorkoutBottomSheet under components.

export default function Profile() {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<SafeAreaView style={styles.container}>
			<View>
				<Text style={styles.title}>Get Ready to Workout!</Text>
				<Button title="Start Workout"/>
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
