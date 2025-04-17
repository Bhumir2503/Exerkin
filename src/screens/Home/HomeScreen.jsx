import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../contexts/ThemeContext";

import Header from "./component/Header";
import Profile from "./component/Profile";
import Stats from "./component/Stats";
import QuoteCard from "./component/QuoteCard";
import WorkoutHistory from "./component/WorkoutHistory";

const HomeScreen = ({ navigation }) => {
	const { themeStyle } = useTheme();

	const styles = createStyles(themeStyle);

	return (
		<SafeAreaView style={styles.container}
            edges={["top", "left", "right"]}
        >
			<Header navigation={navigation} />
			<Profile />
			<Stats />
			<QuoteCard />
            <WorkoutHistory navigation={navigation} />
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
