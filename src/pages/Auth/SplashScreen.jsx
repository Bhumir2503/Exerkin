import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Animated, Easing } from "react-native";
import { StatusBar } from "expo-status-bar";
import { midnightPurpleTheme } from "../../../App";

export default function SplashScreen() {
	// Animation values
	const fadeAnim = React.useRef(new Animated.Value(0)).current;
	const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

	useEffect(() => {
		// Start animations when component mounts
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 800,
				useNativeDriver: true,
				easing: Easing.out(Easing.ease),
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 800,
				useNativeDriver: true,
				easing: Easing.out(Easing.ease),
			}),
		]).start();
	}, []);

	return (
		<View style={styles.container}>
			<StatusBar style="light" />
			<Animated.View
				style={[
					styles.content,
					{
						opacity: fadeAnim,
						transform: [{ scale: scaleAnim }],
					},
				]}
			>
				<Text style={styles.title}>Exerkin</Text>
				<Text style={styles.subtitle}>Track, Share, Progress</Text>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#16161a",
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		alignItems: "center",
	},
	title: {
		fontSize: 40,
		fontWeight: "bold",
		color: "#7f2af0",
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 18,
		color: "#94a1b2",
	},
});
// 	},