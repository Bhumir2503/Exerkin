import { View, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import InfoCard from "../../../components/InfoCard";
import BlueprintCard from "./BlueprintCard";

import { useBlueprintStorage } from "../../../contexts/blueprint/BlueprintStorageContext";
import { useBlueprintSession } from "../../../hooks/useBlueprintSession";

import { trigger } from "react-native-haptic-feedback";

const BlueprintSection = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { storedBlueprints } = useBlueprintStorage();
	const { startBlueprint } = useBlueprintSession();

	const handlePress = () => {
		trigger("impactLight");
		startBlueprint();
		navigation.navigate("BlueprintModalScreen");
		console.log("Blueprint Add Button Pressed");
	};

	if (!storedBlueprints || storedBlueprints.length === 0) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Blueprint</Text>
				<InfoCard
					icon={"build-outline"}
					title={"Design Your Workout"}
					message={
						"Create a personalized plan tailored to your fitness goals and schedule."
					}
					width={"100%"}
				>
					<Pressable style={styles.button} onPress={handlePress}>
						<Text style={styles.buttonText}>Get Designing</Text>
					</Pressable>
				</InfoCard>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Text style={styles.title}>Blueprint</Text>
				<Pressable
					onPress={() => handlePress()}
					style={{
						borderRadius: 8,
						padding: 4,
						paddingVertical: 2,
					}}
				>
					<Ionicons name="add" size={28} color={themeStyle.primary} />
				</Pressable>
			</View>
			{storedBlueprints &&
				storedBlueprints.map((blueprint) => (
					<BlueprintCard
						key={blueprint.blueprintId}
						blueprint={blueprint}
						navigation={navigation}
					/>
				))}
		</View>
	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		container: {
			backgroundColor: theme.backgroundColor,
			borderRadius: 8,
		},
		title: {
			fontSize: 24,
			fontWeight: "bold",
			color: theme.textColor,
		},
		button: {
			backgroundColor: theme.primary,
			borderRadius: 6,
			paddingVertical: 12,
			paddingHorizontal: 20,
			marginTop: 20,
			alignItems: "center",
		},
		buttonText: {
			color: "#FFFFFF",
			fontSize: 16,
			fontWeight: "bold",
		},
	});
};

export default BlueprintSection;
