import { Text, View, TextInput, StyleSheet } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { Swipeable } from "react-native-gesture-handler";

const UserInputSection = ({
	index,
	inputTypes,
	placeholders,
	functions,
	lengths,
	values,
}) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	// Render swipe right actions - this is what appears when the user swipes
	const renderRightActions = () => {
		return (
			<View style={styles.swipeableActions}>
				<Text style={styles.swipeActionText}>Options</Text>
			</View>
		);
	};

	return (
		<Swipeable renderRightActions={renderRightActions}>
			<View style={styles.setRows}>
				<Text
					style={{
						fontSize: 16,
						fontWeight: "bold",
						color: themeStyle.textColor,
						marginLeft: 5,
					}}
				>
					{index + 1}
				</Text>
				<View style={{ flexDirection: "row" }}>
					{inputTypes.map((inputType, inputIndex) => (
						<TextInput
							key={inputIndex}
							style={[styles.inputField]}
							inputMode={inputType}
							keyboardType={
								inputType === "decimal"
									? "decimal-pad"
									: "number-pad"
							}
							placeholder={placeholders[inputIndex]}
							placeholderTextColor={"gray"}
							maxLength={lengths[inputIndex]}
							value={values && values[inputIndex]}
							onChangeText={(text) =>
								functions[inputIndex](text, index)
							}
						/>
					))}
				</View>
			</View>
		</Swipeable>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		setRows: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			width: "100%",
			marginTop: 10,
			paddingVertical: 8,
		},
		setButton: {
			backgroundColor: themeStyle.inputBackground,
			width: "100%",
			padding: "2%",
			borderRadius: 6,
			marginTop: "5%",
			alignItems: "center",
		},
		setButtonText: {
			color: themeStyle.textColor,
			fontWeight: "700",
			fontSize: 16,
		},
		inputField: {
			fontSize: 16,
			color: themeStyle.textColor,
			width: 85,
			textAlign: "center",
			fontWeight: "bold",
			backgroundColor: themeStyle.inputBackground,
			padding: 5,
			paddingHorizontal: 10,
			borderRadius: 6,
			marginLeft: 7,
		},
		inputFieldAlert: {
			borderColor: themeStyle.error,
			borderWidth: 2,
		},
		swipeableActions: {
			backgroundColor: themeStyle.accent || "#3498db",
			justifyContent: "center",
			alignItems: "flex-start",
			width: 100,
			paddingLeft: 15,
		},
		swipeActionText: {
			color: "#fff",
			fontWeight: "600",
			fontSize: 16,
		},
	});
};

export default UserInputSection;
