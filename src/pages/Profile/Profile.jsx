import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../contexts/UserContext";

export default function Profile({ navigation }) {
	const { themeStyle } = useTheme();
	const { user } = useUser();
	const styles = createStyles(themeStyle);
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.topBar}>
				<TouchableWithoutFeedback
					onPress={() => navigation.navigate("Stats")}
				>
					<Ionicons
						name="stats-chart"
						size={24}
						color={themeStyle.textColor}
					/>
				</TouchableWithoutFeedback>
				<Text style={{ fontSize: 24, fontWeight: "bold" }}>
					TestUser111
				</Text>
				<TouchableWithoutFeedback
					onPress={() => navigation.navigate("Settings")}
				>
					<Ionicons
						name="settings"
						size={24}
						color={themeStyle.textColor}
					/>
				</TouchableWithoutFeedback>
			</View>
			<View
				style={{
					marginTop: 25,
					alignItems: "flex-start",
					width: "100%",
					paddingHorizontal: 25,
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<TouchableWithoutFeedback
					onPress={() => console.log("change profile image")}
				>
					<Image
						source={{
							uri: "http://www.gravatar.com/avatar/?d=mp",
						}}
						style={{ width: 100, height: 100, borderRadius: 50 }}
					/>
				</TouchableWithoutFeedback>
				<View style={{ flex: 1, marginLeft: 25 }}>
					<Text style={{ fontSize: 18, fontWeight: "bold" }}>
						Follower: 1000
					</Text>
					<Text style={{ fontSize: 18, fontWeight: "bold" }}>
						Following: 0
					</Text>
					<Text style={{ fontSize: 18, fontWeight: "bold" }}>
						Post: 50
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			alignItems: "center",
			backgroundColor: themeStyle.backgroundColor,
		},
		topBar: {
			marginTop: 20,
			paddingHorizontal: 25,
			width: "100%",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		title: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
	});
