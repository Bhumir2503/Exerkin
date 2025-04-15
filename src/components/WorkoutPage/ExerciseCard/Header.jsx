import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import IonIcons from "@expo/vector-icons/Ionicons";

const Header = ({ repetitionType, metrics }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<View style={styles.header}>
			<Text style={styles.repetitionType}>Set</Text>
			<View style={{ flexDirection: "row" }}>
				{metrics.map((metric, index) => (
					<Text
						key={index}
						style={{
							fontSize: 16,
							color: themeStyle.textColor,
							width: 85,
							textAlign: "center",
							fontWeight: "bold",
							marginLeft: 7,
						}}
					>
						{metric}
					</Text>
				))}
				<View
					style={{
						width: 30,
						justifyContent: "center",
						alignItems: "center",
						marginLeft: 8,
					}}
				>
					<IonIcons
						name="checkmark"
						size={20}
						color={themeStyle.success}
						style={{}}
					/>
				</View>
			</View>
		</View>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		header: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			width: "100%",
		},
		repetitionType: {
			fontSize: 16,
			color: themeStyle.textColor,
			marginLeft: 5,
			fontWeight: "bold",
		},
	});
};

export default Header;
