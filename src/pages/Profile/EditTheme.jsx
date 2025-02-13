import { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function EditTheme({ navigation }) {
	const { themeStyle, setTheme } = useTheme();
	const [selected, setSelected] = useState(themeStyle.name);
	const styles = createStyles(themeStyle);

	return (
		<SafeAreaView
			style={{ backgroundColor: themeStyle.backgroundColor, flex: 1 }}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					alignContent: "center",
					marginBottom: 50,
				}}
			>
				<Ionicons
					name="chevron-back-outline"
					size={25}
					color={themeStyle.textColor}
					style={{ marginLeft: 5, marginTop: 1 }}
					onPress={() => navigation.goBack()}
				/>
				<Text style={styles.title}>Edit Theme</Text>
			</View>
			<PreviewChoice />
			<ColorChoice />
		</SafeAreaView>
	);
}

function PreviewChoice({}) {
	const { themeStyle } = useTheme();
	return (
		<View
			style={{
				justifyContent: "center",
				backgroundColor: themeStyle.card,
				borderRadius: 10,
				marginHorizontal: 30,
				padding: 10,
			}}
		>
			<Text
				style={{
					textAlign: "left",
					fontSize: 18,
					fontWeight: "bold",
					color: themeStyle.primary,
					marginBottom: 5,
				}}
			>
				Bench Press
			</Text>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					width: "100%",
				}}
			>
				<Text
					style={{
						fontSize: 16,
						color: themeStyle.textColor,
						marginLeft: 5,
						fontWeight: "bold",
					}}
				>
					Set
				</Text>
				<View
					style={{
						flexDirection: "row",
					}}
				>
					<Text
						style={{
							fontSize: 16,
							color: themeStyle.textColor,
							width: 50,
							textAlign: "center",
							fontWeight: "bold",
						}}
					>
						lbs
					</Text>
					<Text
						style={{
							fontSize: 16,
							color: themeStyle.textColor,
							width: 50,
							textAlign: "center",
							fontWeight: "bold",
						}}
					>
						Rep
					</Text>
				</View>
			</View>

			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					width: "100%",
				}}
			>
				<Text
					style={{
						fontSize: 16,
						fontWeight: "bold",
						color: themeStyle.textColor,
						marginLeft: 5,
					}}
				>
					1
				</Text>
				<View
					style={{
						flexDirection: "row",
					}}
				>
					<Text
						style={{
							fontSize: 16,
							color: themeStyle.textColor,
							width: 50,
							textAlign: "center",
						}}
					>
						225
					</Text>
					<Text
						style={{
							fontSize: 16,
							color: themeStyle.textColor,
							width: 50,
							textAlign: "center",
						}}
					>
						10
					</Text>
				</View>
			</View>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					width: "100%",
				}}
			>
				<Text
					style={{
						fontSize: 16,
						fontWeight: "bold",
						color: themeStyle.textColor,
						marginLeft: 5,
					}}
				>
					2
				</Text>
				<View
					style={{
						flexDirection: "row",
					}}
				>
					<Text
						style={{
							fontSize: 16,
							color: themeStyle.textColor,
							width: 50,
							textAlign: "center",
						}}
					>
						225
					</Text>
					<Text
						style={{
							fontSize: 16,
							color: themeStyle.textColor,
							width: 50,
							textAlign: "center",
						}}
					>
						10
					</Text>
				</View>
			</View>

			<View style={{ marginTop: 10 }}>
				<TouchableOpacity
					style={{
						backgroundColor: themeStyle.primary,
						padding: 10,
						borderRadius: 5,
						alignItems: "center",
					}}
				>
					<Text
						style={{
							color: themeStyle.textColor,
							fontSize: 16,
							fontWeight: "bold",
						}}
					>
						Add Set
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

function ColorChoice({}) {
	const { themeStyle } = useTheme();
	return (
		<View style={{ marginTop: 20, marginHorizontal: 20 }}>
			<Text
				style={{
					fontSize: 18,
					fontWeight: "bold",
					color: themeStyle.textColor,
				}}
			>
				Light Mode
			</Text>
			<View
				style={{
					flexDirection: "row",
				}}
			>
				<ColorBox color="#6246ea" themeName="lightPurple" />
				<ColorBox color="#ffd803" themeName="lightYellow" />
				<ColorBox color="#f582ae" themeName="lightBrown" />
			</View>
			<Text
				style={{
					fontSize: 18,
					fontWeight: "bold",
					color: themeStyle.textColor,
				}}
			>
				Dark Mode
			</Text>
			<View
				style={{
					flexDirection: "row",
				}}
			>
				<ColorBox color="#7f2af0" themeName="darkPurple" />
				<ColorBox color="#ff8906" themeName="darkYellow" />
				<ColorBox color="#ffc0ad" themeName="darkBrown" />
			</View>
		</View>
	);
}

function ColorBox({ color, themeName }) {
	const { changeTheme, theme, themeStyle } = useTheme();
	const changeColor = (themeName) => {
		changeTheme(themeName);
	};

	return (
		<TouchableOpacity onPress={() => changeColor(themeName)}>
			<View
				style={{
					backgroundColor: color,
					width: 75,
					height: 50,
					borderRadius: 10,
					margin: 10,
					borderWidth: themeName === theme ? 2 : 0,
					borderColor: themeStyle.textColor,
				}}
			></View>
		</TouchableOpacity>
	);
}

const createStyles = (themeStyle) =>
	StyleSheet.create({
		title: {
			fontSize: 20,
			color: themeStyle.textColor,
			fontWeight: "bold",
			marginLeft: 5,
		},
	});
