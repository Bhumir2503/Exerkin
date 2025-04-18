import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Animated, Easing, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

// Define the theme object that will be used consistently throughout the app
export const midnightPurpleTheme = {
	backgroundColor: "#16161a",
	primary: "#7f2af0",
	secondary: "#72757e",
	textColor: "#fffffe",
	textColorSecondary: "#94a1b2",
	card: "#2d2d3a", // Darker card background
	cardAlt: "#2d2d3a", // Alternative card background for variety
	inputBackground: "#1e1e24", // Text input field background
	inputBorder: "#383844", // Text input border
	accent: "#e53170",
	success: "#72B01D",
	error: "#F87060",
	warning: "#F7B32B",
	info: "#3DA9FC",
};

export default function SplashScreen({ onAnimationComplete }) {
	// State to track if the animation has completed
	const [animationComplete, setAnimationComplete] = useState(false);

	// Animation values
	const fadeAnim = React.useRef(new Animated.Value(0)).current;
	const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

	// Optional second animation for a more complex exit effect
	const fadeOutAnim = React.useRef(new Animated.Value(1)).current;

	useEffect(() => {
		// Start entrance animation
		const entranceAnimation = Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 1000, // Longer duration for better visibility
				useNativeDriver: true,
				easing: Easing.out(Easing.ease),
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
				easing: Easing.out(Easing.ease),
			}),
		]);

		// Start the animation and set a minimum display time
		entranceAnimation.start();

		// Set a minimum display time for the splash screen (2.5 seconds total)
		const timer = setTimeout(() => {
			// Optional exit animation
			Animated.timing(fadeOutAnim, {
				toValue: 0,
				duration: 500, // Quick fade out
				useNativeDriver: true,
				easing: Easing.in(Easing.ease),
			}).start(() => {
				// Once exit animation completes, mark as done
				setAnimationComplete(true);
			});
		}, 2000); // 2 seconds + 500ms for exit animation = 2.5 seconds total

		// Cleanup
		return () => clearTimeout(timer);
	}, []);

	// When animation completes, notify parent component
	useEffect(() => {
		if (animationComplete && onAnimationComplete) {
			onAnimationComplete();
		}
	}, [animationComplete, onAnimationComplete]);

	return (
		<Animated.View
			style={[
				styles.container,
				{ opacity: fadeOutAnim }, // Apply exit fade effect
			]}
		>
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
				<Image source={require("../../../assets/logo.png")} style={{width: 250, height:250}} />
				<Text style={styles.title}>Exerkin</Text>
				<Text style={styles.subtitle}>Train. Track. Triumph</Text>
			</Animated.View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: midnightPurpleTheme.backgroundColor,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		alignItems: "center",
	},
	title: {
		marginTop: -40,
		fontSize: 40,
		fontWeight: "bold",
		color: midnightPurpleTheme.primary,
		marginBottom: 12,
	},
	subtitle: {
		fontSize: 18,
		color: midnightPurpleTheme.textColorSecondary,
	},
});
