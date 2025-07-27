import {
	View,
	Platform,
	StyleSheet,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	TouchableOpacity,
	Text,
	Image,
	Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";

import Header from "./components/Header";
import WorkoutDragList from "./components/WorkoutDragList";
import Footer from "./components/Footer";
import WorkoutTimer from "./components/WorkoutTimer";
import Notes from "./components/Notes";
import RestTimer from "./components/RestTimer";
import ImageButton from "./components/ImageButton";

const WorkoutModalScreen = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	return (
		<SafeAreaView
			style={styles.container}
			edges={["top", "left", "right", "bottom"]}
		>
			<TouchableWithoutFeedback onPress={dismissKeyboard}>
				<View style={{ flex: 1 }}>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={styles.containerContent}
					>
						<Header navigation={navigation} screen={"workout"} />
						<View style={styles.userInputButtons}>
							<WorkoutTimer />
							<View style={{ flexDirection: "row" }}>
								<Notes screen={"workout"} />
								<RestTimer />
								<ImageButton />
							</View>
						</View>
						<WorkoutDragList />
					</KeyboardAvoidingView>

					<Footer navigation={navigation} screen={"workout"} />
				</View>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		container: {
			backgroundColor: themeStyle.backgroundColor,
			flex: 1,
		},
		containerContent: {
			flex: 1,
		},
		userInputButtons: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			padding: 20,
			paddingVertical: 10,
		},

		imageUploadedText: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			lineHeight: 20,
			textAlign: "center",
		},
		modalOverlay: {
			flex: 1,
			backgroundColor: "rgba(0, 0, 0, 0.8)",
			justifyContent: "center",
			alignItems: "center",
		},
		imageWrapper: {
			width: "90%",
			height: "90%",
			justifyContent: "center",
			alignItems: "center",
		},

		fullScreenImage: {
			width: "100%",
			height: "100%",
			borderRadius: 10,
		},
	});
};

export default WorkoutModalScreen;
