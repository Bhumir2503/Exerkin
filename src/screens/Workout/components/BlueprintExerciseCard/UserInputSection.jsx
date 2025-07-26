import {
	Text,
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../../contexts/ThemeContext";
import { Swipeable } from "react-native-gesture-handler";
import { useBlueprintExercises } from "../../../../contexts/blueprint/BlueprintExercisesContext";

const UserInputSection = ({
	id,
	index,
	inputTypes,
	placeholders,
	functions,
	lengths,
	values,
}) => {
	const { removeSetFromExercise } = useBlueprintExercises();
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const handleDelete = () => {
		removeSetFromExercise(id, index); // Call the function to remove the set from the exercise
	};

	// Render swipe right actions - this is what appears when the user swipes
	const renderRightActions = (progress, dragX) => {
		return (
			<TouchableOpacity
				style={styles.deleteAction}
				onPress={() => handleDelete()}
			>
				<Ionicons
					name="trash"
					size={40}
					color="#fff"
					style={styles.deleteActionText}
				/>
			</TouchableOpacity>
		);
	};

	// Reference to the swipeable component
	let swipeableRef = null;

	return (
		<Swipeable
			ref={(ref) => {
				swipeableRef = ref;
			}}
			renderRightActions={renderRightActions}
			rightThreshold={100} // Adjust this value to set the threshold
			onSwipeableRightOpen={() => handleDelete(index)}
			onSwipeableOpen={(direction) => {
				if (direction === "right") {
					// Auto-close the swipeable after deletion
					if (swipeableRef) swipeableRef.close();
				}
			}}
		>
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
			marginTop: 7,
			marginBottom: 7, // Add some space below each row for better touchability
			backgroundColor: themeStyle.card, // Ensure the background matches the card style
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
		deleteAction: {
			backgroundColor: themeStyle.error || "#e74c3c",
			justifyContent: "center",
			alignItems: "center",
			width: 100,
			marginTop: 7, // Align with the swipeable row
			marginBottom: 7, // Ensure it aligns with the row for better touchability
			borderTopRightRadius: 6, // Match the border radius of the input fields
			borderBottomRightRadius: 6, // Match the border radius of the input fields
		},
		deleteActionText: {
			color: "#fff",
			fontWeight: "600",
			fontSize: 16,
		},
	});
};

export default UserInputSection;
