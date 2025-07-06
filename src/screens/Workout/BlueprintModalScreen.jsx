import {
	View,
	Platform,
	StyleSheet,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../contexts/ThemeContext";

import Header from "./components/Header";
4;
import Footer from "./components/Footer";
import BlueprintFooter from "./components/BlueprintFooter";
import BlueprintNotes from "./components/BlueprintNotes";
import BlueprintDragList from "./components/BlueprintDraglist";

const BlueprintModalScreen = ({ navigation }) => {
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
			<Header navigation={navigation} screen={"blueprint"} />
			<TouchableWithoutFeedback onPress={dismissKeyboard}>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.containerContent}
				>
					{/* Add your content here */}
					<View style={styles.userInputButtons}>
						<BlueprintNotes />
					</View>
					{/* Drag and Drop List */}
					<BlueprintDragList />
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
			<Footer navigation={navigation} screen={"blueprint"} />
		</SafeAreaView>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: themeStyle.backgroundColor,
		},
		containerContent: {
			flex: 1,
			backgroundColor: themeStyle.backgroundColor,
			marginTop: 10,
		},
		userInputButtons: {
			flexDirection: "row",
			justifyContent: "flex-end",
			padding: 20,
			paddingVertical: 10,
		},
	});

export default BlueprintModalScreen;
