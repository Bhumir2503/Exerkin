/*
 * This component handles the components and modal allowing the user to select an exercise to add to
 * their workout. The user can choose between a predefined exercise or create their own.
*/
import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	Modal,
	TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import ExerciseSelector from "./ExerciseSelector";
import ExerciseCreator from "./ExerciseCreator";


function ExerciseManager({type}) {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);

    const [modalVisible, setModalVisible] = useState(false);
    const [creatingExercise, setCreatingExercise] = useState(false);

    // Close modal and reset state
	const closeModal = () => {
		setModalVisible(false);
	};

    return (
        <>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.button}
            >
                <Ionicons name="add-circle-outline" size={24} color={"white"} />
                <Text style={styles.buttonText}>Add Exercise</Text>
            </TouchableOpacity>

            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
                statusBarTranslucent={true}
            >
                <View style={styles.modalContainer}>
                    { !creatingExercise ? 
                    <ExerciseSelector
                        type={type}
                        closeModal={closeModal}
                        setCreatingExercise={setCreatingExercise}
                    /> 
                    : 
                    <ExerciseCreator
                        type={type}
                        closeModal={closeModal}
                        setCreatingExercise={setCreatingExercise}
                    />}
                </View>
            </Modal>
        </>
    )
}


const createStyles = (themeStyle) =>
	StyleSheet.create({
		button: {
			margin: "auto",
			backgroundColor: themeStyle.primary,
			padding: 12,
			borderRadius: 8,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			marginVertical: 10,
			width: "90%",
		},
		buttonText: {
			color: "white",
			fontSize: 16,
			fontWeight: "bold",
			marginLeft: 8,
		},

		// Modal container
		modalContainer: {
			flex: 1,
			backgroundColor: "rgba(0, 0, 0, 0.5)",
			justifyContent: "center",
			alignItems: "center",
		},
});

export default ExerciseManager;