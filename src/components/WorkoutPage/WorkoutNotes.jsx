
//components/WorkoutPage/WorkoutNotes.jsx
import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { useWorkout } from "../../contexts/WorkoutContext";
import { useTheme } from "../../contexts/ThemeContext";

const MAX_CHARACTERS = 200;

const WorkoutNotes = () => {
    const { workoutNotes, updateWorkoutNotes } = useWorkout();
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                placeholder="Add workout notes..."
                placeholderTextColor="gray"
                value={workoutNotes}
                onChangeText={(text) => updateWorkoutNotes(text.slice(0, MAX_CHARACTERS))}
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
            backgroundColor: themeStyle.inputBackground,
            borderRadius: 5,
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
            color: "gray",
        }
    });

export default WorkoutNotes;