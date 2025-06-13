import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function TextInputUnit({
	value,
	onChangeText,
	placeholder,
	unit,
	keyboardType,
	maxLength,
	header = "",
	props = {},
}) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<View style={{ flex: 1 }}>
			{header ? <Text style={styles.headerText}>{header}</Text> : null}
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.textInput}
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					keyboardType={keyboardType}
					maxLength={maxLength}
					placeholderTextColor={themeStyle.textColorSecondary}
					{...props}
				/>
				<Text style={styles.unitText}>{unit}</Text>
			</View>
		</View>
	);
}

const createStyles = (themeStyle) =>
	StyleSheet.create({
		headerText: {
			color: themeStyle.textColor, // midnightPurple.textColor
			fontSize: 16,
			marginBottom: 6,
			marginLeft: 6,
		},
		inputContainer: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: themeStyle.inputBackground, // midnightPurple.inputBackground
			borderRadius: 8,
			borderWidth: 1,
			borderColor: themeStyle.inputBorder, // midnightPurple.inputBorder
			height: 56,
			paddingLeft: 16,
			flex: 1, // Ensure the input container takes full width
		},
		textInput: {
			flex: 1,
			color: themeStyle.textColor, // midnightPurple.textColor
			fontSize: 16,
			textAlign: "center",
		},
		unitText: {
			color: themeStyle.textColorSecondary, // midnightPurple.textColorSecondary
			fontSize: 16,
			paddingRight: 16,
			width: 40,
			textAlign: "center",
		},
	});
