import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { useTheme } from "../../contexts/ThemeContext";

export default function Stats({navigation}) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	return (
		<SafeAreaView style={styles.container}>
			<View>
				<Ionicons name="chevron-back" size={100} color={themeStyle.textColor} onPress={()=>navigation.goBack()}/>
				<Text style={styles.title}>Stats</Text>
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
