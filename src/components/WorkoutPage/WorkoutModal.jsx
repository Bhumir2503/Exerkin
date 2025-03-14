import {
	Modal,
	View,
	Platform,
	StyleSheet,
	StatusBar,
	SafeAreaView,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
// import {
// 	SafeAreaView,
// 	useSafeAreaInsets,
// } from "react-native-safe-area-context";

const WorkoutModal = ({ visible, title, children }) => {
	const { themeStyle, theme } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<Modal
			presentationStyle="fullScreen"
			animationType="slide"
			visible={visible}
			statusBarTranslucent={true}
		>
			<SafeAreaView
				style={styles.modal}
				edges={["top", "right", "left", "bottom"]}
			>
				<View style={styles.contentContainer}>{children}</View>
			</SafeAreaView>
		</Modal>
	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		modal: {
			flex: 1,
			backgroundColor: theme.backgroundColor,
			paddingTop:
				Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
		},
		contentContainer: {
			flex: 1,
			// Manually apply padding if SafeAreaView still isn't working
			// paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
		},
	});
};

export default WorkoutModal;
