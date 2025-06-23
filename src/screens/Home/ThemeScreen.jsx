import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../contexts/UserContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const ThemeScreen = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<SafeAreaView
			style={{ backgroundColor: themeStyle.backgroundColor, flex: 1 }}
			edges={["top", "left", "right"]}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					alignContent: "center",
					marginBottom: 20,
				}}
			>
				<Ionicons
					name="chevron-back-outline"
					size={25}
					color={themeStyle.textColor}
					style={{ marginLeft: 10, marginTop: 1 }}
					onPress={() => navigation.goBack()}
				/>
				<Text style={styles.title}>Edit Theme</Text>
			</View>

			<ScrollView showsVerticalScrollIndicator={false}>
				<PreviewChoice />
				<ColorChoice />
			</ScrollView>
		</SafeAreaView>
	);
};

function PreviewChoice() {
	const { themeStyle } = useTheme();
	return (
		<View
			style={{
				justifyContent: "center",
				backgroundColor: themeStyle.card,
				borderRadius: 10,
				marginHorizontal: 20,
				padding: 15,
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 3,
				elevation: 3,
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
					Sets
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
						Reps
					</Text>
				</View>
			</View>

			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					width: "100%",
					marginTop: 5,
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
					marginTop: 5,
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

			<View style={{ marginTop: 15 }}>
				<Pressable
					style={{
						backgroundColor: themeStyle.primary,
						padding: 10,
						borderRadius: 5,
						alignItems: "center",
					}}
				>
					<Text
						style={{
							color: "#ffffff",
							fontSize: 16,
							fontWeight: "bold",
						}}
					>
						Add Set
					</Text>
				</Pressable>
			</View>

			<View style={{ marginTop: 10 }}>
				<Pressable
					style={{
						backgroundColor: themeStyle.accent,
						padding: 10,
						borderRadius: 5,
						alignItems: "center",
					}}
				>
					<Text
						style={{
							color: "#ffffff",
							fontSize: 16,
							fontWeight: "bold",
						}}
					>
						Complete Exercise
					</Text>
				</Pressable>
			</View>
		</View>
	);
}

function ColorChoice() {
	const { themeStyle } = useTheme();

	return (
		<View style={{ marginTop: 25, marginHorizontal: 20 }}>
			<Text
				style={{
					fontSize: 18,
					fontWeight: "bold",
					color: themeStyle.textColor,
					marginTop: 15,
					marginBottom: 5,
				}}
			>
				Light Themes
			</Text>
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "flex-start",
				}}
			>
				<ColorBox
					color="#6246ea"
					themeName="lavenderMist"
					label="Lavender Mist"
				/>
				<ColorBox
					color="#f582ae"
					themeName="peachCream"
					label="Peach Cream"
				/>
				<ColorBox
					color="#ffc107"
					themeName="sunnyDaisy"
					label="Sunny Daisy"
				/>
			</View>
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "flex-start",
					marginBottom: 30,
				}}
			>
				<ColorBox
					color="#3da9fc"
					themeName="skyBlossom"
					label="Sky Blossom"
				/>
				<ColorBox
					color="#00bd8e"
					themeName="mintFresh"
					label="Mint Fresh"
				/>
				<ColorBox
					color="#d85893"
					themeName="rosePetal"
					label="Rose Petal"
				/>
			</View>
			<Text
				style={{
					fontSize: 18,
					fontWeight: "bold",
					color: themeStyle.textColor,
					marginBottom: 5,
				}}
			>
				Dark Themes
			</Text>
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "flex-start",
				}}
			>
				<ColorBox
					color="#7f2af0"
					themeName="midnightPurple"
					label="Midnight Purple"
				/>
				<ColorBox
					color="#c17c41"
					themeName="moodyEspresso"
					label="Moody Espresso"
				/>
				<ColorBox
					color="#ff8906"
					themeName="sunsetBlaze"
					label="Sunset Blaze"
				/>
			</View>
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "flex-start",
				}}
			>
				<ColorBox
					color="#3e92cc"
					themeName="oceanDepth"
					label="Ocean Depth"
				/>
				<ColorBox
					color="#4d9078"
					themeName="forestNight"
					label="Forest Night"
				/>
				<ColorBox
					color="#d100d1"
					themeName="cyberMagenta"
					label="Cyber Magenta"
				/>
			</View>
		</View>
	);
}

function ColorBox({ color, themeName, label }) {
	const { changeTheme, theme, themeStyle } = useTheme();
	const { updateThemePreference } = useUser();

	const onPressButton = () => {
		changeTheme(themeName);
		updateThemePreference(themeName);
	};

	return (
		<Pressable
			onPress={() => onPressButton(themeName)}
			style={{
				width: "30%",
				marginHorizontal: "1.5%",
				marginBottom: 15,
				alignItems: "center",
			}}
		>
			<View
				style={{
					backgroundColor: color,
					width: "100%",
					height: 50,
					borderRadius: 8,
					borderWidth: themeName === theme ? 3 : 0,
					borderColor: themeStyle.textColor,
					justifyContent: "center",
					alignItems: "center",
				}}
			></View>
			<Text
				style={{
					color: themeStyle.textColorSecondary,
					fontSize: 12,
					marginTop: 4,
					textAlign: "center",
				}}
			>
				{label}
			</Text>
		</Pressable>
	);
}

const createStyles = (themeStyle) =>
	StyleSheet.create({
		title: {
			fontSize: 20,
			color: themeStyle.textColor,
			fontWeight: "bold",
			marginLeft: 12,
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginTop: 10,
			marginBottom: 5,
		},
	});

export default ThemeScreen;
