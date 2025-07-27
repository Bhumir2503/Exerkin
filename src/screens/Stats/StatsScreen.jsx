// Suggested file structure:
// - StatsScreen.jsx
// - components/OverviewTab.jsx
// - components/LiftsTab.jsx
// - components/TrendsTab.jsx
// - components/BodyFocusTab.jsx
// - hooks/useStatsCalculations.js
// - utils/statsUtils.js

// Here's how to separate it (starting with the entry file):

// StatsScreen.jsx (after splitting)
import React, { useState } from "react";
import {
	View,
	ScrollView,
	TouchableOpacity,
	Text,
	StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import ActiveWorkoutBar from "../Workout/components/ActiveWorkoutBar";
import OverviewTab from "./components/OverviewTab";
import LiftsTab from "./components/LiftTab";
import TrendsTab from "./components/TrendsTab";
import BodyFocusTab from "./components/BodyFocusTab";

const StatsScreen = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const [activeTab, setActiveTab] = useState("overview");

	const renderTabIndicator = (tabName) => (
		<View
			style={[
				styles.tabIndicator,
				activeTab === tabName && styles.activeTabIndicator,
			]}
		/>
	);

	return (
		<View style={{ flex: 1, backgroundColor: themeStyle.backgroundColor }}>
			<SafeAreaView style={styles.container} edges={["top"]}>
				<View style={styles.topBar}>
					<Text style={styles.title}>Stats & Analytics</Text>
				</View>

				<View style={styles.tabBar}>
					{[
						{
							name: "overview",
							icon: "stats-chart",
							label: "Overview",
						},
						{ name: "lifts", icon: "barbell", label: "Lifts" },
						{
							name: "trends",
							icon: "trending-up",
							label: "Trends",
						},
						{ name: "body", icon: "body", label: "Body" },
					].map((tab) => (
						<TouchableOpacity
							key={tab.name}
							style={styles.tab}
							onPress={() => setActiveTab(tab.name)}
						>
							<Ionicons
								name={tab.icon}
								size={20}
								color={
									activeTab === tab.name
										? themeStyle.primary
										: themeStyle.textColorSecondary
								}
							/>
							<Text
								style={[
									styles.tabText,
									activeTab === tab.name &&
										styles.activeTabText,
								]}
							>
								{tab.label}
							</Text>
							{renderTabIndicator(tab.name)}
						</TouchableOpacity>
					))}
				</View>

				<ScrollView
					style={styles.scrollContainer}
					contentContainerStyle={{ paddingBottom: 75 }}
					showsVerticalScrollIndicator={false}
				>
					{/* {activeTab === "overview" && <OverviewTab />}
					{activeTab === "lifts" && <LiftsTab />}
					{activeTab === "trends" && <TrendsTab />}
					{activeTab === "body" && <BodyFocusTab />} */}
				</ScrollView>
			</SafeAreaView>
			<ActiveWorkoutBar navigate={navigation.navigate} />
		</View>
	);
};
const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: themeStyle.backgroundColor,
		},
		scrollContainer: {
			flex: 1,
			width: "100%",
		},
		topBar: {
			alignItems: "center",
			paddingHorizontal: 16,
			paddingVertical: 12,
		},
		title: {
			fontSize: 22,
			fontWeight: "bold",
			color: themeStyle.textColor,

			textAlign: "center",
			marginLeft: 10,
			textAlign: "center",
		},
		tabBar: {
			flexDirection: "row",
			justifyContent: "space-around",
			borderBottomWidth: 1,
			borderBottomColor: themeStyle.borderColor,
			paddingBottom: 0,
		},
		tab: {
			alignItems: "center",
			paddingVertical: 12,
			paddingHorizontal: 16,
			position: "relative",
		},
		tabText: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
			marginTop: 4,
		},
		activeTabText: {
			color: themeStyle.primary,
			fontWeight: "600",
		},
		tabIndicator: {
			position: "absolute",
			bottom: 0,
			left: 8,
			right: 8,
			height: 3,
			borderTopLeftRadius: 3,
			borderTopRightRadius: 3,
			backgroundColor: "transparent",
		},
		activeTabIndicator: {
			backgroundColor: themeStyle.primary,
		},
		tabContent: {
			paddingBottom: 30,
		},
	});

export default StatsScreen;
