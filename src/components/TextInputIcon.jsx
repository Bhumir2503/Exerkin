import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../contexts/ThemeContext";

export default function TextInputIcon({
	icon,
	placeholder,
	keyboardType,
	secureTextEntry = false,
	setText,

}) {
	const { themeStyle } = useTheme();
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				paddingHorizontal: 18,
				backgroundColor: themeStyle.inputBackground,
				borderColor: themeStyle.inputBorder,
				borderWidth: 1,
				borderRadius: 8,
			}}
		>
			<Ionicons
				name={icon}
				size={20}
				color={themeStyle.textColorSecondary}
				style={{ marginRight: 12 }}
			/>
			<TextInput
				style={{
					flex: 1,
					height: 48,
					color: themeStyle.textColor,
					fontSize: 16,
				}}
				placeholder={placeholder}
				placeholderTextColor={themeStyle.textColorSecondary}
				keyboardType={keyboardType}
				secureTextEntry={secureTextEntry}
				onChangeText={setText}
			/>
		</View>
	);
}
