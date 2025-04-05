import React from "react";
import {
	View,
	Platform,
	StyleSheet,
	StatusBar,
	SafeAreaView,
	KeyboardAvoidingView,
	Text,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import TemplateHeader from "./TemplateHeader";

const TemplateModal = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<SafeAreaView
			style={styles.modal}
			edges={["top", "right", "left", "bottom"]}
		>
			<TemplateHeader navigation={navigation} />

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.modalContent}
				keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
			>
				<View style={{ flex: 1 }}>
					{/* Add your template content here */}
					<Text>Template Content Goes Here</Text>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const createStyles = (theme) => {
	return StyleSheet.create({
		modal: {
			flex: 1,
			backgroundColor: theme.backgroundColor,
			paddingTop: StatusBar.currentHeight,
		},
	});
};

export default TemplateModal;