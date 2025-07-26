import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";

import { useState } from "react";

const ChangeUnitSystem = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { unitSystem, updateUnitSystemPreference } = useUser();
	const [selectedUnitSystem, setSelectedUnitSystem] = useState(unitSystem);

	const handleBackPress = () => {
		if (selectedUnitSystem !== unitSystem) {
			updateUnitSystemPreference(selectedUnitSystem);
		}
		navigation.goBack();
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => handleBackPress()}
				>
					<Ionicons
						name="chevron-back-outline"
						size={24}
						color={themeStyle.textColor}
					/>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Change Unit System</Text>
			</View>

			<View style={styles.content}>
				<Text style={styles.subtitle}>
					Change the unit system for your workouts. This will affect
					how weights, and distances are displayed in the app.
				</Text>

				<View
					style={{
						marginBottom: 24,
						flexDirection: "row",
						justifyContent: "space-around",
					}}
				>
					<TouchableOpacity
						onPress={() => setSelectedUnitSystem("imperial")}
						style={{
							padding: 16,
							backgroundColor:
								selectedUnitSystem === "imperial"
									? themeStyle.primary
									: themeStyle.backgroundColor,
							borderWidth:
								selectedUnitSystem === "metric" ? 1 : 0,
							borderColor: themeStyle.borderColor,
							borderRadius: 8,
						}}
					>
						<Text style={{ color: themeStyle.textColor }}>
							Imperial (lbs, mi)
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setSelectedUnitSystem("metric")}
						style={{
							padding: 16,
							backgroundColor:
								selectedUnitSystem === "metric"
									? themeStyle.primary
									: themeStyle.backgroundColor,
							borderWidth:
								selectedUnitSystem === "imperial" ? 1 : 0,
							borderColor: themeStyle.borderColor,
							borderRadius: 8,
						}}
					>
						<Text style={{ color: themeStyle.textColor }}>
							Metric (kg, km)
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: themeStyle.backgroundColor,
		},
		header: {
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 16,
			paddingVertical: 12,
			borderBottomWidth: 1,
			borderBottomColor: themeStyle.borderColor,
		},
		backButton: {
			padding: 4,
		},
		headerTitle: {
			fontSize: 20,
			fontWeight: "600",
			color: themeStyle.textColor,
			marginLeft: 12,
		},
		content: {
			flex: 1,
			padding: 16,
		},
		subtitle: {
			fontSize: 16,
			color: themeStyle.textColor,
			marginBottom: 24,
			lineHeight: 22,
			textAlign: "center",
		},
	});

export default ChangeUnitSystem;
