//components/WorkoutPage/WorkoutNotes.jsx
import React, {useState} from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const MAX_CHARACTERS = 200;

const WorkoutNotes = ({workoutNotesRef}) => {
    const [workoutNotes, setWorkoutNotes] = useState("");
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

    const handleWorkoutNotesChange = (text) => {
        setWorkoutNotes(text);
        workoutNotesRef.current = text;
    }

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.textInput}
				placeholder="Add workout notes..."
				placeholderTextColor={themeStyle.textColorSecondary}
				value={workoutNotes}
				onChangeText={(text) =>
					handleWorkoutNotesChange(text)
				}
				multiline
				maxLength={200}
			/>
			<Text style={styles.charChount}>
				{MAX_CHARACTERS - workoutNotes.length} / {MAX_CHARACTERS}
			</Text>
		</View>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			backgroundColor: themeStyle.card,
			borderRadius: 12,
			padding: 10,
			marginVertical: 10,
			width: "90%",
			alignSelf: "center",
			position: "relative",
		},
		textInput: {
			color: themeStyle.textColor,
			fontSize: 15,
			minHeight: 80,
			paddingBottom: 20,
		},
		charChount: {
			position: "absolute",
			bottom: 5,
			right: 10,
			fontSize: 12,
			color: themeStyle.textColorSecondary,
		},
	});

export default WorkoutNotes;
