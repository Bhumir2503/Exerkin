import React, { useState, useCallback, useMemo, useRef } from "react";
import { View, Button, StyleSheet, Text, Modal, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import WorkoutButton from "../../components/WorkoutPage/WorkoutButtons";
import WorkoutForm from "../../components/WorkoutPage/WorkoutForm";
import ExerciseSelector from "../../components/WorkoutPage/ExerciseSelector";

export default function Profile() {
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);

    const [modalIsVisible, setModalVisible] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState([]);
    
    const addExercise = (exercise) => {
        if (exercise) {
            setSelectedExercises([...selectedExercises, {name: exercise}]);
        }
    };

    // render all of the added exercieses
    let exercises = []
    for (let i = 0; i != selectedExercises.length; i += 1) {
        exercises.push(<WorkoutForm key={i} theme={themeStyle} title={selectedExercises[i].name} />)
    }

    return (
        <SafeAreaView style={styles.primaryContent}>

            {/* Press this button to display the workout modal*/}
            <Button title="Workout" onPress={() => setModalVisible(!modalIsVisible)} />


            {/* This is the primary workout modal */}
            <Modal style={styles.workoutModal} animationType="slide" visible={modalIsVisible} transparent>
                <TouchableOpacity style={styles.modalTop} onPress={() => {setModalVisible(false); setSelectedExercises([])} }/>
                <View style={styles.modalContent}>

                    {/* The title of the workout*/}
                    <View style={styles.titleStyle}>
                        <Text style={styles.workoutTitle}>Workout title</Text>
                    </View>

                    {/* This lets us scroll down the modal */}
                    <ScrollView contentContainerStyle={styles.scrollView} style={{width: "100%", height: "100%"}}>

                        {/* render the current exercises */}
                        {exercises}

                        {/* Buttons that are at the bottom of the exercises */}
                        <ExerciseSelector onSelect={addExercise} />
                        <WorkoutButton type="cancelWorkout" title="Cancel Workout" onPress={() => {setModalVisible(false); setSelectedExercises([])}} />
                        <View style={{width: "100%", height: 200}}></View>
                    </ScrollView>

                </View>

            </Modal>

        </SafeAreaView>
    )
}



const createStyles = (theme) => {
    return StyleSheet.create({
        primaryContent: {
            backgroundColor: theme.backgroundColor,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        
        workoutModal: {
            display: "flex",
            flexDirection: "column",
            height: "80%",
            width: "100%",
        },

        modalTop: {
            height: "15%",
            opacity: 0,
        },

        modalContent: {
            height: "100%",
            backgroundColor: theme.card,
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2%",
            paddingTop: "20%"
        },
        scrollView: {
            width: "100%",
            alignItems: "center"
        },

        titleStyle: {
            position: "absolute",
            width: "100%",
            marginBottom: "4%",
            marginLeft: "3%",
            padding: "2%",
            backgroundColor: theme.card,
        },
        workoutTitle: {
            color: theme.textColor,
            fontSize: 32,
        },
    });
}