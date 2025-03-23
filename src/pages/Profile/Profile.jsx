import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../contexts/UserContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import {
	workoutStreak,
	getWorkoutsThisWeek,
} from "../../utils/WorkoutHistoryFuction";
import WorkoutHistory from "../../components/Profile/WorkoutHistory";

export default function Profile({ navigation }) {
	const { themeStyle } = useTheme();
	const { username } = useUser();
	const { workoutHistory } = useWorkout();
	const [stats, setStats] = useState([
		{ label: "Workouts", value: 0 },
		{ label: "Streak", value: 0 },
		{ label: "This Week", value: 0 },
	]);
	const styles = createStyles(themeStyle);

	// Update stats when workout history changes
	useEffect(() => {
		if (workoutHistory) {
			setStats([
				{ label: "Workouts", value: workoutHistory.length || 0 },
				{ label: "Streak", value: workoutStreak(workoutHistory) },
				{
					label: "This Week",
					value: getWorkoutsThisWeek(workoutHistory),
				},
			]);
		}
	}, [workoutHistory]);

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.topBar}>
						<TouchableOpacity
							style={styles.iconButton}
							onPress={() => navigation.navigate("Stats")}
						>
							<Ionicons
								name="stats-chart"
								size={24}
								color={themeStyle.textColor}
							/>
						</TouchableOpacity>
						<Text style={styles.appTitle}>Exerkin</Text>
						<TouchableOpacity
							style={styles.iconButton}
							onPress={() => navigation.navigate("Settings")}
						>
							<Ionicons
								name="settings"
								size={24}
								color={themeStyle.textColor}
							/>
						</TouchableOpacity>
					</View>

					{/* Profile Section */}
					<View style={styles.profileSection}>
						<View style={styles.avatarContainer}>
							<View style={styles.avatar}>
								<Text style={styles.avatarText}>
									{username?.charAt(0)?.toUpperCase() || "U"}
								</Text>
							</View>
						</View>
						<View style={styles.profileInfo}>
							<Text style={styles.username}>{username}</Text>
							<Text style={styles.userBio}>
								Fitness Enthusiast
							</Text>
						</View>
					</View>

					{/* Stats Section */}
					<View style={styles.statsContainer}>
						{stats.map((stat, index) => (
							<View key={index} style={styles.statItem}>
								<Text style={styles.statValue}>
									{stat.value}
								</Text>
								<Text style={styles.statLabel}>
									{stat.label}
								</Text>
							</View>
						))}
					</View>
				</View>

				{/* Workout History */}
				<View style={styles.workoutHistoryContainer}>
					<Text style={styles.sectionTitle}>Workout History</Text>

					{/* Display empty state if no workout history */}
					{!workoutHistory || workoutHistory.length === 0 ? (
						<View style={styles.emptyStateCard}>
							<View style={styles.emptyStateIconContainer}>
								<Ionicons
									name="fitness-outline"
									size={40}
									color={themeStyle.primary}
								/>
							</View>
							<Text style={styles.emptyStateTitle}>
								No Workouts Yet
							</Text>
							<Text style={styles.emptyStateDescription}>
								Complete your first workout to start tracking
								your fitness journey!
							</Text>
						</View>
					) : (
						<WorkoutHistory />
					)}
				</View>
			</SafeAreaView>
		</View>
	);
}

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: themeStyle.backgroundColor,
		},
		safeArea: {
			flex: 1,
		},
		header: {
			paddingBottom: 20,
		},
		topBar: {
			paddingHorizontal: 20,
			paddingTop: 10,
			width: "100%",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		appTitle: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
		iconButton: {
			padding: 8,
			backgroundColor: themeStyle.backgroundColor,
			borderRadius: 12,
		},
		profileSection: {
			paddingHorizontal: 20,
			paddingTop: 20,
			flexDirection: "row",
			alignItems: "center",
		},
		avatarContainer: {
			marginRight: 15,
		},
		avatar: {
			width: 70,
			height: 70,
			borderRadius: 35,
			backgroundColor: themeStyle.primary,
			justifyContent: "center",
			alignItems: "center",
			borderWidth: 3,
			borderColor: themeStyle.backgroundColor,
		},
		avatarText: {
			color: "#fff",
			fontSize: 28,
			fontWeight: "bold",
		},
		profileInfo: {
			flex: 1,
		},
		username: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 4,
		},
		userBio: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			opacity: 0.8,
		},
		statsContainer: {
			flexDirection: "row",
			justifyContent: "space-around",
			paddingVertical: 15,
			marginTop: 20,
			marginHorizontal: 20,
			backgroundColor: themeStyle.backgroundColor,
			borderRadius: 12,
		},
		statItem: {
			alignItems: "center",
		},
		statValue: {
			fontSize: 20,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
		statLabel: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
			marginTop: 4,
		},
		workoutHistoryContainer: {
			flex: 1,
			paddingHorizontal: 20,
			paddingTop: 20,
		},
		sectionTitle: {
			fontSize: 20,
			fontWeight: "bold",
			marginBottom: 15,
			color: themeStyle.textColor,
		},
		emptyStateCard: {
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 25,
			alignItems: "center",
			justifyContent: "center",
		},
		emptyStateIconContainer: {
			backgroundColor: `${themeStyle.primary}20`, // 20% opacity of primary color
			width: 80,
			height: 80,
			borderRadius: 40,
			justifyContent: "center",
			alignItems: "center",
			marginBottom: 15,
		},
		emptyStateTitle: {
			fontSize: 20,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 10,
		},
		emptyStateDescription: {
			fontSize: 16,
			color: themeStyle.textColorSecondary,
			textAlign: "center",
			marginBottom: 20,
			lineHeight: 22,
		},
	});
