import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useUser } from "../../contexts/UserContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkoutHistory } from "../../contexts/workout/WorkoutHistoryContext";

import Header from "./component/Header";
import Profile from "./component/Profile";
import QuoteCard from "./component/QuoteCard";

const HomeScreen = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const { username } = useUser();

	const styles = createStyles(themeStyle);

	return (
		<SafeAreaView style={styles.container}>
			<Header navigation={navigation} />
			<Profile />
            <QuoteCard />
		</SafeAreaView>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: themeStyle.backgroundColor,
		},
	});

export default HomeScreen;
