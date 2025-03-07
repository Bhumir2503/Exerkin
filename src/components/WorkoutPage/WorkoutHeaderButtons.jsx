import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

const WorkoutHeaderButtons = ({onClosePressed, onFinishedPressed, setTitleError, titleError, workoutTitle, setWorkoutTitle}) => {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);

    return (
		<View style={styles.container}>
			<TouchableOpacity onPress={onClosePressed}>
				<Ionicons
					name="return-up-back"
					size={32}
					color={themeStyle.textColor}
				/>
			</TouchableOpacity>
			<TextInput
				style={{
					...styles.titleInput,
					borderColor: titleError ? "red" : themeStyle.textColor,
					borderBottomWidth: titleError ? 2 : 0,
				}}
				value={workoutTitle}
				placeholder="Add Title..."
				onChangeText={(text) => setWorkoutTitle(text)}
				onFocus={() => setTitleError(false)}
				maxLength={32}
			/>
			<TouchableOpacity onPress={onFinishedPressed}>
				<Ionicons
                    name="checkmark-sharp"
                    size={32}
                    color={themeStyle.primary}
                />
			</TouchableOpacity>
		</View>
	);
 }


const createStyles = (themeStyle) => {
	return StyleSheet.create({
		container: {
			flexDirection: "row",
			justifyContent: "space-between",
			paddingHorizontal: 20,
			paddingTop: 15,
		},
		text: {
			color: themeStyle.accent,
			fontSize: 24,
		},
		titleInput: {
			color: themeStyle.textColor,
			fontSize: 24,
            flex: 1,
			marginHorizontal: 20,
			textAlign: "center",
			fontWeight: "bold",
		},
	});
};

export default WorkoutHeaderButtons;