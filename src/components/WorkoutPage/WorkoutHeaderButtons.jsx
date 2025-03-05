import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

const WorkoutHeaderButtons = ({onClosePressed, onFinishedPressed,}) => {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onClosePressed}>
                <Ionicons name="return-up-back" size={32} color={themeStyle.textColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onFinishedPressed}>
                <Text style={styles.text}>Finish</Text>
            </TouchableOpacity>
        </View>
    )
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
	});
};

export default WorkoutHeaderButtons;