import React from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function Profile({navigation}) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.topBar}>
				<TouchableWithoutFeedback onPress={()=> navigation.navigate("Stats")}>
					<Ionicons name="stats-chart" size={24} color={themeStyle.textColor} />
				</TouchableWithoutFeedback>
				<TouchableWithoutFeedback onPress={() => navigation.navigate("Settings")}>
					<Ionicons name="settings" size={24} color={themeStyle.textColor} />
				</TouchableWithoutFeedback>
			</View>
			<View style={{flex: 1}}>
				<Text style={styles.title}>Bhumir</Text>
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
		topBar:{
			marginTop: 20,
			paddingHorizontal: 25,
			width: "100%",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",

		},
		title: {
			fontSize: 48,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
	});
